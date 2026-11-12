import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(
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
    const { status } = body;

    const updated = await prisma.furnitureRequest.update({
      where: { id },
      data: { status },
      include: {
        furniture: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Request updated',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update request', error: error?.message },
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
    await prisma.furnitureRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete request', error: error?.message },
      { status: 500 }
    );
  }
}
