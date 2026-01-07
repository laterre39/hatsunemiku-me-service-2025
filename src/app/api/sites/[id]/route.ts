import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 사이트 수정
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
    const { name, url, show } = body;

    const updatedSite = await prisma.vocaSite.update({
      where: { id: Number(id) },
      data: {
        name,
        url,
        show,
      },
    });

    revalidateTag("voca-sites");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json(updatedSite);
  } catch (error) {
    return NextResponse.json({ message: "Error updating site", error }, { status: 500 });
  }
}

// 단일 삭제
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

    await prisma.vocaSite.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-sites");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting site", error }, { status: 500 });
  }
}
