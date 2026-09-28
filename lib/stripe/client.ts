import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";

let cachedClient: Stripe | null = null;

// Lazy singleton: the Stripe SDK throws immediately if constructed without a
// key, which would crash module evaluation (and the build) before the route
// handler that actually needs it ever runs.
export function getStripe(): Stripe {
  if (!cachedClient) {
    cachedClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return cachedClient;
}

/** Cheile Stripe lipsesc încă local (dev) — plata nu trebuie să blocheze restul aplicației. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function appUrl(): string {
  return SITE_URL;
}
