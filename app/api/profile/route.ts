import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

const MAX_AVATAR_LENGTH = 2_200_000;

function serializeUser(user: {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  birthdate: Date;
  username: string;
  avatarUrl: string | null;
  utype: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...user,
    birthdate: user.birthdate.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      gender: true,
      birthdate: true,
      username: true,
      avatarUrl: true,
      utype: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: serializeUser(user) });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const firstName = String(body.firstName ?? "").trim();
  const middleNameValue = String(body.middleName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const gender = String(body.gender ?? "").trim();
  const birthdateRaw = String(body.birthdate ?? "").trim();
  const avatarUrlRaw = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : null;

  if (!firstName || !lastName || !gender || !birthdateRaw) {
    return NextResponse.json(
      { error: "First name, last name, gender, and birthdate are required." },
      { status: 400 }
    );
  }

  const birthdate = new Date(birthdateRaw);

  if (Number.isNaN(birthdate.getTime())) {
    return NextResponse.json({ error: "Invalid birthdate." }, { status: 400 });
  }

  if (avatarUrlRaw && avatarUrlRaw.length > MAX_AVATAR_LENGTH) {
    return NextResponse.json(
      { error: "Profile image is too large. Please choose a smaller image." },
      { status: 400 }
    );
  }

  if (avatarUrlRaw && !avatarUrlRaw.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Profile image must be a valid image file." },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      middleName: middleNameValue || null,
      lastName,
      gender,
      birthdate,
      avatarUrl: avatarUrlRaw || null,
    },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      gender: true,
      birthdate: true,
      username: true,
      avatarUrl: true,
      utype: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    message: "Profile updated successfully.",
    user: serializeUser(user),
  });
}
