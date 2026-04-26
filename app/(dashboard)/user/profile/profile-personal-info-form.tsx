"use client";

import { LoaderCircle, Save, ShieldCheck } from "lucide-react";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

import type { ProfileFormState, ProfileUser, SessionUser } from "./profile-types";

type ProfilePersonalInfoFormProps = {
  form: ProfileFormState;
  profile: ProfileUser | null;
  sessionUser?: SessionUser;
  isLoading: boolean;
  isSavingProfile: boolean;
  profileMessage: string | null;
  profileError: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onFormChange: (updater: (current: ProfileFormState) => ProfileFormState) => void;
  onReset: () => void;
};

export function ProfilePersonalInfoForm({
  form,
  profile,
  sessionUser,
  isLoading,
  isSavingProfile,
  profileMessage,
  profileError,
  onSubmit,
  onFormChange,
  onReset,
}: ProfilePersonalInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.07]">
          <ShieldCheck className="size-5 text-white/80" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-white">Personal information</h2>
          <p className="text-sm text-white/55">Keep your account details up to date.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-white/65">First name</span>
          <input
            value={form.firstName}
            onChange={(event) => onFormChange((current) => ({ ...current, firstName: event.target.value }))}
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            placeholder="First name"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Middle name</span>
          <input
            value={form.middleName}
            onChange={(event) => onFormChange((current) => ({ ...current, middleName: event.target.value }))}
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            placeholder="Optional"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Last name</span>
          <input
            value={form.lastName}
            onChange={(event) => onFormChange((current) => ({ ...current, lastName: event.target.value }))}
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            placeholder="Last name"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Username</span>
          <input
            value={profile?.username ?? sessionUser?.username ?? ""}
            disabled
            className="h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-white/45 outline-none"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Gender</span>
          <select
            value={form.gender}
            onChange={(event) => onFormChange((current) => ({ ...current, gender: event.target.value }))}
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-white/25"
          >
            <option value="" className="bg-[#090909] text-white">
              Select gender
            </option>
            <option value="Male" className="bg-[#090909] text-white">
              Male
            </option>
            <option value="Female" className="bg-[#090909] text-white">
              Female
            </option>
            <option value="Other" className="bg-[#090909] text-white">
              Other
            </option>
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Birthdate</span>
          <input
            type="date"
            value={form.birthdate}
            onChange={(event) => onFormChange((current) => ({ ...current, birthdate: event.target.value }))}
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-white/25"
          />
        </label>
      </div>

      {profileMessage ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {profileMessage}
        </p>
      ) : null}

      {profileError ? (
        <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {profileError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={isSavingProfile || isLoading} className="rounded-2xl px-4">
          {isSavingProfile ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>{isSavingProfile ? "Saving..." : "Save profile"}</span>
        </Button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/[0.06] hover:text-white"
        >
          Reset changes
        </button>
      </div>
    </form>
  );
}
