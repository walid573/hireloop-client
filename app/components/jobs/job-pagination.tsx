"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"

type JobPaginationProps = {
    page: number
    pageCount: number
    /** Selecting a page only notifies — no state change here, wiring stays elsewhere. */
    onNavigate?: (page: number) => void
    className?: string
}

/** Numbers shown per Figma: 1 2 3 … pageCount (single ellipsis pattern). */
function pageItems(page: number, pageCount: number): (number | "ellipsis")[] {
    if (pageCount <= 6) return Array.from({ length: pageCount }, (_, i) => i + 1)
    return [1, 2, 3, "ellipsis", pageCount]
}

const itemClass = "flex size-8 items-center justify-center rounded-lg text-[13px]"

/** "Pagination" row from the Figma Browse Jobs screen. */
export function JobPagination({ page, pageCount, onNavigate, className }: JobPaginationProps) {
    return (
        <nav aria-label="Browse jobs pagination" className={cn("flex justify-center gap-1.5", className)}>
            <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onNavigate?.(page - 1)}
                className={cn(itemClass, "border border-white/[0.08] text-[#ededef] hover:bg-white/5 disabled:opacity-50")}
            >
                <ChevronLeftIcon className="size-4" />
            </button>

            {pageItems(page, pageCount).map((item, index) =>
                item === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className={cn(itemClass, "text-[#6e6e78]")}>
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === page ? "page" : undefined}
                        onClick={() => onNavigate?.(item)}
                        className={cn(
                            itemClass,
                            item === page
                                ? "border-transparent bg-white font-semibold text-[#08080a]"
                                : "border border-white/[0.08] text-[#ededef] hover:bg-white/5"
                        )}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={() => onNavigate?.(page + 1)}
                className={cn(itemClass, "border border-white/[0.08] text-[#ededef] hover:bg-white/5 disabled:opacity-50")}
            >
                <ChevronRightIcon className="size-4" />
            </button>
        </nav>
    )
}
