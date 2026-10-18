import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getSessionUser();

    // Get who current user is already following
    let excludeIds: string[] = [];
    if (currentUser) {
      excludeIds.push(currentUser.id);
      const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      excludeIds.push(...following.map((f) => f.followingId));
    }

    const suggested = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: { followers: true },
        },
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: suggested.map((u) => ({ ...u, isFollowing: false })),
    });
  } catch (error) {
    console.error('Fetch suggested error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
