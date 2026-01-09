import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 목록 조회
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const playlists = await prisma.vocaPlaylist.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'desc' }
      ],
    });
    return NextResponse.json(playlists);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching playlists", error }, { status: 500 });
  }
}

// 플레이리스트 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { playlistId, platform, name, description, creator, isSlider } = body;

    if (!playlistId || !platform || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const lastPlaylist = await prisma.vocaPlaylist.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = (lastPlaylist?.order ?? 0) + 1;

    const newPlaylist = await prisma.vocaPlaylist.create({
      data: {
        playlist_id: playlistId,
        platform,
        name,
        description,
        creator,
        is_slider: isSlider || false,
        order: nextOrder,
      },
    });

    revalidateTag("voca-playlists");
    revalidatePath("/playlists");

    return NextResponse.json(newPlaylist);
  } catch (error) {
    return NextResponse.json({ message: "Error creating playlist", error }, { status: 500 });
  }
}

// 순서 일괄 변경 (PATCH)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { items } = body; // [{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // 트랜잭션으로 일괄 업데이트
    await prisma.$transaction(
      items.map((item: { id: number; order: number }) =>
        prisma.vocaPlaylist.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidateTag("voca-playlists");
    revalidatePath("/playlists");

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error updating order", error }, { status: 500 });
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

    await prisma.vocaPlaylist.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidateTag("voca-playlists");
    revalidatePath("/playlists");

    return NextResponse.json({ message: "Playlists deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting playlists", error }, { status: 500 });
  }
}
