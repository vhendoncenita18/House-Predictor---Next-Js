import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { type PredictionFormValues, estimatePrediction } from "@/lib/prediction-utils";
import {
    type PredictionSource,
    validatePredictionInput,
    serializePrediction,
} from "./utils";
import { getPredictionImageFromRecord } from "./image";
import { getMLPrediction } from "./ml";

type PredictionModelDelegate = {
    findFirst(args: unknown): Promise<PredictionSource | null>;
    findMany(args: unknown): Promise<PredictionSource[]>;
    create(args: unknown): Promise<PredictionSource>;
    update(args: unknown): Promise<PredictionSource>;
    delete(args: unknown): Promise<unknown>;
};

const predictionModel = prisma.prediction as unknown as PredictionModelDelegate;

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

        const image = getPredictionImageFromRecord(prediction);

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

    const data = predictions.map((prediction) => {
        const image = getPredictionImageFromRecord(prediction);
        return serializePrediction(prediction, image, scope);
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
        const mlPredictedPrice = await getMLPrediction(values);
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
                predictedPrice: mlPredictedPrice, // Use ML prediction result
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
