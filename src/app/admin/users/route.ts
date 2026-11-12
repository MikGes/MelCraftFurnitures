import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        furnitureRequests: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = users.map((u) => ({
      _id: u.id,
      email: u.email,
      role: u.role,
      email_verified: u.emailVerified,
      orders: u.furnitureRequests.map((r) => ({ _id: r.id })),
      createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Can't load users", success: false },
      { status: 500 }
    );
  }
}
