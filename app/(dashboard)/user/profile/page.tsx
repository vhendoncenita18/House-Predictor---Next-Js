"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { HeroHeader } from "@/components/header";
import { sectionCardClassName } from "@/components/user-dashboard/containerCards";

import { ProfileHero } from "./profile-hero";
import { ProfilePasswordForm } from "./profile-password-form";
import { ProfilePersonalInfoForm } from "./profile-personal-info-form";
import { ProfileSummaryCard } from "./profile-summary-card";
import {
  emptyPasswordForm,
  emptyProfileForm,
  type ErrorResponse,
  type PasswordFormState,
  type ProfileFormState,
  type ProfileResponse,
  type ProfileUser,
  type SessionUser,
} from "./profile-types";

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);

  const sessionUser = session?.user as SessionUser | undefined;

  useEffect(() => {
    if (status !== "authenticated" || profile) {
      return;
    }

    setForm((current) => ({
      ...current,
      firstName: current.firstName || sessionUser?.firstName || "",
      middleName: current.middleName || sessionUser?.middleName || "",
      lastName: current.lastName || sessionUser?.lastName || "",
      gender: current.gender || sessionUser?.gender || "",
      birthdate: current.birthdate || sessionUser?.birthdate?.slice(0, 10) || "",
    }));
  }, [profile, sessionUser, status]);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status !== "loading") {
        setIsLoading(false);
      }
      return;
    }

    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const data = (await response.json()) as ProfileResponse | ErrorResponse;

        if (!response.ok || !("user" in data)) {
          throw new Error(("error" in data && data.error) || "Unable to load profile.");
        }

        if (!isMounted) {
          return;
        }

        setProfile(data.user);
        setForm({
          firstName: data.user.firstName ?? "",
          middleName: data.user.middleName ?? "",
          lastName: data.user.lastName ?? "",
          gender: data.user.gender ?? "",
          birthdate: data.user.birthdate.slice(0, 10),
          avatarUrl: data.user.avatarUrl ?? "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProfileError(error instanceof Error ? error.message : "Unable to load profile.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [status]);

  function syncProfileState(user: ProfileUser) {
    setProfile(user);
    setForm({
      firstName: user.firstName ?? "",
      middleName: user.middleName ?? "",
      lastName: user.lastName ?? "",
      gender: user.gender ?? "",
      birthdate: user.birthdate.slice(0, 10),
      avatarUrl: user.avatarUrl ?? "",
    });
  }

  async function syncSessionUser(user: ProfileUser) {
    await update({
      user: {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender: user.gender,
        birthdate: user.birthdate,
        username: user.username,
        utype: user.utype,
      },
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file for your profile photo.");
      return;
    }

    if (file.size > 1_500_000) {
      setProfileError("Please choose an image smaller than 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const nextForm = { ...form, avatarUrl: result };

      setForm(nextForm);
      setIsUploadingAvatar(true);
      setProfileError(null);

      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextForm),
        });

        const data = (await response.json()) as ProfileResponse & { message?: string; error?: string };

        if (!response.ok || !data.user) {
          throw new Error(data.error || "Unable to update profile photo.");
        }

        syncProfileState(data.user);
        await syncSessionUser(data.user);
        window.dispatchEvent(
          new CustomEvent("profile-avatar-updated", {
            detail: { avatarUrl: data.user.avatarUrl ?? "" },
          })
        );
        setProfileMessage("Profile photo updated successfully.");
      } catch (error) {
        setProfileError(error instanceof Error ? error.message : "Unable to update profile photo.");
      } finally {
        setIsUploadingAvatar(false);
        event.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as ProfileResponse & { message?: string; error?: string };

      if (!response.ok || !data.user) {
        throw new Error(data.error || "Unable to update profile.");
      }

      syncProfileState(data.user);
      await syncSessionUser(data.user);
      setProfileMessage(data.message || "Profile updated successfully.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage(null);
    setPasswordError(null);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to update password.");
      }

      setPasswordForm(emptyPasswordForm);
      setPasswordMessage(data.message || "Password updated successfully.");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  const displayName =
    [form.firstName, form.lastName].filter(Boolean).join(" ") ||
    sessionUser?.firstName ||
    sessionUser?.username ||
    "User";

  function resetProfileForm() {
    if (!profile) {
      return;
    }

    setForm({
      firstName: profile.firstName ?? "",
      middleName: profile.middleName ?? "",
      lastName: profile.lastName ?? "",
      gender: profile.gender ?? "",
      birthdate: profile.birthdate.slice(0, 10),
      avatarUrl: profile.avatarUrl ?? "",
    });
    setProfileError(null);
    setProfileMessage(null);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090909] text-white">
      <HeroHeader />

      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-90 contain-strict lg:block"
      >
        <div className="absolute left-0 top-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,100%,.12)_0,hsla(0,0%,75%,.04)_45%,hsla(0,0%,45%,0)_80%)]" />
        <div className="absolute left-0 top-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.08)_0,hsla(0,0%,60%,.03)_80%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 size-full bg-[radial-gradient(120%_120%_at_50%_100%,#171717_0%,#090909_58%,#050505_100%)]"
      />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:gap-10 lg:px-8 lg:pt-36">
        <ProfileHero />

        <section className={`${sectionCardClassName} grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]`}>
          <ProfileSummaryCard
            displayName={displayName}
            form={form}
            profile={profile}
            sessionUser={sessionUser}
            isUploadingAvatar={isUploadingAvatar}
            onFileChange={handleFileChange}
          />

          <div className="grid gap-6">
            <ProfilePersonalInfoForm
              form={form}
              profile={profile}
              sessionUser={sessionUser}
              isLoading={isLoading}
              isSavingProfile={isSavingProfile}
              profileMessage={profileMessage}
              profileError={profileError}
              onSubmit={handleProfileSubmit}
              onFormChange={setForm}
              onReset={resetProfileForm}
            />

            <ProfilePasswordForm
              passwordForm={passwordForm}
              isLoading={isLoading}
              isSavingPassword={isSavingPassword}
              passwordMessage={passwordMessage}
              passwordError={passwordError}
              onSubmit={handlePasswordSubmit}
              onPasswordChange={setPasswordForm}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
