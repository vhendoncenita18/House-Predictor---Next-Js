"use client";

import Image from "next/image";
import { Camera, UserCircle2 } from "lucide-react";

import type { ChangeEvent } from "react";

import type { ProfileFormState, ProfileUser, SessionUser } from "./profile-types";

type ProfileSummaryCardProps = {
  displayName: string;
  form: ProfileFormState;
  profile: ProfileUser | null;
  sessionUser?: SessionUser;
  isUploadingAvatar: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function ProfileSummaryCard({
  displayName,
  form,
  profile,
  sessionUser,
  isUploadingAvatar,
  onFileChange,
}: ProfileSummaryCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/3 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 flex size-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/4">
          {form.avatarUrl ? (
            <Image
              src={form.avatarUrl}
              alt={`${displayName} profile`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <UserCircle2 className="size-16 text-white/45" />
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-2 text-sm text-white/80 transition hover:bg-white/9 hover:text-white">
          <Camera className="size-4" />
          <span>{isUploadingAvatar ? "Uploading..." : "Upload photo"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploadingAvatar}
            onChange={onFileChange}
          />
        </label>

        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">{displayName}</h2>
          <p className="text-sm text-white/55">@{profile?.username ?? sessionUser?.username ?? "username"}</p>
        </div>

        <div className="mt-8 grid w-full gap-3 text-left">
          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/75">Role</p>
            <p className="mt-2 text-sm font-medium text-emerald-50">
              {profile?.utype ?? sessionUser?.utype ?? "User"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Member since</p>
            <p className="mt-2 text-sm font-medium text-white/80">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Loading..."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Last updated</p>
            <p className="mt-2 text-sm font-medium text-white/80">
              {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
