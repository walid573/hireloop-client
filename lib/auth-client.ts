import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
// Type-only import: gives the client knowledge of user additionalFields
// (e.g. `role`) without bundling any server code
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        // Infer server-side user additionalFields so `role` is typed on
        // signUp.email input / session user output
        inferAdditionalFields<typeof auth>(), adminClient()
    ]
})

export const { signIn, signUp, useSession } = authClient
