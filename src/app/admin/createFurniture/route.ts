import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMailToUsers } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const furDetails = await req.json();
    const price = typeof furDetails.furniture_price === 'number'
      ? furDetails.furniture_price
      : parseFloat(furDetails.furniture_price);

    await prisma.furniture.create({
      data: {
        furniture_name: furDetails.furniture_name,
        furniture_type: furDetails.furniture_type,
        furniture_price: isNaN(price) ? 0 : price,
        furniture_description: furDetails.furniture_description || '',
        special_description: furDetails.special_description || '',
        furniture_image: furDetails.furniture_image || '',
      },
    });

    const verified = await prisma.user.findMany({
      where: { emailVerified: true },
      select: { email: true },
    });
    if (verified.length > 0) {
      sendMailToUsers(verified.map((u) => u.email), furDetails.furniture_type).catch(console.error);
    }

    return NextResponse.json({
      message: 'Furniture created successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Can't create furniture", success: false, error: error?.message },
      { status: 500 }
    );
  }
}
