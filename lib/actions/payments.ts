const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const checkoutVerify = async (sessionId: string) => {
    let res: Response
    try {
        // Backend route: POST /payments/checkout-verify with body { session_id }
        res = await fetch(`${BaseUrl}/payments/checkout-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: sessionId })
        })
    } catch {
        throw new Error(
            'Could not reach the payment server — is the backend running?'
        )
    }

    const raw = await res.text()

    let data: unknown
    try {
        data = JSON.parse(raw)
    } catch {
        // Backend returned an HTML page (e.g. a 404/error page) instead of JSON
        throw new Error(
            `Payment verification got a non-JSON response (HTTP ${res.status}) — check that /payments/verify-checkout exists on the backend.`
        )
    }

    if (!res.ok) {
        throw new Error(`Payment verification failed (HTTP ${res.status}).`)
    }

    return data
}
