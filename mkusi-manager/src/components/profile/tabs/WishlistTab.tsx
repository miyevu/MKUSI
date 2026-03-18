'use client';
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function WishlistTab() {
  return (
    <Box className="animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Wishlist
      </Typography>
      
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
          variant="contained" 
          className="bg-slate-900 hover:bg-blue-600 text-white rounded-full font-bold normal-case px-8 py-2.5 shadow-none"
        >
          Explore Products
        </Button>
      </Box>
    </Box>
  );
}