import { sectionCardClassName } from "@/components/user-dashboard/containerCards";

import type { AdminRecentPrediction } from "./dashboard-types";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

type AdminRecentPredictionsProps = {
  predictions: AdminRecentPrediction[];
};

export function AdminRecentPredictions({ predictions }: AdminRecentPredictionsProps) {
  return (
    <section className={sectionCardClassName}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">Prediction feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Recent predictions</h2>
        </div>
        <p className="text-sm text-white/55">Latest valuation activity across the app.</p>
      </div>

      <div className="mt-6 space-y-3">
        {predictions.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/2 px-5 py-8 text-sm text-white/55">
            No predictions have been created yet.
          </div>
        ) : (
          predictions.map((prediction) => (
            <article
              key={prediction.id}
              className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.2fr_0.8fr_auto]"
            >
              <div>
                <p className="text-base font-medium text-white">{prediction.propertyType}</p>
                <p className="mt-1 text-sm text-white/55">{prediction.location}</p>
                <p className="mt-2 text-sm text-white/45">
                  by {prediction.user.firstName} {prediction.user.lastName} (@{prediction.user.username})
                </p>
              </div>

              <div className="text-sm text-white/60">
                <p>Created {prediction.createdAt.toLocaleDateString()}</p>
                <p className="mt-1">{prediction.createdAt.toLocaleTimeString()}</p>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/65">Estimate</p>
                <p className="mt-2 text-lg font-semibold text-emerald-100">
                  {pesoFormatter.format(prediction.predictedPrice)}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
