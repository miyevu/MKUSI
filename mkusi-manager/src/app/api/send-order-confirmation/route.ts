import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, customerName, orderId, total, items } = await request.json();

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Missing email or order ID.' }, { status: 400 });
    }

    const emailHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Order Confirmed 🎉</h2>
            <p style="color: #475569;">Hi ${customerName || 'there'}, thanks for shopping with MKUSI! Here's a summary of your order:</p>
            <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 0 0 8px 0;"><strong>Items:</strong> ${items || 'See order details'}</p>
            <p style="margin: 0; color: #2563eb; font-weight: bold;">Total: GH₵ ${Number(total).toFixed(2)}</p>
            </div>
            <p style="color: #475569;">We'll reach out shortly to arrange delivery. If you have any questions, just reply to this email or reach out on WhatsApp below.</p>

            <a
            href="https://wa.me/233543391481?text=Hi%20MKUSI!%20I%20have%20a%20question%20about%20my%20order%20${encodeURIComponent(orderId)}"
            style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: white; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 8px;"
            >
            💬 Chat with us on WhatsApp
            </a>

            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">— The MKUSI Team</p>
        </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MKUSI <onboarding@resend.dev>',
        to: email,
        subject: `Order Confirmed — ${orderId}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend order confirmation failed:', data);
      return NextResponse.json({ success: false, error: 'Failed to send confirmation email.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Order confirmation email error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send confirmation email.' }, { status: 500 });
  }
}