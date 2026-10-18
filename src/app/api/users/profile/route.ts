import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional().nullable(),
  avatarUrl: z.string().url().or(z.string().startsWith('/')).optional().nullable(),
  coverUrl: z.string().url().or(z.string().startsWith('/')).optional().nullable(),
  website: z.string().max(100).optional().nullable(),
  location: z.string().max(50).optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, bio, avatarUrl, coverUrl, website, location } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(coverUrl !== undefined ? { coverUrl } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(location !== undefined ? { location } : {}),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        website: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
