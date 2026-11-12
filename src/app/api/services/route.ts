import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendServiceRequestMail } from '@/lib/mail';
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
      const services = await prisma.serviceRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: services });
    } else {
      const services = await prisma.serviceRequest.findMany({
        where: {
          OR: [
            { userId: session.sub },
            { email: session.email },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: services });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve service requests', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, serviceType, message } = body;

    if (!fullName || !email || !phoneNumber || !serviceType || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists or create
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: fullName,
          phone: phoneNumber,
          emailVerified: true,
        },
      });
    }

    const newServiceReq = await prisma.serviceRequest.create({
      data: {
        userId: user.id,
        fullName,
        email: cleanEmail,
        phoneNumber,
        serviceType,
        message,
        status: 'PENDING',
      },
    });

    // Notify team via email
    sendServiceRequestMail({
      fullName,
      email: cleanEmail,
      phone: phoneNumber,
      serviceType,
      message,
    }).catch((err) => console.error('Service notification error:', err));

    // Notify team via Telegram
    const telegramMsg = `📐 <b>New MelCraft Service Consultation</b>\n\n` +
      `<b>Service:</b> ${serviceType}\n` +
      `<b>Client:</b> ${fullName}\n` +
      `<b>Email:</b> ${cleanEmail}\n` +
      `<b>Phone:</b> ${phoneNumber}\n` +
      `<b>Message:</b>\n${message}\n\n` +
      `<i>Received via MelCraft Services</i>`;
    sendTelegramNotification(telegramMsg).catch((err) => console.error('Telegram notification error:', err));

    return NextResponse.json({
      success: true,
      message: 'Your service consultation request has been submitted! Our design team will contact you shortly.',
      data: newServiceReq,
    });
  } catch (error: any) {
    console.error('Service request error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit service request', error: error?.message },
      { status: 500 }
    );
  }
}
