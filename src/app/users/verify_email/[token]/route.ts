import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const target = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (target) {
      await prisma.user.update({
        where: { id: target.id },
        data: {
          emailVerified: true,
          verificationToken: null,
        },
      });
      return NextResponse.redirect(new URL('/verify-email?status=success', req.url));
    }

    return NextResponse.redirect(new URL('/verify-email?status=invalid', req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/verify-email?status=error', req.url));
  }
}
