/**
 * Compact salary chip text, e.g. "75000","105000" → "€75k - €105k"
 * (matching the Figma job cards). Safe against missing values.
 */
export function formatSalaryRange(minSalary: string, maxSalary: string, currency = "€"): string {
    const token = (value: string) => {
        const n = Number(value)
        if (!value || !Number.isFinite(n)) return null
        return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`
    }
    const min = token(minSalary)
    const max = token(maxSalary)
    if (min === null && max === null) return `${currency}—`
    if (min === max || max === null) return `${currency}${min}`
    if (min === null) return `${currency}${max}`
    return `${currency}${min} - ${currency}${max}`
}

/** "Nimbus Cloudworks" → "NC" for the logo tile when no logo image exists. */
export function companyInitials(companyName: string): string {
    const words = companyName.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return "–"
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
}

/** "full-time" → "Full-time" (data is stored lowercase; the UI shows title case). */
export function formatJobType(jobType: string): string {
    return jobType.charAt(0).toUpperCase() + jobType.slice(1)
}

/** "• Ship UI\n- Ship tests" → ["Ship UI", "Ship tests"] for bullet lists. */
export function toBulletItems(text: string): string[] {
    return text
        .split("\n")
        .map((line) => line.trim().replace(/^[-•·]\s*/, "").trim())
        .filter(Boolean)
}
