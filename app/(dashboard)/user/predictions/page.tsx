"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertTriangle, ChevronLeft, ChevronRight, Pencil, Sparkles, Star, Trash2 } from "lucide-react";
import { HeroHeader } from "@/components/header";
import { type PredictionRecord } from "@/data/predictions";
import { sampleHouses } from "@/data/sample-houses";
import {
    itemCardClassName,
    pesoFormatter,
    railClassName,
    scrollCards,
    sectionCardClassName,
} from "@/components/user-dashboard/containerCards";
import { normalizePropertyType } from "@/lib/prediction-utils";

const FAVORITES_STORAGE_KEY = "user-prediction-favorites";

function DeletePredictionSkeleton() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
            <div className="w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111] p-6 shadow-2xl shadow-black/40 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <div className="size-11 animate-pulse rounded-2xl bg-red-300/20" />
                    <div className="space-y-3">
                        <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                        <div className="h-7 w-56 animate-pulse rounded-full bg-white/15" />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="h-56 animate-pulse rounded-[1.25rem] bg-white/[0.08]" />
                    <div className="space-y-4">
                        <div className="h-5 w-40 animate-pulse rounded-full bg-white/12" />
                        <div className="h-4 w-52 animate-pulse rounded-full bg-white/10" />
                        <div className="grid grid-cols-2 gap-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 animate-pulse rounded-2xl border border-white/10 bg-black/20"
                                />
                            ))}
                        </div>
                        <div className="h-11 w-44 animate-pulse rounded-2xl bg-red-300/20" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserPredictionsPage() {
    const { status } = useSession();
    const predictionsRailRef = useRef<HTMLDivElement>(null);
    const favoritesRailRef = useRef<HTMLDivElement>(null);
    const suggestionsRailRef = useRef<HTMLDivElement>(null);
    const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
    const [selectedPrediction, setSelectedPrediction] = useState<PredictionRecord | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [isPredictionsLoading, setIsPredictionsLoading] = useState(true);
    const [predictionsError, setPredictionsError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [predictionToDelete, setPredictionToDelete] = useState<PredictionRecord | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

        if (!storedFavorites) {
            return;
        }

        try {
            const parsedFavorites = JSON.parse(storedFavorites) as string[];
            setFavoriteIds(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } catch {
            setFavoriteIds([]);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    }, [favoriteIds]);

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
                setSelectedPrediction((currentSelected) => {
                    if (currentSelected) {
                        const matchingPrediction = data.find(
                            (prediction) => prediction.id === currentSelected.id
                        );

                        if (matchingPrediction) {
                            return matchingPrediction;
                        }
                    }

                    return data[0] ?? null;
                });
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

    const favoritePredictions = useMemo(
        () => predictions.filter((prediction) => favoriteIds.includes(prediction.id)),
        [favoriteIds, predictions]
    );

    const suggestionTemplates = useMemo(() => {
        const selectedType = selectedPrediction?.propertyType;
        const matchingHouses = selectedType
            ? sampleHouses.filter(
                  (house) =>
                      normalizePropertyType(house.PropertyType) ===
                      normalizePropertyType(selectedType)
              )
            : [];

        return (matchingHouses.length > 0 ? matchingHouses : sampleHouses).slice(0, 8);
    }, [selectedPrediction]);

    function toggleFavorite(predictionId: string) {
        setFavoriteIds((currentFavorites) =>
            currentFavorites.includes(predictionId)
                ? currentFavorites.filter((id) => id !== predictionId)
                : [...currentFavorites, predictionId]
        );
    }

    async function deletePrediction() {
        if (!predictionToDelete) {
            return;
        }

        const predictionId = predictionToDelete.id;
        setIsDeleting(true);
        setPredictionsError(null);

        try {
            const response = await fetch(`/api/predictions?id=${encodeURIComponent(predictionId)}`, {
                method: "DELETE",
            });
            const data = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to delete prediction.");
            }

            setPredictions((currentPredictions) => {
                const nextPredictions = currentPredictions.filter(
                    (prediction) => prediction.id !== predictionId
                );

                setSelectedPrediction((currentSelected) => {
                    if (currentSelected?.id === predictionId) {
                        return nextPredictions[0] ?? null;
                    }

                    return currentSelected;
                });

                return nextPredictions;
            });
            setFavoriteIds((currentFavorites) =>
                currentFavorites.filter((id) => id !== predictionId)
            );
            setPredictionToDelete(null);
        } catch (error) {
            setPredictionsError(
                error instanceof Error ? error.message : "Unable to delete prediction."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    function renderPredictionCard(prediction: PredictionRecord, isFavoriteRail = false) {
        const isFavorite = favoriteIds.includes(prediction.id);

        return (
            <article
                key={`${isFavoriteRail ? "favorite" : "prediction"}-${prediction.id}`}
                className={`${itemCardClassName} relative ${selectedPrediction?.id === prediction.id ? "border-white/30 bg-white/[0.08]" : ""}`}
            >
                <button
                    type="button"
                    onClick={() => toggleFavorite(prediction.id)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className={`absolute right-7 cursor-pointer top-7 z-10 inline-flex size-10 items-center justify-center rounded-full border transition ${
                        isFavorite
                            ? "border-amber-300/40 bg-amber-300/20 text-amber-100"
                            : "border-white/15 bg-black/40 text-white/75 hover:bg-black/55 hover:text-white"
                    }`}
                >
                    <Star className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedPrediction(prediction)}
                    className="text-left"
                >
                    <div className="relative h-40 overflow-hidden rounded-[1.25rem]">
                        <Image
                            src={prediction.image}
                            alt={`${prediction.propertyType} in ${prediction.location}`}
                            fill
                            sizes="(max-width: 640px) 260px, (max-width: 1280px) 300px, 250px"
                            className="cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="mt-4 space-y-1.5">
                        <p className="text-base font-semibold text-white">
                            {normalizePropertyType(prediction.propertyType)}
                        </p>
                        <p className="text-sm text-white/60">{prediction.location}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            {new Date(prediction.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-emerald-200">
                            {pesoFormatter.format(prediction.predictedPrice)}
                        </p>
                    </div>
                </button>
            </article>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
            {isDeleting ? <DeletePredictionSkeleton /> : null}

            {predictionToDelete && !isDeleting ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
                    <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#111111] p-6 shadow-2xl shadow-black/40">
                        <div className="flex items-start gap-4">
                            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-300/10 text-red-100">
                                <AlertTriangle className="size-5" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                    Confirm Delete
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">
                                    Delete this prediction?
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-white/65">
                                    This will permanently remove the {normalizePropertyType(predictionToDelete.propertyType)} prediction for {predictionToDelete.location}.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">
                                {normalizePropertyType(predictionToDelete.propertyType)}
                            </p>
                            <p className="mt-1 text-sm text-white/55">{predictionToDelete.location}</p>
                            <p className="mt-2 text-sm text-emerald-200">
                                {pesoFormatter.format(predictionToDelete.predictedPrice)}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setPredictionToDelete(null)}
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-5 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => void deletePrediction()}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/12 px-5 text-sm font-medium text-red-100 transition hover:bg-red-400/18"
                            >
                                <Trash2 className="size-4" />
                                Delete Prediction
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <HeroHeader />

            <div
                aria-hidden
                className="absolute inset-0 isolate hidden opacity-90 contain-strict lg:block"
            >
                <div className="absolute left-0 top-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,100%,.12)_0,hsla(0,0%,75%,.04)_45%,hsla(0,0%,45%,0)_80%)]" />
                <div className="absolute left-0 top-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.08)_0,hsla(0,0%,60%,.03)_80%,transparent_100%)]" />
                <div className="absolute left-0 top-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
            </div>

            <div
                aria-hidden
                className="absolute inset-0 -z-10 size-full bg-[radial-gradient(120%_120%_at_50%_100%,#171717_0%,#090909_58%,#050505_100%)]"
            />

            <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:gap-10 lg:px-8 lg:pt-36">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                            Prediction Center
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Your House Predictions
                        </h1>
                        <p className="max-w-3xl text-sm text-white/65 sm:text-base">
                            Review your saved property valuations, mark your best picks as favorites, and explore sample house templates for your next estimate.
                        </p>
                    </div>

                    <Link
                        href="/user/prediction"
                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                    >
                        Add Prediction
                    </Link>
                </div>

                {favoritePredictions.length > 0 ? (
                    <section className={sectionCardClassName}>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                    Favorites
                                </p>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Favorite Predictions
                                </h2>
                                <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                                    Your starred prediction cards are collected here for quick access.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => scrollCards(favoritesRailRef, "left")}
                                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                    aria-label="Scroll favorite predictions left"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollCards(favoritesRailRef, "right")}
                                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                    aria-label="Scroll favorite predictions right"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div ref={favoritesRailRef} className={railClassName}>
                            {favoritePredictions.map((prediction) =>
                                renderPredictionCard(prediction, true)
                            )}
                        </div>
                    </section>
                ) : null}

                <section className={sectionCardClassName}>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                My Predictions
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Saved Results
                            </h2>
                            <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                                Tap a card to inspect it, then use the star in the upper-right corner to save favorites.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => scrollCards(predictionsRailRef, "left")}
                                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                aria-label="Scroll predictions left"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollCards(predictionsRailRef, "right")}
                                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
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
                                Add your first property prediction to start building your list.
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
                            <div ref={predictionsRailRef} className={railClassName}>
                                {predictions.map((prediction) => renderPredictionCard(prediction))}
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
                                                    {normalizePropertyType(
                                                        selectedPrediction.propertyType
                                                    )}
                                                </h3>
                                                <p className="text-sm text-white/65 sm:text-base">
                                                    {selectedPrediction.location}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleFavorite(selectedPrediction.id)}
                                                className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                                                    favoriteIds.includes(selectedPrediction.id)
                                                        ? "border-amber-300/35 bg-amber-300/14 text-amber-100"
                                                        : "border-white/15 bg-white/[0.05] text-white/85 hover:bg-white/[0.09]"
                                                }`}
                                            >
                                                <Star
                                                    className={`size-4 ${
                                                        favoriteIds.includes(selectedPrediction.id)
                                                            ? "fill-current"
                                                            : ""
                                                    }`}
                                                />
                                                {favoriteIds.includes(selectedPrediction.id)
                                                    ? "Saved in Favorites"
                                                    : "Add to Favorites"}
                                            </button>
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
                                                <p className="text-xs text-white/45">Kitchens</p>
                                                <p className="mt-1 text-base font-semibold">
                                                    {selectedPrediction.kitchens ?? "Not set"}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                <p className="text-xs text-white/45">Garages</p>
                                                <p className="mt-1 text-base font-semibold">
                                                    {selectedPrediction.garages ?? 0}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                <p className="text-xs text-white/45">Created</p>
                                                <p className="mt-1 text-base font-semibold">
                                                    {new Date(
                                                        selectedPrediction.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <Link
                                                href={`/user/prediction?edit=${selectedPrediction.id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                                            >
                                                <Pencil className="size-4" />
                                                Edit Prediction
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={() => setPredictionToDelete(selectedPrediction)}
                                                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-400/16 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <Trash2 className="size-4" />
                                                Delete Prediction
                                            </button>
                                        </div>

                                        <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                                            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">
                                                Predicted Price
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold text-cyan-100">
                                                {pesoFormatter.format(
                                                    selectedPrediction.predictedPrice
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </section>

                <section className={sectionCardClassName}>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Suggestions
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Suggested House Templates
                            </h2>
                            <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                                Sample houses you can use as inspiration for future prediction entries.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => scrollCards(suggestionsRailRef, "left")}
                                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                aria-label="Scroll suggested templates left"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollCards(suggestionsRailRef, "right")}
                                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                aria-label="Scroll suggested templates right"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-5 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50/90">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10">
                                <Sparkles className="size-4" />
                            </span>
                            <div>
                                <p className="font-medium text-cyan-50">
                                    Smart suggestion template
                                </p>
                                <p className="mt-1 text-cyan-50/75">
                                    {selectedPrediction
                                        ? `These samples are matched to your selected ${normalizePropertyType(selectedPrediction.propertyType)} prediction.`
                                        : "Browse these samples to get ideas for your next valuation."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div ref={suggestionsRailRef} className={railClassName}>
                        {suggestionTemplates.map((house) => (
                            <article key={house.id} className={` ${itemCardClassName} min-w-[270px]`}>
                                <div className="relative h-40 overflow-hidden rounded-[1.25rem]">
                                    <Image
                                        src={house.image}
                                        alt={`${house.PropertyType} in ${house.Location}`}
                                        fill
                                        sizes="(max-width: 640px) 260px, (max-width: 1280px) 300px, 250px"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="mt-4 space-y-1.5">
                                    <p className="text-base font-semibold text-white">
                                        {normalizePropertyType(house.PropertyType)}
                                    </p>
                                    <p className="text-sm text-white/60">{house.Location}</p>
                                    <p className="text-sm text-emerald-200">
                                        {pesoFormatter.format(house.Price_PHP)}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/60">
                                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                        {house.FloorArea} sqm
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                        {house.Bedrooms} bedrooms
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
