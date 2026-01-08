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
      orderBy: { id: 'desc' },
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

    const newPlaylist = await prisma.vocaPlaylist.create({
      data: {
        playlist_id: playlistId,
        platform,
        name,
        description,
        creator,
        is_slider: isSlider || false,
      },
    });

    revalidateTag("voca-playlists");
    revalidatePath("/playlists"); // 플레이리스트 페이지 갱신

    return NextResponse.json(newPlaylist);
  } catch (error) {
    return NextResponse.json({ message: "Error creating playlist", error }, { status: 500 });
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
