'use client';
import React, { useState } from 'react';
import { Typography, Box, Avatar, Button, Stack, TextField } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function EditProfileTab() {
  const [form, setForm] = useState({
    username: 'lawrencemkusi',
    name: 'Lawrence Mkusi',
    bio: "I've come back for you... to remind you of something. Something you once knew...",
  });

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
        Edit profile
      </Typography>

      <Stack direction="row" alignItems="center" spacing={3} className="mb-10">
        <Avatar 
          className="w-20 h-20"
          sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%, #a1c4fd 100%)' }}
        />
        <Button 
          startIcon={<SyncIcon />} 
          className="text-blue-600 font-bold normal-case text-sm hover:bg-blue-50 rounded-lg px-4 py-2"
        >
          Change profile photo
        </Button>
      </Stack>

      <Stack spacing={4}>
        <Box>
          <Typography className="text-sm font-bold text-slate-900 mb-1">Username<span className="text-red-500">*</span></Typography>
          <TextField 
            fullWidth variant="outlined" value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
            sx={inputStyles}
          />
          <Typography className="text-xs font-bold text-green-600 mt-1 ml-1">Available</Typography>
        </Box>

        <Box>
          <Typography className="text-sm font-bold text-slate-900 mb-1">Name</Typography>
          <TextField 
            fullWidth variant="outlined" value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            sx={inputStyles}
          />
        </Box>

        <Box>
          <Typography className="text-sm font-bold text-slate-900 mb-1">Bio</Typography>
          <TextField 
            fullWidth multiline rows={4} variant="outlined" value={form.bio}
            onChange={(e) => {
              if (e.target.value.length <= 250) setForm({...form, bio: e.target.value})
            }}
            sx={inputStyles}
          />
          <Typography className="text-xs text-slate-500 text-right mt-1">
            ({form.bio.length}/250)
          </Typography>
        </Box>

        <Box>
          <Typography className="text-sm font-bold text-slate-900 mb-2">Twitter</Typography>
          <Button 
            startIcon={<TwitterIcon className="text-slate-900" />}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold normal-case rounded-full px-6 py-2.5 shadow-none w-max"
          >
            Connect Twitter account
          </Button>
        </Box>

        <Box className="pt-4">
          <Button 
            variant="contained" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-full px-8 py-3 shadow-none w-max"
          >
            Update Profile
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}