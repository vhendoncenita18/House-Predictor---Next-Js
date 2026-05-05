"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { sectionCardClassName, pesoFormatter } from "@/components/user-dashboard/containerCards";

type AdminPredictionCard = {
  id: string;
  createdAt: string;
  location: string;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  floorArea: number;
  garages: number | null;
  predictedPrice: number;
  image: string;
};

type AdminPredictionUserSection = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  predictions: AdminPredictionCard[];
};

type PredictionsBoardProps = {
  users: AdminPredictionUserSection[];
};

export function PredictionsBoard({ users }: PredictionsBoardProps) {
  const router = useRouter();
  const [deletingPredictionId, setDeletingPredictionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDeletePrediction(predictionId: string) {
    const confirmed = window.confirm("Delete this prediction?");

    if (!confirmed) {
      return;
    }

    setDeletingPredictionId(predictionId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/predictions/${predictionId}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete prediction.");
      }

      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete prediction."
      );
    } finally {
      setDeletingPredictionId(null);
    }
  }

  if (users.length === 0) {
    return (
      <section className={sectionCardClassName}>
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/2 px-5 py-10 text-center text-sm text-white/55">
          No user predictions available yet.
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8">
      {users.map((user) => (
        <section key={user.id} className={sectionCardClassName}>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">User section</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-white/55">@{user.username}</p>
            </div>
            <p className="text-sm text-white/55">
              {user.predictions.length} recent prediction{user.predictions.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {user.predictions.map((prediction) => {
              const isDeleting = deletingPredictionId === prediction.id;

              return (
                <article
                  key={prediction.id}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/3"
                >
                  <div className="relative h-44">
                    <Image
                      src={prediction.image}
                      alt={`${prediction.propertyType} in ${prediction.location}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-base font-semibold text-white">{prediction.propertyType}</p>
                      <p className="mt-1 text-sm text-white/60">{prediction.location}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white/65">
                      <p>Bedrooms: {prediction.bedrooms ?? 0}</p>
                      <p>Bathrooms: {prediction.bathrooms ?? 0}</p>
                      <p>Floor: {prediction.floorArea} sqm</p>
                      <p>Garage: {prediction.garages ?? 0}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/70">
                        Estimated price
                      </p>
                      <p className="mt-2 text-lg font-semibold text-emerald-100">
                        {pesoFormatter.format(prediction.predictedPrice)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-white/45">
                        {new Date(prediction.createdAt).toLocaleDateString()}{" "}
                        {new Date(prediction.createdAt).toLocaleTimeString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => void handleDeletePrediction(prediction.id)}
                        disabled={isDeleting}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-400/16 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" />
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {error ? (
        <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
