"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Building2, Building, Warehouse } from "lucide-react";
import { HeroHeader } from "@/components/header";
import { sampleHouses, type SampleHouse } from "@/data/sample-houses";
import {
    itemCardClassName,
    pesoFormatter,
    railClassName,
    scrollCards,
    sectionCardClassName,
} from "@/components/user-dashboard/containerCards";

type HouseCategory = "House & Lot" | "Condominium" | "Townhouse" | "Apartment";

type CategoryConfig = {
    key: HouseCategory;
    title: string;
    eyebrow: string;
    description: string;
    accentClassName: string;
    icon: typeof Home;
    matches: (house: SampleHouse) => boolean;
};

const categoryConfigs: CategoryConfig[] = [
    {
        key: "House & Lot",
        title: "House & Lot",
        eyebrow: "Detached Living",
        description: "Family-ready homes with open lots, larger footprints, and private parking.",
        accentClassName: "from-emerald-400/25 via-emerald-300/10 to-transparent",
        icon: Home,
        matches: (house) => house.PropertyType === "House & Lot",
    },
    {
        key: "Condominium",
        title: "Condominium",
        eyebrow: "Vertical City Homes",
        description: "Compact urban residences designed for efficient city living and easy access.",
        accentClassName: "from-cyan-400/25 via-cyan-300/10 to-transparent",
        icon: Building2,
        matches: (house) => house.PropertyType === "Condominium",
    },
    {
        key: "Townhouse",
        title: "Townhouse",
        eyebrow: "Linked Residences",
        description: "Multi-level homes with flexible interiors, ideal for growing households.",
        accentClassName: "from-amber-400/25 via-amber-300/10 to-transparent",
        icon: Building,
        matches: (house) => house.PropertyType === "Townhouse",
    },
    {
        key: "Apartment",
        title: "Apartment",
        eyebrow: "Rental Blocks",
        description: "Income-focused and high-density residential options for urban neighborhoods.",
        accentClassName: "from-fuchsia-400/20 via-fuchsia-300/10 to-transparent",
        icon: Warehouse,
        matches: (house) => house.PropertyType === "Apartment/Rowhouse",
    },
];

export default function UserHousesPage() {
    const [selectedCategory, setSelectedCategory] = useState<HouseCategory>("House & Lot");
    const categoryRailRef = useRef<HTMLDivElement>(null);
    const categorySectionRef = useRef<HTMLElement>(null);

    const housesByCategory = useMemo(
        () =>
            categoryConfigs.reduce(
                (accumulator, category) => {
                    accumulator[category.key] = sampleHouses.filter(category.matches);
                    return accumulator;
                },
                {} as Record<HouseCategory, SampleHouse[]>
            ),
        []
    );

    const [selectedHouseByCategory, setSelectedHouseByCategory] = useState<Record<HouseCategory, SampleHouse>>({
        "House & Lot": housesByCategory["House & Lot"][0],
        Condominium: housesByCategory.Condominium[0],
        Townhouse: housesByCategory.Townhouse[0],
        Apartment: housesByCategory.Apartment[0],
    });

    const activeCategory = categoryConfigs.find((category) => category.key === selectedCategory) ?? categoryConfigs[0];
    const activeHouses = housesByCategory[selectedCategory];
    const selectedHouse = selectedHouseByCategory[selectedCategory] ?? activeHouses[0];

    const handleSeeAll = (category: HouseCategory) => {
        setSelectedCategory(category);
        categorySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
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
                <Link
                    href="/user/prediction"
                    className="self-end flex justify-center w-40  rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                >
                    Add Prediction
                </Link>
                <section className={sectionCardClassName}>
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Property Library
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Sample Houses by Category
                            </h1>
                            <p className="max-w-3xl text-sm text-white/65 sm:text-base">
                                Browse every sample house in the dataset by property type, then open a category to explore all available listings.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {categoryConfigs.map((category) => {
                            const categoryHouses = housesByCategory[category.key];
                            const previewHouse = categoryHouses[0];
                            const Icon = category.icon;

                            return (
                                <article
                                    key={category.key}
                                    className={`group relative overflow-hidden rounded-[1.65rem] border p-5 transition duration-300 hover:-translate-y-1 ${selectedCategory === category.key
                                        ? "border-white/25 bg-white/[0.08]"
                                        : "border-white/10 bg-white/[0.04]"
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.accentClassName}`} />
                                    <div className="relative flex h-full flex-col">
                                        <div className="mb-4 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                                                    {category.eyebrow}
                                                </p>
                                                <h2 className="mt-2 text-2xl font-semibold text-white">
                                                    {category.title}
                                                </h2>
                                            </div>
                                            <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/80">
                                                <Icon className="size-5" />
                                            </span>
                                        </div>

                                        <div className="relative h-44 overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20">
                                            <Image
                                                src={previewHouse.image}
                                                alt={`${category.title} sample preview`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            <p className="text-sm leading-6 text-white/65">
                                                {category.description}
                                            </p>
                                            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm">
                                                <span className="text-white/55">Available Samples</span>
                                                <span className="font-semibold text-white">{categoryHouses.length}</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleSeeAll(category.key)}
                                            className="cursor-pointer mt-6 inline-flex items-center justify-center self-center rounded-full border border-white/15 bg-white/[0.07] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.12]"
                                        >
                                            See All
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section ref={categorySectionRef} className={sectionCardClassName}>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Selected Category
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                {activeCategory.title}
                            </h2>
                            <p className="max-w-2xl text-sm text-white/65 sm:text-base">
                                {activeCategory.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => scrollCards(categoryRailRef, "left")}
                                className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                aria-label="Scroll category houses left"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollCards(categoryRailRef, "right")}
                                className="cursor-pointer inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                                aria-label="Scroll category houses right"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div ref={categoryRailRef} className={railClassName}>
                        {activeHouses.map((house) => (
                            <button
                                key={house.id}
                                type="button"
                                onClick={() =>
                                    setSelectedHouseByCategory((current) => ({
                                        ...current,
                                        [selectedCategory]: house,
                                    }))
                                }
                                className={`${itemCardClassName} ${selectedHouse?.id === house.id ? "border-white/30 bg-white/[0.08]" : ""}`}
                            >
                                <div className="relative h-40 overflow-hidden rounded-[1.25rem]">
                                    <Image
                                        src={house.image}
                                        alt={`${house.PropertyType} in ${house.Location}`}
                                        fill
                                        className="cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <p className="text-base font-semibold text-white">
                                        {house.PropertyType === "Apartment/Rowhouse" ? "Apartment" : house.PropertyType}
                                    </p>
                                    <p className="text-sm text-white/60">
                                        Location: {house.Location}
                                    </p>
                                    <p className="text-sm text-emerald-200">
                                        {pesoFormatter.format(house.Price_PHP)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedHouse ? (
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
                                        <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                                            {selectedHouse.PropertyType === "Apartment/Rowhouse"
                                                ? "Apartment"
                                                : selectedHouse.PropertyType}
                                        </h3>
                                        <p className="text-sm text-white/65 sm:text-base">
                                            {selectedHouse.Location}
                                        </p>
                                    </div>
                                    <Link
                                        href={{
                                            pathname: "/user/prediction",
                                            query: {
                                                location: selectedHouse.Location,
                                                propertyType: selectedHouse.PropertyType,
                                                lotArea: String(selectedHouse.LotArea),
                                                floorArea: String(selectedHouse.FloorArea),
                                                bedrooms: String(selectedHouse.Bedrooms),
                                                bathrooms: String(selectedHouse.Bathrooms),
                                                kitchens: String(selectedHouse.Kitchens),
                                                garages: String(selectedHouse.Garages),
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/12 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
                                    >
                                        Use for Prediction
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                        <p className="text-xs text-white/45">Lot Area</p>
                                        <p className="mt-1 text-base font-semibold">
                                            {selectedHouse.LotArea > 0 ? `${selectedHouse.LotArea} sqm` : "Not applicable"}
                                        </p>
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
                    ) : null}
                </section>
            </main>
        </div>
    );
}
