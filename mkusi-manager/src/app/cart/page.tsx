'use client';
import React from 'react';
import { Container, Typography, Grid, Box, Button, IconButton, Divider, Stack } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Link from 'next/link';

const CART_ITEMS = [
  { id: 1, name: "MagSafe Silicone Case", price: 150, brand: "iPhone 15 Pro", qty: 1, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT4L3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693593574244" },
];

export default function CartPage() {
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <Container maxWidth="lg">
        <Typography variant="h3" className="font-black text-slate-900 mb-10">Your Bag</Typography>
        
        <Grid container spacing={4}>
          {/* Left Side: Items */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {CART_ITEMS.map((item) => (
                <Box key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
                  <Box className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </Box>
                  
                  <Box className="flex-grow">
                    <Typography className="text-xs font-bold text-blue-600 uppercase mb-1">{item.brand}</Typography>
                    <Typography variant="h6" className="font-bold text-slate-900">{item.name}</Typography>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <IconButton size="small"><RemoveIcon fontSize="small" /></IconButton>
                        <Typography className="px-4 font-bold">{item.qty}</Typography>
                        <IconButton size="small"><AddIcon fontSize="small" /></IconButton>
                      </div>
                      <IconButton color="error" size="small"><DeleteOutlineIcon /></IconButton>
                    </div>
                  </Box>

                  <Typography variant="h6" className="font-black text-slate-900">
                    GH₵ {item.price}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Right Side: Summary */}
          <Grid item xs={12} md={4}>
            <Box className="bg-white p-8 rounded-3xl border border-slate-100 sticky top-24">
              <Typography variant="h5" className="font-bold mb-6">Order Summary</Typography>
              
              <Stack spacing={2} className="mb-6">
                <div className="flex justify-between">
                  <Typography className="text-slate-500">Subtotal</Typography>
                  <Typography className="font-bold">GH₵ {subtotal}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-slate-500">Shipping</Typography>
                  <Typography className="font-bold text-green-600">Calculated at checkout</Typography>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <Typography variant="h6" className="font-bold">Total</Typography>
                  <Typography variant="h6" className="font-black text-blue-600">GH₵ {subtotal}</Typography>
                </div>
              </Stack>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                className="bg-blue-600 hover:bg-blue-700 py-4 rounded-xl normal-case text-lg font-bold shadow-lg shadow-blue-100"
              >
                Proceed to Checkout
              </Button>
              
              <Link href="/shop" className="no-underline">
                <Button fullWidth className="mt-4 text-slate-500 font-bold normal-case">
                  Continue Shopping
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}