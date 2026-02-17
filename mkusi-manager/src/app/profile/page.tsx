'use client';
import React from 'react';
import { Container, Typography, Box, Paper, Avatar, Grid, Button, Divider, Stack } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export default function ProfilePage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <Container maxWidth="md" className="py-12 px-6">
        <Typography variant="h4" className="font-black text-slate-900 mb-8 tracking-tighter">
          My Account
        </Typography>

        <Grid container spacing={4}>
          {/* User Overview */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} className="p-8 rounded-[2rem] border border-slate-100 text-center bg-white">
              <Avatar className="w-24 h-24 mx-auto mb-4 bg-blue-600 text-2xl font-bold">M</Avatar>
              <Typography variant="h6" className="font-black text-slate-900">Mkusi User</Typography>
              <Typography variant="body2" className="text-slate-500 mb-6">user@mkusi.com</Typography>
              
              <Stack spacing={1}>
                <Button variant="contained" fullWidth className="bg-black text-white rounded-full py-2.5 font-bold normal-case shadow-none hover:bg-slate-800">
                  Edit Profile
                </Button>
                <Button variant="outlined" fullWidth className="border-slate-200 text-red-600 rounded-full py-2.5 font-bold normal-case hover:bg-red-50 hover:border-red-200">
                  <LogoutIcon className="mr-2 text-sm" /> Logout
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Activity/Details Area */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Paper elevation={0} className="p-6 rounded-[2rem] border border-slate-100 bg-white">
                <Typography variant="h6" className="font-black mb-4 flex items-center gap-2">
                  <ShoppingBagIcon className="text-blue-600" /> Recent Orders
                </Typography>
                <Box className="py-12 text-center bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                  <Typography className="text-slate-400 font-bold mb-2">No orders found.</Typography>
                  <Button href="/shop" className="text-blue-600 font-black">Continue Shopping</Button>
                </Box>
              </Paper>

              <Paper elevation={0} className="p-6 rounded-[2rem] border border-slate-100 bg-white">
                <Typography variant="h6" className="font-black mb-4 flex items-center gap-2">
                  <SettingsIcon className="text-slate-400" /> Account Details
                </Typography>
                <Stack spacing={2}>
                  <div className="flex justify-between"><Typography className="text-slate-500">Phone</Typography><Typography className="font-bold">+233 24 000 0000</Typography></div>
                  <Divider />
                  <div className="flex justify-between"><Typography className="text-slate-500">Location</Typography><Typography className="font-bold">Accra, Ghana</Typography></div>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </main>
  );
}