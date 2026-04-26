"use client";

import { KeyRound, LoaderCircle } from "lucide-react";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

import type { PasswordFormState } from "./profile-types";

type ProfilePasswordFormProps = {
  passwordForm: PasswordFormState;
  isLoading: boolean;
  isSavingPassword: boolean;
  passwordMessage: string | null;
  passwordError: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onPasswordChange: (updater: (current: PasswordFormState) => PasswordFormState) => void;
};

export function ProfilePasswordForm({
  passwordForm,
  isLoading,
  isSavingPassword,
  passwordMessage,
  passwordError,
  onSubmit,
  onPasswordChange,
}: ProfilePasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.07]">
          <KeyRound className="size-5 text-white/80" />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-white">Change password</h2>
          <p className="text-sm text-white/55">Use a strong password with at least 6 characters.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Current password</span>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) =>
              onPasswordChange((current) => ({ ...current, currentPassword: event.target.value }))
            }
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-white/25"
            placeholder="Current password"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">New password</span>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) =>
              onPasswordChange((current) => ({ ...current, newPassword: event.target.value }))
            }
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-white/25"
            placeholder="New password"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-white/65">Confirm password</span>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(event) =>
              onPasswordChange((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none transition focus:border-white/25"
            placeholder="Confirm password"
          />
        </label>
      </div>

      {passwordMessage ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {passwordMessage}
        </p>
      ) : null}

      {passwordError ? (
        <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {passwordError}
        </p>
      ) : null}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={isSavingPassword || isLoading} className="rounded-2xl px-4">
          {isSavingPassword ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
          <span>{isSavingPassword ? "Updating..." : "Update password"}</span>
        </Button>
      </div>
    </form>
  );
}
