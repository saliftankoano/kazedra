/**
 * PawaPay configuration resolver.
 *
 * Mirrors roogo-web/lib/pawapay-config.ts but stripped of Clerk/org logic.
 *
 * Rules:
 *   - Production (NODE_ENV=production): always forces live credentials.
 *   - Development: PAWAPAY_LOCAL_MODE=sandbox|live chooses (defaults sandbox).
 *   - Throws explicit errors if the selected mode's credentials are missing.
 *
 * Sandbox test MSISDNs (Burkina Faso): see roogo-web/docs/pawapay-test-numbers.md.
 */

export interface PawaPayConfig {
  url: string;
  token: string;
  environment: "sandbox" | "live";
}

export function resolvePawaPayConfig(): PawaPayConfig {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const url = process.env.PAWAPAY_LIVE_URL || process.env.PAWAPAY_URL;
    const token =
      process.env.PAWAPAY_LIVE_API_TOKEN || process.env.PAWAPAY_API_TOKEN;

    if (!url) {
      throw new Error(
        "PawaPay prod error: PAWAPAY_LIVE_URL (or PAWAPAY_URL) non configuré."
      );
    }
    if (!token) {
      throw new Error(
        "PawaPay prod error: PAWAPAY_LIVE_API_TOKEN (or PAWAPAY_API_TOKEN) non configuré."
      );
    }
    return {
      url: url.replace(/\/+$/, ""),
      token: token.trim(),
      environment: "live",
    };
  }

  const localMode = (process.env.PAWAPAY_LOCAL_MODE || "sandbox").toLowerCase();

  if (localMode === "live") {
    const url = process.env.PAWAPAY_LIVE_URL || process.env.PAWAPAY_URL;
    const token =
      process.env.PAWAPAY_LIVE_API_TOKEN || process.env.PAWAPAY_API_TOKEN;

    if (!url || !token) {
      throw new Error(
        "PawaPay local live mode: PAWAPAY_LIVE_URL / PAWAPAY_LIVE_API_TOKEN manquants. " +
          "Ajoutez-les ou passez PAWAPAY_LOCAL_MODE=sandbox."
      );
    }
    return {
      url: url.replace(/\/+$/, ""),
      token: token.trim(),
      environment: "live",
    };
  }

  const url = process.env.PAWAPAY_SANDBOX_URL || process.env.PAWAPAY_URL;
  const token =
    process.env.PAWAPAY_SANDBOX_API_TOKEN || process.env.PAWAPAY_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "PawaPay sandbox: PAWAPAY_SANDBOX_URL / PAWAPAY_SANDBOX_API_TOKEN manquants dans .env.local."
    );
  }

  return {
    url: url.replace(/\/+$/, ""),
    token: token.trim(),
    environment: "sandbox",
  };
}

export const PAWAPAY_IPS = [
  "3.64.89.224", // Sandbox
  "18.192.208.15",
  "18.195.113.136",
  "3.72.212.107",
  "54.73.125.42",
  "54.155.38.214",
  "54.73.130.113",
] as const;
