import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdminRole } from "@/lib/auth-role";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as { id?: string; utype?: string } | undefined;

  if (!isAdminRole(currentUser?.utype)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  if (currentUser?.id === id) {
    return NextResponse.json(
      { error: "You cannot delete the admin account you are currently using." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: {
          predictions: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
    deletedPredictionCount: user._count.predictions,
  });
}
