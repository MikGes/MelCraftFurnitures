import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendProductRequestMail } from '@/lib/mail';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.role === 'ADMIN') {
      const requests = await prisma.furnitureRequest.findMany({
        include: {
          furniture: true,
          user: {
            select: { id: true, email: true, name: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: requests });
    } else {
      // User only sees their own requests
      const requests = await prisma.furnitureRequest.findMany({
        where: {
          OR: [
            { userId: session.sub },
            { email: session.email },
          ],
        },
        include: { furniture: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: requests });
    }
  } catch (error: any) {
    console.error('Fetch requests error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve requests', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, phoneNumber, furnitureId, notes, fullName } = body;
    const finalPhone = phone || phoneNumber;

    if (!email || !finalPhone || !furnitureId) {
      return NextResponse.json(
        { success: false, message: 'Email, phone number, and furniture ID are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify furniture exists
    const furniture = await prisma.furniture.findUnique({
      where: { id: furnitureId },
    });

    if (!furniture) {
      return NextResponse.json(
        { success: false, message: 'Furniture item not found' },
        { status: 404 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          phone: finalPhone,
          name: fullName || undefined,
          emailVerified: true, // auto-verify upon order submission
        },
      });
    }

    // Create the request
    const newRequest = await prisma.furnitureRequest.create({
      data: {
        userId: user.id,
        furnitureId: furniture.id,
        fullName: fullName || user.name || 'Valued Customer',
        email: cleanEmail,
        phoneNumber: finalPhone,
        notes: notes || undefined,
        status: 'PENDING',
      },
      include: {
        furniture: true,
      },
    });

    // Send email alert to admin
    sendProductRequestMail({
      email: cleanEmail,
      phone: finalPhone,
      furnitureName: furniture.furniture_name,
    }).catch((err) => console.error('Product request email error:', err));

    // Send Telegram notification to admin
    const telegramMsg = `🪵 <b>New MelCraft Furniture Request</b>\n\n` +
      `<b>Product:</b> ${furniture.furniture_name}\n` +
      `<b>Category:</b> ${furniture.furniture_type}\n` +
      `<b>Client:</b> ${fullName || user.name || 'Valued Visitor'}\n` +
      `<b>Email:</b> ${cleanEmail}\n` +
      `<b>Phone:</b> ${finalPhone}\n` +
      (notes ? `<b>Notes:</b> ${notes}\n` : '') +
      `\n<i>Received via MelCraft Storefront</i>`;
    sendTelegramNotification(telegramMsg).catch((err) => console.error('Telegram notification error:', err));

    return NextResponse.json({
      success: true,
      message: 'Your furniture order has been received successfully. We appreciate your request!',
      data: newRequest,
    });
  } catch (error: any) {
    console.error('Submit order error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not process order', error: error?.message },
      { status: 500 }
    );
  }
}
