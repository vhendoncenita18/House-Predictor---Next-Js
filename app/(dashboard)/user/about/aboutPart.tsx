
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    Database,
    MapPin,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import {
    sectionCardClassName,
} from "@/components/user-dashboard/containerCards";

const featureDetails = [
    {
        label: "Model support",
        value: "AI valuation engine trained on housing attributes",
        icon: Sparkles,
    },
    {
        label: "Inputs covered",
        value: "Location, floor area, lot area, rooms, kitchens, garages",
        icon: Building2,
    },
    {
        label: "Data focus",
        value: "Structured property details and repeatable comparison points",
        icon: Database,
    },
    {
        label: "User benefit",
        value: "Faster estimates with saved prediction history",
        icon: ShieldCheck,
    },
];

export default function AboutPart() {
    return (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    About the platform
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                    A smarter way to understand house pricing before you
                    commit.
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                    House Predictor blends property details with an AI
                    valuation workflow so users can estimate price,
                    revisit saved predictions, and compare options with
                    more confidence.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/user/prediction"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                    >
                        Start a prediction
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="/user/predictions"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                    >
                        View saved results
                    </Link>
                </div>
            </div>

            <div className={sectionCardClassName}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Why it exists
                </p>
                <div className="mt-4 space-y-4">
                    <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
                                <MapPin className="size-5" />
                            </span>
                            <div>
                                <p className="text-sm font-medium text-cyan-50">
                                    Real estate decisions need context
                                </p>
                                <p className="mt-1 text-sm leading-6 text-cyan-50/75">
                                    Price discovery gets easier when
                                    location, property scale, and home
                                    features are evaluated together
                                    instead of in isolation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {featureDetails.map((detail) => {
                            const Icon = detail.icon;

                            return (
                                <div
                                    key={detail.label}
                                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                                >
                                    <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/80">
                                        <Icon className="size-4" />
                                    </span>
                                    <p className="mt-3 text-sm font-medium text-white">
                                        {detail.label}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-white/60">
                                        {detail.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
} 