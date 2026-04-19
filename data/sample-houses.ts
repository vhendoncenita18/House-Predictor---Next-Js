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

export const houseAndLotImages = [
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
    "/house-and-lot/hal-11.jpg",
    "/house-and-lot/hal-12.jpg",
    "/house-and-lot/hal-13.jpg",
    "/house-and-lot/hal-14.jpg",
    "/house-and-lot/hal-15.jpg",
    "/house-and-lot/hal-16.jpg",
    "/house-and-lot/hal-17.jpg",
    "/house-and-lot/hal-18.jpg",
    "/house-and-lot/hal-19.jpg",
    "/house-and-lot/hal-20.jpg",
];

export const townhouseImages = [
    "/townhouse/th-10.jpg",
    "/townhouse/th-2.jpg",
    "/townhouse/th-3.jpg",
    "/townhouse/th-4.jpg",
    "/townhouse/th-5.jpg",
    "/townhouse/th-6.jpg",
    "/townhouse/th-7.jpg",
    "/townhouse/th-8.jpg",
    "/townhouse/th-9.jpg",
    "/townhouse/th-1.jpg",
];

export const apartmentImages = [
    "/apartment/ap-1.jpg",
    "/apartment/ap-2.jpg",
    "/apartment/ap-3.jpg",
    "/apartment/ap-4.jpg",
    "/apartment/ap-5.jpg",
    "/apartment/ap-6.jpg",
    "/apartment/ap-7.jpg",
    "/apartment/ap-8.jpg",
    "/apartment/ap-9.jpg",
    "/apartment/ap-10.jpg",
];

export const condominiumImages = [
    "/condominium/cd-1.jpg",
    "/condominium/cd-2.jpg",
    "/condominium/cd-3.jpg",
    "/condominium/cd-4.jpg",
    "/condominium/cd-5.jpg",
    "/condominium/cd-6.jpg",
    "/condominium/cd-7.jpg",
    "/condominium/cd-8.jpg",
    "/condominium/cd-9.jpg",
    "/condominium/cd-10.jpg",
];

export const allPropertyImages = [
    ...houseAndLotImages,
    ...townhouseImages,
    ...apartmentImages,
    ...condominiumImages,
];

const houseAndLotLocations = [
    "Iloilo",
    "Batangas",
    "Davao City",
    "Cavite",
    "Bacolod",
    "Laguna",
    "Pampanga",
    "Metro Manila",
    "Cagayan de Oro",
    "Baguio",
    "General Santos",
    "Butuan",
    "Dumaguete",
    "Tagaytay",
    "Antipolo",
    "Lipa",
    "Naga",
    "Tarlac",
    "Subic",
    "Puerto Princesa",
];

const townhouseLocations = [
    "Cebu City",
    "Iloilo",
    "Davao City",
    "Cebu City",
    "Baguio",
    "Pasig",
    "Taguig",
    "Makati",
    "Antipolo",
    "Quezon City",
];

const apartmentLocations = [
    "Iloilo",
    "Cebu City",
    "Cebu City",
    "Metro Manila",
    "Davao City",
    "Quezon City",
    "Pasay",
    "Pasig",
    "Taguig",
    "Baguio",
];

const condominiumLocations = [
    "Bacolod",
    "Cavite",
    "Cavite",
    "Iloilo",
    "Cebu City",
    "Makati",
    "Pasig",
    "Taguig",
    "Quezon City",
    "Pasay",
];

function createSeedHouse(
    id: number,
    image: string,
    location: string,
    propertyType: string,
    lotArea: number,
    floorArea: number,
    bedrooms: number,
    bathrooms: number,
    kitchens: number,
    garages: number,
    price: number
): SampleHouse {
    return {
        id,
        image,
        Location: location,
        PropertyType: propertyType,
        LotArea: lotArea,
        FloorArea: floorArea,
        Bedrooms: bedrooms,
        Bathrooms: bathrooms,
        Kitchens: kitchens,
        Garages: garages,
        Price_PHP: price,
    };
}

const houseAndLotSamples = houseAndLotImages.map((image, index) => {
    const lotArea = 98 + index * 11;
    const floorArea = 88 + index * 9;
    const bedrooms = 2 + (index % 5);
    const bathrooms = 1 + (index % 4);
    const kitchens = index % 6 === 0 ? 2 : 1;
    const garages = index % 5 === 0 ? 2 : 1;
    const price = 4_732_000 + index * 685_000;

    return createSeedHouse(
        index + 1,
        image,
        houseAndLotLocations[index],
        "House & Lot",
        lotArea,
        floorArea,
        bedrooms,
        bathrooms,
        kitchens,
        garages,
        price
    );
});

const townhouseSamples = townhouseImages.map((image, index) => {
    const lotArea = 90 + index * 16;
    const floorArea = 122 + index * 18;
    const bedrooms = 3 + (index % 4);
    const bathrooms = 2 + (index % 3);
    const kitchens = index % 4 === 0 ? 2 : 1;
    const garages = index % 3 === 0 ? 2 : 1;
    const price = 8_950_000 + index * 1_140_000;

    return createSeedHouse(
        houseAndLotSamples.length + index + 1,
        image,
        townhouseLocations[index],
        "Townhouse",
        lotArea,
        floorArea,
        bedrooms,
        bathrooms,
        kitchens,
        garages,
        price
    );
});

const apartmentSamples = apartmentImages.map((image, index) => {
    const lotArea = 140 + index * 19;
    const floorArea = 120 + index * 21;
    const bedrooms = 3 + (index % 4);
    const bathrooms = 2 + (index % 3);
    const kitchens = 2;
    const garages = index % 2;
    const price = 11_850_000 + index * 1_320_000;

    return createSeedHouse(
        houseAndLotSamples.length + townhouseSamples.length + index + 1,
        image,
        apartmentLocations[index],
        "Apartment/Rowhouse",
        lotArea,
        floorArea,
        bedrooms,
        bathrooms,
        kitchens,
        garages,
        price
    );
});

const condominiumSamples = condominiumImages.map((image, index) => {
    const floorArea = 28 + index * 11;
    const bedrooms = 1 + (index % 3);
    const bathrooms = 1 + (index % 2);
    const garages = index % 2;
    const price = 2_016_000 + index * 960_000;

    return createSeedHouse(
        houseAndLotSamples.length + townhouseSamples.length + apartmentSamples.length + index + 1,
        image,
        condominiumLocations[index],
        "Condominium",
        0,
        floorArea,
        bedrooms,
        bathrooms,
        1,
        garages,
        price
    );
});

export const sampleHouses: SampleHouse[] = [
    ...houseAndLotSamples,
    ...townhouseSamples,
    ...apartmentSamples,
    ...condominiumSamples,
];

export function getRandomHouseImage(seed: number) {
    return allPropertyImages[seed % allPropertyImages.length];
}
