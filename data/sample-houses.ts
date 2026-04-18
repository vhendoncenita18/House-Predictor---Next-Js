export type SampleHouse = {
    id: number;
    image: string;
    Location: string;
    PropertyType: string;
    LotArea: number;
    FloorArea: number;
    Bedrooms: number;
    Bathrooms: number;
    Kitchens: number;
    Garages: number;
    Price_PHP: number;
};

export const houseCardImages = [
    "/house-and-lot/hal-1.jpg",
    "/house-and-lot/hal-2.jpg",
    "/house-and-lot/hal-3.jpg",
    "/house-and-lot/hal-4.jpg",
    "/house-and-lot/hal-5.jpg",
    "/house-and-lot/hal-6.jpg",
    "/house-and-lot/hal-7.jpg",
    "/house-and-lot/hal-8.jpg",
    "/house-and-lot/hal-9.jpg",
    "/house-and-lot/hal-10.jpg",
];

export const sampleHouses: SampleHouse[] = [
    {
        id: 1,
        image: houseCardImages[0],
        Location: "Quezon City",
        PropertyType: "House and Lot",
        LotArea: 180,
        FloorArea: 140,
        Bedrooms: 3,
        Bathrooms: 2,
        Kitchens: 1,
        Garages: 1,
        Price_PHP: 6800000,
    },
    {
        id: 2,
        image: houseCardImages[1],
        Location: "Taguig City",
        PropertyType: "Townhouse",
        LotArea: 120,
        FloorArea: 155,
        Bedrooms: 4,
        Bathrooms: 3,
        Kitchens: 1,
        Garages: 2,
        Price_PHP: 9250000,
    },
    {
        id: 3,
        image: houseCardImages[2],
        Location: "Cebu City",
        PropertyType: "Single Detached",
        LotArea: 210,
        FloorArea: 175,
        Bedrooms: 4,
        Bathrooms: 3,
        Kitchens: 1,
        Garages: 2,
        Price_PHP: 8750000,
    },
    {
        id: 4,
        image: houseCardImages[3],
        Location: "Davao City",
        PropertyType: "Bungalow",
        LotArea: 240,
        FloorArea: 160,
        Bedrooms: 3,
        Bathrooms: 2,
        Kitchens: 1,
        Garages: 2,
        Price_PHP: 7100000,
    },
    {
        id: 5,
        image: houseCardImages[4],
        Location: "Pasig City",
        PropertyType: "Duplex",
        LotArea: 135,
        FloorArea: 145,
        Bedrooms: 3,
        Bathrooms: 3,
        Kitchens: 1,
        Garages: 1,
        Price_PHP: 7950000,
    },
    {
        id: 6,
        image: houseCardImages[5],
        Location: "Makati City",
        PropertyType: "Condominium",
        LotArea: 0,
        FloorArea: 85,
        Bedrooms: 2,
        Bathrooms: 2,
        Kitchens: 1,
        Garages: 0,
        Price_PHP: 6500000,
    },
    {
        id: 7,
        image: houseCardImages[6],
        Location: "Mandaluyong City",
        PropertyType: "Townhouse",
        LotArea: 110,
        FloorArea: 130, 
        Bedrooms: 3,
        Bathrooms: 2,
        Kitchens: 1,
        Garages: 1,
        Price_PHP: 7200000,
    },
    {
        id: 8,
        image: houseCardImages[7],
        Location: "Pasay City",
        PropertyType: "Single Detached",
        LotArea: 200,
        FloorArea: 150,
        Bedrooms: 4,
        Bathrooms: 3,
        Kitchens: 1,
        Garages: 2,
        Price_PHP: 8000000,    
    }
];

export function getRandomHouseImage(seed: number) {
    return houseCardImages[seed % houseCardImages.length];
}
