import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dns from "dns";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Prefer IPv4; some sandboxes block outbound IPv6 and Supabase can return AAAA first.
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

// Create PostgreSQL connection pool with SSL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase external connections
  },
  connectionTimeoutMillis: 5000,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Test the connection immediately
pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully!");
    client.release(); // release back to the pool
  })
  .catch(err => {
    console.error("❌ Failed to connect to the database:", err);
  });

export const db = drizzle(pool, { schema });
