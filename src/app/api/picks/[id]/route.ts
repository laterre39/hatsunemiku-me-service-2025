import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 영상 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { videoId, comment } = body;

    const updatedPick = await prisma.vocaPick.update({
      where: { id: Number(id) },
      data: {
        video_id: videoId,
        comment: comment,
      },
    });

    // 데이터 캐시와 메인 페이지 캐시를 모두 갱신
    revalidateTag("voca-picks");
    revalidatePath("/");

    return NextResponse.json(updatedPick);
  } catch (error) {
    return NextResponse.json({ message: "Error updating pick", error }, { status: 500 });
  }
}

// 영상 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.vocaPick.delete({
      where: { id: Number(id) },
    });

    // 데이터 캐시와 메인 페이지 캐시를 모두 갱신
    revalidateTag("voca-picks");
    revalidatePath("/");

    return NextResponse.json({ message: "Pick deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting pick", error }, { status: 500 });
  }
}
