'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, IconButton, Stack,
  Radio, RadioGroup, FormControlLabel, Divider, Chip
} from '@mui/material';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const CART_ITEMS = [
  {
    id: 1, name: "15000mAh Solar Power Bank", sku: "#21433254354532",
    color: "Black", extra: "Fast-Charging Type-C Cable",
    basePrice: 485.00, extraPrice: 25.00, qty: 1,
    image: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=400"
  },
  {
    id: 2, name: "MagSafe Silicone Case", sku: "#21432353246353",
    color: "Midnight Blue", extra: "Screen Protector",
    basePrice: 120.00, extraPrice: 30.00, qty: 3,
    image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400"
  },
];

export default function CartPage() {
  const [shippingMode, setShippingMode] = useState('pickup');
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.basePrice + item.extraPrice) * item.qty), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shippingCost = shippingMode === 'delivery' ? 35.00 : 0;
  const finalTotal = subtotal - discount + shippingCost;
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <main className="bg-[#f8f9fb] min-h-screen flex flex-col w-full font-sans">
      <Navbar />

      <Container maxWidth="xl" className="px-4 md:px-8 py-8 md:py-12 flex-1">

        {/* ── Header ── */}
        <Box className="flex items-center justify-between mb-8 md:mb-10">
          <Box>
            <Typography variant="h4" className="font-black text-slate-900 tracking-tight text-3xl md:text-4xl leading-none">
              My Cart
            </Typography>
            <Typography className="text-slate-400 text-sm font-medium mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/shop"
            startIcon={<KeyboardBackspaceRoundedIcon fontSize="small" />}
            disableRipple
            className="text-slate-500 hover:text-blue-600 font-bold normal-case text-sm px-0 bg-transparent hover:bg-transparent"
          >
            Continue shopping
          </Button>
        </Box>

        {cartItems.length === 0 ? (
          /* ── Empty State ── */
          <Box className="flex flex-col items-center justify-center py-28 text-center">
            <Box className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 44 }} className="text-slate-300" />
            </Box>
            <Typography className="font-black text-slate-900 text-2xl mb-2">Your cart is empty</Typography>
            <Typography className="text-slate-400 text-sm mb-8 max-w-xs">
              Looks like you haven't added anything yet. Browse our store and find something you'll love.
            </Typography>
            <Button
              component={Link}
              href="/shop"
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-2xl px-8 py-3 shadow-none text-sm"
            >
              Shop Now
            </Button>
          </Box>
        ) : (
          <Box className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ════════════════════════════════ */}
            {/* LEFT — Cart Items                */}
            {/* ════════════════════════════════ */}
            <Box className="w-full flex-1 min-w-0">
              <Box className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">

                {/* Column headers (desktop) */}
                <Box className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50">
                  <Box className="col-span-5">
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Product</Typography>
                  </Box>
                  <Box className="col-span-2 flex justify-center">
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Price</Typography>
                  </Box>
                  <Box className="col-span-2 flex justify-center">
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Qty</Typography>
                  </Box>
                  <Box className="col-span-2 flex justify-end">
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Total</Typography>
                  </Box>
                  <Box className="col-span-1 flex justify-end">
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]"></Typography>
                  </Box>
                </Box>

                {/* Items */}
                {cartItems.map((item, index) => (
                  <Box
                    key={item.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center px-6 py-6 transition-colors hover:bg-slate-50/60 ${index < cartItems.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    {/* Product Info */}
                    <Box className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <Box className="relative shrink-0">
                        <Box className="w-20 h-20 md:w-[72px] md:h-[72px] bg-[#f0f2f5] rounded-2xl overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </Box>
                      </Box>
                      <Box className="flex-1 min-w-0">
                        <Typography className="font-bold text-slate-900 text-sm leading-snug mb-0.5 line-clamp-2">
                          {item.name}
                        </Typography>
                        <Box className="flex flex-wrap gap-1.5 mt-1.5">
                          <Chip
                            label={item.color}
                            size="small"
                            className="bg-slate-100 text-slate-500 font-semibold h-5 text-[10px] rounded-md"
                          />
                          <Chip
                            label={item.extra}
                            size="small"
                            className="bg-blue-50 text-blue-500 font-semibold h-5 text-[10px] rounded-md"
                          />
                        </Box>
                        {/* Mobile: price + total inline */}
                        <Box className="flex items-center justify-between mt-3 md:hidden">
                          <Typography className="text-slate-400 text-xs font-semibold">
                            ₵{(item.basePrice + item.extraPrice).toFixed(2)} each
                          </Typography>
                          <Typography className="font-black text-slate-900 text-sm">
                            ₵{((item.basePrice + item.extraPrice) * item.qty).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Unit Price (desktop) */}
                    <Box className="hidden md:flex col-span-2 justify-center">
                      <Typography className="font-semibold text-slate-500 text-sm">
                        ₵{(item.basePrice + item.extraPrice).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Quantity Controls + Mobile Delete */}
                    <Box className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center gap-3">
                      <Box className="flex items-center bg-[#f0f2f5] rounded-2xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors font-bold text-lg leading-none cursor-pointer bg-transparent border-none select-none"
                        >
                          −
                        </button>
                        <Typography className="font-black text-slate-900 text-sm w-7 text-center select-none">
                          {item.qty}
                        </Typography>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors font-bold text-lg leading-none cursor-pointer bg-transparent border-none select-none"
                        >
                          +
                        </button>
                      </Box>
                      {/* Delete — mobile only, inline with stepper */}
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        size="small"
                        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                        className=" text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    {/* Line Total — desktop only */}
                    <Box className="hidden md:flex col-span-2 justify-end items-center gap-3">
                      <Typography className="font-black text-slate-900 text-sm">
                        ₵{((item.basePrice + item.extraPrice) * item.qty).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Delete — desktop only */}
                    <Box className="hidden md:flex col-span-1 items-center justify-center">
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        size="small"
                        className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Promo Code */}
              <Box className="mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm px-6 py-5 flex items-center gap-3">
                <Box className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#f0f2f5] rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none border-none focus:ring-2 focus:ring-blue-100 tracking-widest"
                  />
                </Box>
                <Button
                  disableRipple
                  onClick={() => { if (promoCode) setPromoApplied(true); }}
                  variant={promoApplied ? 'outlined' : 'contained'}
                  className={`font-black normal-case rounded-2xl px-6 py-3 shadow-none text-sm shrink-0 ${promoApplied ? 'border-green-200 text-green-600 bg-green-50 hover:bg-green-50' : 'bg-slate-900 hover:bg-blue-600 text-white'}`}
                >
                  {promoApplied ? '✓ Applied' : 'Apply'}
                </Button>
              </Box>
            </Box>

            {/* ════════════════════════════════ */}
            {/* RIGHT — Order Summary            */}
            {/* ════════════════════════════════ */}
            <Box className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24">
              <Box className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Summary Header */}
                <Box className="px-6 pt-6 pb-4 border-b border-slate-50">
                  <Typography className="font-black text-slate-900 text-base">Order Summary</Typography>
                </Box>

                {/* Shipping Mode */}
                <Box className="px-6 pt-5 pb-4 border-b border-slate-50">
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">
                    Delivery method
                  </Typography>
                  <RadioGroup value={shippingMode} onChange={(e) => setShippingMode(e.target.value)}>
                    <Stack spacing={2}>

                      <Box
                        onClick={() => setShippingMode('pickup')}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMode === 'pickup' ? 'border-blue-500 bg-blue-50/60' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <StorefrontOutlinedIcon
                          fontSize="small"
                          className={shippingMode === 'pickup' ? 'text-blue-600' : 'text-slate-400'}
                        />
                        <Box className="flex-1">
                          <Typography className="font-bold text-slate-900 text-sm leading-none mb-0.5">
                            Store Pickup
                          </Typography>
                          <Typography className="text-slate-400 text-[11px] font-medium">Ready in ~20 min</Typography>
                        </Box>
                        <Typography className="font-black text-green-600 text-xs">FREE</Typography>
                        <Radio
                          value="pickup"
                          size="small"
                          className="p-0"
                          checkedIcon={<CheckCircleRoundedIcon className="text-blue-600" sx={{ fontSize: 18 }} />}
                          icon={<RadioButtonUncheckedRoundedIcon className="text-slate-300" sx={{ fontSize: 18 }} />}
                        />
                      </Box>

                      <Box
                        onClick={() => setShippingMode('delivery')}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMode === 'delivery' ? 'border-blue-500 bg-blue-50/60' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <LocalShippingOutlinedIcon
                          fontSize="small"
                          className={shippingMode === 'delivery' ? 'text-blue-600' : 'text-slate-400'}
                        />
                        <Box className="flex-1">
                          <Typography className="font-bold text-slate-900 text-sm leading-none mb-0.5">
                            Home Delivery
                          </Typography>
                          <Typography className="text-slate-400 text-[11px] font-medium">2–4 business days</Typography>
                        </Box>
                        <Typography className="font-black text-slate-900 text-xs">₵35</Typography>
                        <Radio
                          value="delivery"
                          size="small"
                          className="p-0"
                          checkedIcon={<CheckCircleRoundedIcon className="text-blue-600" sx={{ fontSize: 18 }} />}
                          icon={<RadioButtonUncheckedRoundedIcon className="text-slate-300" sx={{ fontSize: 18 }} />}
                        />
                      </Box>

                    </Stack>
                  </RadioGroup>
                </Box>

                {/* Price Breakdown */}
                <Box className="px-6 py-5">
                  <Stack spacing={3}>
                    <Box className="flex justify-between items-center">
                      <Typography className="text-slate-500 text-sm font-semibold">
                        Subtotal ({totalItems} items)
                      </Typography>
                      <Typography className="text-slate-900 text-sm font-bold">
                        ₵{subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    {promoApplied && (
                      <Box className="flex justify-between items-center">
                        <Typography className="text-green-600 text-sm font-semibold">
                          Promo ({promoCode})
                        </Typography>
                        <Typography className="text-green-600 text-sm font-bold">
                          −₵{discount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}

                    <Box className="flex justify-between items-center">
                      <Typography className="text-slate-500 text-sm font-semibold">Delivery</Typography>
                      <Typography className={`text-sm font-bold ${shippingCost === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {shippingCost === 0 ? 'Free' : `₵${shippingCost.toFixed(2)}`}
                      </Typography>
                    </Box>

                    <Divider className="border-slate-100" />

                    <Box className="flex justify-between items-center">
                      <Typography className="text-slate-900 font-black text-base">Total</Typography>
                      <Box className="text-right">
                        <Typography className="font-black text-blue-600 text-lg leading-none">
                          ₵{finalTotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                {/* CTA */}
                <Box className="px-6 pb-6">
                  <Button
                    component={Link} 
                    href="/checkout" 
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardRoundedIcon />}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm normal-case shadow-none transition-colors"
                  >
                    Checkout • ₵{finalTotal.toFixed(2)}
                  </Button>

                  {/* Trust badges */}
                  <Stack direction="row" spacing={2} className="mt-4 justify-center">
                    <Box className="flex items-center gap-1">
                      <LockOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                      <Typography className="text-[10px] text-slate-400 font-semibold">Secure checkout</Typography>
                    </Box>
                    <Box className="flex items-center gap-1">
                      <VerifiedOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
                      <Typography className="text-[10px] text-slate-400 font-semibold">Verified store</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>

          </Box>
        )}
      </Container>
      <Footer />
    </main>
  );
}
