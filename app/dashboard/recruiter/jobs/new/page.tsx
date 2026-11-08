"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Clock3, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// TODO: call POST /api/jobs (or a server action) once the job API exists
export interface NewJobData {
    title: string
    company: string
    category: string
    jobType: string
    remote: boolean
    location: string
    deadline: string
    salaryMin: string
    salaryMax: string
    salaryFrequency: string
    responsibilities: string
    requirements: string
}

const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design",
    "Marketing",
    "Sales",
    "Data & AI",
    "Finance",
    "Operations",
    "Other",
] as const

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const

const FIELD_BG =
    "h-10 rounded-lg border border-input bg-card/50 px-3 text-sm md:text-base dark:bg-card/50"

export default function NewJobPage() {
    // The only state: Remote Work toggle (Switch doesn't submit when unchecked,
    // and we need it to disable the location field)
    const [remote, setRemote] = React.useState(false)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const data = Object.fromEntries(
            new FormData(e.currentTarget)
        ) as unknown as NewJobData
        const job = { ...data, remote }

        // TODO: replace with real submission
        console.log(job)
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
            {/* ── Page header ─────────────────────────────────────────── */}
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground">
                        <Link href="/dashboard/recruiter/jobs" className="hover:text-foreground">
                            Manage Jobs
                        </Link>
                        <span className="mx-1.5">›</span>
                        <span className="text-primary">Create New Listing</span>
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold">Post a New Job</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fill in the position specifications to attract qualified talent
                        across our network.
                    </p>
                </div>

            </header>

            {/* ── Form ────────────────────────────────────────────────── */}
            <form
                id="new-job-form"
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* 1 · Basic Information */}
                <section className="rounded-xl border border-border bg-card/50 p-6">
                    <h2 className="mb-6 flex items-center gap-2.5 text-sm font-medium">
                        <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            1
                        </span>
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Basic Information
                        </span>
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-sm font-normal text-muted-foreground">
                                Job Title <span className="text-destructive">*</span>
                            </Label>
                            <Input id="title" name="title" placeholder="Frontend Developer" required className={FIELD_BG} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="company" className="text-sm font-normal text-muted-foreground">
                                    Company Name <span className="text-destructive">*</span>
                                </Label>
                                <Input id="company" name="company" placeholder="HirePulse Network" required className={FIELD_BG} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category" className="text-sm font-normal text-muted-foreground">
                                    Job Category <span className="text-destructive">*</span>
                                </Label>
                                <Select name="category" required>
                                    <SelectTrigger
                                        id="category"
                                        className="w-full data-[size=default]:h-10 border-input bg-card/50 rounded-lg dark:bg-card/50"
                                    >
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_CATEGORIES.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Job Type — pill segmented selector (radio inputs → FormData) */}
                        <fieldset className="space-y-1.5">
                            <legend className="text-sm font-normal text-muted-foreground">
                                Job Type <span className="text-destructive">*</span>
                            </legend>
                            <div className="grid gap-3 sm:grid-cols-4">
                                {JOB_TYPES.map((t, i) => (
                                    <label key={t} className="relative flex">
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={t}
                                            defaultChecked={i === 0}
                                            className="peer sr-only"
                                            required
                                        />
                                        <span
                                            className={FIELD_BG +
                                                " flex flex-1 cursor-pointer items-center justify-center transition-colors " +
                                                "text-muted-foreground hover:text-foreground " +
                                                "peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-foreground"}
                                        >
                                            {t}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </section>

                {/* 2 · Location, Compensation & Timeline */}
                <section className="rounded-xl border border-border bg-card/50 p-6">
                    <h2 className="mb-6 flex items-center gap-2.5 text-sm font-medium">
                        <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            2
                        </span>
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Location, Compensation &amp; Timeline
                        </span>
                    </h2>

                    <div className="space-y-5">
                        {/* Remote toggle row */}
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Clock3 className="size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Remote Work Allowed (&lsquo;Remote&rsquo;)</p>
                                    <p className="text-xs text-muted-foreground">
                                        Candidates can apply from anywhere, no relocation needed
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="remote"
                                name="remote"
                                checked={remote}
                                onCheckedChange={setRemote}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-5">
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="location" className="text-sm font-normal text-muted-foreground">
                                    Job Location <span className="text-xs text-muted-foreground/60">(location)</span>{" "}
                                    {" "}<span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="New York, USA"
                                        required={!remote}
                                        disabled={remote}
                                        className={FIELD_BG + " pl-8"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:col-span-3">
                                <Label htmlFor="deadline" className="text-sm font-normal text-muted-foreground">
                                    Application Deadline <span className="text-xs text-muted-foreground/60">(deadline)</span>{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input id="deadline" name="deadline" type="date" required className={FIELD_BG} />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="salaryMin" className="text-sm font-normal text-muted-foreground">
                                    Min Salary / Rate <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        €
                                    </span>
                                    <Input
                                        id="salaryMin"
                                        name="salaryMin"
                                        type="number"
                                        min={0}
                                        placeholder="25"
                                        required
                                        className={FIELD_BG + " pl-8"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="salaryMax" className="text-sm font-normal text-muted-foreground">
                                    Max Salary / Rate <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        €
                                    </span>
                                    <Input
                                        id="salaryMax"
                                        name="salaryMax"
                                        type="number"
                                        min={0}
                                        placeholder="40"
                                        required
                                        className={FIELD_BG + " pl-8"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="salaryFrequency" className="sr-only">
                                    Frequency
                                </Label>
                                <Select name="salaryFrequency" required defaultValue="per hour">
                                    <SelectTrigger
                                        id="salaryFrequency"
                                        className="h-10 w-full border-input bg-card/50 rounded-lg dark:bg-card/50"
                                    >
                                        <SelectValue placeholder="Frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SALARY_FREQUENCIES.map((f) => (
                                            <SelectItem key={f} value={f}>
                                                {f}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3 · Responsibilities & Requirements */}
                <section className="rounded-xl border border-border bg-card/50 p-6">
                    <h2 className="mb-6 flex items-center gap-2.5 text-sm font-medium">
                        <span className="rounded bg-primary/90 px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                            3
                        </span>
                        <span className="text-foreground/90 underline decoration-border/70 underline-offset-4">
                            Responsibilities &amp; Requirements
                        </span>
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="responsibilities" className="text-sm font-normal text-muted-foreground">
                                Key Responsibilities <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences…"
                                rows={4}
                                required
                                className="rounded-lg border-input bg-card/50 dark:bg-card/50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="requirements" className="text-sm font-normal text-muted-foreground">
                                Qualifications / Requirements <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                placeholder={"• 3+ years of experience with React…\n• Solid understanding of CSS…\n• Experience partnering closely with product teams…"}
                                rows={5}
                                required
                                className="rounded-lg border-input bg-card/50 dark:bg-card/50"
                            />
                        </div>
                    </div>
                </section>
                <section>
                    <Button
                        type="submit"
                        form="new-job-form"
                        className="rounded-full"
                    >
                        Publish Job <ArrowRight />
                    </Button>
                </section>
            </form>
        </div>
    )
}
