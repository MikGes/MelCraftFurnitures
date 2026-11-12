import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, getSessionUser } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, name, phone, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser && existingUser.password) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Role handling: Only existing ADMIN can create another ADMIN account
    let assignedRole: Role = Role.USER;
    if (role === 'ADMIN' || role === Role.ADMIN) {
      const currentUser = await getSessionUser(req);
      if (currentUser?.role === 'ADMIN') {
        assignedRole = Role.ADMIN;
      } else {
        // Check if there are any admins in the system
        const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
        if (adminCount === 0) {
          assignedRole = Role.ADMIN;
        } else {
          return NextResponse.json(
            { success: false, message: 'Unauthorized to create an admin account' },
            { status: 403 }
          );
        }
      }
    }

    const hashedPassword = await hashPassword(password);

    // If user was previously just a subscriber without a password, update them!
    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            username: username?.trim() || existingUser.username,
            name: name?.trim() || existingUser.name,
            phone: phone?.trim() || existingUser.phone,
            password: hashedPassword,
            role: assignedRole,
            emailVerified: true,
          },
        })
      : await prisma.user.create({
          data: {
            email: cleanEmail,
            username: username?.trim() || undefined,
            name: name?.trim() || undefined,
            phone: phone?.trim() || undefined,
            password: hashedPassword,
            role: assignedRole,
            emailVerified: true,
          },
        });

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username || undefined,
      name: user.name || undefined,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Could not create account', error: error?.message },
      { status: 500 }
    );
  }
}
