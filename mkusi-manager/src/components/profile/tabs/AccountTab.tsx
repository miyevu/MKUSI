'use client';
import React, { useState } from 'react';
import { Typography, Box, Stack, Divider, Switch, Button, TextField } from '@mui/material';

export default function AccountTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
    },
  };

  return (
    <Box className="max-w-2xl animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Account Settings
      </Typography>

      {/* Security Section */}
      <Box className="p-6 border border-slate-200 rounded-3xl bg-slate-50 mb-8">
        <Typography className="font-bold text-slate-900 mb-6">Change Password</Typography>
        <Stack spacing={4}>
          <TextField 
            fullWidth type="password" label="Current Password" variant="outlined" 
            sx={inputStyles}
          />
          <TextField 
            fullWidth type="password" label="New Password" variant="outlined" 
            sx={inputStyles}
          />
          <Button variant="contained" className="bg-slate-900 hover:bg-slate-800 text-white font-bold normal-case rounded-full px-8 py-3 shadow-none w-max">
            Update Password
          </Button>
        </Stack>
      </Box>

      {/* Notifications Section */}
      <Box className="p-6 border border-slate-200 rounded-3xl bg-slate-50">
        <Typography className="font-bold text-slate-900 mb-6">Notification Preferences</Typography>
        
        <Box className="flex justify-between items-center mb-4">
          <Box>
            <Typography className="font-bold text-slate-900 text-sm">Order Updates via Email</Typography>
            <Typography className="text-slate-500 text-xs mt-0.5">Receive receipts and tracking links</Typography>
          </Box>
          <Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} color="primary" />
        </Box>
        
        <Divider className="my-4 border-slate-200" />
        
        <Box className="flex justify-between items-center">
          <Box>
            <Typography className="font-bold text-slate-900 text-sm">Promotional SMS</Typography>
            <Typography className="text-slate-500 text-xs mt-0.5">Get texted about flash sales and VIP discounts</Typography>
          </Box>
          <Switch checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} color="primary" />
        </Box>
      </Box>

    </Box>
  );
}