'use client';
import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Define the shape of your item prop
interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  // We'll add these later when you build the context, 
  // but good to set up the skeleton now!
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <Stack direction="row" spacing={3} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative group">
      
      {/* Item Image */}
      <Box className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
      </Box>

      {/* Item Details */}
      <Box className="flex-1 flex flex-col justify-between py-1 pr-8">
        <Box>
          <Typography className="font-bold text-slate-900 leading-tight mb-1 text-sm line-clamp-2">
            {item.name}
          </Typography>
          <Typography className="font-black text-blue-600">
            ₵{item.price.toFixed(2)}
          </Typography>
        </Box>
        
        {/* Quantity Controls */}
        <Box className="flex items-center border border-slate-200 rounded-lg w-fit mt-2">
          <IconButton onClick={onDecrease} size="small" className="p-1 rounded-none text-slate-400">
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography className="px-3 font-bold text-xs">{item.quantity}</Typography>
          <IconButton onClick={onIncrease} size="small" className="p-1 rounded-none text-slate-400">
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Delete Button */}
      <IconButton 
        onClick={onRemove}
        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>

    </Stack>
  );
}