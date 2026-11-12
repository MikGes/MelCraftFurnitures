import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = body;
    const identifier = email || username;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email/username and password' },
        { status: 400 }
      );
    }

    // Search user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.trim().toLowerCase() },
          { username: identifier.trim() },
        ],
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username || undefined,
      name: user.name || undefined,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred', error: error?.message },
      { status: 500 }
    );
  }
}
