'use client';
import React from 'react';
import { Container, Grid, Paper, Typography, Box, Stack, Chip, IconButton, Divider, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BarChart } from '@mui/x-charts/BarChart';
import { useProducts } from '@/context/ProductContext';

export default function AdminDashboard() {
  const { orders, products } = useProducts();

  // Stats Logic
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (parseInt(order.total.replace(/[^0-9]/g, '')) || 0);
  }, 0);
  
  const activeOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  // Chart Data
  const chartData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]; 
  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Container maxWidth="xl" className="fade-in">
      
      {/* Header */}
      <Box className="flex justify-between items-end mb-10">
        <Box>
          <Typography variant="h4" className="font-black text-slate-900 mb-1">
            Dashboard
          </Typography>
          <Typography className="text-slate-500 font-medium">
            Tuesday, 10 Feb 2026
          </Typography>
        </Box>
        <Chip label="Live Data" color="success" size="small" className="bg-green-100 text-green-700 font-bold" />
      </Box>

      {/* METRIC CARDS ROW */}
      <Grid container spacing={4} className="mb-10">
        
        {/* HERO CARD: REVENUE (Dark Style like 'Skillset' image) */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper elevation={0} className="relative overflow-hidden h-full p-8 rounded-[32px] bg-[#1e293b] text-white shadow-xl shadow-slate-200 flex flex-col justify-between">
            <Box className="flex justify-between items-start">
              <Box className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <TrendingUpIcon className="text-white" />
              </Box>
              <Chip label="+12.5%" size="small" className="bg-[#10b981] text-white font-bold border-none" />
            </Box>
            
            <Box>
              <Typography className="text-slate-400 font-medium mb-2">Total Revenue</Typography>
              <Typography variant="h3" className="font-black tracking-tight mb-2">
                GH₵ {totalRevenue.toLocaleString()}
              </Typography>
              <Typography className="text-sm text-slate-400 flex items-center gap-1">
                <span className="text-white font-bold">+GH₵ 1,200</span> from last month
              </Typography>
            </Box>

            {/* Abstract Background Decoration */}
            <Box className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          </Paper>
        </Grid>

        {/* SECONDARY STATS (Light Style) */}
        <Grid item xs={12} md={7} lg={8}>
          <Grid container spacing={4}>
            {/* Active Orders */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm h-full hover:shadow-md transition-shadow">
                <Stack direction="row" justifyContent="space-between" className="mb-6">
                  <Box className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <ShoppingCartIcon />
                  </Box>
                  <IconButton size="small"><ArrowOutwardIcon className="text-slate-300" /></IconButton>
                </Stack>
                <Typography variant="h4" className="font-black text-slate-900 mb-1">{activeOrders}</Typography>
                <Typography className="text-slate-500 font-medium">Active Orders</Typography>
              </Paper>
            </Grid>

            {/* Inventory Status */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm h-full hover:shadow-md transition-shadow">
                <Stack direction="row" justifyContent="space-between" className="mb-6">
                  <Box className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <InventoryIcon />
                  </Box>
                  <IconButton size="small"><ArrowOutwardIcon className="text-slate-300" /></IconButton>
                </Stack>
                <Typography variant="h4" className="font-black text-slate-900 mb-1">{lowStock}</Typography>
                <Typography className="text-slate-500 font-medium">Low Stock Items</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* MAIN CONTENT SPLIT */}
      <Grid container spacing={4}>
        
        {/* CHART SECTION */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-8">
              <Typography variant="h6" className="font-bold text-slate-900">Sales Analytics</Typography>
              <Box className="flex gap-2">
                <Chip label="Monthly" clickable className="bg-slate-900 text-white font-bold" />
                <Chip label="Weekly" clickable variant="outlined" className="border-slate-200 font-bold" />
              </Box>
            </Stack>
            
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                series={[{ data: chartData, color: '#1e293b', radius: 8 }]}
                height={350}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{ legend: { hidden: true } }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* RECENT TRANSACTIONS SIDE LIST */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm h-full">
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-6">
              <Typography variant="h6" className="font-bold text-slate-900">Recent Sales</Typography>
              <IconButton><MoreHorizIcon /></IconButton>
            </Stack>

            <Box className="flex flex-col gap-4">
              {orders.slice(0, 5).map((order, i) => (
                <Box key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                  <Box className="flex items-center gap-4">
                    <Avatar className="bg-blue-50 text-blue-600 font-bold rounded-xl">
                      {order.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {order.customerName}
                      </Typography>
                      <Typography className="text-xs text-slate-500">
                        {order.items.split(',')[0]}...
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="font-bold text-slate-900 text-sm">
                    {order.total}
                  </Typography>
                </Box>
              ))}
              
              {orders.length === 0 && (
                <Typography className="text-center text-slate-400 py-10">No recent sales</Typography>
              )}
            </Box>
            
            {orders.length > 0 && (
               <Button fullWidth variant="outlined" className="mt-6 rounded-xl border-slate-200 text-slate-600 font-bold normal-case py-3 hover:border-slate-900 hover:text-slate-900">
                 View All Orders
               </Button>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}