import Link from "next/link"
import {
    ArrowRight,
    CircleCheck,
    CreditCard,
    Mail,
    TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { checkoutVerify } from "@/lib/actions/payments"
import { PREMIUM_PRODUCT } from "@/lib/billing"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

import { CopyButton } from "./copy-button"

const CARD = "rounded-xl border border-border bg-card/50 p-6"

function DetailRow({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-right text-sm font-medium">{children}</span>
        </div>
    )
}

export default async function Success({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }>
}) {
    const { session_id } = await searchParams

    if (!session_id) {
        // No session to verify — send the visitor back to checkout
        return redirect("/payment?canceled=1")
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"],
    })
    const { status, payment_status, customer_email, payment_intent } = session

    if (status === "open") {
        return redirect("/")
    }

    if (status === "complete" || payment_status === "paid") {
        // Verify with the backend, but never crash the page over it —
        // the payment itself already went through on Stripe.
        let verifyError: string | null = null
        try {
            await checkoutVerify(session_id)
        } catch (err) {
            verifyError = err instanceof Error ? err.message : "Payment verification failed."
            console.error("checkoutVerify:", verifyError)
        }

        // Stripe types payment_intent as string | PaymentIntent — it's an
        // object here because of the expand above.
        const intent = typeof payment_intent === "string" ? null : payment_intent
        const transactionId = intent?.id ?? null
        const amount =
            intent?.amount != null ? intent.amount / 100 : (session.amount_total ?? 0) / 100
        const productDescription =
            session.line_items?.data[0]?.description ?? PREMIUM_PRODUCT.name
        const paidAt = new Date(session.created * 1000).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })

        return (
            <div className="mx-auto w-full max-w-2xl px-6 py-12">
                {/* ── Confirmation header ─────────────────────────────── */}
                <header className="flex flex-col items-center text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                        <CircleCheck className="size-8 text-primary" />
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold">Payment successful</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your premium access is now active — pay once, yours forever.
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3.5" />
                        A receipt has been emailed to{" "}
                        {customer_email ?? "your email address"} by Stripe.
                    </p>
                </header>

                {/* ── Payment details ─────────────────────────────────── */}
                <section className={`${CARD} mt-8 p-6`}>
                    <h2 className="flex items-center gap-2.5 text-sm font-medium">
                        <CreditCard className="size-4 text-muted-foreground" />
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Payment Details
                        </span>
                    </h2>

                    <div className="mt-4 divide-y divide-border/70">
                        <DetailRow label="Amount paid">
                            <span className="text-base font-semibold">
                                {PREMIUM_PRODUCT.currencySymbol}
                                {amount.toFixed(2)}
                            </span>
                        </DetailRow>

                        <DetailRow label="Status">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                <CircleCheck className="size-3" />
                                {payment_status === "paid" ? "Paid" : payment_status}
                            </span>
                        </DetailRow>

                        <DetailRow label="Product">{productDescription}</DetailRow>

                        <DetailRow label="Date">{paidAt}</DetailRow>

                        <DetailRow label="Transaction ID">
                            {transactionId ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                                        {transactionId}
                                    </code>
                                    <CopyButton value={transactionId} />
                                </span>
                            ) : (
                                "—"
                            )}
                        </DetailRow>
                    </div>
                </section>

                {/* ── Backend verification warning ────────────────────── */}
                {verifyError && (
                    <div
                        role="status"
                        className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                    >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <p>
                            Note: your payment succeeded, but we couldn&apos;t verify it
                            with our server right now. Premium access may be delayed —
                            please contact support if it doesn&apos;t appear.
                        </p>
                    </div>
                )}

                {/* ── Actions ─────────────────────────────────────────── */}
                <div className="mt-8 flex items-center justify-center gap-3">
                    <Button render={<Link href="/dashboard" />} className="rounded-full">
                        Go to Dashboard <ArrowRight />
                    </Button>
                    <Button
                        render={<Link href="/browse-jobs" />}
                        variant="outline"
                        className="rounded-full"
                    >
                        Browse Jobs
                    </Button>
                </div>
            </div>
        )
    }

    // Session exists but wasn't paid — e.g. abandoned mid-checkout
    return redirect("/payment?canceled=1")
}
