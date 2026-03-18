'use client';
import React from 'react';
import { Typography, Box, Button, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function WalletsTab() {
  return (
    <Box className="max-w-2xl animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Wallets & Payment
      </Typography>

      <Stack spacing={4}>
        {/* Mock Saved Mobile Money Account */}
        <Box className="p-6 border border-slate-200 rounded-3xl bg-white flex items-center justify-between group hover:border-blue-300 transition-colors cursor-pointer">
          <Box className="flex items-center gap-4">
            <Box className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-slate-900 text-xs tracking-tighter shadow-sm">
              MTN
            </Box>
            <Box>
              <Typography className="font-bold text-slate-900">MTN Mobile Money</Typography>
              <Typography className="text-slate-500 text-sm tracking-widest mt-0.5">•••• 4567</Typography>
            </Box>
          </Box>
          <IconButton className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Add New Payment Method */}
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          className="border-dashed border-2 border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-slate-400 rounded-3xl py-6 font-bold normal-case w-full"
        >
          Add new payment method
        </Button>
      </Stack>
    </Box>
  );
}