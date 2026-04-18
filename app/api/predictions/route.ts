import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRandomHouseImage } from "@/data/sample-houses";

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const predictions = await prisma.prediction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 12,
    });

    const data = predictions.map((prediction, index) => ({
        id: prediction.id,
        createdAt: prediction.createdAt.toISOString(),
        location: prediction.location,
        propertyType: prediction.propertyType,
        lotArea: prediction.lotArea != null ? Number(prediction.lotArea) : null,
        floorArea: Number(prediction.floorArea),
        bedrooms: prediction.bedrooms,
        bathrooms: prediction.bathrooms,
        hasGarage: prediction.hasGarage ?? false,
        predictedPrice: Number(prediction.predictedPrice),
        image: getRandomHouseImage(index + prediction.location.length),
    }));

    return NextResponse.json(data);
}
