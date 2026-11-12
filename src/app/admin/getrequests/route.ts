import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const furnitures = await prisma.furnitureRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        furniture: true,
        user: true,
      },
    });

    const data = furnitures.map((r) => ({
      _id: r.id,
      orderedBy: { email: r.email, fullname: r.fullName },
      ordered_furniture: {
        _id: r.furniture.id,
        furniture_name: r.furniture.furniture_name,
        furniture_type: r.furniture.furniture_type,
        furniture_price: r.furniture.furniture_price,
      },
      phoneNumber: r.phoneNumber,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'An error occurred, please try again', error: error?.message },
      { status: 500 }
    );
  }
}
