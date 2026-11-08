"use client"

import { Briefcase, Building2, Eye, EyeOff, Mail, ShieldCheck } from "lucide-react"
import { useState, type FormEvent } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"


export type AccountRole = "seeker" | "recruiter" | "admin"

export type AuthFormData = {
  name: string
  email: string
  password: string
  /** Who the user is on thtform — sent to Better Auth as a user field */
  role: AccountRole
}

type AuthFormProps = {
  initialMode: "signin" | "signup"
  /**
   * Better Auth handlers live in the component that renders AuthForm.
   * The matching handler runs based on the currently active mode, so
   * toggling Sign In <-> Sign Up in place always calls the right flow.
   * Throw an `Error` inside a handler to surface its message in the form.
   */
  onSignIn?: (data: AuthFormData) => Promise<void> | void
  onSignUp?: (data: AuthFormData) => Promise<void> | void
}

const initialFormData: AuthFormData = {
  name: "",
  email: "",
  password: "",
  role: "seeker",
}

const roleOptions: { value: AccountRole; label: string; icon: typeof Briefcase; hint: string }[] = [
  { value: "seeker", label: "Seeker", icon: Briefcase, hint: "I'm looking for a job" },
  { value: "recruiter", label: "Recruiter", icon: Building2, hint: "I'm hiring talent" },
  { value: "admin", label: "Admin", icon: ShieldCheck, hint: "Platform administrator" },
]

export function AuthForm({ initialMode, onSignIn, onSignUp }: AuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [formData, setFormData] = useState<AuthFormData>(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const isSignUp = mode === "signup"

  const switchMode = () => {
    setFormData(initialFormData)
    setShowPassword(false)
    setFormError(null)
    setMode(isSignUp ? "signin" : "signup")
  }

  const handleChange = (field: keyof AuthFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setFormError(null)
    setIsSubmitting(true)

    try {
      const handler = isSignUp ? onSignUp : onSignIn
      if (handler) {
        await handler(formData)
      } else {
        // Dev fallback until Better Auth handlers are wired up
        console.log(isSignUp ? "Sign Up data:" : "Sign In data:", formData)
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          aria-label="HireLoop home"
          className="mx-auto mb-8 flex w-fit transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        {/* Card */}
        <div className="w-full rounded-3xl border border-border/60 bg-card p-6 shadow-xl sm:p-8">
          {/* Page Toggler */}
          <div className="mb-8 grid grid-cols-2 rounded-full border border-border/60 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => !isSignUp || switchMode()}
              aria-current={!isSignUp}
              className={cn(
                "h-8 rounded-full text-sm font-medium transition-colors cursor-pointer",
                isSignUp
                  ? "text-muted-foreground hover:text-foreground"
                  : "bg-primary text-primary-foreground shadow-sm"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => isSignUp || switchMode()}
              aria-current={isSignUp}
              className={cn(
                "h-8 rounded-full text-sm font-medium transition-colors cursor-pointer",
                isSignUp
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6 space-y-1.5 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "Join HireLoop and start your journey today."
                : "Sign in to continue your job search."}
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Button variant="outline" size="lg" type="button">
              <GithubIcon className="size-4" data-icon="inline-start" />
              <span className="truncate">GitHub</span>
            </Button>
            <Button variant="outline" size="lg" type="button">
              <Mail className="size-4" data-icon="inline-start" />
              <span className="truncate">Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              or continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name")(e.target.value)}
                />
              </div>
            )}

            {isSignUp && (
              <fieldset className="grid gap-2">
                <legend className="text-sm leading-none font-medium">
                  I am a…
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Account type"
                  className="grid gap-2 sm:grid-cols-3"
                >
                  {roleOptions.map(({ value, label, icon: Icon, hint }) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={formData.role === value}
                      title={hint}
                      onClick={() => handleChange("role")(value)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors cursor-pointer outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                        formData.role === value
                          ? "border-[#6366F1] bg-[#6366F1]/10 text-foreground"
                          : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4",
                          formData.role === value
                            ? "text-[#6366F1]"
                            : "text-muted-foreground"
                        )}
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email")(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  className="pr-10"
                  value={formData.password}
                  onChange={(e) => handleChange("password")(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 font-normal text-muted-foreground">
                  <input type="checkbox" className="size-4 accent-[#6366F1]" />
                  Remember me
                </label>
                <Link
                  href="#"
                  className="font-medium text-[#6366F1] hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {formError}
              </div>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
              {isSubmitting
                ? isSignUp
                  ? "Creating account…"
                  : "Signing in…"
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          {/* Switch link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-[#6366F1] hover:underline underline-offset-4 cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Minimal GitHub glyph (lucide-react@1.x ships no Github brand icon)
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.2.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}
