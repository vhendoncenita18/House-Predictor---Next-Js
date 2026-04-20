import {
    emptyPredictionForm,
    normalizePropertyType,
    type PredictionFormValues,
} from "@/lib/prediction-utils";

export type PredictionSource = {
    id: string;
    createdAt: Date;
    location: string;
    propertyType: string;
    lotArea: unknown;
    floorArea: unknown;
    bedrooms: number | null;
    bathrooms: number | null;
    kitchens: number | null;
    garages: number | null;
    predictedPrice: unknown;
    user: {
        firstName: string | null;
        lastName: string | null;
        username: string | null;
    };
};

export function parseOptionalNumber(value: unknown) {
    if (value == null || value === "") {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function parseRequiredNumber(value: unknown) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function validatePredictionInput(input: Partial<PredictionFormValues>) {
    const values: PredictionFormValues = {
        location: String(input.location ?? emptyPredictionForm.location).trim(),
        propertyType: normalizePropertyType(
            String(input.propertyType ?? emptyPredictionForm.propertyType)
        ),
        lotArea: Math.max(0, parseRequiredNumber(input.lotArea)),
        floorArea: Math.max(1, parseRequiredNumber(input.floorArea)),
        bedrooms: Math.max(0, parseRequiredNumber(input.bedrooms)),
        bathrooms: Math.max(0, parseRequiredNumber(input.bathrooms)),
        kitchens: Math.max(0, parseRequiredNumber(input.kitchens)),
        garages: Math.max(0, parseRequiredNumber(input.garages)),
    };

    if (!values.location) {
        throw new Error("Location is required.");
    }

    if (!values.propertyType) {
        throw new Error("Property type is required.");
    }

    return values;
}

export function serializePrediction(
    prediction: PredictionSource,
    image: string,
    scope: string | null
) {
    return {
        id: prediction.id,
        createdAt: prediction.createdAt.toISOString(),
        location: prediction.location,
        propertyType: normalizePropertyType(prediction.propertyType),
        lotArea: parseOptionalNumber(prediction.lotArea),
        floorArea: parseRequiredNumber(prediction.floorArea),
        bedrooms: prediction.bedrooms,
        bathrooms: prediction.bathrooms,
        kitchens: prediction.kitchens,
        garages: prediction.garages,
        predictedPrice: parseRequiredNumber(prediction.predictedPrice),
        image,
        ownerName:
            scope === "others"
                ? [prediction.user.firstName, prediction.user.lastName]
                      .filter(Boolean)
                      .join(" ")
                : null,
        ownerUsername: scope === "others" ? prediction.user.username : null,
    };
}
