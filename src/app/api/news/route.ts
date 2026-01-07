import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from 'crypto';

// 목록 조회
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const news = await prisma.vocaNews.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching news", error }, { status: 500 });
  }
}

// 뉴스 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { category, date, url, title_jp, title_kr } = body;

    if (!category || !date || !url || !title_jp) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // external_id 생성 (날짜 + 제목 해시)
    const content = `${date}_${title_jp.substring(0, 50)}`;
    const externalId = crypto.createHash('md5').update(content, 'utf-8').digest('hex');

    const newNews = await prisma.vocaNews.create({
      data: {
        external_id: externalId,
        category,
        created_at: new Date(),
        date: new Date(date),
        url,
        title_jp,
        title_kr: title_kr || "",
      },
    });

    revalidateTag("voca-news");
    revalidatePath("/news"); // 뉴스 페이지 갱신

    return NextResponse.json(newNews);
  } catch (error) {
    return NextResponse.json({ message: "Error creating news", error }, { status: 500 });
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

    await prisma.vocaNews.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-news");
    revalidatePath("/news");

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting news", error }, { status: 500 });
  }
}
