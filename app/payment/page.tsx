"use client"

import React from "react"
import Link from "next/link"
import {
    ArrowRight,
    Check,
    CreditCard,
    Loader2,
    Lock,
    ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// ── Product configuration ────────────────────────────────────────────
// TODO: replace with the real product / pricing once billing exists
const PRODUCT = {
    name: "Featured Job Posting",
    description:
        "One featured listing with 30-day visibility and priority placement in search results.",
    price: 49,
    currency: "€",
}

const VAT_RATE = 0.2
const vat = PRODUCT.price * VAT_RATE
const total = PRODUCT.price + vat

const formatAmount = (amount: number) => `${PRODUCT.currency}${amount.toFixed(2)}`

const FEATURES = [
    "Priority placement in browse & search results",
    "Highlighted “Featured” badge on your listing",
    "30 days of visibility",
    "Application tracking via your recruiter dashboard",
]

export default function PaymentPage() {
    const [redirecting, setRedirecting] = React.useState(false)

    async function handlePay() {
        setRedirecting(true)
        try {
            // TODO: Stripe Checkout — replace this block once the API route exists:
            //
            //   const res = await fetch("/api/checkout", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ price: PRODUCT.price, currency: "eur" }),
            //   })
            //   if (!res.ok) throw new Error("Failed to start checkout")
            //   const { url } = await res.json()
            //   window.location.href = url // redirect to Stripe Checkout page
            //
            await new Promise((resolve) => setTimeout(resolve, 1200))
            console.warn("Stripe Checkout is not wired up yet.")
        } finally {
            setRedirecting(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
            {/* ── Page header ─────────────────────────────────────────── */}
            <header className="mb-8">
                <p className="text-xs text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">
                        Home
                    </Link>
                    <span className="mx-1.5">›</span>
                    <span className="text-primary">Checkout</span>
                </p>
                <h1 className="mt-1 text-3xl font-semibold">Complete your payment</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Review your order below — you&apos;ll finish payment securely on Stripe.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* ── 1 · Order summary ───────────────────────────────────── */}
                <section className="rounded-xl border border-border bg-card/50 p-6 lg:col-span-3">
                    <h2 className="mb-6 flex items-center gap-2.5 text-sm font-medium">
                        <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            1
                        </span>
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Order Summary
                        </span>
                    </h2>

                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <CreditCard className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{PRODUCT.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {PRODUCT.description}
                                </p>
                            </div>
                        </div>

                        <ul className="mt-4 space-y-2">
                            {FEATURES.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-start gap-2 text-xs text-muted-foreground"
                                >
                                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price breakdown */}
                    <dl className="mt-6 space-y-2.5 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Subtotal</dt>
                            <dd>{formatAmount(PRODUCT.price)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">VAT ({VAT_RATE * 100}%)</dt>
                            <dd>{formatAmount(vat)}</dd>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex justify-between text-base font-semibold">
                            <dt>Total due</dt>
                            <dd>{formatAmount(total)}</dd>
                        </div>
                    </dl>
                </section>

                {/* ── 2 · Payment ─────────────────────────────────────────── */}
                <section className="flex flex-col rounded-xl border border-border bg-card/50 p-6 lg:col-span-2">
                    <h2 className="mb-6 flex items-center gap-2.5 text-sm font-medium">
                        <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            2
                        </span>
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Payment
                        </span>
                    </h2>

                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="size-5 shrink-0 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    Pay securely with Stripe.
                                </span>{" "}
                                Card details are handled entirely by Stripe — they never touch
                                our servers.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex-1 space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Clicking the button below will take you to Stripe&apos;s secure
                            checkout page to enter your card details. You&apos;ll be brought
                            back here once payment is complete.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={handlePay}
                        disabled={redirecting}
                        className="mt-6 h-11 w-full rounded-full text-base"
                    >
                        {redirecting ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Redirecting…
                            </>
                        ) : (
                            <>
                                Pay {formatAmount(total)}
                                <ArrowRight />
                            </>
                        )}
                    </Button>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                        <Lock className="size-3" />
                        256-bit encrypted checkout
                    </p>
                </section>
            </div>
        </div>
    )
}
