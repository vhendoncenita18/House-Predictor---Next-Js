"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { sectionCardClassName, railClassName, itemCardClassName, pesoFormatter, scrollCards } from "./containerCards";
import { type PredictionRecord } from "@/data/predictions";


export default function MyPredictions() {
    const { status } = useSession();
    const predictionRailRef = useRef<HTMLDivElement>(null);
    const [isPredictionsLoading, setIsPredictionsLoading] = useState(true);
    const [predictionsError, setPredictionsError] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
    const [selectedPrediction, setSelectedPrediction] = useState<PredictionRecord | null>(null);

    useEffect(() => {
            if (status === "loading") {
                return;
            }
    
            if (status !== "authenticated") {
                setPredictions([]);
                setSelectedPrediction(null);
                setIsPredictionsLoading(false);
                return;
            }
    
            let isMounted = true;
    
            async function loadPredictions() {
                setIsPredictionsLoading(true);
                setPredictionsError(null);
    
                try {
                    const response = await fetch("/api/predictions", {
                        cache: "no-store",
                    });
    
                    if (!response.ok) {
                        throw new Error("Unable to load predictions right now.");
                    }
    
                    const data = (await response.json()) as PredictionRecord[];
    
                    if (!isMounted) {
                        return;
                    }
    
                    setPredictions(data);
                    setSelectedPrediction(data[0] ?? null);
                } catch (error) {
                    if (!isMounted) {
                        return;
                    }
    
                    setPredictionsError(
                        error instanceof Error
                            ? error.message
                            : "Unable to load predictions right now."
                    );
                } finally {
                    if (isMounted) {
                        setIsPredictionsLoading(false);
                    }
                }
            }

            loadPredictions();
    
            return () => {
                isMounted = false;
            };
        }, [status]);

    return (
        <section className={sectionCardClassName}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                        Results
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        My Predictions
                    </h2>
                    <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                        Review recent valuation outputs and keep your pricing decisions organized in one place.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => scrollCards(predictionRailRef, "left")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Scroll predictions left"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollCards(predictionRailRef, "right")}
                        className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Scroll predictions right"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            {isPredictionsLoading ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm text-white/55">
                    Loading your saved predictions...
                </div>
            ) : predictionsError ? (
                <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-10 text-center text-sm text-red-100/85">
                    {predictionsError}
                </div>
            ) : predictions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
                    <p className="text-base font-medium text-white">No predictions yet</p>
                    <p className="mt-2 text-sm text-white/55">
                        Add your first property prediction to see it here.
                    </p>
                    <Link
                        href="/user/prediction"
                        className="mt-5 inline-flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                    >
                        Add Prediction
                    </Link>
                </div>
            ) : (
                <>
                    <div ref={predictionRailRef} className={railClassName}>
                        {predictions.map((prediction) => (
                            <button
                                key={prediction.id}
                                type="button"
                                onClick={() => setSelectedPrediction(prediction)}
                                className={`cursor-pointer ${itemCardClassName} ${selectedPrediction?.id === prediction.id ? "border-white/30 bg-white/[0.08]" : ""}`}
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
                                        You
                                    </p>
                                    <p className="text-sm text-emerald-200">
                                        {pesoFormatter.format(prediction.predictedPrice)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedPrediction ? (
                        <div className="mt-6 grid gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
                            <div className="relative min-h-[260px] overflow-hidden rounded-[1.25rem] bg-black/20 lg:min-h-[100%]">
                                <Image
                                    src={selectedPrediction.image}
                                    alt={`${selectedPrediction.propertyType} in ${selectedPrediction.location}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover object-center"
                                />
                            </div>

                            <div className="flex flex-col justify-between gap-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                            Selected Prediction
                                        </p>
                                        <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                                            {selectedPrediction.propertyType}
                                        </h3>
                                        <p className="text-sm text-white/65 sm:text-base">
                                            {selectedPrediction.location}
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
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedPrediction.lotArea
                                                ? `${selectedPrediction.lotArea} sqm`
                                                : "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Floor Area</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedPrediction.floorArea} sqm
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bedrooms</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedPrediction.bedrooms ?? "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bathrooms</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedPrediction.bathrooms ?? "Not set"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Garage</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedPrediction.hasGarage ? "Available" : "None"}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Created</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {new Date(selectedPrediction.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">
                                        Predicted Price
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-cyan-100">
                                        {pesoFormatter.format(selectedPrediction.predictedPrice)}
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