
import {
    BadgeCheck,
    BrainCircuit,
    LineChart,
} from "lucide-react";

import {
    itemCardClassName,
    sectionCardClassName,
} from "@/components/user-dashboard/containerCards";

const platformHighlights = [
    {
        title: "Prediction-first workflow",
        description:
            "Enter real property details, run a machine-learning estimate, and keep every valuation organized in one place.",
        icon: BrainCircuit,
    },
    {
        title: "Market-aware property views",
        description:
            "Browse property inspiration, compare layouts, and spot pricing patterns across different housing types and locations.",
        icon: LineChart,
    },
    {
        title: "Built for practical decisions",
        description:
            "The experience is shaped to help buyers, sellers, and analysts move from guesswork to clearer pricing conversations.",
        icon: BadgeCheck,
    },
];

export default function StrengthCard() {
    return (
        <section className={sectionCardClassName}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                        What you can do here
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Core platform strengths
                    </h2>
                </div>
                <p className="max-w-2xl text-sm text-white/60 sm:text-right sm:text-base">
                    The product is designed around quick estimates,
                    useful review flows, and cleaner property
                    comparisons.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {platformHighlights.map((highlight) => {
                    const Icon = highlight.icon;

                    return (
                        <article
                            key={highlight.title}
                            className={`${itemCardClassName} min-w-0`}
                        >
                            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white">
                                <Icon className="size-5" />
                            </span>
                            <h3 className="mt-5 text-xl font-semibold text-white">
                                {highlight.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-white/60">
                                {highlight.description}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    )
}