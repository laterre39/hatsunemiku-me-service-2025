import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 생일 정보 수정
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
    const { name, date, color } = body;

    const updatedBirthday = await prisma.vocaBirthday.update({
      where: { id: Number(id) },
      data: {
        name,
        date: new Date(date),
        color,
      },
    });

    revalidateTag("voca-birthdays");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json(updatedBirthday);
  } catch (error) {
    return NextResponse.json({ message: "Error updating birthday", error }, { status: 500 });
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

    await prisma.vocaBirthday.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-birthdays");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json({ message: "Birthday deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting birthday", error }, { status: 500 });
  }
}
