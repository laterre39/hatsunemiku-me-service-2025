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
    const sites = await prisma.vocaSite.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching sites", error }, { status: 500 });
  }
}

// 사이트 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, url, show } = body;

    if (!name || !url) {
      return NextResponse.json({ message: "Name and URL are required" }, { status: 400 });
    }

    const newSite = await prisma.vocaSite.create({
      data: {
        name,
        url,
        show: show || false,
      },
    });

    revalidateTag("voca-sites");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json(newSite);
  } catch (error) {
    return NextResponse.json({ message: "Error creating site", error }, { status: 500 });
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

    await prisma.vocaSite.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-sites");
    revalidatePath("/", "layout"); // 모든 페이지의 푸터 갱신

    return NextResponse.json({ message: "Sites deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting sites", error }, { status: 500 });
  }
}
