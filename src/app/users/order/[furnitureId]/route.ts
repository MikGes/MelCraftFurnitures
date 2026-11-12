import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendProductRequestMail } from '@/lib/mail';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ furnitureId: string }> }
) {
  try {
    const { furnitureId } = await params;
    const body = await req.json();
    const { email, phone, fullName } = body;

    if (!email || !phone) {
      return NextResponse.json(
        { message: 'Email and phone required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          phone,
          name: fullName,
          emailVerified: true,
        },
      });
    }

    const furniture = await prisma.furniture.findUnique({
      where: { id: furnitureId },
    });

    const newRequest = await prisma.furnitureRequest.create({
      data: {
        userId: user.id,
        furnitureId,
        fullName: fullName || user.name || 'Valued Customer',
        email: cleanEmail,
        phoneNumber: phone,
        status: 'PENDING',
      },
    });

    sendProductRequestMail({
      email: cleanEmail,
      phone,
      furnitureName: furniture?.furniture_name,
    }).catch(console.error);

    return NextResponse.json({
      message: 'Your furniture order has been received successfully. We appreciate your request!',
      success: true,
      data: newRequest,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Oops! Something went wrong while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}
