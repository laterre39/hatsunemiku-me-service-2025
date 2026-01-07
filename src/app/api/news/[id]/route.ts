import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 뉴스 수정
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
    const { category, date, url, title_jp, title_kr } = body;

    const updatedNews = await prisma.vocaNews.update({
      where: { id: Number(id) },
      data: {
        category,
        date: new Date(date),
        url,
        title_jp,
        title_kr,
      },
    });

    revalidateTag("voca-news");
    revalidatePath("/news");

    return NextResponse.json(updatedNews);
  } catch (error) {
    return NextResponse.json({ message: "Error updating news", error }, { status: 500 });
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

    await prisma.vocaNews.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-news");
    revalidatePath("/news");

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting news", error }, { status: 500 });
  }
}
