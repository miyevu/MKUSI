import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { data: lowStockProducts, error } = await supabase
      .from('products')
      .select('name, stock, category')
      .lte('stock', 5)
      .order('stock', { ascending: true });

    if (error) {
      console.error('Failed to fetch low stock products:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!lowStockProducts || lowStockProducts.length === 0) {
      return NextResponse.json({ success: true, message: 'No low stock products today.' });
    }

    const { data: settingsData } = await supabase
      .from('settings')
      .select('store_email')
      .eq('id', 1)
      .single();

    const adminEmail = settingsData?.store_email || process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!adminEmail) {
      return NextResponse.json({ error: 'No admin email configured to send low-stock alert to.' }, { status: 400 });
    }

    const rowsHtml = lowStockProducts.map(p => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${p.category}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: ${p.stock === 0 ? '#dc2626' : '#a16207'}; font-weight: bold;">
          ${p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Daily Low Stock Report</h2>
        <p style="color: #475569;">${lowStockProducts.length} product${lowStockProducts.length === 1 ? ' is' : 's are'} at or below 5 units in stock:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f8fafc; text-align: left;">
              <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #94a3b8;">Product</th>
              <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #94a3b8;">Category</th>
              <th style="padding: 8px; font-size: 12px; text-transform: uppercase; color: #94a3b8;">Stock</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <p style="color: #94a3b8; font-size: 12px;">This is your daily automated stock check from MKUSI.</p>
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
        to: adminEmail,
        subject: `Low Stock Alert — ${lowStockProducts.length} product${lowStockProducts.length === 1 ? '' : 's'} need attention`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Failed to send low stock email:', errData);
      return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, count: lowStockProducts.length });
  } catch (err) {
    console.error('Daily low stock check error:', err);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}