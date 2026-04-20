import { estimatePrediction, type PredictionFormValues } from "@/lib/prediction-utils";

export async function getMLPrediction(values: PredictionFormValues): Promise<number> {
    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Location: values.location,
                PropertyType: values.propertyType,
                LotArea: values.lotArea,
                FloorArea: values.floorArea,
                Bedrooms: values.bedrooms,
                Bathrooms: values.bathrooms,
                Kitchens: values.kitchens,
                Garages: values.garages,
            }),
        });

        if (!response.ok) throw new Error("ML Server error");

        const data = await response.json();
        return data.predicted_price; // Matches your FastAPI return key
    } catch (error) {
        console.error("Failed to connect to Python ML service:", error);
        // Fallback to utility prediction if the Python server is down
        return estimatePrediction(values).predictedPrice;
    }
}
