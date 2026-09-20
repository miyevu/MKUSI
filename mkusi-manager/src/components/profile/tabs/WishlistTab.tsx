'use client';
import React from 'react';
import { Typography, Box, Button, Grid, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistTab() {
  const { products, wishlist, wishlistLoading } = useProducts();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistLoading) {
    return (
      <Box className="animate-fade-in flex flex-col items-center justify-center py-20">
        <CircularProgress size={26} sx={{ color: '#2563eb', mb: 2 }} />
        <Typography className="text-slate-400 text-sm font-medium">Loading your wishlist...</Typography>
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Wishlist
      </Typography>

      {wishlistedProducts.length === 0 ? (
        <Box className="p-16 border border-slate-200 rounded-3xl bg-slate-50 text-center flex flex-col items-center">
          <Box className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6">
            <FavoriteBorderIcon sx={{ fontSize: 32 }} className="text-red-400" />
          </Box>
          <Typography variant="h6" className="font-bold text-slate-900 mb-2">
            Your wishlist is empty
          </Typography>
          <Typography className="text-slate-500 text-sm mb-8 max-w-sm">
            Save your favorite accessories here to easily find them later or share them with friends.
          </Typography>
          <Button
            component={Link}
            href="/shop"
            variant="contained"
            className="bg-slate-900 hover:bg-blue-600 text-white rounded-full font-bold normal-case px-8 py-2.5 shadow-none"
          >
            Explore Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlistedProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 4 }}>
              <ProductCard {...product} viewMode="grid" />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}