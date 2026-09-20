import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export async function POST(request: NextRequest) {
  try {
    const { products }: { products: FeaturedProduct[] } = await request.json();

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products selected.' }, { status: 400 });
    }

    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('email');

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, total: 0, message: 'No subscribers to notify.' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    const productsHtml = products.map(p => `
      <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 12px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center;">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width: 64px; height: 64px; object-fit: contain; border-radius: 8px;" />` : ''}
        <div style="flex: 1;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #0f172a;">${p.name}</p>
          <p style="margin: 0; color: #2563eb; font-weight: bold;">GH₵ ${Number(p.price).toFixed(2)}</p>
        </div>
        <a href="${siteUrl}/shop/${p.id}" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; white-space: nowrap;">
          View
        </a>
      </div>
    `).join('');

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Handpicked for you 🛍️</h2>
        <p style="color: #475569;">Our team put together a few favorites from MKUSI:</p>
        ${productsHtml}
        <a href="${siteUrl}/shop" style="display: inline-block; margin-top: 8px; background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">
          Browse Full Shop
        </a>
      </div>
    `;

    let sentCount = 0;
    const failures: string[] = [];

    for (const sub of subscribers) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'MKUSI <onboarding@resend.dev>',
            to: sub.email,
            subject: `${products.length > 1 ? 'New picks' : 'A pick'} just for you — MKUSI`,
            html: emailHtml,
          }),
        });

        if (res.ok) {
          sentCount++;
        } else {
          failures.push(sub.email);
        }
      } catch {
        failures.push(sub.email);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: subscribers.length,
      failures: failures.length > 0 ? failures : undefined,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to send notifications.' }, { status: 500 });
  }
}