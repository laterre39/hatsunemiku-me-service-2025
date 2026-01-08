import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

// 플레이리스트 수정
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
    const { playlistId, platform, name, description, creator, isSlider } = body;

    const updatedPlaylist = await prisma.vocaPlaylist.update({
      where: { id: Number(id) },
      data: {
        playlist_id: playlistId,
        platform,
        name,
        description,
        creator,
        is_slider: isSlider,
      },
    });

    revalidateTag("voca-playlists");
    revalidatePath("/playlists");

    return NextResponse.json(updatedPlaylist);
  } catch (error) {
    return NextResponse.json({ message: "Error updating playlist", error }, { status: 500 });
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

    await prisma.vocaPlaylist.delete({
      where: { id: Number(id) },
    });

    revalidateTag("voca-playlists");
    revalidatePath("/playlists");

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting playlist", error }, { status: 500 });
  }
}
