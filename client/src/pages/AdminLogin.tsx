import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/session", {
          credentials: "include",
        });

        if (res.ok && active) {
          setLocation("/admin");
          return;
        }
      } catch {
        // ignore and show login form
      } finally {
        if (active) {
          setIsCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      active = false;
    };
  }, [setLocation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message ?? "Unable to sign in");
      }

      setLocation("/admin");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100/70 via-background to-slate-100/40 px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md border-border/70 bg-card/95 shadow-xl sm:max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Admin Portal</CardTitle>
          <CardDescription className="mx-auto max-w-md">
            Sign in to manage menu, notices, orders, and operations.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-6 sm:px-7 sm:pb-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="h-11"
                required
              />
            </div>

            {errorMessage && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
