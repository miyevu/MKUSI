'use client';
import React from 'react';
import { Typography, Box, Button, Stack, Chip, Divider } from '@mui/material';
import Link from 'next/link';
import GridViewIcon from '@mui/icons-material/GridView';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';

export default function OrdersTab() {
  const { currentUser } = useAuth();
  const { orders } = useProducts();

  const myOrders = orders.filter(o => o.customerEmail === currentUser?.email);

  const getStatusDisplay = (order: (typeof orders)[number]) => {
    if (order.removedAt) {
      return { label: 'Incomplete', className: 'bg-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-wider' };
    }
    if (order.status === 'Delivered') {
      return { label: 'Order Complete', className: 'bg-green-50 text-green-700 font-bold text-[10px] uppercase tracking-wider' };
    }
    return { label: 'Pending', className: 'bg-amber-50 text-amber-700 font-bold text-[10px] uppercase tracking-wider' };
  };

  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Order History
      </Typography>

      {myOrders.length === 0 ? (
        <Box className="p-12 border border-slate-200 rounded-3xl bg-slate-50 text-center flex flex-col items-center">
          <GridViewIcon sx={{ fontSize: 48 }} className="text-slate-300 mb-4" />
          <Typography className="text-slate-900 font-bold mb-2">No orders yet</Typography>
          <Typography className="text-slate-500 text-sm mb-6 max-w-xs">
            When you place orders, their tracking status and history will appear here.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-full px-8 py-2.5 shadow-none">
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Stack spacing={4}>
          {myOrders.map((order) => {
            const statusDisplay = getStatusDisplay(order);
            return (
              <Box key={order.id} className={`p-6 border rounded-3xl bg-white transition-colors ${order.removedAt ? 'border-slate-200 opacity-70' : 'border-slate-200 hover:border-slate-300'}`}>
                <Box className="flex justify-between items-center mb-4">
                  <Box>
                    <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order.id}</Typography>
                    <Typography className="font-bold text-slate-900">Placed on {order.date}</Typography>
                  </Box>
                  <Chip
                    label={statusDisplay.label}
                    size="small"
                    className={statusDisplay.className}
                  />
                </Box>
                <Divider className="my-4 border-slate-100" />
                <Box className="flex items-center justify-between">
                  <Typography className="text-slate-700 text-sm flex-1">{order.items}</Typography>
                  <Typography className="font-black text-slate-900 ml-4 shrink-0">{order.total}</Typography>
                </Box>
                {order.removedAt && (
                  <Typography className="text-slate-400 text-xs mt-3">
                    This order could not be completed. If you believe this is a mistake, please contact us.
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}