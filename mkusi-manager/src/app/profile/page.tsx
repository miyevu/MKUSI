'use client';
import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Avatar, Button, Stack, Divider, Grid, IconButton, Chip, LinearProgress 
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Icons
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Order History' },
  { id: 'wishlist', label: 'Saved Items' },
  { id: 'settings', label: 'Settings' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="bg-[#f8fafc] min-h-screen flex flex-col">
      <Navbar />
      
      {/* 1. PREMIUM HERO BANNER */}
      <Box className="relative w-full bg-slate-900 h-48 md:h-64 overflow-hidden">
        {/* Subtle Background Gradients */}
        <Box className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <Box className="absolute bottom-0 left-0 w-64 h-64 bg-slate-700/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <Container maxWidth="lg" className="h-full relative">
          <Button className="absolute top-6 right-6 text-white border border-white/20 hover:bg-white/10 rounded-full px-6 py-2 font-bold normal-case text-sm">
            Sign Out
          </Button>
        </Container>
      </Box>

      {/* 2. OVERLAPPING PROFILE IDENTITY */}
      <Container maxWidth="lg" className="-mt-16 md:-mt-20 relative z-10 px-4 md:px-8 mb-8">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'flex-end' }} spacing={3}>
          <Box className="relative">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-[#f8fafc] bg-white text-blue-600 text-5xl font-black shadow-xl">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400" alt="User" />
            </Avatar>
            <IconButton className="absolute bottom-2 right-2 bg-slate-900 text-white hover:bg-blue-600 shadow-lg border-2 border-[#f8fafc] p-2 transition-colors">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box className="pb-2 text-center md:text-left">
            <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} spacing={1.5} className="mb-1">
              <Typography variant="h3" className="font-black text-slate-900 tracking-tight leading-none">
                Lawrence Mkusi
              </Typography>
              <Chip icon={<AutoAwesomeOutlinedIcon className="text-yellow-500" />} label="VIP" size="small" className="bg-slate-900 text-white font-black text-[10px] tracking-widest uppercase px-1 hidden md:flex" />
            </Stack>
            <Typography className="text-slate-500 font-medium">lawrence@mkusi.com • Joined Feb 2026</Typography>
          </Box>
        </Stack>
      </Container>

      {/* 3. STICKY HORIZONTAL NAVIGATION */}
      <Box className="sticky top-[72px] z-40 bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200/60 mb-8">
        <Container maxWidth="lg" className="px-4 md:px-8">
          <Stack direction="row" spacing={1} className="overflow-x-auto no-scrollbar py-2">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                disableRipple
                onClick={() => setActiveTab(tab.id)}
                className={`normal-case font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* 4. MAIN CONTENT AREA */}
      <Container maxWidth="lg" className="px-4 md:px-8 pb-20 flex-1">
        <Grid container spacing={{ xs: 4, lg: 6 }}>
          
          {/* LEFT COLUMN: Track Order & History */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            
            {/* Active Order Tracker */}
            <Typography variant="h6" className="font-black text-slate-900 mb-4 tracking-tight">
              Track Active Order
            </Typography>
            <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-blue-100 bg-white shadow-sm mb-8 relative overflow-hidden">
              <Box className="flex justify-between items-start mb-8">
                <Box>
                  <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Arriving Tomorrow</Typography>
                  <Typography variant="h5" className="font-black text-blue-600 tracking-tight">Order #MK-4059-8522</Typography>
                </Box>
                <Button variant="outlined" className="rounded-xl font-bold normal-case text-slate-600 border-slate-200">
                  Track Rider
                </Button>
              </Box>

              {/* Custom Stepper */}
              <Box className="relative mb-4">
                <LinearProgress variant="determinate" value={50} className="h-2 rounded-full bg-slate-100 [&>span]:bg-blue-600 absolute top-5 left-0 w-full -z-10" />
                <Stack direction="row" justifyContent="space-between" className="px-2">
                  <Box className="flex flex-col items-center gap-2 bg-white px-2">
                    <Box className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200"><Inventory2OutlinedIcon fontSize="small" /></Box>
                    <Typography className="text-xs font-bold text-slate-900">Packed</Typography>
                  </Box>
                  <Box className="flex flex-col items-center gap-2 bg-white px-2">
                    <Box className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200"><LocalShippingOutlinedIcon fontSize="small" /></Box>
                    <Typography className="text-xs font-bold text-slate-900">Shipped</Typography>
                  </Box>
                  <Box className="flex flex-col items-center gap-2 bg-white px-2">
                    <Box className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-white"><CheckCircleOutlineIcon fontSize="small" /></Box>
                    <Typography className="text-xs font-bold text-slate-400">Delivered</Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Order History List */}
            <Box className="flex justify-between items-end mb-4">
              <Typography variant="h6" className="font-black text-slate-900 tracking-tight">Past Purchases</Typography>
              <Button variant="text" className="font-bold text-slate-500 hover:text-slate-900 normal-case">View All</Button>
            </Box>
            <Stack spacing={3}>
              {[
                { title: '15000mAh Solar Power Bank', date: 'Feb 10, 2026', price: '₵510.00', status: 'Delivered', img: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=100' },
                { title: 'MagSafe Silicone Case', date: 'Jan 22, 2026', price: '₵150.00', status: 'Delivered', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=100' }
              ].map((item, i) => (
                <Paper key={i} elevation={0} className="p-4 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer group flex items-center gap-4">
                  <Box className="w-20 h-20 bg-slate-50 rounded-2xl p-2 shrink-0 border border-slate-100">
                    <img src={item.img} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                  </Box>
                  <Box className="flex-1">
                    <Typography className="font-bold text-slate-900 leading-tight mb-1">{item.title}</Typography>
                    <Typography className="text-xs text-slate-500 font-medium mb-2">{item.date}</Typography>
                    <Chip label={item.status} size="small" className="bg-green-50 text-green-700 font-bold text-[10px] uppercase tracking-wider" />
                  </Box>
                  <Box className="text-right pr-2">
                    <Typography className="font-black text-slate-900 mb-2">{item.price}</Typography>
                    <IconButton size="small" className="text-slate-300 group-hover:text-blue-600 bg-slate-50 transition-colors">
                      <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Stack>

          </Grid>

          {/* RIGHT COLUMN: Wallet & Details */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            
            {/* VIP Digital Card */}
            <Typography variant="h6" className="font-black text-slate-900 mb-4 tracking-tight">MKUSI Wallet</Typography>
            <Paper elevation={0} className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 shadow-xl mb-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              {/* Card Details */}
              <Box className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <Stack direction="row" justifyItems="space-between" alignItems="center" className="mb-8 relative z-10">
                <Typography className="font-black tracking-widest uppercase text-sm opacity-80 flex-1">Store Credit</Typography>
                <AutoAwesomeOutlinedIcon className="text-yellow-400" />
              </Stack>
              <Typography variant="h3" className="font-black tracking-tight mb-6 relative z-10">₵ 125.00</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end" className="relative z-10">
                <Box>
                  <Typography className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Card Holder</Typography>
                  <Typography className="font-bold tracking-wider">L. MKUSI</Typography>
                </Box>
                <Box className="text-right">
                  <Typography className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Status</Typography>
                  <Typography className="font-bold tracking-wider text-yellow-400">VIP MEMBER</Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Account Details Minimalist Block */}
            <Typography variant="h6" className="font-black text-slate-900 mb-4 tracking-tight">Default Address</Typography>
            <Paper elevation={0} className="p-6 rounded-[2rem] border border-slate-200 bg-white relative group">
              <IconButton size="small" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 text-blue-600">
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              
              <Typography className="font-black text-slate-900 mb-1">Lawrence Mkusi</Typography>
              <Typography className="text-slate-500 text-sm leading-relaxed mb-4">
                +233 54 123 4567<br />
                Near the Total Station<br />
                East Legon, Accra<br />
                Ghana
              </Typography>
              <Divider className="my-4 border-slate-100" />
              <Button fullWidth className="normal-case font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-xl">
                Manage Addresses
              </Button>
            </Paper>

          </Grid>
        </Grid>
      </Container>

      <Footer />
    </main>
  );
}