import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// 목록 조회
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const whitelist = await prisma.whiteList.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(whitelist);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching whitelist", error }, { status: 500 });
  }
}

// 이메일 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, memo } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const newEntry = await prisma.whiteList.create({
      data: {
        email,
        memo,
      },
    });

    revalidateTag("whitelist");

    return NextResponse.json(newEntry);
  } catch (error) {
    return NextResponse.json({ message: "Error creating whitelist entry", error }, { status: 500 });
  }
}

// 다중 삭제
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "IDs array is required" }, { status: 400 });
    }

    await prisma.whiteList.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("whitelist");

    return NextResponse.json({ message: "Whitelist entries deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting whitelist entries", error }, { status: 500 });
  }
}
