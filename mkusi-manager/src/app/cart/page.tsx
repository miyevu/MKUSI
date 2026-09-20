'use client';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, IconButton, Stack,
  Radio, RadioGroup, Divider, Chip, Skeleton, Grid
} from '@mui/material';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useProducts, getDiscountedPrice } from '@/context/ProductContext';

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

function CartSkeletonRow() {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-6 border-b border-slate-50 last:border-none">
      <Box className="col-span-1 md:col-span-5 flex items-center gap-4">
        <Skeleton variant="rounded" width={72} height={72} sx={{ borderRadius: '16px' }} />
        <Box className="flex-1">
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>
      <Box className="hidden md:flex col-span-2 justify-center">
        <Skeleton variant="text" width={50} height={20} />
      </Box>
      <Box className="col-span-1 md:col-span-2 flex justify-center">
        <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: '16px' }} />
      </Box>
      <Box className="hidden md:flex col-span-2 justify-end">
        <Skeleton variant="text" width={60} height={20} />
      </Box>
      <Box className="hidden md:flex col-span-1 justify-center">
        <Skeleton variant="circular" width={28} height={28} />
      </Box>
    </Box>
  );
}

export default function CartPage() {
  const { cartItems, cartLoading, products, updateCartQty, removeFromCart, storeSettings } = useProducts();
  const [shippingMode, setShippingMode] = useState('pickup');

  const resolvedItems = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      const { finalPrice, hasDiscount, originalPrice } = getDiscountedPrice(product);
      return { ...item, product, unitPrice: finalPrice, hasDiscount, originalPrice };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = resolvedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const shippingCost = shippingMode === 'delivery' ? storeSettings.deliveryFee : 0;
  const finalTotal = subtotal + shippingCost;
  const totalItems = resolvedItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartLoading) {
    return (
      <main className="bg-[#f8f9fb] min-h-screen flex flex-col w-full font-sans">
        <Navbar />
        <Container maxWidth="xl" className="px-4 md:px-8 py-8 md:py-12 flex-1">
          <Box className="mb-8 md:mb-10">
            <Skeleton variant="text" width={200} height={44} />
            <Skeleton variant="text" width={140} height={20} />
          </Box>

          <Box className="flex flex-col lg:flex-row gap-6 items-start">
            <Box className="w-full flex-1 min-w-0">
              <Box className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                <CartSkeletonRow />
                <CartSkeletonRow />
                <CartSkeletonRow />
              </Box>
            </Box>

            <Box className="w-full lg:w-[360px] shrink-0">
              <Box className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <Skeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={70} sx={{ borderRadius: '16px', mb: 2 }} />
                <Skeleton variant="rounded" height={70} sx={{ borderRadius: '16px', mb: 3 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={56} sx={{ borderRadius: '16px' }} />
              </Box>
            </Box>
          </Box>
        </Container>
        <Footer />
      </main>
    );
  }

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

        {resolvedItems.length === 0 ? (
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
                {resolvedItems.map((item, index) => (
                  <Box
                    key={item.productId}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center px-6 py-6 transition-colors hover:bg-slate-50/60 ${index < resolvedItems.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    {/* Product Info */}
                    <Box className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <Box className="relative shrink-0">
                        <Box className="w-20 h-20 md:w-[72px] md:h-[72px] bg-[#f0f2f5] rounded-2xl overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={item.product.image || 'https://via.placeholder.com/100'}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </Box>
                      </Box>
                      <Box className="flex-1 min-w-0">
                        <Typography className="font-bold text-slate-900 text-sm leading-snug mb-0.5 line-clamp-2">
                          {item.product.name}
                        </Typography>
                        <Box className="flex flex-wrap gap-1.5 mt-1.5">
                          {item.hasDiscount && (
                            <Chip
                              label="Discounted"
                              size="small"
                              className="bg-amber-50 text-amber-700 font-semibold h-5 text-[10px] rounded-md"
                            />
                          )}
                          <Chip
                            label={item.product.category}
                            size="small"
                            className="bg-blue-50 text-blue-500 font-semibold h-5 text-[10px] rounded-md"
                          />
                        </Box>
                        {/* Mobile: price + total inline */}
                        <Box className="flex items-center justify-between mt-3 md:hidden">
                          <Typography className="text-slate-400 text-xs font-semibold">
                            ₵{item.unitPrice.toFixed(2)} each
                          </Typography>
                          <Typography className="font-black text-slate-900 text-sm">
                            ₵{(item.unitPrice * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Unit Price (desktop) */}
                    <Box className="hidden md:flex col-span-2 flex-col items-center justify-center">
                      <Typography className="font-semibold text-slate-500 text-sm">
                        ₵{item.unitPrice.toFixed(2)}
                      </Typography>
                      {item.hasDiscount && (
                        <Typography className="text-slate-300 line-through text-[11px]">
                          ₵{item.originalPrice.toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {/* Quantity Controls + Mobile Delete */}
                    <Box className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center gap-3">
                      <Box className="flex items-center bg-[#f0f2f5] rounded-2xl overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.productId, -1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors font-bold text-lg leading-none cursor-pointer bg-transparent border-none select-none"
                        >
                          −
                        </button>
                        <Typography className="font-black text-slate-900 text-sm w-7 text-center select-none">
                          {item.quantity}
                        </Typography>
                        <button
                          onClick={() => updateCartQty(item.productId, 1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors font-bold text-lg leading-none cursor-pointer bg-transparent border-none select-none"
                        >
                          +
                        </button>
                      </Box>
                      {/* Delete — mobile only, inline with stepper */}
                      <IconButton
                        onClick={() => removeFromCart(item.productId)}
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
                        ₵{(item.unitPrice * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Delete — desktop only */}
                    <Box className="hidden md:flex col-span-1 items-center justify-center">
                      <IconButton
                        onClick={() => removeFromCart(item.productId)}
                        size="small"
                        className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
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
                        <Typography className="font-black text-slate-900 text-xs">₵{storeSettings.deliveryFee.toFixed(2)}</Typography>
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