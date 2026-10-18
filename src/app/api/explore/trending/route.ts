import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const hashtags = await prisma.hashtag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const trending = hashtags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.posts,
    }));

    return NextResponse.json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error('Fetch trending error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch trending tags' }, { status: 500 });
  }
}
