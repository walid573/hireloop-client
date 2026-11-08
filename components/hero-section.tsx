"use client"

import Image from "next/image"
import { Search, MapPin, Briefcase, Building2, UserCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const trendingPositions = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const stats = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: UserCheck,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfication Rate",
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#07080E] text-white pt-12 pb-16 sm:pt-16 sm:pb-24">
      {/* Globe Background Image spanning from top of hero section to bottom */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center overflow-hidden">
        <div className="relative w-420 h-410  opacity-90">
          <Image
            src="/globe.png"
            alt="Hero background globe"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl py-14 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="hidden h-[1px] w-10 bg-gradient-to-r from-transparent to-white/20 sm:block" />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1 text-[11px] font-mono tracking-widest text-neutral-300 backdrop-blur-md">
            <span role="img" aria-label="Briefcase">💼</span>
            <span className="text-white font-bold">50,000+</span>
            <span className="text-neutral-400 font-medium">NEW JOBS THIS MONTH</span>
          </div>
          <span className="hidden h-[1px] w-10 bg-gradient-to-l from-transparent to-white/20 sm:block" />
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-[1.15]">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-xs sm:text-sm md:text-base text-neutral-400 leading-relaxed">
          HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search Bar */}
        <div className="mt-8 w-full max-w-2xl">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-[#0F121E]/95 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full"
          >
            {/* Input 1: Job title */}
            <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
              <Search className="size-4 shrink-0 text-neutral-400" />
              <input
                type="text"
                placeholder="Job title, skill or company"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Vertical Divider */}
            <div className="hidden h-5 w-[1px] bg-white/10 sm:block" />

            {/* Input 2: Location */}
            <div className="flex flex-1 items-center gap-3 px-3 py-1.5 border-t border-white/5 sm:border-t-0">
              <MapPin className="size-4 shrink-0 text-neutral-400" />
              <input
                type="text"
                placeholder="Location or Remote"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              size="icon-lg"
              className="h-10 w-full sm:w-11 rounded-xl sm:rounded-full bg-[#5B5BD6] text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/20 shrink-0"
              aria-label="Search jobs"
            >
              <Search className="size-4 stroke-[2.5]" />
            </Button>
          </form>
        </div>

        {/* Trending Positions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-400">
          <span className="text-neutral-500 mr-1 text-[11px]">Trending Position</span>
          {trendingPositions.map((position) => (
            <button
              key={position}
              type="button"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-neutral-300 hover:border-white/20 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-xs"
            >
              {position}
            </button>
          ))}
        </div>

        {/* Headline Over Globe */}
        <div className="max-w-2xl text-center px-4 mt-20 sm:mt-50">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-snug">
            Assisting over <span className="font-extrabold text-white">15,000 job seekers</span>
            <br /> find their dream positions.
          </h2>
        </div>

        {/* 4 Stat Cards Row */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0C0E17]/90 p-6 text-left shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-[#121522]"
              >
                <div>
                  <div className="mb-6 text-neutral-400 group-hover:text-white transition-colors">
                    <Icon className="size-5 stroke-[1.75]" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </div>
                </div>
                <div className="mt-4 text-xs font-medium text-neutral-400">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
