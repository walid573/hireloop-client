"use client"

import React from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = React.useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard unavailable (e.g. insecure context) — ignore
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy transaction ID"
            title={copied ? "Copied!" : "Copy"}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
            {copied ? (
                <Check className="size-3.5 text-primary" />
            ) : (
                <Copy className="size-3.5" />
            )}
        </button>
    )
}
