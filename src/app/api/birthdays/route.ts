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
    const birthdays = await prisma.vocaBirthday.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(birthdays);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching birthdays", error }, { status: 500 });
  }
}

// 생일 정보 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, date, color } = body;

    if (!name || !date || !color) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newBirthday = await prisma.vocaBirthday.create({
      data: {
        name,
        date: new Date(date),
        color,
      },
    });

    revalidateTag("voca-birthdays");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json(newBirthday);
  } catch (error) {
    return NextResponse.json({ message: "Error creating birthday", error }, { status: 500 });
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

    await prisma.vocaBirthday.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-birthdays");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json({ message: "Birthdays deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting birthdays", error }, { status: 500 });
  }
}
