import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    const data = await request.json();
    const filePath = join(process.cwd(), 'public', 'data', 'songs.json');

    await writeFile(filePath, JSON.stringify(data, null, 2) + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save songs.json:', error);
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    );
  }
}
