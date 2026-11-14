import { cn } from "@/lib/utils"

/** Common width presets for dashboard pages. */
type PageContainerWidth = "default" | "wide"

const widthClass: Record<PageContainerWidth, string> = {
    default: "max-w-4xl",
    wide: "max-w-6xl",
}

type PageContainerProps = {
    width?: PageContainerWidth
    children: React.ReactNode
}

/** Standard dashboard page wrapper — centers content and applies padding. */
export function PageContainer({ width = "default", children }: PageContainerProps) {
    return <div className={cn("mx-auto w-full px-4 py-8", widthClass[width])}>{children}</div>
}

type PageHeaderProps = {
    title: string
    subtitle?: string
    /** Optional right-side content (e.g. a primary action button). */
    action?: React.ReactNode
}

/** Standard dashboard page heading — title + subtitle with an optional
 * action slot on the right (as in the Figma dashboard screens). */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
                <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                    {title}
                </h1>
                {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
            </div>
            {action}
        </header>
    )
}
