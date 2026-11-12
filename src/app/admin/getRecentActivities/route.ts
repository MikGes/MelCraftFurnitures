import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [recentUser, recentRequest, recentProduct] = await Promise.all([
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
    ]);

    const formattedReq = recentRequest
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
        recentRequest: formattedReq,
        recentProduct: formattedProduct,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent activities' },
      { status: 500 }
    );
  }
}
