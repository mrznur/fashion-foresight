import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const TO_EMAIL = Deno.env.get('NOTIFY_EMAIL')!; // your email to receive notifications

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response('No record', { status: 400 });
    }

    const { first_name, last_name, email, phone, subject, message } = record;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fashion Foresight <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Contact: ${subject}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fff;">
            <h2 style="color: #64020e; margin-bottom: 24px;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #7a5c60; width: 120px;">Name</td><td style="padding: 8px 0; color: #1a0508; font-weight: 600;">${first_name} ${last_name ?? ''}</td></tr>
              <tr><td style="padding: 8px 0; color: #7a5c60;">Email</td><td style="padding: 8px 0; color: #1a0508;"><a href="mailto:${email}" style="color: #64020e;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #7a5c60;">Phone</td><td style="padding: 8px 0; color: #1a0508;">${phone}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; color: #7a5c60;">Subject</td><td style="padding: 8px 0; color: #1a0508;">${subject}</td></tr>
            </table>
            <div style="margin-top: 24px; padding: 20px; background: #faf9f8; border-radius: 12px; border-left: 4px solid #64020e;">
              <p style="color: #1a0508; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top: 24px; color: #7a5c60; font-size: 12px;">Sent via Fashion Foresight contact form</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response('Email failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500 });
  }
});
