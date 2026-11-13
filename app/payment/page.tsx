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
import { PREMIUM_PRODUCT as PRODUCT } from "@/lib/billing"

const total = PRODUCT.price

const formatAmount = (amount: number) => `${PRODUCT.currencySymbol}${amount.toFixed(2)}`

const FEATURES = [
    "Unlimited access to all premium features",
    "Priority placement in browse & search results",
    "Advanced filters and full applicant insights",
    "Pay once — yours forever, no recurring charges",
]

export default function PaymentPage({}) {
    const [redirecting, setRedirecting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    // Set when Stripe redirects back with ?canceled=1
    const [canceled, setCanceled] = React.useState(false)

    React.useEffect(() => {
        if (new URLSearchParams(window.location.search).get("canceled")) {
            setCanceled(true)
        }
    }, [])

    async function handlePay() {
        setRedirecting(true)
        setError(null)
        try {
            // Create a Stripe Checkout Session and redirect to its hosted page
            const res = await fetch("/api/checkout", { method: "POST" })
            const data = (await res.json()) as { url?: string; error?: string }

            if (!res.ok || !data.url) {
                throw new Error(data.error ?? "Failed to start checkout.")
            }

            // Hand off to Stripe; we stay "redirecting" while navigating away
            window.location.href = data.url
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            )
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
                <h1 className="mt-1 text-3xl font-semibold">
                    Unlock Premium — one-time payment
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Pay once to access all premium features. You&apos;ll finish payment
                    securely on Stripe.
                </p>
            </header>

            {/* ── Stripe cancel notice ───────────────────────────────── */}
            {canceled && (
                <div
                    role="status"
                    className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                >
                    <Lock className="size-4 shrink-0" />
                    <p>Checkout was canceled — you were not charged.</p>
                </div>
            )}

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
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{PRODUCT.name}</p>
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                        One-time payment
                                    </span>
                                </div>
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
                            <dt className="text-muted-foreground">One-time payment</dt>
                            <dd>{formatAmount(PRODUCT.price)}</dd>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex justify-between text-base font-semibold">
                            <dt>Pay once, total</dt>
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
                                    One-time payment of {formatAmount(total)}.
                                </span>{" "}
                                No subscription — your premium access never expires. Payment
                                is handled securely by Stripe.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex-1 space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Clicking the button below will take you to Stripe&apos;s secure
                            checkout page to enter your card details. You&apos;ll be brought
                            back here to start using your premium features right away.
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
                                Pay once {formatAmount(total)}
                                <ArrowRight />
                            </>
                        )}
                    </Button>

                    {error && (
                        <p role="alert" className="mt-3 text-center text-xs text-destructive">
                            {error}
                        </p>
                    )}

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                        <Lock className="size-3" />
                        256-bit encrypted checkout
                    </p>
                </section>
            </div>
        </div>
    )
}
