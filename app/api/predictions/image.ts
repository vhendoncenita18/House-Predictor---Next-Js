import { estimatePrediction, type PredictionFormValues } from "@/lib/prediction-utils";
import { parseOptionalNumber, parseRequiredNumber, type PredictionSource } from "./utils";

export function getPredictionImage(values: PredictionFormValues): string {
    return estimatePrediction(values).image;
}

export function getPredictionImageFromRecord(prediction: PredictionSource): string {
    const values: PredictionFormValues = {
        location: prediction.location,
        propertyType: prediction.propertyType,
        lotArea: parseOptionalNumber(prediction.lotArea) ?? 0,
        floorArea: parseRequiredNumber(prediction.floorArea),
        bedrooms: prediction.bedrooms ?? 0,
        bathrooms: prediction.bathrooms ?? 0,
        kitchens: prediction.kitchens ?? 0,
        garages: prediction.garages ?? 0,
    };

    return getPredictionImage(values);
}
