import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const creds = await req.json();
    const identifier = creds.email || creds.username;

    if (!identifier || !creds.password) {
      return NextResponse.json(
        { success: false, message: 'Email or password not correct' },
        { status: 400 }
      );
    }

    const target = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.trim().toLowerCase() },
          { username: identifier.trim() },
        ],
      },
    });

    if (target && target.password && (await verifyPassword(creds.password, target.password))) {
      const token = signToken({
        sub: target.id,
        email: target.email,
        role: target.role,
        username: target.username || undefined,
      });

      const response = NextResponse.json({
        access_token: token,
        message: 'You are authenticated!',
        success: true,
      });

      response.cookies.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Email or password not correct', success: false },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'An error occurred, please try again', error: error?.message },
      { status: 500 }
    );
  }
}
