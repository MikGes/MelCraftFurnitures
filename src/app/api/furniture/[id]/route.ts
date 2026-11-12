import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const furniture = await prisma.furniture.findUnique({
      where: { id },
    });

    if (!furniture) {
      return NextResponse.json(
        { success: false, message: 'Furniture item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: furniture });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error retrieving furniture', error: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const {
      furniture_name,
      furniture_type,
      furniture_price,
      furniture_description,
      special_description,
      furniture_image,
    } = body;

    const priceNum =
      furniture_price !== undefined
        ? typeof furniture_price === 'number'
          ? furniture_price
          : parseFloat(furniture_price)
        : undefined;

    const updated = await prisma.furniture.update({
      where: { id },
      data: {
        ...(furniture_name && { furniture_name }),
        ...(furniture_type && { furniture_type }),
        ...(priceNum !== undefined && !isNaN(priceNum) && { furniture_price: priceNum }),
        ...(furniture_description !== undefined && { furniture_description }),
        ...(special_description !== undefined && { special_description }),
        ...(furniture_image !== undefined && { furniture_image }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Furniture updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update furniture error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update furniture', error: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.furniture.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Furniture deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete furniture error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete furniture', error: error?.message },
      { status: 500 }
    );
  }
}
