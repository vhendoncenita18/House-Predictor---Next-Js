import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPredictionImageFromRecord } from "@/app/api/predictions/image";
import { isAdminRole } from "@/lib/auth-role";
import prisma from "@/lib/prisma";

import { AdminPageIntro } from "../admin-page-intro";
import { AdminShell } from "../admin-shell";
import { PredictionsBoard } from "./predictions-board";

type AdminPredictionUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  predictions: {
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
  }[];
};

export default async function AdminPredictionsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { utype?: string } | undefined)?.utype;

  if (!isAdminRole(role)) {
    redirect("/user/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      predictions: {
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          createdAt: true,
          location: true,
          propertyType: true,
          lotArea: true,
          floorArea: true,
          bedrooms: true,
          bathrooms: true,
          kitchens: true,
          garages: true,
          predictedPrice: true,
        },
      },
    },
  });

  const typedUsers = users as AdminPredictionUser[];
  const usersWithPredictions = typedUsers.filter((user) => user.predictions.length > 0);

  return (
    <AdminShell>
      <AdminPageIntro
        eyebrow="Admin predictions"
        title="Predictions by user"
        description="Each section below is one user, with their latest prediction cards grouped together for faster review."
      />

      <PredictionsBoard
        users={usersWithPredictions.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          predictions: user.predictions.map((prediction) => ({
            id: prediction.id,
            createdAt: prediction.createdAt.toISOString(),
            location: prediction.location,
            propertyType: prediction.propertyType,
            bedrooms: prediction.bedrooms,
            bathrooms: prediction.bathrooms,
            floorArea: Number(prediction.floorArea),
            garages: prediction.garages,
            predictedPrice: Number(prediction.predictedPrice),
            image: getPredictionImageFromRecord({
              ...prediction,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
              },
            }),
          })),
        }))}
      />
    </AdminShell>
  );
}
