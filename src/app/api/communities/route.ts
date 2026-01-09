import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
      orderBy: [
        { order: 'asc' },
        { id: 'desc' }
      ],
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

    const lastCommunity = await prisma.vocaCommunity.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = (lastCommunity?.order ?? 0) + 1;

    const newCommunity = await prisma.vocaCommunity.create({
      data: {
        name,
        description: description || "",
        url,
        order: nextOrder,
      },
    });

    revalidateTag("voca-communities");
    revalidatePath("/");

    return NextResponse.json(newCommunity);
  } catch (error) {
    return NextResponse.json({ message: "Error creating community", error }, { status: 500 });
  }
}

// 순서 일괄 변경 (PATCH)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: number; order: number }) =>
        prisma.vocaCommunity.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidateTag("voca-communities");
    revalidatePath("/");

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error updating order", error }, { status: 500 });
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
