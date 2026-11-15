"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { setInitialRole } from "@/lib/actions/user"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"



  const handleSignIn = async (data: AuthFormData) => {
    const { error } = await authClient.signIn.email({
      email: data.email, // required, The email address of the user.
      password: data.password, // required, The password of the user.
      callbackURL: redirectTo, // An optional URL to redirect to after the user signs in.
    })

    if (error) {
      // Throwing here makes AuthForm render the message in its error alert
      throw new Error(error.message ?? "Invalid email or password.")
    }

    // Better Auth redirects to callbackURL on success; this is a fallback.
    router.push("/")
  }

  const handleSignUp = async (data: AuthFormData) => {
    // role can't travel through signUp.email — the admin plugin marks it
    // input:false ("role is not allowed to be set"). It's applied right
    // after, via the setInitialRole server action.
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) {
      throw new Error(error.message ?? "Failed to create account. Please try again.")
    }

    await setInitialRole(data.role)
    router.push("/signin")
  }

  return (
    <AuthForm
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      initialMode="signin"
    />
  )
}
