import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { firstName, bankName, email } = await req.json();

    if (!firstName || !bankName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'BankForge Waitlist <onboarding@resend.dev>',
      to: 'outreach@bankforge.ai',
      subject: `New AI SEO Waitlist — ${bankName}`,
      html: `
        <h2>New AI SEO Remediation Waitlist Signup</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Bank:</strong> ${bankName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit' },
      { status: 500 },
    );
  }
}
