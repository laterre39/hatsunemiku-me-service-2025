import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 커뮤니티 수정
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
    const { name, description, url } = body;

    const updatedCommunity = await prisma.vocaCommunity.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        url,
      },
    });

    revalidateTag("voca-communities");
    revalidatePath("/");

    return NextResponse.json(updatedCommunity);
  } catch (error) {
    return NextResponse.json({ message: "Error updating community", error }, { status: 500 });
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

    await prisma.vocaCommunity.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-communities");
    revalidatePath("/");

    return NextResponse.json({ message: "Community deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting community", error }, { status: 500 });
  }
}
