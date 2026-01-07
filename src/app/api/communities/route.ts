import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 목록 조회
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const communities = await prisma.vocaCommunity.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(communities);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching communities", error }, { status: 500 });
  }
}

// 커뮤니티 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, url } = body;

    if (!name || !url) {
      return NextResponse.json({ message: "Name and URL are required" }, { status: 400 });
    }

    const newCommunity = await prisma.vocaCommunity.create({
      data: {
        name,
        description: description || "",
        url,
      },
    });

    revalidateTag("voca-communities");
    revalidatePath("/"); // 메인 페이지 갱신

    return NextResponse.json(newCommunity);
  } catch (error) {
    return NextResponse.json({ message: "Error creating community", error }, { status: 500 });
  }
}

// 다중 삭제
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "IDs array is required" }, { status: 400 });
    }

    await prisma.vocaCommunity.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-communities");
    revalidatePath("/");

    return NextResponse.json({ message: "Communities deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting communities", error }, { status: 500 });
  }
}
