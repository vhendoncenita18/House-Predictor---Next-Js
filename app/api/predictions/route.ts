import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRandomHouseImage } from "@/data/sample-houses";
import {
    emptyPredictionForm,
    estimatePrediction,
    normalizePropertyType,
    type PredictionFormValues,
} from "@/lib/prediction-utils";

type PredictionSource = {
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

type PredictionModelDelegate = {
    findFirst(args: unknown): Promise<PredictionSource | null>;
    findMany(args: unknown): Promise<PredictionSource[]>;
    create(args: unknown): Promise<PredictionSource>;
    update(args: unknown): Promise<PredictionSource>;
    delete(args: unknown): Promise<unknown>;
};

const predictionModel = prisma.prediction as unknown as PredictionModelDelegate;

function parseOptionalNumber(value: unknown) {
    if (value == null || value === "") {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseRequiredNumber(value: unknown) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function validatePredictionInput(input: Partial<PredictionFormValues>) {
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

function serializePrediction(
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

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    const id = searchParams.get("id");

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (id) {
        const prediction = await predictionModel.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });

        if (!prediction) {
            return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
        }

        const image = estimatePrediction({
            location: prediction.location,
            propertyType: prediction.propertyType,
            lotArea: parseOptionalNumber(prediction.lotArea) ?? 0,
            floorArea: parseRequiredNumber(prediction.floorArea),
            bedrooms: prediction.bedrooms ?? 0,
            bathrooms: prediction.bathrooms ?? 0,
            kitchens: prediction.kitchens ?? 0,
            garages: prediction.garages ?? 0,
        }).image;

        return NextResponse.json(serializePrediction(prediction, image, scope));
    }

    const predictions = await predictionModel.findMany({
        where: scope === "others" ? { NOT: { userId } } : { userId },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
    });

    const data = predictions.map((prediction, index) => {
        return serializePrediction(
            prediction,
            getRandomHouseImage(index + prediction.location.length),
            scope
        );
    });

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as Partial<PredictionFormValues>;
        const values = validatePredictionInput(body);
        const estimation = estimatePrediction(values);

        const prediction = await predictionModel.create({
            data: {
                userId,
                location: values.location,
                propertyType: values.propertyType,
                lotArea: values.lotArea,
                floorArea: values.floorArea,
                bedrooms: values.bedrooms,
                bathrooms: values.bathrooms,
                kitchens: values.kitchens,
                garages: values.garages,
                predictedPrice: estimation.predictedPrice,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json(
            serializePrediction(prediction, estimation.image, null),
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create prediction.",
            },
            { status: 400 }
        );
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = (await request.json()) as Partial<PredictionFormValues> & { id?: string };

        if (!body.id) {
            return NextResponse.json({ error: "Prediction id is required." }, { status: 400 });
        }

        const values = validatePredictionInput(body);
        const estimation = estimatePrediction(values);

        const existingPrediction = await predictionModel.findFirst({
            where: {
                id: body.id,
                userId,
            },
        });

        if (!existingPrediction) {
            return NextResponse.json({ error: "Prediction not found." }, { status: 404 });
        }

        const prediction = await predictionModel.update({
            where: { id: body.id },
            data: {
                location: values.location,
                propertyType: values.propertyType,
                lotArea: values.lotArea,
                floorArea: values.floorArea,
                bedrooms: values.bedrooms,
                bathrooms: values.bathrooms,
                kitchens: values.kitchens,
                garages: values.garages,
                predictedPrice: estimation.predictedPrice,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json(serializePrediction(prediction, estimation.image, null));
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to update prediction.",
            },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Prediction id is required." }, { status: 400 });
    }

    const existingPrediction = await predictionModel.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingPrediction) {
        return NextResponse.json({ error: "Prediction not found." }, { status: 404 });
    }

    await predictionModel.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
