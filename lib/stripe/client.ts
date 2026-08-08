import Stripe from "stripe";

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
