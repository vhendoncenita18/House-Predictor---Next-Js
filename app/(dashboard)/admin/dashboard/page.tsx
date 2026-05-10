import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPredictionImageFromRecord } from "@/app/api/predictions/image";
import { sectionCardClassName } from "@/components/user-dashboard/containerCards";
import prisma from "@/lib/prisma";
import { isAdminRole } from "@/lib/auth-role";
import { AdminShell } from "../admin-shell";

import { AdminDashboardHero } from "./admin-dashboard-hero";
import { AdminRecentPredictions } from "./admin-recent-predictions";
import { AdminRecentUsers } from "./admin-recent-users";
import { AdminStatGrid } from "./admin-stat-grid";
import type {
  AdminDashboardStat,
  AdminHistoryUser,
  AdminRecentPrediction,
} from "./dashboard-types";

type RawAdminRecentPrediction = Omit<AdminRecentPrediction, "predictedPrice"> & {
  predictedPrice: unknown;
};

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { utype?: string } | undefined)?.utype;

  if (!isAdminRole(role)) {
    redirect("/user/dashboard");
  }

  const [
    totalUsers,
    totalPredictions,
    adminUsers,
    latestUsers,
    latestPredictions,
    predictionAggregate,
    groupedPropertyTypes,
    groupedLocations,
    historyUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.prediction.count(),
    prisma.user.findMany({
      where: {
        OR: [{ utype: "Admin" }, { utype: "admin" }],
      },
      select: { id: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        utype: true,
        createdAt: true,
      },
    }),
    prisma.prediction.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        location: true,
        propertyType: true,
        predictedPrice: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    }),
    prisma.prediction.aggregate({
      _avg: { predictedPrice: true },
    }),
    prisma.prediction.groupBy({
      by: ["propertyType"],
      _count: { propertyType: true },
      orderBy: {
        _count: {
          propertyType: "desc",
        },
      },
      take: 1,
    }),
    prisma.prediction.groupBy({
      by: ["location"],
      _count: { location: true },
      orderBy: {
        _count: {
          location: "desc",
        },
      },
      take: 1,
    }),
    prisma.user.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      take: 4,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        predictions: {
          orderBy: { createdAt: "desc" },
          take: 3,
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
    }),
  ]);

  const averagePredictionValue = Number(predictionAggregate._avg.predictedPrice ?? 0);
  const leadingPropertyType = groupedPropertyTypes[0];
  const leadingLocation = groupedLocations[0];
  const typedHistoryUsers = historyUsers as AdminHistoryUser[];

  const stats: AdminDashboardStat[] = [
    {
      label: "Total users",
      value: totalUsers.toString(),
      hint: `${adminUsers.length} admin account${adminUsers.length === 1 ? "" : "s"} currently registered.`,
    },
    {
      label: "Predictions",
      value: totalPredictions.toString(),
      hint: leadingPropertyType
        ? `${leadingPropertyType.propertyType} is the most common property type right now.`
        : "No predictions yet.",
    },
    {
      label: "Average estimate",
      value: toCurrency(averagePredictionValue),
      hint: leadingLocation
        ? `${leadingLocation.location} currently leads activity by location.`
        : "Waiting for more prediction data.",
    },
    {
      label: "Newest member",
      value: latestUsers[0] ? latestUsers[0].username : "None yet",
      hint: latestUsers[0]
        ? `${latestUsers[0].firstName} ${latestUsers[0].lastName} joined most recently.`
        : "No member records found.",
    },
  ];

  return (
    <AdminShell>
        <AdminDashboardHero />
        <AdminStatGrid stats={stats} />

        <section className="grid min-w-0 gap-6 lg:gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <AdminRecentUsers users={latestUsers} />
          <AdminRecentPredictions
            predictions={(latestPredictions as RawAdminRecentPrediction[]).map((prediction) => ({
              ...prediction,
              predictedPrice: Number(prediction.predictedPrice),
            }))}
          />
        </section>

        <section className={`${sectionCardClassName} min-w-0`}>
          <div className="mb-6 min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45 sm:tracking-[0.3em]">
              Dashboard history
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">User prediction history</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              Recent prediction activity is grouped by user so the admin dashboard reads like a live history board.
            </p>
          </div>

          <div className="grid min-w-0 gap-6">
            {typedHistoryUsers.filter((user) => user.predictions.length > 0).map((user) => (
              <section
                key={user.id}
                className="min-w-0 rounded-[1.5rem] border border-white/10 bg-white/3 p-4 sm:p-5"
              >
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="[overflow-wrap:anywhere] break-words text-xl font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="[overflow-wrap:anywhere] break-words text-sm text-white/55">
                      @{user.username}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-white/50">
                    {user.predictions.length} latest prediction{user.predictions.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.predictions.map((prediction) => {
                    const image = getPredictionImageFromRecord({
                      ...prediction,
                      user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                      },
                    });

                    return (
                      <article
                        key={prediction.id}
                        className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20"
                      >
                        <div className="relative h-40">
                          <Image
                            src={image}
                            alt={`${prediction.propertyType} in ${prediction.location}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-2 p-4">
                          <p className="[overflow-wrap:anywhere] break-words text-base font-semibold text-white">
                            {prediction.propertyType}
                          </p>
                          <p className="[overflow-wrap:anywhere] break-words text-sm text-white/60">
                            {prediction.location}
                          </p>
                          <p className="text-sm text-emerald-200">
                            {toCurrency(Number(prediction.predictedPrice))}
                          </p>
                          <p className="text-xs text-white/45">
                            {prediction.createdAt.toLocaleDateString()} {prediction.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}

            {typedHistoryUsers.every((user) => user.predictions.length === 0) ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/2 px-5 py-10 text-center text-sm text-white/55">
                No prediction history available yet.
              </div>
            ) : null}
          </div>
        </section>
    </AdminShell>
  );
}
