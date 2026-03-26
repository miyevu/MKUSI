'use client';
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Stack, InputAdornment, IconButton, Divider 
} from '@mui/material';
import Link from 'next/link';

// Icons
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // NEW: Admin state
  const [showPassword, setShowPassword] = useState(false);

  // Reusable custom input style to match your premium MKUSI theme
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1rem',
      backgroundColor: '#f8fafc', // slate-50
      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px', transition: 'all 0.2s' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: isAdmin ? '#0f172a' : '#2563eb', borderWidth: '2px' },
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-white font-sans overflow-hidden relative">
      
      {/* ========================================== */}
      {/* LEFT SIDE: CREATIVE BRANDING PANEL         */}
      {/* ========================================== */}
      <Box className={`hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden transition-colors duration-700 ${isAdmin ? 'bg-slate-900' : 'bg-[#0f172a]'}`}>
        {/* Ambient Glowing Blobs - Changes color in admin mode */}
        <Box className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 transition-colors duration-700 ${isAdmin ? 'bg-slate-700/30' : 'bg-blue-600/20'}`} />
        <Box className={`absolute bottom-0 left-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 transition-colors duration-700 ${isAdmin ? 'bg-slate-600/20' : 'bg-indigo-600/20'}`} />
        
        {/* Top Header */}
        <Box className="relative z-10 flex justify-between items-center">
          <Link href="/" className="no-underline">
            <Typography variant="h4" className="font-black text-white tracking-tighter">
              MKUSI {isAdmin && <span className="text-slate-400 font-medium text-lg ml-2">WORKSPACE</span>}
            </Typography>
          </Link>
        </Box>

        {/* Center Value Proposition */}
        <Box className="relative z-10 max-w-md">
          <Typography variant="h2" className="font-black text-white leading-[1.1] mb-6 tracking-tighter text-5xl">
            {isAdmin 
              ? "System Control." 
              : isLogin ? "Welcome back to premium." : "Unlock the full experience."}
          </Typography>
          <Typography className="text-slate-400 text-lg mb-8 leading-relaxed">
            {isAdmin 
              ? "Authenticate to access the MKUSI management dashboard, inventory controls, and order fulfillment system."
              : isLogin 
                ? "Sign in to access your orders, track deliveries, and view your exclusive wishlist." 
                : "Create an account to track orders, save your favorite accessories, and get exclusive member discounts."}
          </Typography>

          {/* Dynamic Trust Badges based on state */}
          {!isLogin && !isAdmin && (
            <Stack spacing={3} className="text-slate-300">
              <Box className="flex items-center gap-3">
                <CheckCircleRoundedIcon className="text-blue-500" />
                <Typography className="font-medium">Faster checkout on all devices</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <CheckCircleRoundedIcon className="text-blue-500" />
                <Typography className="font-medium">Exclusive early access to sales</Typography>
              </Box>
              <Box className="flex items-center gap-3">
                <CheckCircleRoundedIcon className="text-blue-500" />
                <Typography className="font-medium">Free shipping on orders over ₵1500</Typography>
              </Box>
            </Stack>
          )}
        </Box>

        {/* Bottom Footer */}
        <Typography className="relative z-10 text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} MKUSI Accessories. All rights reserved.
        </Typography>
      </Box>

      {/* ========================================== */}
      {/* RIGHT SIDE: INTERACTIVE FORM               */}
      {/* ========================================== */}
      <Box className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
        
        {/* Mobile-only Back Button & Logo */}
        <Box className="lg:hidden absolute top-6 left-6 right-6 flex justify-between items-center">
          <Link href="/" className="no-underline">
            <Typography variant="h5" className="font-black tracking-tighter text-slate-900">
              MKUSI {isAdmin && <span className="text-slate-400 text-sm">WORKSPACE</span>}
            </Typography>
          </Link>
        </Box>

        <Box className="w-full max-w-md">
          
          {/* Custom Toggle Switch - Hides if in Admin Mode */}
          {!isAdmin && (
            <Box className="flex p-1 bg-slate-100 rounded-full mb-10 border border-slate-200/60">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition-all duration-300 ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition-all duration-300 ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Create Account
              </button>
            </Box>
          )}

          <Box className={`mb-8 ${isAdmin ? 'mt-10' : ''}`}>
            {isAdmin && (
              <Box className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <AdminPanelSettingsOutlinedIcon className="text-slate-900" />
              </Box>
            )}
            <Typography variant="h4" className="font-black text-slate-900 mb-2 tracking-tight">
              {isAdmin ? "Admin Portal" : isLogin ? "Sign in to MKUSI" : "Create your account"}
            </Typography>
            <Typography className="text-slate-500 text-sm font-medium">
              {isAdmin ? "Enter your master credentials to proceed." : isLogin ? "Enter your details to access your account." : "Join us to get the best premium accessories."}
            </Typography>
          </Box>

          {/* The Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={3}>
              
              {/* Only show Name fields if signing up AND not admin */}
              {!isLogin && !isAdmin && (
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth placeholder="First Name" variant="outlined" sx={inputStyles} />
                  <TextField fullWidth placeholder="Last Name" variant="outlined" sx={inputStyles} />
                </Stack>
              )}

              <TextField 
                fullWidth 
                placeholder={isAdmin ? "Admin Email / ID" : "Email address"} 
                type="email"
                variant="outlined" 
                sx={inputStyles} 
              />
              
              <Box>
                <TextField 
                  fullWidth 
                  placeholder="Password" 
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined" 
                  sx={inputStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" className="text-slate-400">
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {(isLogin || isAdmin) && (
                  <Box className="flex justify-end mt-2">
                    <Link href="#" className={`text-xs font-bold no-underline transition-colors ${isAdmin ? 'text-slate-500 hover:text-slate-900' : 'text-blue-600 hover:text-blue-700'}`}>
                      {isAdmin ? "Forgot master password?" : "Forgot password?"}
                    </Link>
                  </Box>
                )}
              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                className={`text-white py-4 rounded-2xl font-black text-base normal-case shadow-none transition-all mt-2 ${isAdmin ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-slate-900'}`}
              >
                {isAdmin ? "Access Dashboard" : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </Stack>
          </form>

          {/* Social Logins - Hidden on Admin */}
          {!isAdmin && (
            <Box className="mt-10">
              <Divider className="text-slate-400 text-xs font-bold uppercase tracking-widest before:border-slate-100 after:border-slate-100 pb-6">
                Or continue with
              </Divider>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-3 rounded-2xl font-bold normal-case text-sm shadow-none"
                >
                  Google
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AppleIcon className="text-slate-900" />}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-3 rounded-2xl font-bold normal-case text-sm shadow-none"
                >
                  Apple
                </Button>
              </Stack>
            </Box>
          )}

          {/* Admin Toggle Link */}
          <Box className={`text-center ${isAdmin ? 'mt-12' : 'mt-10'}`}>
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer bg-transparent border-none outline-none"
            >
              {isAdmin ? "← Back to Customer Login" : "Staff & Admin Access"}
            </button>
          </Box>

        </Box>
      </Box>
    </main>
  );
}