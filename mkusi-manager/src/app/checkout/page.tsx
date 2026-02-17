'use client';
import React, { useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Box, Paper, Stack, Divider } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { addOrder } = useProducts();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: 'Accra'
  });

  // This represents the current cart total
  const totalAmount = "GH₵ 170.00";

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save the order to the Admin Dashboard (Internal State)
    const newOrder = addOrder({
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      address: `${form.address}, ${form.city}`,
      items: "MagSafe Silicone Case", // This would normally come from a Cart state
      total: totalAmount
    });

    // 2. Move to the Success Page, passing the Order ID and Name
    router.push(`/checkout/success?id=${newOrder.id}&name=${form.firstName}`);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <Container maxWidth="lg" className="py-12">
        <Typography variant="h4" className="font-black text-slate-900 mb-8 tracking-tight">
          Checkout
        </Typography>
        
        <Box component="form" onSubmit={handlePlaceOrder}>
          <Grid container spacing={4}>
            {/* Left Side: Delivery Details Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} className="p-8 rounded-3xl border border-slate-100 shadow-sm">
                <Typography variant="h6" className="font-bold mb-6 text-slate-800">
                  Delivery Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth label="First Name" variant="outlined" required 
                      value={form.firstName}
                      onChange={(e) => setForm({...form, firstName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth label="Last Name" variant="outlined" required 
                      value={form.lastName}
                      onChange={(e) => setForm({...form, lastName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth label="Phone Number" variant="outlined" required 
                      placeholder="e.g. 054 XXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth label="Street Address / Landmark" variant="outlined" multiline rows={3} required 
                      placeholder="Near the Total Station, East Legon"
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Side: Order Summary */}
            <Grid item xs={12} md={5}>
              <Box className="sticky top-24">
                <Paper elevation={0} className="p-8 rounded-3xl border border-slate-100 mb-6 shadow-sm">
                  <Typography variant="h6" className="font-bold mb-4 text-slate-800">
                    Order Summary
                  </Typography>
                  
                  <Stack spacing={2}>
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">GH₵ 150.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-green-600">GH₵ 20.00</span>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center pt-2">
                      <Typography variant="h6" className="font-bold text-slate-900">Total</Typography>
                      <Typography variant="h5" className="font-black text-blue-600">
                        {totalAmount}
                      </Typography>
                    </div>
                  </Stack>
                </Paper>

                <Button 
                  type="submit"
                  variant="contained" 
                  fullWidth 
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  className="bg-blue-600 hover:bg-blue-700 py-4 rounded-xl normal-case text-lg font-bold shadow-lg shadow-blue-100 text-white"
                >
                  Place Order
                </Button>
                
                <Typography variant="caption" className="block text-center mt-4 text-slate-400 leading-tight">
                  Your order will be saved in our system immediately.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </main>
  );
}