"use client";

import { Suspense } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Pencil, Save, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { emptyPredictionForm, estimatePrediction, normalizePropertyType, propertyTypeOptions, toPredictionFormValues, type PredictionFormValues } from "@/lib/prediction-utils";
import { sampleHouses } from "@/data/sample-houses";
import { PredictionRecord } from "@/data/predictions";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
});

type FormErrors = Partial<Record<keyof PredictionFormValues, string>>;

const sectionCardClassName =
    "rounded-[1.5rem] border border-white/10 bg-white/3 p-6";

function PredictionSaveSkeleton({ action }: { action: "Saving" | "Updating" | "Deleting" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
            <div className="w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111] shadow-2xl shadow-black/40">
                <div className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-5 p-6 sm:p-8">
                        <div>
                            <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                            <div className="mt-4 h-8 w-64 max-w-full animate-pulse rounded-full bg-white/15" />
                            <p className="mt-3 text-sm text-white/60">
                                {action} prediction...
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                                    <div className="h-11 animate-pulse rounded-2xl border border-white/10 bg-white/[0.06]" />
                                </div>
                            ))}
                        </div>

                        <div className="h-11 w-44 animate-pulse rounded-2xl bg-emerald-300/25" />
                    </div>

                    <div className="border-t border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                        <div className="h-52 animate-pulse rounded-[1.25rem] bg-white/[0.08]" />
                        <div className="mt-5 space-y-3">
                            <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                            <div className="h-7 w-44 animate-pulse rounded-full bg-white/15" />
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-16 animate-pulse rounded-2xl border border-white/10 bg-black/20"
                                    />
                                ))}
                            </div>
                            <div className="h-20 animate-pulse rounded-[1.25rem] border border-cyan-400/15 bg-cyan-400/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PredictionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const [formValues, setFormValues] = useState<PredictionFormValues>(emptyPredictionForm);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAction, setSubmitAction] = useState<"Saving" | "Updating" | "Deleting">("Saving");
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(Boolean(editId));
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const lotArea = searchParams.get("lotArea");
        const floorArea = searchParams.get("floorArea");

        if (lotArea || floorArea) {
            const sampleData = {
                location: searchParams.get("location") ?? "",
                propertyType: searchParams.get("propertyType") ?? "House & Lot",
                lotArea: Number(lotArea ?? 0),
                floorArea: Number(floorArea ?? 0),
                bedrooms: Number(searchParams.get("bedrooms") ?? 0),
                bathrooms: Number(searchParams.get("bathrooms") ?? 0),
                kitchens: Number(searchParams.get("kitchens") ?? 0),
                garages: Number(searchParams.get("garages") ?? 0),
            };

            setFormValues(sampleData);
            setIsLoadingPrediction(false);
            return;
        }

        const predictionId = editId ?? "";

        if (!predictionId) {
            setIsLoadingPrediction(false);
            return;
        }

        let isMounted = true;

        async function loadPrediction() {
            setIsLoadingPrediction(true);
            setServerError(null);

            try {
                const response = await fetch(`/api/predictions?id=${encodeURIComponent(predictionId)}`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Unable to load this prediction.");
                }

                const prediction = (await response.json()) as PredictionRecord;

                if (!isMounted) {
                    return;
                }

                setFormValues({
                    location: prediction.location,
                    propertyType: normalizePropertyType(prediction.propertyType),
                    lotArea: prediction.lotArea ?? 0,
                    floorArea: prediction.floorArea,
                    bedrooms: prediction.bedrooms ?? 0,
                    bathrooms: prediction.bathrooms ?? 0,
                    kitchens: prediction.kitchens ?? 0,
                    garages: prediction.garages ?? 0,
                });
                setSelectedTemplateId(null);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setServerError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load this prediction."
                );
            } finally {
                if (isMounted) {
                    setIsLoadingPrediction(false);
                }
            }
        }

        loadPrediction();

        return () => {
            isMounted = false;
        };
    }, [editId, searchParams]);

    const liveEstimate = useMemo(() => estimatePrediction(formValues), [formValues]);

    const suggestedTemplates = useMemo(() => {
        const matching = sampleHouses.filter(
            (house) =>
                normalizePropertyType(house.PropertyType) ===
                normalizePropertyType(formValues.propertyType)
        );

        return (matching.length > 0 ? matching : sampleHouses).slice(0, 8);
    }, [formValues.propertyType]);

    function updateField<Key extends keyof PredictionFormValues>(
        key: Key,
        value: PredictionFormValues[Key]
    ) {
        setFormValues((current) => ({
            ...current,
            [key]: value,
        }));

        setErrors((current) => {
            const next = { ...current };
            delete next[key];
            return next;
        });
    }

    function validateForm() {
        const nextErrors: FormErrors = {};

        if (!formValues.location.trim()) {
            nextErrors.location = "Location is required.";
        }

        if (!formValues.propertyType.trim()) {
            nextErrors.propertyType = "Property type is required.";
        }

        if (formValues.floorArea <= 0) {
            nextErrors.floorArea = "Floor area must be greater than 0.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function applyTemplate(templateId: number) {
        const template = sampleHouses.find((house) => house.id === templateId);

        if (!template) {
            return;
        }

        setFormValues(toPredictionFormValues(template));
        setSelectedTemplateId(templateId);
        setErrors({});
        setServerError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitAction(editId ? "Updating" : "Saving");
        setIsSubmitting(true);
        setServerError(null);

        try {
            const response = await fetch("/api/predictions", {
                method: editId ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editId ? { id: editId, ...formValues } : formValues),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to save prediction.");
            }

            router.push("/user/predictions");
            router.refresh();
        } catch (error) {
            setServerError(
                error instanceof Error ? error.message : "Unable to save prediction."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!editId) {
            return;
        }

        setSubmitAction("Deleting");
        setIsSubmitting(true);
        setIsDeleteConfirmOpen(false);
        setServerError(null);

        try {
            const response = await fetch(`/api/predictions?id=${encodeURIComponent(editId)}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to delete prediction.");
            }

            router.push("/user/predictions");
            router.refresh();
        } catch (error) {
            setServerError(
                error instanceof Error ? error.message : "Unable to delete prediction."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
            {isSubmitting ? <PredictionSaveSkeleton action={submitAction} /> : null}

            {isDeleteConfirmOpen && !isSubmitting ? (
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
                                    This will permanently remove this saved property prediction.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">
                                {formValues.propertyType}
                            </p>
                            <p className="mt-1 text-sm text-white/55">
                                {formValues.location || "No location set"}
                            </p>
                            <p className="mt-2 text-sm text-emerald-200">
                                {pesoFormatter.format(liveEstimate.predictedPrice)}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-5 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/12 px-5 text-sm font-medium text-red-100 transition hover:bg-red-400/18"
                            >
                                <Trash2 className="size-4" />
                                Delete Prediction
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

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
                        <Link
                            href="/user/predictions"
                            className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Predictions
                        </Link>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                            {editId ? "Edit Prediction" : "Add Prediction"}
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            {editId ? "Update Your Prediction" : "Create a New Prediction"}
                        </h1>
                        <p className="max-w-3xl text-sm text-white/65 sm:text-base">
                            Fill in the property details below, or tap a template card to auto-fill the form and then adjust it to match the house you want.
                        </p>
                    </div>
                </div>

                <section className={sectionCardClassName}>
                    <div className="mb-6 flex items-center gap-3">
                        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                            <Sparkles className="size-5" />
                        </span>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Templates
                            </p>
                            <h2 className="text-2xl font-semibold text-white">
                                Click a Sample to Auto-Fill
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {suggestedTemplates.map((house) => (
                            <button
                                key={house.id}
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => applyTemplate(house.id)}
                                className={`group rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-1 ${selectedTemplateId === house.id
                                        ? "border-cyan-300/35 bg-cyan-300/10"
                                        : "border-white/10 bg-white/3 hover:border-white/20"
                                    }`}
                            >
                                <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                                    <Image
                                        src={house.image}
                                        alt={`${house.PropertyType} in ${house.Location}`}
                                        fill
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
                            </button>
                        ))}
                    </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className={sectionCardClassName}>
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Prediction Form
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">
                                Property Details
                            </h2>
                        </div>

                        {isLoadingPrediction ? (
                            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/2 px-5 py-10 text-center text-sm text-white/55">
                                Loading prediction details...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Location</label>
                                        <Input
                                            value={formValues.location}
                                            onChange={(event) => updateField("location", event.target.value)}
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                            placeholder="Enter location"
                                        />
                                        {errors.location ? (
                                            <p className="text-xs text-red-300">{errors.location}</p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Property Type</label>
                                        <Select
                                            value={formValues.propertyType}
                                            onChange={(event) =>
                                                updateField("propertyType", event.target.value)
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        >
                                            {propertyTypeOptions.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                    className="bg-[#111111] text-white"
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Lot Area</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formValues.lotArea}
                                            onChange={(event) =>
                                                updateField("lotArea", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Floor Area</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formValues.floorArea}
                                            onChange={(event) =>
                                                updateField("floorArea", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                        {errors.floorArea ? (
                                            <p className="text-xs text-red-300">{errors.floorArea}</p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Bedrooms</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formValues.bedrooms}
                                            onChange={(event) =>
                                                updateField("bedrooms", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Bathrooms</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formValues.bathrooms}
                                            onChange={(event) =>
                                                updateField("bathrooms", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Kitchens</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formValues.kitchens}
                                            onChange={(event) =>
                                                updateField("kitchens", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/75">Garages</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formValues.garages}
                                            onChange={(event) =>
                                                updateField("garages", Number(event.target.value))
                                            }
                                            className="h-11 border-white/10 bg-black/20 px-4 text-white"
                                        />
                                    </div>
                                </div>

                                {serverError ? (
                                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100/90">
                                        {serverError}
                                    </div>
                                ) : null}

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isLoadingPrediction}
                                        className="cursor-pointer h-11 rounded-2xl bg-emerald-500 px-5 text-black hover:bg-emerald-400"
                                    >
                                        {editId ? (
                                            <>
                                                <Save className="size-4" />
                                                Update Prediction
                                            </>
                                        ) : (
                                            <>
                                                <Pencil className="size-4" />
                                                Save Prediction
                                            </>
                                        )}
                                    </Button>

                                    {editId ? (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={isSubmitting}
                                            onClick={() => setIsDeleteConfirmOpen(true)}
                                            className="h-11 rounded-2xl px-5"
                                        >
                                            <Trash2 className="size-4" />
                                            Delete Prediction
                                        </Button>
                                    ) : null}
                                </div>
                            </form>
                        )}
                    </section>

                    <section className={sectionCardClassName}>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                            Live Estimate
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            Predicted Result Preview
                        </h2>

                        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/3">
                            <div className="relative h-64">
                                <Image
                                    src={liveEstimate.image}
                                    alt="Prediction preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-4 p-5">
                                <div>
                                    <p className="text-sm text-white/55">
                                        {formValues.location || "Choose a location"}
                                    </p>
                                    <h3 className="mt-1 text-2xl font-semibold text-white">
                                        {formValues.propertyType}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Lot Area</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.lotArea} sqm
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Floor Area</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.floorArea} sqm
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bedrooms</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.bedrooms}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Bathrooms</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.bathrooms}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Kitchens</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.kitchens}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Garages</p>
                                        <p className="mt-1 font-medium text-white">
                                            {formValues.garages}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">
                                        Estimated Price
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-cyan-100">
                                        {pesoFormatter.format(liveEstimate.predictedPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PredictionForm />
        </Suspense>
    );
}
