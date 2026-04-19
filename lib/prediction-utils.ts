import { sampleHouses, type SampleHouse } from "@/data/sample-houses";
import type { PredictionRecord } from "@/data/predictions";

export type PredictionFormValues = {
    location: string;
    propertyType: string;
    lotArea: number;
    floorArea: number;
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    garages: number;
};

export const propertyTypeOptions = [
    "House & Lot",
    "Condominium",
    "Townhouse",
    "Apartment",
];

export const emptyPredictionForm: PredictionFormValues = {
    location: "",
    propertyType: "House & Lot",
    lotArea: 0,
    floorArea: 0,
    bedrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    garages: 0,
};

export function normalizePropertyType(propertyType: string) {
    if (propertyType === "Apartment/Rowhouse") {
        return "Apartment";
    }

    return propertyType;
}

export function toPredictionFormValues(house: SampleHouse): PredictionFormValues {
    return {
        location: house.Location,
        propertyType: normalizePropertyType(house.PropertyType),
        lotArea: house.LotArea,
        floorArea: house.FloorArea,
        bedrooms: house.Bedrooms,
        bathrooms: house.Bathrooms,
        kitchens: house.Kitchens,
        garages: house.Garages,
    };
}

export function predictionRecordToFormValues(record: PredictionRecord): PredictionFormValues {
    return {
        location: record.location,
        propertyType: normalizePropertyType(record.propertyType),
        lotArea: record.lotArea ?? 0,
        floorArea: record.floorArea,
        bedrooms: record.bedrooms ?? 0,
        bathrooms: record.bathrooms ?? 0,
        kitchens: record.kitchens ?? 0,
        garages: record.garages ?? 0,
    };
}

function scoreHouseMatch(values: PredictionFormValues, house: SampleHouse) {
    return (
        Math.abs(values.lotArea - house.LotArea) * 0.35 +
        Math.abs(values.floorArea - house.FloorArea) * 0.45 +
        Math.abs(values.bedrooms - house.Bedrooms) * 18 +
        Math.abs(values.bathrooms - house.Bathrooms) * 16 +
        Math.abs(values.kitchens - house.Kitchens) * 14 +
        Math.abs(values.garages - house.Garages) * 12
    );
}

export function estimatePrediction(values: PredictionFormValues) {
    const normalizedType = normalizePropertyType(values.propertyType);
    const matchingHouses = sampleHouses.filter(
        (house) => normalizePropertyType(house.PropertyType) === normalizedType
    );
    const candidateHouses = matchingHouses.length > 0 ? matchingHouses : sampleHouses;
    const rankedMatches = [...candidateHouses]
        .sort((left, right) => scoreHouseMatch(values, left) - scoreHouseMatch(values, right))
        .slice(0, 3);

    const averageBasePrice =
        rankedMatches.reduce((total, house) => total + house.Price_PHP, 0) /
        rankedMatches.length;

    const sizeAdjustment =
        values.floorArea * 52000 +
        values.lotArea * (normalizedType === "Condominium" ? 0 : 11000);
    const amenityAdjustment =
        values.bedrooms * 180000 +
        values.bathrooms * 150000 +
        values.kitchens * 95000 +
        values.garages * 125000;
    const predictedPrice = Math.round(averageBasePrice * 0.55 + sizeAdjustment + amenityAdjustment);
    const templateImage = rankedMatches[0]?.image ?? sampleHouses[0]?.image ?? "/house-and-lot/hal-1.jpg";

    return {
        predictedPrice,
        image: templateImage,
    };
}
