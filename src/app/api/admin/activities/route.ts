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

    // Fetch recent items
    const [recentUser, recentRequest, recentProduct, totalProducts, totalRequests, totalSubscribers, totalServiceRequests] =
      await Promise.all([
        prisma.user.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { id: true, email: true, createdAt: true },
        }),
        prisma.furnitureRequest.findFirst({
          orderBy: { createdAt: 'desc' },
          include: {
            furniture: true,
            user: { select: { email: true } },
          },
        }),
        prisma.furniture.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { id: true, furniture_name: true, furniture_type: true, createdAt: true },
        }),
        prisma.furniture.count(),
        prisma.furnitureRequest.count(),
        prisma.user.count(),
        prisma.serviceRequest.count(),
      ]);

    // Format to match dashboard interface
    const formattedRequest = recentRequest
      ? {
          _id: recentRequest.id,
          orderedBy: { email: recentRequest.email },
          ordered_furniture: {
            _id: recentRequest.furniture.id,
            furniture_name: recentRequest.furniture.furniture_name,
            furniture_type: recentRequest.furniture.furniture_type,
          },
          phoneNumber: recentRequest.phoneNumber,
          createdAt: recentRequest.createdAt.toISOString(),
        }
      : null;

    const formattedUser = recentUser
      ? {
          _id: recentUser.id,
          email: recentUser.email,
          createdAt: recentUser.createdAt.toISOString(),
        }
      : null;

    const formattedProduct = recentProduct
      ? {
          _id: recentProduct.id,
          furniture_name: recentProduct.furniture_name,
          furniture_type: recentProduct.furniture_type,
          createdAt: recentProduct.createdAt.toISOString(),
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        recentUser: formattedUser,
        recentRequest: formattedRequest,
        recentProduct: formattedProduct,
        stats: {
          totalProducts,
          totalRequests,
          totalSubscribers,
          totalServiceRequests,
        },
      },
    });
  } catch (error: any) {
    console.error('Fetch activities error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard activities', error: error?.message },
      { status: 500 }
    );
  }
}
