import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "IDs array is required" }, { status: 400 });
    }

    // 본인 계정은 삭제 목록에서 제외
    const filteredIds = ids.filter(id => id !== session.user.id);

    await prisma.user.deleteMany({
      where: {
        id: { in: filteredIds },
      },
    });

    revalidateTag("users");

    return NextResponse.json({ message: "Users deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting users", error }, { status: 500 });
  }
}
