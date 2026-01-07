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
    const events = await prisma.vocaEvent.findMany({
      orderBy: { start_date: 'desc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching events", error }, { status: 500 });
  }
}

// 이벤트 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, startDate, endDate, url, comment } = body;

    if (!name || !startDate || !endDate || !url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newEvent = await prisma.vocaEvent.create({
      data: {
        name,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        url,
        comment: comment || "",
      },
    });

    revalidateTag("voca-events");
    revalidatePath("/"); // 메인 페이지 갱신

    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json({ message: "Error creating event", error }, { status: 500 });
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

    await prisma.vocaEvent.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-events");
    revalidatePath("/");

    return NextResponse.json({ message: "Events deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting events", error }, { status: 500 });
  }
}
