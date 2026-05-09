import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const TO_EMAIL = Deno.env.get('NOTIFY_EMAIL')!;

serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;
    if (!order) return new Response('No record', { status: 400 });

    const items = Array.isArray(order.items) ? order.items : [];
    const shipping = order.shipping_address ?? {};

    const itemRows = items.map((item: { name: string; size: string; quantity: number; price: number }) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f0ef;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f0ef;text-align:center;">${item.size}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f0ef;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f0ef;text-align:right;">BDT ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    ).join('');

    const customerName = order.guest_name ?? 'Registered User';
    const customerPhone = order.guest_phone ?? '—';
    const deliveryAddress = [shipping.address, shipping.city].filter(Boolean).join(', ') || '—';
    const deliveryNote = shipping.note || '';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fashion Foresight <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `🛍️ New Order #${order.id.slice(0, 8).toUpperCase()} — BDT ${Number(order.total).toLocaleString()}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e8dede;border-radius:12px;">
            <h2 style="color:#64020e;margin-bottom:4px;">New Order Received</h2>
            <p style="color:#7a5c60;margin-bottom:24px;font-size:14px;">
              Order #${order.id.slice(0, 8).toUpperCase()} &nbsp;·&nbsp; ${new Date(order.created_at).toLocaleString('en-BD')}
            </p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#faf9f8;border-radius:8px;">
              <tr>
                <td style="padding:10px 14px;font-size:12px;color:#7a5c60;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">Customer</td>
                <td style="padding:10px 14px;font-size:14px;color:#1a0508;font-weight:600;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-size:12px;color:#7a5c60;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">Phone</td>
                <td style="padding:10px 14px;font-size:14px;color:#1a0508;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-size:12px;color:#7a5c60;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">Delivery</td>
                <td style="padding:10px 14px;font-size:14px;color:#1a0508;">${deliveryAddress}${deliveryNote ? `<br><span style="color:#7a5c60;font-size:12px;">Note: ${deliveryNote}</span>` : ''}</td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <thead>
                <tr style="background:#1a0508;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#fff;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#fff;">Size</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#fff;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#fff;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <div style="text-align:right;padding:16px 20px;background:#fdf2f2;border-radius:8px;margin-bottom:24px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#64020e;">Total: BDT ${Number(order.total).toLocaleString()}</p>
            </div>

            <p style="color:#7a5c60;font-size:12px;text-align:center;">
              Log in to your admin dashboard to update the order status.
            </p>
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
