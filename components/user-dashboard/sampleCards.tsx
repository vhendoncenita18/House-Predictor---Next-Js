"use client"

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sampleHouses, type SampleHouse } from "@/data/sample-houses";
import Image from "next/image";
import Link from "next/link";
import { sectionCardClassName, railClassName, itemCardClassName, pesoFormatter, scrollCards } from "./containerCards";

export default function SampleCards() {
    const sampleRailRef = useRef<HTMLDivElement>(null);
    const [selectedHouse, setSelectedHouse] = useState<SampleHouse>(sampleHouses[0]);

    return (
        <section className={sectionCardClassName}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                        Overview
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Sample Houses
                    </h1>
                    <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                        Browse recently added sample properties and use them as a starting point for faster valuation comparisons.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => scrollCards(sampleRailRef, "left")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Scroll sample houses left"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollCards(sampleRailRef, "right")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Scroll sample houses right"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div ref={sampleRailRef} className={railClassName} >
                {sampleHouses.map((house) => (
                    <button
                        key={house.id}
                        type="button"
                        onClick={() => setSelectedHouse(house)}
                        className={`${itemCardClassName} cursor-pointer transition-all ${selectedHouse.id === house.id ? " border-white/30 bg-white/[0.08]" : ""}`}
                    >
                        <div className="relative h-40 overflow-hidden rounded-[1.25rem]">
                            <Image
                                src={house.image}
                                alt={`${house.PropertyType} in ${house.Location}`}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-4 space-y-1.5">
                            <p className="text-base font-semibold text-white">
                                {house.PropertyType}
                            </p>
                            <p className="text-sm text-white/60">
                                Location: {house.Location}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-6 grid gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
                <div className="relative min-h-[260px] overflow-hidden rounded-[1.25rem] bg-black/20 lg:min-h-[100%]">
                    <Image
                        src={selectedHouse.image}
                        alt={`${selectedHouse.PropertyType} in ${selectedHouse.Location}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center"
                    />
                </div>

                <div className="flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Selected Property
                            </p>
                            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                                {selectedHouse.PropertyType}
                            </h2>
                            <p className="text-sm text-white/65 sm:text-base">
                                {selectedHouse.Location}
                            </p>
                        </div>
                        <Link
                            href="/user/prediction"
                            className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                        >
                            Add Prediction
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Lot Area</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.LotArea} sqm</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Floor Area</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.FloorArea} sqm</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Bedrooms</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.Bedrooms}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Bathrooms</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.Bathrooms}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Kitchens</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.Kitchens}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs text-white/45">Garages</p>
                            <p className="mt-1 text-base font-semibold">{selectedHouse.Garages}</p>
                        </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
                            Estimated Price
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-emerald-200">
                            {pesoFormatter.format(selectedHouse.Price_PHP)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

