import Link from "next/link";

export function ProfileHero() {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/45">Account settings</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your profile</h1>
        <p className="max-w-2xl text-sm text-white/65 sm:text-base">
          Manage your personal details, upload a profile photo, and keep your account secure.
        </p>
      </div>

      <Link
        href="/user/dashboard"
        className="inline-flex w-fit rounded-2xl border border-white/10 bg-white/4 px-4 py-2 text-sm text-white/80 transition hover:bg-white/9 hover:text-white"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
