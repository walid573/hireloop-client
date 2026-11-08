"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { authClient, useSession } from "@/lib/auth-client"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const {data :session } = useSession();
  const handleSignOut = async () => {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/"); // redirect to login page
    },
  },
});
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <Logo />
        </Link>

        {/* Desktop Nav & Actions Right Aligned */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "text-sm font-medium text-foreground transition-colors"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Vertical Divider */}
          <span aria-hidden="true" className="h-4 w-px bg-border/60" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {session?.user ? 
            <>
            <span>Welcome, {session.user.name}!</span>
            <Button onClick={handleSignOut}>Sign Out</Button>
            </>
            : <><Link
              href="/signin"
              className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm px-1 py-0.5"
            >
              Sign In
            </Link>
            <Button
              render={<Link href="/signup" />}
              size="sm"
              className="h-9 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              Get Started
            </Button></>}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="size-9" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Open main menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs flex flex-col justify-between">
              <div>
                <SheetHeader className="border-b px-4 py-4 text-left">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <Logo />
                </SheetHeader>

                <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={
                        isActive(link.href)
                          ? "flex h-10 items-center rounded-lg bg-accent px-3 text-sm font-medium text-foreground"
                          : "flex h-10 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <SheetFooter className="border-t p-4 flex flex-col gap-2">
                <Link
                  href="/signin"
                  className="flex h-10 items-center justify-center rounded-xl border border-input text-sm font-medium text-indigo-500 hover:bg-accent transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  render={<Link href="/signup" />}
                  className="h-10 w-full rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Get Started
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
