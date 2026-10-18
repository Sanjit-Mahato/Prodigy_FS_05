import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT, COOKIE_NAME } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
      },
    });

    if (existingUser) {
      const field = existingUser.username === username.toLowerCase() ? 'Username' : 'Email';
      return NextResponse.json(
        { success: false, error: `${field} is already taken` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const token = await signJWT({ userId: user.id, username: user.username });

    const response = NextResponse.json({
      success: true,
      data: user,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
