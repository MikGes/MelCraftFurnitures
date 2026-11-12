import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = crypto.randomUUID();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json({
          success: true,
          message: 'You have already subscribed!',
        });
      }
      await prisma.user.update({
        where: { id: existing.id },
        data: { verificationToken: token },
      });
      await sendVerificationEmail(cleanEmail, token);
      return NextResponse.json({
        success: true,
        message: 'You have subscribed! Please verify your email.',
      });
    }

    await prisma.user.create({
      data: {
        email: cleanEmail,
        verificationToken: token,
      },
    });

    await sendVerificationEmail(cleanEmail, token);
    return NextResponse.json({
      success: true,
      message: 'You have subscribed! Please verify your email.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Can't Create User, please try again!" },
      { status: 500 }
    );
  }
}
