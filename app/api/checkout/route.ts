import { NextResponse } from "next/server"
import Stripe from "stripe"

import { auth } from "@/lib/auth"
import { PREMIUM_PRODUCT } from "@/lib/billing"

function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not set.")
    }
    return new Stripe(key)
}

// Creates a Stripe Checkout Session (one-time payment) and returns its
// hosted checkout URL. The client redirects the user to that URL.
export async function POST(request: Request) {
    try {
        const stripe = getStripe()

        // The backend needs to know WHO paid — it reads metadata.userId
        // to set premium: true on that user's document.
        const userSession = await auth.api.getSession({ headers: request.headers })
        if (!userSession?.user) {
            return NextResponse.json(
                { error: "You must be signed in to make a payment." },
                { status: 401 }
            )
        }

        const origin = new URL(request.url).origin

        const session = await stripe.checkout.sessions.create({
            // One-time charge — NOT a subscription. Premium access never expires.
            mode: "payment",
            metadata: {
                userId: userSession.user.id,
            },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: PREMIUM_PRODUCT.currencyCode,
                        unit_amount: PREMIUM_PRODUCT.price * 100, // Stripe expects the smallest currency unit
                        product_data: {
                            name: `HireLoop ${PREMIUM_PRODUCT.name}`,
                            description: PREMIUM_PRODUCT.description,
                        },
                    },
                },
            ],
            // {CHECKOUT_SESSION_ID} is a literal placeholder Stripe replaces
            // with the real session id before redirecting the user back.
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment?canceled=1`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("Failed to create Stripe Checkout session:", error)
        return NextResponse.json(
            { error: "Failed to start checkout. Please try again." },
            { status: 500 }
        )
    }
}
