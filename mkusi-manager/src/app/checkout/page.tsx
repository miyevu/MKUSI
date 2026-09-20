'use client';
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Box, Paper, Stack, Divider, Radio, RadioGroup, FormControlLabel, FormControl, Grid, Alert
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts, getDiscountedPrice } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, products, addOrder, clearCart, storeSettings, validatePromoCode } = useProducts();
  const { currentUser } = useAuth();

  const resolvedItems = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const { finalPrice } = getDiscountedPrice(product);
      return { ...item, product, unitPrice: finalPrice };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: 'Accra'
  });

  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        firstName: prev.firstName || currentUser.firstName || '',
        lastName: prev.lastName || currentUser.lastName || '',
        email: prev.email || currentUser.email || '',
      }));
    }
  }, [currentUser]);
  
  const [errors, setErrors] = useState({
    phone: '',
    email: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitWarning, setSubmitWarning] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ discountType: 'percent' | 'fixed'; discountValue: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  const subtotal = resolvedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const promoDiscount = promoApplied
    ? promoApplied.discountType === 'percent'
      ? subtotal * (promoApplied.discountValue / 100)
      : Math.min(promoApplied.discountValue, subtotal)
    : 0;
  const totalAmount = subtotal - promoDiscount + storeSettings.deliveryFee;

  const validatePhone = (phone: string) => {
    if (phone.length > 0 && phone.length < 10) {
      return "Phone number must be 10 digits";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    if (email.length === 0) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleApplyPromo = async () => {
    setPromoError('');
    setValidatingPromo(true);
    const result = await validatePromoCode(promoCode);
    setValidatingPromo(false);

    if (!result.valid) {
      setPromoError(result.error || 'Invalid code.');
      setPromoApplied(null);
      return;
    }

    setPromoApplied({ discountType: result.discountType!, discountValue: result.discountValue! });
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitWarning('');

    if (resolvedItems.length === 0) return;

    const phoneError = validatePhone(form.phone);
    const emailError = validateEmail(form.email);
    const finalPhoneError = form.phone.length === 0 ? "Phone number is required" : phoneError;

    if (finalPhoneError || emailError) {
      setErrors({ phone: finalPhoneError, email: emailError });
      return;
    }

    setSubmitting(true);

    const result = await addOrder({
      customerName: `${form.firstName} ${form.lastName}`,
      customerEmail: form.email || currentUser?.email,
      phone: form.phone,
      address: `${form.address}, ${form.city}`,
      lineItems: resolvedItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      totalOverride: totalAmount,
      promoCode: promoApplied ? promoCode : undefined,
    });

    if (!result.success || !result.order) {
      setSubmitting(false);
      setSubmitError(result.error || 'Failed to place order. Please try again.');
      return;
    }

    if (result.error) {
      setSubmitWarning(result.error);
    }

    sessionStorage.setItem('mkusi_order_id', result.order.id);
    sessionStorage.setItem('mkusi_customer_name', form.firstName);

    if (form.email) {
      fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          customerName: form.firstName,
          orderId: result.order.id,
          total: totalAmount.toFixed(2),
          items: resolvedItems.map(i => `${i.quantity}x ${i.product.name}`).join(', '),
        }),
      }).catch(err => console.error('Order confirmation email failed (non-blocking):', err));
    }

    await clearCart();
    setSubmitting(false);

    router.push(`/checkout/success`);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
      '&.Mui-error fieldset': { borderColor: '#ef4444', borderWidth: '2px' },
    }
  };

  if (resolvedItems.length === 0) {
    return (
      <main className="bg-[#fafafa] min-h-screen">
        <Navbar />
        <Container maxWidth="sm" className="py-24 flex flex-col items-center text-center">
          <Box className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <LockIcon sx={{ fontSize: 32 }} className="text-slate-300" />
          </Box>
          <Typography className="font-black text-slate-900 text-2xl mb-2">Your cart is empty</Typography>
          <Typography className="text-slate-400 text-sm mb-8 max-w-xs">
            Add something to your cart before checking out.
          </Typography>
          <Button
            component={Link}
            href="/shop"
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-2xl px-8 py-3 shadow-none text-sm"
          >
            Browse Products
          </Button>
        </Container>
        <Footer />
      </main>
    );
  }

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
            <Typography variant="h4" className="font-black text-slate-900 tracking-tight leading-none mb-1" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
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
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Email Address" 
                          variant="outlined" 
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email} 
                          error={!!errors.email}
                          helperText={errors.email}
                          onChange={(e) => {
                            setForm({...form, email: e.target.value});
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
              <Box className="lg:sticky lg:top-28">
                <Paper elevation={0} className="p-6 md:p-8 rounded-[2rem] border border-slate-200 mb-6 shadow-sm bg-white overflow-hidden relative">
                  
                  <Box className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                  <Typography variant="h6" className="font-black mb-6 text-slate-900 relative">
                    Order Summary
                  </Typography>
                  
                  {/* Cart Items List */}
                  <Stack spacing={3} className="mb-6">
                    {resolvedItems.map((item) => (
                      <Stack key={item.productId} direction="row" spacing={2} alignItems="center">
                        <Box className="relative">
                          <Box className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </Box>
                          <Box className="absolute -top-2 -right-2 bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {item.quantity}
                          </Box>
                        </Box>
                        <Box className="flex-1">
                          <Typography className="font-bold text-sm text-slate-900 line-clamp-1">{item.product.name}</Typography>
                        </Box>
                        <Typography className="font-bold text-sm text-slate-900">
                          ₵{(item.unitPrice * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* Promo Code */}
                  <Box className="mb-6">
                    {!promoApplied ? (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); } }}
                          sx={textFieldStyles}
                        />
                        <Button
                          onClick={handleApplyPromo}
                          disabled={!promoCode || validatingPromo}
                          variant="outlined"
                          className="border-slate-300 text-slate-700 font-bold normal-case rounded-xl px-5 shrink-0"
                        >
                          {validatingPromo ? 'Checking...' : 'Apply'}
                        </Button>
                      </Stack>
                    ) : (
                      <Box className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                        <Typography className="text-green-700 font-bold text-sm">
                          ✓ {promoCode} applied
                        </Typography>
                        <Button onClick={handleRemovePromo} className="text-green-700 font-bold normal-case text-xs px-2 min-w-0">
                          Remove
                        </Button>
                      </Box>
                    )}
                    {promoError && (
                      <Typography className="text-red-500 text-xs font-semibold mt-1.5">{promoError}</Typography>
                    )}
                  </Box>

                  <Divider className="mb-6 border-dashed border-slate-200" />

                  {/* Calculations */}
                  <Stack spacing={2} className="my-4">
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm">Subtotal</Typography>
                      <Typography className="font-bold text-sm">₵{subtotal.toFixed(2)}</Typography>
                    </Box>
                    {promoApplied && (
                      <Box className="flex justify-between items-center text-green-600">
                        <Typography className="font-bold text-sm">Promo discount</Typography>
                        <Typography className="font-bold text-sm">−₵{promoDiscount.toFixed(2)}</Typography>
                      </Box>
                    )}
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm flex items-center gap-1">
                        Delivery 
                      </Typography>
                      <Typography className="font-bold text-sm text-green-600">₵{storeSettings.deliveryFee.toFixed(2)}</Typography>
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

                  {submitWarning && (
                    <Alert severity="warning" sx={{ borderRadius: 2, mb: 3, fontWeight: 600, fontSize: '0.8rem' }}>
                      {submitWarning}
                    </Alert>
                  )}

                  {submitError && (
                    <Alert severity="error" sx={{ borderRadius: 2, mb: 3, fontWeight: 600 }}>
                      {submitError}
                    </Alert>
                  )}

                  {/* Submit Action */}
                  <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth 
                    disabled={submitting}
                    className="bg-[#1e293b] hover:bg-blue-600 py-4 rounded-2xl normal-case text-lg font-black shadow-none transition-all duration-300 text-white"
                    startIcon={<AccountBalanceWalletIcon />}
                  >
                    {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
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