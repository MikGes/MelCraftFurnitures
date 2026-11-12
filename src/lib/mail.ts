import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.SMTP_USER || 'melcraftinteriors@gmail.com',
    pass: process.env.MailPassword || 'cqfsdhijgdubobhq',
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/api/users/verify/${token}`;
    await transporter.sendMail({
      from: '"MelCraft Interiors" <melcraftinteriors@gmail.com>',
      to,
      subject: 'Email Verification - MelCraft Interiors',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded-lg: 8px;">
          <h2 style="color: #92400e;">Welcome to MelCraft Interiors</h2>
          <p>Thank you for subscribing to MelCraft! Please verify your email to receive updates and request custom furniture.</p>
          <div style="margin: 24px 0;">
            <a href="${verificationLink}" style="background-color: #b45309; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser: <br>${verificationLink}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}

export async function sendProductRequestMail(customer: { email: string; phone: string; furnitureName?: string }) {
  try {
    await transporter.sendMail({
      from: '"MelCraft Interiors" <melcraftinteriors@gmail.com>',
      to: 'melcraftinteriors@gmail.com',
      subject: 'New Furniture / Service Request Received',
      text: `A new request has been submitted.\n\nCustomer Email: ${customer.email}\nPhone Number: ${customer.phone}\nRequested Item: ${customer.furnitureName || 'General Inquiry'}\n\nPlease review the request in your dashboard.`,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send product request notification email:', error);
    return { success: false, error };
  }
}

export async function sendServiceRequestMail(request: { fullName: string; email: string; phone: string; serviceType: string; message: string }) {
  try {
    await transporter.sendMail({
      from: '"MelCraft Interiors" <melcraftinteriors@gmail.com>',
      to: 'melcraftinteriors@gmail.com',
      subject: `New Service Request: ${request.serviceType}`,
      text: `A new service consultation request has been submitted.\n\nCustomer Name: ${request.fullName}\nEmail: ${request.email}\nPhone Number: ${request.phone}\nService Type: ${request.serviceType}\nMessage:\n${request.message}\n\nPlease review in the dashboard.`,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send service request email:', error);
    return { success: false, error };
  }
}

export async function sendMailToUsers(emails: string[], category: string) {
  try {
    for (const email of emails) {
      const namePart = email.split('@')[0];
      await transporter.sendMail({
        from: '"MelCraft Interiors" <melcraftinteriors@gmail.com>',
        to: email,
        subject: 'New Product Alert! - MelCraft Interiors',
        html: `
          <p>Dear <strong>${namePart}</strong>,</p>
          <p>We are excited to inform you that a new product in the <strong>${category}</strong> category has just been posted!</p>
          <p>Visit <a href="https://melcraftinteriors.com">melcraftinteriors.com</a> to view more!</p>
          <br>
          <p>Best regards,<br>MelCraft Interiors Team</p>
        `,
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to send announcement emails:', error);
    return { success: false, error };
  }
}
