import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// 사용자 역할 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // 1. 관리자 권한 체크
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    // 역할 유효성 검사 (USER, ADMIN, STAFF)
    if (!role || !["USER", "ADMIN", "STAFF"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // 2. 사용자 역할 업데이트
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    // 3. 캐시 갱신
    revalidateTag("users");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// 사용자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // 1. 관리자 권한 체크
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // 본인 계정 삭제 방지
    if (id === session.user.id) {
      return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
    }

    // 2. 사용자 삭제
    await prisma.user.delete({
      where: { id },
    });

    // 3. 캐시 갱신
    revalidateTag("users");

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
