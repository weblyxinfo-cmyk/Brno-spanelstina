/**
 * Environment variable validation and type definitions
 *
 * This module provides runtime validation of required environment variables
 * and TypeScript types for type-safe access.
 */

// ===========================================
// Type Definitions
// ===========================================

interface ServerEnv {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  RESEND_API_KEY?: string;
  ADMIN_EMAIL?: string;
  JWT_SECRET: string;
}

interface ClientEnv {
  NEXT_PUBLIC_SITE_URL: string;
}

interface EnvConfig {
  server: ServerEnv;
  client: ClientEnv;
}

// ===========================================
// Environment Variable Definitions
// ===========================================

const requiredServerVars = [
  {
    key: "TURSO_DATABASE_URL",
    description: "Turso database URL",
    hint: "Get from https://turso.tech dashboard",
  },
  {
    key: "TURSO_AUTH_TOKEN",
    description: "Turso authentication token",
    hint: "Generate in Turso dashboard > Database > Settings > Tokens",
  },
  {
    key: "JWT_SECRET",
    description: "Secret key for JWT token signing (admin auth)",
    hint: "Generate with: openssl rand -base64 32",
  },
] as const;

const optionalServerVars = [
  {
    key: "RESEND_API_KEY",
    description: "Resend API key for email sending",
    hint: "Get from https://resend.com/api-keys",
  },
  {
    key: "ADMIN_EMAIL",
    description: "Admin email for contact form notifications",
    hint: "e.g., info@brno-spanelstina.cz",
  },
] as const;

const clientVars = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    description: "Public site URL",
    hint: "e.g., http://localhost:3000 or https://brno-spanelstina.cz",
    default: "http://localhost:3000",
  },
] as const;

// ===========================================
// Validation Functions
// ===========================================

/**
 * Validates all required environment variables are set.
 * Throws an error with helpful messages if any are missing.
 */
export function validateEnv(): void {
  const missing: Array<{ key: string; description: string; hint: string }> = [];

  // Check required server variables
  for (const envVar of requiredServerVars) {
    if (!process.env[envVar.key]) {
      missing.push(envVar);
    }
  }

  // If any required vars are missing, throw helpful error
  if (missing.length > 0) {
    const errorLines = [
      "",
      "=".repeat(60),
      "MISSING REQUIRED ENVIRONMENT VARIABLES",
      "=".repeat(60),
      "",
    ];

    for (const { key, description, hint } of missing) {
      errorLines.push(`  ${key}`);
      errorLines.push(`    Description: ${description}`);
      errorLines.push(`    Hint: ${hint}`);
      errorLines.push("");
    }

    errorLines.push("-".repeat(60));
    errorLines.push("Make sure you have a .env.local file with these variables.");
    errorLines.push("Copy .env.example to .env.local and fill in the values:");
    errorLines.push("  cp .env.example .env.local");
    errorLines.push("=".repeat(60));
    errorLines.push("");

    throw new Error(errorLines.join("\n"));
  }
}

/**
 * Checks environment variables and logs warnings for missing optional vars.
 * Does not throw, just logs helpful information.
 */
export function checkEnv(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required server variables
  for (const envVar of requiredServerVars) {
    if (!process.env[envVar.key]) {
      missing.push(envVar.key);
    }
  }

  // Check optional server variables (warn only)
  for (const envVar of optionalServerVars) {
    if (!process.env[envVar.key]) {
      warnings.push(`${envVar.key} not set - ${envVar.description} will be disabled`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Gets environment configuration with type safety.
 * Validates on first access to ensure all required vars are present.
 */
export function getEnv(): EnvConfig {
  // Only validate in server environment
  if (typeof window === "undefined") {
    validateEnv();
  }

  return {
    server: {
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      JWT_SECRET: process.env.JWT_SECRET!,
    },
    client: {
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  };
}

// ===========================================
// Individual Getters (convenience functions)
// ===========================================

/**
 * Get database URL - throws if not set
 */
export function getDatabaseUrl(): string {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. " +
      "Get your database URL from https://turso.tech dashboard."
    );
  }
  return url;
}

/**
 * Get database auth token - throws if not set
 */
export function getDatabaseToken(): string {
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!token) {
    throw new Error(
      "TURSO_AUTH_TOKEN is not set. " +
      "Generate a token in Turso dashboard > Database > Settings > Tokens."
    );
  }
  return token;
}

/**
 * Get JWT secret - throws if not set
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. " +
      "Generate with: openssl rand -base64 32"
    );
  }
  return secret;
}

/**
 * Get Resend API key - returns undefined if not set (optional)
 */
export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

/**
 * Get admin email - returns default if not set
 */
export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || "info@brno-spanelstina.cz";
}

/**
 * Get public site URL - returns localhost default if not set
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Check if email sending is configured
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// ===========================================
// Development Helpers
// ===========================================

/**
 * Log environment status (for development debugging)
 */
export function logEnvStatus(): void {
  if (process.env.NODE_ENV === "production") {
    return; // Don't log in production
  }

  const { isValid, missing, warnings } = checkEnv();

  console.log("\n--- Environment Status ---");
  console.log(`Status: ${isValid ? "OK" : "MISSING REQUIRED VARS"}`);

  if (missing.length > 0) {
    console.log(`Missing: ${missing.join(", ")}`);
  }

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`  - ${w}`));
  }

  console.log("--------------------------\n");
}
