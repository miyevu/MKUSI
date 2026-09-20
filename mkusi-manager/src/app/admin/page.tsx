'use client';
import React, { useMemo, useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Box, Stack, Chip, Avatar, Button, Divider, LinearProgress
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { useProducts } from '@/context/ProductContext';
import { supabase } from '@/lib/supabase';
import { exportMultiSectionCSV } from '@/lib/csvExport';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  Pending:   { bg: '#fef9c3', color: '#a16207', label: 'Pending' },
  Delivered: { bg: '#dcfce7', color: '#15803d', label: 'Delivered' },
};

function parseTotal(total: string): number {
  const num = parseFloat(total.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

interface CouponUsageRow {
  code: string;
  discount_type: string;
  discount_value: number;
  times_used: number;
  usage_limit: number | null;
  active: boolean;
}

export default function AdminDashboard() {
  const { orders, products, ordersLoading, productsLoading } = useProducts();
  const [coupons, setCoupons] = useState<CouponUsageRow[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setCouponsLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('code, discount_type, discount_value, times_used, usage_limit, active')
        .order('times_used', { ascending: false });
      if (!error && data) {
        setCoupons(data as CouponUsageRow[]);
      }
      setCouponsLoading(false);
    };
    fetchCoupons();
  }, []);

  const { chartLabels, chartData } = useMemo(() => {
    const days: { label: string; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d });
    }

    const data = days.map(({ date }) => {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      return orders
        .filter(o => {
          const created = new Date(o.createdAt);
          return created >= dayStart && created <= dayEnd;
        })
        .reduce((sum, o) => sum + parseTotal(o.total), 0);
    });

    return { chartLabels: days.map(d => d.label), chartData: data };
  }, [orders]);

  // Best-effort top-sellers: parses "Nx ProductName" segments out of each
  // order's items string and matches against current product names.
  const topSellers = useMemo(() => {
    const countByName: Record<string, number> = {};

    orders.forEach(order => {
      const segments = order.items.split(',').map(s => s.trim());
      segments.forEach(seg => {
        const match = seg.match(/^(\d+)x\s+(.+)$/i);
        if (!match) return;
        const qty = parseInt(match[1], 10);
        const name = match[2].trim();
        countByName[name] = (countByName[name] || 0) + qty;
      });
    });

    const withProductData = Object.entries(countByName)
      .map(([name, qty]) => {
        const product = products.find(p => p.name === name);
        return { name, qty, image: product?.image, price: product?.price };
      })
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return withProductData;
  }, [orders, products]);

  const weeklyRevenue = chartData.reduce((sum, v) => sum + v, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + parseTotal(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' && !o.removedAt).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalProducts = products.length;
  const maxSellerQty = topSellers[0]?.qty || 1;

  const handleExportDashboard = () => {
    const summaryRows = [
      { Metric: 'Total Revenue', Value: `GH₵ ${totalRevenue.toLocaleString()}` },
      { Metric: 'Total Orders', Value: orders.length },
      { Metric: 'Pending Orders', Value: pendingOrders },
      { Metric: 'Low Stock Products', Value: lowStockCount },
      { Metric: 'Out of Stock Products', Value: outOfStockCount },
      { Metric: 'Total Products', Value: totalProducts },
      { Metric: 'Revenue (Last 7 Days)', Value: `GH₵ ${weeklyRevenue.toLocaleString()}` },
    ];

    const ordersRows = orders.map(o => ({
      OrderID: o.id,
      CustomerName: o.customerName,
      CustomerEmail: o.customerEmail || '',
      Items: o.items,
      Total: o.total,
      Status: o.removedAt ? 'Removed' : o.status,
      Date: o.date,
    }));

    const topSellersRows = topSellers.map((s, i) => ({
      Rank: i + 1,
      Product: s.name,
      UnitsSold: s.qty,
    }));

    const couponRows = coupons.map(c => ({
      Code: c.code,
      Discount: c.discount_type === 'percent' ? `${c.discount_value}%` : `GH₵${c.discount_value}`,
      TimesUsed: c.times_used,
      UsageLimit: c.usage_limit ?? 'Unlimited',
      Active: c.active ? 'Yes' : 'No',
    }));

    exportMultiSectionCSV(`mkusi-dashboard-report-${new Date().toISOString().slice(0, 10)}`, [
      { title: 'Summary', rows: summaryRows },
      { title: 'All Orders', rows: ordersRows },
      { title: 'Top Selling Products', rows: topSellersRows },
      { title: 'Coupon Usage', rows: couponRows },
    ]);
  };

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `GH₵ ${totalRevenue.toLocaleString()}`,
      sub: `${orders.length} orders total`,
      icon: TrendingUpRoundedIcon,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      label: 'Pending Orders',
      value: String(pendingOrders),
      sub: pendingOrders > 0 ? 'Needs attention' : 'All caught up',
      icon: ShoppingBagRoundedIcon,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      label: 'Inventory Health',
      value: String(lowStockCount + outOfStockCount),
      sub: `${lowStockCount} low · ${outOfStockCount} out`,
      icon: Inventory2RoundedIcon,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
    },
    {
      label: 'Total Products',
      value: String(totalProducts),
      sub: 'Live in your store',
      icon: PeopleRoundedIcon,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Dashboard
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center" className="flex-wrap gap-y-2">
          <Chip
            label="● Live"
            size="small"
            sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 'bold', fontSize: '0.7rem' }}
          />
          <Button
            onClick={handleExportDashboard}
            variant="outlined"
            startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold normal-case rounded-2xl px-5 py-2.5 text-sm shrink-0"
          >
            Export Report
          </Button>
          <Button
            component={Link}
            href="/admin/add-product"
            variant="contained"
            startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
            className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-5 py-2.5 shadow-none transition-colors text-sm shrink-0"
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} className="mb-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Grid key={card.label} size={{ xs: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: { xs: 2.5, md: 3 }, height: '100%' }}
                className="bg-white hover:shadow-md transition-shadow"
              >
                <Box
                  sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: card.iconBg, color: card.iconColor }}
                  className="flex items-center justify-center shrink-0 mb-4"
                >
                  <Icon sx={{ fontSize: 20 }} />
                </Box>
                <Typography className="font-black text-slate-900 text-xl md:text-2xl leading-none mb-1">
                  {card.value}
                </Typography>
                <Typography className="text-slate-400 text-xs font-medium mb-2">
                  {card.label}
                </Typography>
                <Divider className="mb-2" sx={{ borderColor: '#f8fafc' }} />
                <Typography className="text-slate-500 text-[11px] font-semibold">
                  {card.sub}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Chart + Orders */}
      <Grid container spacing={3} className="mb-3">

        {/* Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', p: { xs: 3, md: 4 } }}
            className="bg-white"
          >
            <Box className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <Box>
                <Typography className="font-black text-slate-900 text-base mb-0.5">Sales Analytics</Typography>
                <Typography className="text-slate-400 text-xs font-medium">
                  Revenue this week · <span className="font-bold text-slate-600">GH₵ {weeklyRevenue.toLocaleString()}</span>
                </Typography>
              </Box>
              <Chip label="Last 7 Days" size="small" sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} />
            </Box>

            {ordersLoading ? (
              <Box sx={{ width: '100%', height: { xs: 220, md: 300 } }} className="flex items-center justify-center">
                <Typography className="text-slate-400 text-sm font-medium">Loading chart...</Typography>
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ width: '100%', height: { xs: 220, md: 300 } }} className="flex flex-col items-center justify-center gap-2">
                <TrendingUpRoundedIcon sx={{ fontSize: 36 }} className="text-slate-200" />
                <Typography className="text-slate-400 text-sm font-medium">No orders yet this week</Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: { xs: 220, md: 300 } }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: chartLabels }]}
                  series={[{
                    data: chartData,
                    color: '#2563eb',
                  }]}
                  height={300}
                  margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
                  hideLegend
                  borderRadius={10}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: '#f1f5f9' },
                    '& .MuiChartsAxis-tick': { stroke: '#f1f5f9' },
                    '& .MuiChartsAxis-tickLabel': { fill: '#94a3b8', fontSize: '11px' },
                    '& .MuiChartsGrid-line': { stroke: '#f8fafc' },
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Quick Actions row under chart */}
          <Grid container spacing={3} className="mt-1">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                component={Link}
                href="/admin/inventory"
                elevation={0}
                sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 3, display: 'block', textDecoration: 'none' }}
                className="bg-white hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <Inventory2RoundedIcon sx={{ fontSize: 22 }} className="text-blue-600 mb-2" />
                <Typography className="font-bold text-slate-900 text-sm">Manage Inventory</Typography>
                <Typography className="text-slate-400 text-xs">{totalProducts} products</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                component={Link}
                href="/admin/orders"
                elevation={0}
                sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 3, display: 'block', textDecoration: 'none' }}
                className="bg-white hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <ShoppingBagRoundedIcon sx={{ fontSize: 22 }} className="text-orange-600 mb-2" />
                <Typography className="font-bold text-slate-900 text-sm">View Orders</Typography>
                <Typography className="text-slate-400 text-xs">{pendingOrders} pending</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                component={Link}
                href="/admin/add-product"
                elevation={0}
                sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 3, display: 'block', textDecoration: 'none' }}
                className="bg-white hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <AddRoundedIcon sx={{ fontSize: 22 }} className="text-green-600 mb-2" />
                <Typography className="font-bold text-slate-900 text-sm">Add Product</Typography>
                <Typography className="text-slate-400 text-xs">List something new</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}
            className="bg-white"
          >
            <Box className="flex items-center justify-between mb-5">
              <Box>
                <Typography className="font-black text-slate-900 text-base mb-0.5">Recent Orders</Typography>
                <Typography className="text-slate-400 text-xs font-medium">{orders.length} total orders</Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/orders"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                size="small"
                className="text-blue-600 font-bold normal-case text-xs"
                disableRipple
              >
                View all
              </Button>
            </Box>

            <Stack spacing={0} className="flex-1">
              {ordersLoading ? (
                <Box className="flex-1 flex items-center justify-center py-12">
                  <Typography className="text-slate-400 text-sm font-medium">Loading...</Typography>
                </Box>
              ) : orders.length === 0 ? (
                <Box className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <Box className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                    <ShoppingBagRoundedIcon sx={{ fontSize: 22 }} className="text-slate-300" />
                  </Box>
                  <Typography className="text-slate-400 text-sm font-medium">No orders yet</Typography>
                </Box>
              ) : (
                orders.slice(0, 6).map((order, i) => {
                  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES['Pending'];
                  return (
                    <Box key={order.id}>
                      <Box className="flex items-center gap-3 py-3 hover:bg-slate-50/60 rounded-2xl px-2 -mx-2 cursor-pointer transition-colors">
                        <Avatar
                          sx={{
                            width: 36, height: 36,
                            bgcolor: '#eff6ff',
                            color: '#2563eb',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            borderRadius: '10px',
                            flexShrink: 0,
                          }}
                        >
                          {order.customerName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box className="flex-1 min-w-0">
                          <Typography className="font-bold text-slate-900 text-sm leading-tight truncate">
                            {order.customerName}
                          </Typography>
                          <Typography className="text-slate-400 text-[11px] font-medium truncate">
                            {order.items.split(',')[0]}
                          </Typography>
                        </Box>
                        <Box className="shrink-0 text-right">
                          <Typography className="font-black text-slate-900 text-sm leading-tight">
                            {order.total}
                          </Typography>
                          <Box
                            sx={{ bgcolor: style.bg, color: style.color }}
                            className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-md mt-0.5 inline-block"
                          >
                            {style.label}
                          </Box>
                        </Box>
                      </Box>
                      {i < Math.min(orders.length, 6) - 1 && (
                        <Divider sx={{ borderColor: '#f8fafc' }} />
                      )}
                    </Box>
                  );
                })
              )}
            </Stack>
          </Paper>
        </Grid>

      </Grid>

      {/* Top Sellers + Coupon Usage */}
      <Grid container spacing={3}>

        {/* Top Selling Products */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', p: { xs: 3, md: 4 }, height: '100%' }}
            className="bg-white"
          >
            <Box className="flex items-center gap-2 mb-5">
              <EmojiEventsRoundedIcon sx={{ fontSize: 20 }} className="text-amber-500" />
              <Typography className="font-black text-slate-900 text-base">Top Selling Products</Typography>
            </Box>

            {productsLoading || ordersLoading ? (
              <Box className="py-12 flex items-center justify-center">
                <Typography className="text-slate-400 text-sm font-medium">Loading...</Typography>
              </Box>
            ) : topSellers.length === 0 ? (
              <Box className="py-12 flex flex-col items-center justify-center text-center">
                <Box className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                  <EmojiEventsRoundedIcon sx={{ fontSize: 22 }} className="text-slate-300" />
                </Box>
                <Typography className="text-slate-400 text-sm font-medium">No sales data yet</Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {topSellers.map((seller, i) => (
                  <Box key={seller.name}>
                    <Box className="flex items-center gap-3 mb-1.5">
                      <Box className="w-7 h-7 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {seller.image ? (
                          <img src={seller.image} alt={seller.name} className="w-full h-full object-contain" />
                        ) : (
                          <Typography className="text-slate-400 text-xs font-black">#{i + 1}</Typography>
                        )}
                      </Box>
                      <Typography className="font-bold text-slate-900 text-sm flex-1 truncate">
                        {seller.name}
                      </Typography>
                      <Typography className="font-black text-slate-900 text-sm shrink-0">
                        {seller.qty} sold
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(seller.qty / maxSellerQty) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 3 },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}

            <Typography className="text-slate-300 text-[10px] mt-5">
              Based on completed order history · counts may be approximate for renamed or removed products
            </Typography>
          </Paper>
        </Grid>

        {/* Coupon Usage */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', p: { xs: 3, md: 4 }, height: '100%' }}
            className="bg-white"
          >
            <Box className="flex items-center justify-between mb-5">
              <Box className="flex items-center gap-2">
                <LocalOfferRoundedIcon sx={{ fontSize: 20 }} className="text-blue-600" />
                <Typography className="font-black text-slate-900 text-base">Coupon Usage</Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/coupons"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                size="small"
                className="text-blue-600 font-bold normal-case text-xs"
                disableRipple
              >
                Manage
              </Button>
            </Box>

            {couponsLoading ? (
              <Box className="py-12 flex items-center justify-center">
                <Typography className="text-slate-400 text-sm font-medium">Loading...</Typography>
              </Box>
            ) : coupons.length === 0 ? (
              <Box className="py-12 flex flex-col items-center justify-center text-center">
                <Box className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                  <LocalOfferRoundedIcon sx={{ fontSize: 22 }} className="text-slate-300" />
                </Box>
                <Typography className="text-slate-400 text-sm font-medium">No coupons created yet</Typography>
              </Box>
            ) : (
              <Stack spacing={0} divider={<Divider sx={{ borderColor: '#f8fafc' }} />}>
                {coupons.slice(0, 6).map((coupon) => (
                  <Box key={coupon.code} className="flex items-center gap-3 py-3">
                    <Box className="flex-1 min-w-0">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography className="font-black text-slate-900 text-sm tracking-wide">
                          {coupon.code}
                        </Typography>
                        {!coupon.active && (
                          <Chip label="Inactive" size="small" sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 700, fontSize: '0.6rem', height: 18 }} />
                        )}
                      </Stack>
                      <Typography className="text-slate-400 text-[11px] font-medium">
                        {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₵${coupon.discount_value}`} off
                      </Typography>
                    </Box>
                    <Box className="text-right shrink-0">
                      <Typography className="font-black text-slate-900 text-sm">
                        {coupon.times_used}{coupon.usage_limit !== null ? ` / ${coupon.usage_limit}` : ''}
                      </Typography>
                      <Typography className="text-slate-400 text-[10px] font-medium">
                        {coupon.usage_limit !== null ? 'used' : 'uses (unlimited)'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}