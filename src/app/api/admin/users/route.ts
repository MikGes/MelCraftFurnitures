import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        furnitureRequests: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = users.map((u) => ({
      _id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      email_verified: u.emailVerified,
      orders: u.furnitureRequests.map((r) => ({ _id: r.id })),
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error?.message },
      { status: 500 }
    );
  }
}
