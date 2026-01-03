import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');
  const secret = request.nextUrl.searchParams.get('secret');

  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

  if (!REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'REVALIDATE_SECRET is not set' }, { status: 500 });
  }

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag && !path) {
    return NextResponse.json({ message: 'Missing tag or path param' }, { status: 400 });
  }

  try {
    if (tag) {
      revalidateTag(tag);
    }
    
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json(
      { revalidated: true, tag, path, now: Date.now() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 });
  }
}
