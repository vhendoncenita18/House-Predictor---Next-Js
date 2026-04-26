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
  const currentUser = session?.user as { utype?: string } | undefined;

  if (!isAdminRole(currentUser?.utype)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Prediction id is required." }, { status: 400 });
  }

  const prediction = await prisma.prediction.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!prediction) {
    return NextResponse.json({ error: "Prediction not found." }, { status: 404 });
  }

  await prisma.prediction.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
