"use client"

import { useRouter } from "next/navigation"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()

  const handleSignUp = async (data: AuthFormData) => {
    const { error } = await authClient.signUp.email({
      name: data.name, // required, The name of the user.
      email: data.email, // required, The email address of the user.
      password: data.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      role: data.role, // user additionalField — requires input: true in lib/auth.ts
       // An optional URL to redirect to after the user signs up.
    })

    if (error) {
      // Throwing here makes AuthForm render the message in its error alert
      throw new Error(error.message ?? "Failed to create account. Please try again.")
    }

    // Better Auth redirects to callbackURL on success; this is a fallback.
    router.push("/")
  }

  const handleSignIn = async (data: AuthFormData) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) {
      throw new Error(error.message ?? "Invalid email or password.")
    }
  }

  return (
    <AuthForm
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      initialMode="signup"
    />
  )
}
