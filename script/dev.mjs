import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const apiHost = process.env.HOST || "127.0.0.1";
const apiPort = process.env.PORT || "5050";
const frontendHost = process.env.FRONTEND_HOST || "127.0.0.1";
const frontendPort = process.env.FRONTEND_PORT || "5173";

const children = new Set();
let isShuttingDown = false;

function killChildren(signal) {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

function maybeExit() {
  if (isShuttingDown && children.size === 0) {
    process.exit(process.exitCode ?? 0);
  }
}

function shutdown(code = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  process.exitCode = code;
  killChildren("SIGTERM");

  setTimeout(() => {
    killChildren("SIGKILL");
    maybeExit();
  }, 5_000).unref();

  maybeExit();
}

function runScript(name, scriptName) {
  const child = spawn(npmCommand, ["run", scriptName], {
    stdio: "inherit",
    env: process.env,
  });

  children.add(child);

  child.on("error", (error) => {
    console.error(`[dev] Failed to start ${name}:`, error);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    children.delete(child);

    if (!isShuttingDown) {
      const nextCode = typeof code === "number" ? code : signal ? 1 : 0;
      if (nextCode !== 0) {
        console.error(
          `[dev] ${name} stopped unexpectedly${signal ? ` with ${signal}` : ""}.`,
        );
      }
      shutdown(nextCode);
      return;
    }

    maybeExit();
  });
}

console.log(
  `[dev] Frontend: http://${frontendHost}:${frontendPort} | API: http://${apiHost}:${apiPort}`,
);

runScript("API server", "dev:server");
runScript("Vite frontend", "dev:client");

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => shutdown(0));
}
