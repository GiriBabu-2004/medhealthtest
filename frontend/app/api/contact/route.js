import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // ✅ Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use "host", "port", and "secure" for other providers
      auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS, // your App Password
      },
    });

    // ✅ Define email
    const mailOptions = {
      from: `"MedHealth Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER, // your own email
      subject: `New Contact Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    return NextResponse.json(
      { success: false, message: 'Email sending failed.' },
      { status: 500 }
    );
  }
}
