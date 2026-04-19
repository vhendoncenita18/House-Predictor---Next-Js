export type PredictionRecord = {
    id: string;
    createdAt: string;
    location: string;
    propertyType: string;
    lotArea: number | null;
    floorArea: number;
    bedrooms: number | null;
    bathrooms: number | null;
    kitchens: number | null;
    garages: number | null;
    hasGarage: boolean;
    predictedPrice: number;
    image: string;
    ownerName: string | null;
    ownerUsername: string | null;
};
