

import {
    BadgeCheck,
} from "lucide-react";

import {
    sectionCardClassName,
} from "@/components/user-dashboard/containerCards";

const teamPrinciples = [
    "Make pricing tools approachable for everyday property decisions.",
    "Turn complex house attributes into a clean prediction workflow.",
    "Keep results reviewable so users can compare, revisit, and refine estimates.",
];


export default function GuidelinesCard() {
    return (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={sectionCardClassName}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Guiding principles
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    How the product is shaped
                </h2>
                <div className="mt-6 space-y-3">
                    {teamPrinciples.map((principle) => (
                        <div
                            key={principle}
                            className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                                <BadgeCheck className="size-4" />
                            </span>
                            <p className="text-sm leading-6 text-white/70">
                                {principle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={sectionCardClassName}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Best use cases
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Where this helps most
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-sm font-medium text-white">
                            Buyers and families
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                            Explore home options and check whether an
                            asking price looks aligned with the
                            property&apos;s characteristics.
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-sm font-medium text-white">
                            Property sellers
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                            Use structured estimates as a starting point
                            before positioning a listing in the market.
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-sm font-medium text-white">
                            Students and researchers
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                            Review how property features influence model
                            output inside a practical real-estate
                            interface.
                        </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-sm font-medium text-white">
                            Analysts and agents
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                            Keep prediction history close at hand for
                            faster comparisons and recurring valuation
                            checks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

