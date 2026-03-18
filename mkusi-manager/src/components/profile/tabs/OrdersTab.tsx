'use client';
import React from 'react';
import { Typography, Box, Button, Stack, Chip, Divider } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';

export default function OrdersTab() {
  // Using a mock order here so the page doesn't look empty! 
  // You can replace this with an empty state if you prefer.
  const hasOrders = true; 

  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Order History
      </Typography>

      {!hasOrders ? (
        <Box className="p-12 border border-slate-200 rounded-3xl bg-slate-50 text-center flex flex-col items-center">
          <GridViewIcon sx={{ fontSize: 48 }} className="text-slate-300 mb-4" />
          <Typography className="text-slate-900 font-bold mb-2">No orders yet</Typography>
          <Typography className="text-slate-500 text-sm mb-6 max-w-xs">
            When you place orders, their tracking status and history will appear here.
          </Typography>
          <Button variant="contained" className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-full px-8 py-2.5 shadow-none">
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Stack spacing={4}>
          <Box className="p-6 border border-slate-200 rounded-3xl bg-white hover:border-slate-300 transition-colors">
            <Box className="flex justify-between items-center mb-4">
              <Box>
                <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #MK-4059-8522</Typography>
                <Typography className="font-bold text-slate-900">Placed on Feb 23, 2026</Typography>
              </Box>
              <Chip label="Delivered" size="small" className="bg-green-50 text-green-700 font-bold text-[10px] uppercase tracking-wider" />
            </Box>
            
            <Divider className="my-4 border-slate-100" />
            
            <Stack direction="row" alignItems="center" spacing={4}>
              <Box className="w-20 h-20 bg-slate-50 rounded-2xl p-2 shrink-0 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=200" alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
              </Box>
              <Box className="flex-1">
                <Typography className="font-bold text-slate-900 leading-tight mb-1">15000mAh Solar Power Bank</Typography>
                <Typography className="text-slate-500 text-sm">Quantity: 1</Typography>
              </Box>
              <Box className="text-right">
                <Typography className="font-black text-slate-900 mb-2">₵510.00</Typography>
                <Button variant="outlined" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full py-1.5 px-4 font-bold normal-case text-xs">
                  Buy Again
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
}