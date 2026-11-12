'use server';

import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import { sendTelegramNotification } from '@/lib/telegram';
import crypto from 'crypto';

export async function createUser(email: string) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const token = crypto.randomUUID();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return {
          success: true,
          message: "You're already subscribed and verified! Thank you.",
        };
      }

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { verificationToken: token },
      });

      await sendVerificationEmail(cleanEmail, token);
      return {
        success: true,
        message: 'Subscription updated! Please check your inbox to verify your email.',
      };
    }

    await prisma.user.create({
      data: {
        email: cleanEmail,
        verificationToken: token,
        emailVerified: false,
      },
    });

    await sendVerificationEmail(cleanEmail, token);

    sendTelegramNotification(
      `📬 <b>New MelCraft Newsletter Subscriber</b>\n\n` +
      `<b>Email:</b> ${cleanEmail}\n` +
      `<i>Subscribed via MelCraft website</i>`
    ).catch(console.error);

    return {
      success: true,
      message: "Thanks for subscribing! We've sent a verification link to your email.",
    };
  } catch (error: any) {
    console.error('Server action createUser error:', error);
    return {
      success: false,
      message: 'Subscription failed. Please check your connection and try again.',
    };
  }
}