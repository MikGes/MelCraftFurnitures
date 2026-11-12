import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendMailToUsers } from '@/lib/mail';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const furnitures = await prisma.furniture.findMany({
      where: category ? { furniture_type: category } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: furnitures,
    });
  } catch (error: any) {
    console.error('Fetch furniture error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch furniture items', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      furniture_name,
      furniture_type,
      furniture_price,
      furniture_description,
      special_description,
      furniture_image,
    } = body;

    if (!furniture_name || !furniture_type || furniture_price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required furniture details' },
        { status: 400 }
      );
    }

    const priceNum = typeof furniture_price === 'number' ? furniture_price : parseFloat(furniture_price);

    const newFurniture = await prisma.furniture.create({
      data: {
        furniture_name,
        furniture_type,
        furniture_price: isNaN(priceNum) ? 0 : priceNum,
        furniture_description: furniture_description || '',
        special_description: special_description || '',
        furniture_image: furniture_image || '',
      },
    });

    // Notify verified subscribers asynchronously
    const verifiedUsers = await prisma.user.findMany({
      where: { emailVerified: true },
      select: { email: true },
    });

    if (verifiedUsers.length > 0) {
      const emails = verifiedUsers.map((u) => u.email);
      sendMailToUsers(emails, furniture_type).catch((err) =>
        console.error('Email alert error:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Furniture created successfully',
      data: newFurniture,
    });
  } catch (error: any) {
    console.error('Create furniture error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create furniture', error: error?.message },
      { status: 500 }
    );
  }
}
