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
    const picks = await prisma.vocaPick.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(picks);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching picks", error }, { status: 500 });
  }
}

// 영상 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { videoId, comment } = body;

    if (!videoId) {
      return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }

    const newPick = await prisma.vocaPick.create({
      data: {
        video_id: videoId,
        comment: comment,
      },
    });

    // 데이터 캐시와 메인 페이지 캐시를 모두 갱신
    revalidateTag("voca-picks");
    revalidatePath("/");

    return NextResponse.json(newPick);
  } catch (error) {
    return NextResponse.json({ message: "Error creating pick", error }, { status: 500 });
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

    await prisma.vocaPick.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    // 데이터 캐시와 메인 페이지 캐시를 모두 갱신
    revalidateTag("voca-picks");
    revalidatePath("/");

    return NextResponse.json({ message: "Picks deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting picks", error }, { status: 500 });
  }
}
