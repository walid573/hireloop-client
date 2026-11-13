// ── Product configuration ────────────────────────────────────────────
// Shared between the payment page and the /api/checkout route so the
// price shown to the user always matches what Stripe charges.

export const PREMIUM_PRODUCT = {
    name: "Premium Access",
    description:
        "Unlock all premium features with a single one-time payment — no subscription, no renewals.",
    /** Amount in whole currency units (e.g. 49 → €49.00). */
    price: 49,
    /** ISO currency code used by Stripe. */
    currencyCode: "eur",
    /** Symbol used for display. */
    currencySymbol: "€",
} as const
