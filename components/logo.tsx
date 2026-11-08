import Image from "next/image"
import { cn } from "cn"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="HireLoop Logo"
        width={130}
        height={32}
        className="h-8 w-auto object-contain"
        priority
      />
    </div>
  )
}
