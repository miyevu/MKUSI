'use client';
import React from 'react';
import {
  Grid, Paper, Typography, Box, Stack, Chip, Avatar, Button, Divider
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  Pending:   { bg: '#fef9c3', color: '#a16207', label: 'Pending' },
  Shipped:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Shipped' },
  Delivered: { bg: '#dcfce7', color: '#15803d', label: 'Delivered' },
  Cancelled: { bg: '#fee2e2', color: '#b91c1c', label: 'Cancelled' },
};

const CHART_DATA  = [3200, 5100, 4200, 7800, 6100, 9200, 8400];
const CHART_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminDashboard() {
  const { orders, products } = useProducts();

  const totalRevenue = orders.reduce((sum, o) =>
    sum + (parseInt(o.total.replace(/[^0-9]/g, '')) || 0), 0
  );
  const pendingOrders   = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount   = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalProducts   = products.length;

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `GH₵ ${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      up: true,
      icon: TrendingUpRoundedIcon,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      label: 'Pending Orders',
      value: String(pendingOrders),
      change: '+3',
      up: true,
      icon: ShoppingBagRoundedIcon,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      label: 'Low Stock',
      value: String(lowStockCount),
      change: '-2',
      up: false,
      icon: Inventory2RoundedIcon,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
    },
    {
      label: 'Total Products',
      value: String(totalProducts),
      change: '+5',
      up: true,
      icon: PeopleRoundedIcon,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <Box className="flex items-start justify-between mb-8 gap-4">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Dashboard
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Chip
          label="● Live"
          size="small"
          sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 'bold', fontSize: '0.7rem' }}
        />
      </Box>

      {/* ── Stat Cards ── */}
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
                <Box className="flex items-start justify-between mb-4">
                  <Box
                    sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: card.iconBg, color: card.iconColor }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box className={`flex items-center gap-0.5 text-xs font-bold ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                    {card.up
                      ? <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} />
                      : <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />
                    }
                    {card.change}
                  </Box>
                </Box>
                <Typography className="font-black text-slate-900 text-xl md:text-2xl leading-none mb-1">
                  {card.value}
                </Typography>
                <Typography className="text-slate-400 text-xs font-medium">
                  {card.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Chart + Orders ── */}
      <Grid container spacing={3}>

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
                <Typography className="text-slate-400 text-xs font-medium">Revenue this week</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip label="Weekly" size="small" sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} />
                <Chip label="Monthly" size="small" variant="outlined" sx={{ borderColor: 'grey.200', fontWeight: 'bold', fontSize: '0.7rem' }} />
              </Stack>
            </Box>

            <Box sx={{ width: '100%', height: { xs: 220, md: 300 } }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: CHART_LABELS }]}
                series={[{
                  data: CHART_DATA,
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
          </Paper>
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
                href="/admin/inventory"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                size="small"
                className="text-blue-600 font-bold normal-case text-xs"
                disableRipple
              >
                View all
              </Button>
            </Box>

            <Stack spacing={0} className="flex-1">
              {orders.length === 0 ? (
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
                    <Box key={i}>
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
    </Box>
  );
}
