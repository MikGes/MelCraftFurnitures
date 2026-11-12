import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = crypto.randomUUID();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed and verified!',
          alreadyVerified: true,
        });
      }

      // Update token and resend
      await prisma.user.update({
        where: { id: existing.id },
        data: { verificationToken: token },
      });
      await sendVerificationEmail(cleanEmail, token);

      return NextResponse.json({
        success: true,
        message: 'Subscription updated! Please check your email to verify.',
      });
    }

    // Create new subscriber user
    await prisma.user.create({
      data: {
        email: cleanEmail,
        verificationToken: token,
        emailVerified: false,
      },
    });

    // Send email
    await sendVerificationEmail(cleanEmail, token);

    return NextResponse.json({
      success: true,
      message: 'You have subscribed! Please check your email to verify.',
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Subscription failed. Please try again.', error: error?.message },
      { status: 500 }
    );
  }
}
