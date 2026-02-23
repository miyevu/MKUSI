'use client';
import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Box, Paper, Stack, Divider, Radio, RadioGroup, FormControlLabel, FormControl, Grid 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// MOCK DATA - Replace with actual Cart State later
const MOCK_CART = [
  { id: 1, name: "15000mAh Solar Power Bank", price: 510.00, quantity: 1, image: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=100" },
  { id: 2, name: "MagSafe Silicone Case", price: 150.00, quantity: 1, image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=100" }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { addOrder } = useProducts();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Accra'
  });
  
  // NEW: State object to hold error messages for any field
  const [errors, setErrors] = useState({
    phone: '',
    email: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('momo');

  const subtotal = MOCK_CART.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 20.00;
  const totalAmount = subtotal + deliveryFee;

  const validatePhone = (phone: string) => {
    if (phone.length > 0 && phone.length < 10) {
      return "Phone number must be 10 digits";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Check all validations before submitting
    const phoneError = validatePhone(form.phone);
    const emailError = validateEmail(form.email);
    
    // Also enforce that phone can't be empty on submit
    const finalPhoneError = form.phone.length === 0 ? "Phone number is required" : phoneError;

    if (finalPhoneError || emailError) {
      setErrors({ phone: finalPhoneError, email: emailError });
      return; // Stop submission!
    }

    // 1. GENERATE THE 8-DIGIT ID HERE
    const part1 = Math.floor(1000 + Math.random() * 9000); 
    const part2 = Math.floor(1000 + Math.random() * 9000); 
    const eightDigitId = `MK-${part1}-${part2}`;

    // 2. Save order to context (we don't need its returned 4-digit ID anymore)
    addOrder({
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      address: `${form.address}, ${form.city}`,
      items: MOCK_CART.map(i => `${i.quantity}x ${i.name}`).join(', '), 
      total: `GH₵ ${totalAmount.toFixed(2)}`
    });

    // 3. SECURELY SAVE TO SESSION STORAGE (Hidden from URL)
    sessionStorage.setItem('mkusi_order_id', eightDigitId);
    sessionStorage.setItem('mkusi_customer_name', form.firstName);

    // 4. ROUTE TO A CLEAN URL
    router.push(`/checkout/success`);
  };

  // Custom TextField styling
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
      '&.Mui-error fieldset': { borderColor: '#ef4444', borderWidth: '2px' }, // Red border on error
    }
  };

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <Navbar />
      
      <Container maxWidth="lg" className="py-8 md:py-16">
        {/* Header Section */}
        <Box className="flex items-center gap-3 mb-10">
          <Box className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <LockIcon />
          </Box>
          <Box>
            <Typography variant="h4" className="font-black text-slate-900 tracking-tight leading-none mb-1">
              Secure Checkout
            </Typography>
            <Typography className="text-slate-500 font-medium">
              Complete your order securely below.
            </Typography>
          </Box>
        </Box>
        
        <Box component="form" onSubmit={handlePlaceOrder} noValidate>
          <Grid container spacing={{ xs: 4, lg: 8 }}>
            
            {/* LEFT SIDE: Forms */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={6}>
                
                {/* Section 1: Contact Info */}
                <Box>
                  <Typography variant="h6" className="font-black mb-4 flex items-center gap-2 text-slate-900">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Contact Information
                  </Typography>
                  <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth label="First Name" variant="outlined" required 
                          value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})}
                          sx={textFieldStyles}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth label="Last Name" variant="outlined" required 
                          value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})}
                          sx={textFieldStyles}
                        />
                      </Grid>
                      
                      {/* UPDATED PHONE FIELD */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Phone Number" 
                          variant="outlined" 
                          required 
                          type="tel" 
                          placeholder="e.g. 054 XXX XXXX"
                          value={form.phone} 
                          error={!!errors.phone} 
                          helperText={errors.phone}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            if (onlyNums.length <= 10) {
                              setForm({...form, phone: onlyNums});
                              // Clear error dynamically as they type
                              if (errors.phone && onlyNums.length === 10) {
                                setErrors({ ...errors, phone: '' });
                              }
                            }
                          }}
                          onBlur={() => {
                            setErrors({ ...errors, phone: validatePhone(form.phone) });
                          }}
                          inputProps={{ 
                            maxLength: 10, 
                            inputMode: 'numeric', 
                            pattern: '[0-9]*' 
                          }}
                          sx={textFieldStyles}
                        />
                      </Grid>
                      
                      {/* UPDATED EMAIL FIELD */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Email Address" 
                          variant="outlined" 
                          type="email"
                          placeholder="Optional for receipts"
                          value={form.email} 
                          error={!!errors.email}
                          helperText={errors.email}
                          onChange={(e) => {
                            setForm({...form, email: e.target.value});
                            // Clear error dynamically if they start fixing it
                            if (errors.email) setErrors({ ...errors, email: '' });
                          }}
                          onBlur={() => {
                            setErrors({ ...errors, email: validateEmail(form.email) });
                          }}
                          sx={textFieldStyles}
                        />
                      </Grid>

                    </Grid>
                  </Paper>
                </Box>

                {/* Section 2: Delivery */}
                <Box>
                  <Typography variant="h6" className="font-black mb-4 flex items-center gap-2 text-slate-900">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Delivery Address
                  </Typography>
                  <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField 
                          fullWidth label="Street Address / Landmark" variant="outlined" multiline rows={2} required 
                          placeholder="E.g. Near the Total Station, East Legon"
                          value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
                          sx={textFieldStyles}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth label="City / Region" variant="outlined" required 
                          value={form.city} onChange={(e) => setForm({...form, city: e.target.value})}
                          sx={textFieldStyles}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                {/* Section 3: Payment */}
                <Box>
                  <Typography variant="h6" className="font-black mb-4 flex items-center gap-2 text-slate-900">
                    <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Payment Method
                  </Typography>
                  <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
                    <FormControl component="fieldset" className="w-full">
                      <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <Box className={`border-2 rounded-2xl mb-3 p-2 transition-all ${paymentMethod === 'momo' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                          <FormControlLabel 
                            value="momo" 
                            control={<Radio />} 
                            label={<Typography className="font-bold text-slate-900">Mobile Money (Pay on Delivery)</Typography>} 
                            className="w-full m-0"
                          />
                        </Box>
                        <Box className={`border-2 rounded-2xl p-2 transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                          <FormControlLabel 
                            value="cash" 
                            control={<Radio />} 
                            label={<Typography className="font-bold text-slate-900">Cash on Delivery</Typography>} 
                            className="w-full m-0"
                          />
                        </Box>
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Box>

              </Stack>
            </Grid>

            {/* RIGHT SIDE: Order Summary */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="sticky top-28">
                <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 mb-6 shadow-sm bg-white overflow-hidden relative">
                  
                  {/* Background Decoration */}
                  <Box className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                  <Typography variant="h6" className="font-black mb-6 text-slate-900 relative">
                    Order Summary
                  </Typography>
                  
                  {/* Cart Items List */}
                  <Stack spacing={3} className="mb-6">
                    {MOCK_CART.map((item) => (
                      <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                        <Box className="relative">
                          <Box className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </Box>
                          <Box className="absolute -top-2 -right-2 bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {item.quantity}
                          </Box>
                        </Box>
                        <Box className="flex-1">
                          <Typography className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</Typography>
                        </Box>
                        <Typography className="font-bold text-sm text-slate-900">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Divider className="mb-6 border-dashed border-slate-200" />

                  {/* Calculations */}
                  <Stack spacing={2} className="my-4">
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm">Subtotal</Typography>
                      <Typography className="font-bold text-sm">₵{subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm flex items-center gap-1">
                        Delivery 
                      </Typography>
                      <Typography className="font-bold text-sm text-green-600">₵{deliveryFee.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
              
                  <Box className="bg-slate-50 p-2 py-4 rounded-2xl mb-8 flex flex-col justify-between border border-slate-100">
                    <Typography className="text-sm flex items-center gap-1 text-slate-500">
                      Total 
                    </Typography>
                    <Typography variant="h4" className="font-black text-blue-600 tracking-tight">
                      ₵{totalAmount.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Submit Action */}
                  <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth 
                    className="bg-[#1e293b] hover:bg-blue-600 py-4 rounded-2xl normal-case text-lg font-black shadow-none transition-all duration-300 text-white"
                    startIcon={<AccountBalanceWalletIcon />}
                  >
                    Confirm & Place Order
                  </Button>
                  
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" className="mt-4">
                    <SecurityIcon sx={{ fontSize: 12 }} className="text-slate-400" />
                    <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      256-bit SSL Encrypted
                    </Typography>
                  </Stack>

                </Paper>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Container>
      <Footer />
    </main>
  );
}