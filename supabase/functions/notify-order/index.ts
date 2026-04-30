import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const TO_EMAIL = Deno.env.get('NOTIFY_EMAIL')!;

serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;
    if (!order) return new Response('No record', { status: 400 });

    const items = Array.isArray(order.items) ? order.items : [];
    const itemRows = items.map((item: { name: string; size: string; quantity: number; price: number }) =>
      `<tr>
        <td style="padding:8px;border-bottom:1px solid #f5f0ef;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #f5f0ef;text-align:center;">${item.size}</td>
        <td style="padding:8px;border-bottom:1px solid #f5f0ef;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #f5f0ef;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fashion Foresight <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `New Order #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
            <h2 style="color:#64020e;margin-bottom:8px;">New Order Received</h2>
            <p style="color:#7a5c60;margin-bottom:24px;">Order #${order.id.slice(0, 8).toUpperCase()} · ${new Date(order.created_at).toLocaleString()}</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr style="background:#faf9f8;">
                  <th style="padding:8px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7a5c60;">Item</th>
                  <th style="padding:8px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7a5c60;">Size</th>
                  <th style="padding:8px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7a5c60;">Qty</th>
                  <th style="padding:8px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7a5c60;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="text-align:right;padding:16px;background:#fdf2f2;border-radius:8px;">
              <p style="margin:0;font-size:18px;font-weight:bold;color:#1a0508;">Total: $${Number(order.total).toFixed(2)}</p>
            </div>
            <p style="margin-top:24px;color:#7a5c60;font-size:12px;">Login to your admin dashboard to manage this order.</p>
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
