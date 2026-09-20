'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, Paper, Stack, Divider, Chip, CircularProgress, Alert
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface TrackedOrder {
  id: string;
  customer_name: string;
  items: string;
  total: string;
  phone: string;
  address: string;
  status: string;
  date: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    const trimmedId = orderId.trim().toUpperCase();
    const trimmedPhone = phone.replace(/\D/g, '');

    if (!trimmedId || !trimmedPhone) {
      setError('Enter both your order ID and phone number.');
      return;
    }

    setLoading(true);
    const { data, error: lookupError } = await supabase
      .from('orders')
      .select('id, customer_name, items, total, phone, address, status, date')
      .eq('id', trimmedId)
      .eq('phone', trimmedPhone)
      .single();

    setLoading(false);

    if (lookupError || !data) {
      setError("We couldn't find an order with that ID and phone number. Double-check both and try again.");
      return;
    }

    setOrder(data as TrackedOrder);
  };

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <Navbar />

      <Container maxWidth="sm" className="py-16 md:py-24">
        <Box className="text-center mb-10">
          <Box className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} className="text-blue-600" />
          </Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight mb-2">
            Track Your Order
          </Typography>
          <Typography className="text-slate-500 text-sm max-w-sm mx-auto">
            No account needed — just enter your order ID and the phone number used at checkout.
          </Typography>
        </Box>

        <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
          <Box component="form" onSubmit={handleLookup}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Order ID"
                placeholder="e.g. MK-1234-5678"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="Same number used at checkout"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputProps={{ inputMode: 'numeric' }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                  }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.85rem' }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchRoundedIcon />}
                className="bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-2xl font-bold normal-case text-base shadow-none transition-colors"
              >
                {loading ? 'Searching...' : 'Find My Order'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {order && (
          <Paper elevation={0} className="mt-6 p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
            <Stack direction="row" alignItems="center" justifyContent="space-between" className="mb-6">
              <Box>
                <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Order
                </Typography>
                <Typography className="font-black text-slate-900 text-lg">{order.id}</Typography>
              </Box>
              <Chip
                label={order.status}
                className={order.status === 'Delivered' ? 'bg-green-100 text-green-700 font-bold' : 'bg-amber-100 text-amber-700 font-bold'}
              />
            </Stack>

            <Divider className="mb-6" />

            <Stack spacing={3}>
              <Box>
                <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Items</Typography>
                <Typography className="text-slate-900 text-sm font-medium">{order.items}</Typography>
              </Box>
              <Box className="flex justify-between items-center">
                <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total</Typography>
                <Typography className="font-black text-blue-600 text-lg">{order.total}</Typography>
              </Box>
              <Box>
                <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Delivery Address</Typography>
                <Typography className="text-slate-900 text-sm font-medium">{order.address}</Typography>
              </Box>
              <Box className="flex justify-between items-center">
                <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest">Order Date</Typography>
                <Typography className="text-slate-900 text-sm font-medium">{order.date}</Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>

      <Footer />
    </main>
  );
}