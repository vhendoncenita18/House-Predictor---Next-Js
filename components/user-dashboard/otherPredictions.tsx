"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { sectionCardClassName, railClassName, itemCardClassName, pesoFormatter, scrollCards } from "./containerCards";
import {type PredictionRecord } from "@/data/predictions";


export default function OtherPredictions() {
    const status = useSession().status;
    const otherPredictionRailRef = useRef<HTMLDivElement>(null);
    const [otherPredictions, setOtherPredictions] = useState<PredictionRecord[]>([]);
    const [selectedOtherPrediction, setSelectedOtherPrediction] = useState<PredictionRecord | null>(null);
    const [isOtherPredictionsLoading, setIsOtherPredictionsLoading] = useState(true);
    const [otherPredictionsError, setOtherPredictionsError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (status !== "authenticated") {
            setOtherPredictions([]);
            setSelectedOtherPrediction(null);
            setIsOtherPredictionsLoading(false);
            return;
        }

        let isMounted = true;

        async function loadOtherPredictions() {
            setIsOtherPredictionsLoading(true);
            setOtherPredictionsError(null);

            try {
                const response = await fetch("/api/predictions?scope=others", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Unable to load other predictions right now.");
                }

                const data = (await response.json()) as PredictionRecord[];

                if (!isMounted) {
                    return;
                }

                setOtherPredictions(data);
                setSelectedOtherPrediction(data[0] ?? null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setOtherPredictionsError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load other predictions right now."
                );
            } finally {
                if (isMounted) {
                    setIsOtherPredictionsLoading(false);
                }
            }
        }

        loadOtherPredictions();

        return () => {
            isMounted = false;
        };
    }, [status]);


    return (
        <section className={sectionCardClassName}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                        Community
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Other Predictions
                    </h2>
                    <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                        Explore recent predictions from other users and compare pricing across different properties.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => scrollCards(otherPredictionRailRef, "left")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/70 transition hover:bg-white/8 hover:text-white"
                        aria-label="Scroll other predictions left"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollCards(otherPredictionRailRef, "right")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/70 transition hover:bg-white/8 hover:text-white"
                        aria-label="Scroll other predictions right"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            {isOtherPredictionsLoading ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/3 px-5 py-10 text-center text-sm text-white/55">
                    Loading other users&apos; predictions...
                </div>
            ) : otherPredictionsError ? (
                <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-10 text-center text-sm text-red-100/85">
                    {otherPredictionsError}
                </div>
            ) : otherPredictions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/3 px-5 py-10 text-center">
                    <p className="text-base font-medium text-white">No other predictions yet</p>
                    <p className="mt-2 text-sm text-white/55">
                        When other users add predictions, they&apos;ll appear here.
                    </p>
                </div>
            ) : (
                <>
                    <div ref={otherPredictionRailRef} className={railClassName}>
                        {otherPredictions.map((prediction) => (
                            <button
                                key={prediction.id}
                                type="button"
                                onClick={() => setSelectedOtherPrediction(prediction)}
                                className={`cursor-pointer ${itemCardClassName} ${selectedOtherPrediction?.id === prediction.id ? "border-white/30 bg-white/8" : ""}`}
                            >
                                <div className="relative h-40 overflow-hidden rounded-[1.25rem]">
                                    <Image
                                        src={prediction.image}
                                        alt={`${prediction.propertyType} in ${prediction.location}`}
                                        fill
                                        sizes="(max-width: 640px) 260px, (max-width: 1280px) 300px, 250px"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <p className="text-base font-semibold text-white">
                                        {prediction.propertyType}
                                    </p>
                                    <p className="text-sm text-white/60">
                                        {prediction.location}
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                        {prediction.ownerName ?? prediction.ownerUsername ?? "User"}
                                    </p>
                                    <p className="text-sm text-emerald-200">
                                        {pesoFormatter.format(prediction.predictedPrice)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedOtherPrediction ? (
                        <div className="mt-6 grid gap-6 rounded-[1.5rem] border border-white/10 bg-white/3 p-4 sm:p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
                            <div className="relative min-h-65 overflow-hidden rounded-[1.25rem] bg-black/20 lg:min-h-full">
                                <Image
                                    src={selectedOtherPrediction.image}
                                    alt={`${selectedOtherPrediction.propertyType} in ${selectedOtherPrediction.location}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover object-center"
                                />
                            </div>

                            <div className="flex flex-col justify-between gap-5">
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                        Selected Community Prediction
                                    </p>
                                    <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                                        {selectedOtherPrediction.propertyType}
                                    </h3>
                                    <p className="text-sm text-white/65 sm:text-base">
                                        {selectedOtherPrediction.location}
                                    </p>
                                    <p className="text-sm text-cyan-100/80">
                                        Predicted by{" "}
                                        {selectedOtherPrediction.ownerName ??
                                            selectedOtherPrediction.ownerUsername ??
                                            "another user"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Lot Area</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedOtherPrediction.lotArea
                                                ? `${selectedOtherPrediction.lotArea} sqm`
                                                : "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Floor Area</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedOtherPrediction.floorArea} sqm
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bedrooms</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedOtherPrediction.bedrooms ?? "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bathrooms</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedOtherPrediction.bathrooms ?? "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Garage</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedOtherPrediction.hasGarage ? "Available" : "None"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Created</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {new Date(selectedOtherPrediction.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">
                                        Predicted Price
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-cyan-100">
                                        {pesoFormatter.format(selectedOtherPrediction.predictedPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </section>
    )
}