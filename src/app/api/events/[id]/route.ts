import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 이벤트 수정
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
    const { name, startDate, endDate, url, comment } = body;

    const updatedEvent = await prisma.vocaEvent.update({
      where: { id: Number(id) },
      data: {
        name,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        url,
        comment,
      },
    });

    revalidateTag("voca-events");
    revalidatePath("/");

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ message: "Error updating event", error }, { status: 500 });
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

    await prisma.vocaEvent.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-events");
    revalidatePath("/");

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting event", error }, { status: 500 });
  }
}
