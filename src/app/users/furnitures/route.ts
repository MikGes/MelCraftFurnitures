import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const furnitures = await prisma.furniture.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: furnitures });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch furniture', error: error?.message },
      { status: 500 }
    );
  }
}
