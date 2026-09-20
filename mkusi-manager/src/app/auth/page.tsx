'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Stack, InputAdornment, IconButton, Divider, Alert
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

export default function AuthPage() {
  const router = useRouter();
  const { currentUser, signupWithPassword, loginWithPassword, loginWithGoogle, requestAdminOtp, verifyAdminOtp } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const [adminEmail, setAdminEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Fires whenever a session appears while sitting on this page — covers
  // password login/signup, Google's hash-fragment redirect back to /auth,
  // and a logged-in user manually navigating to /auth.
  useEffect(() => {
    if (currentUser) {
      router.push(currentUser.isAdmin ? '/admin' : '/');
    }
  }, [currentUser, router]);

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1rem',
      backgroundColor: '#f8fafc',
      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px', transition: 'all 0.2s' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: isAdmin ? '#0f172a' : '#2563eb', borderWidth: '2px' },
    }
  };

  const resetAdminFlow = () => {
    setOtpSent(false);
    setOtpCode('');
    setAdminEmail('');
    setError('');
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await requestAdminOtp(adminEmail);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Could not send code.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyAdminOtp(adminEmail, otpCode);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid or expired code.');
      return;
    }
    // No need to router.push here — the useEffect above handles it
    // once currentUser updates from the verified session.
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await loginWithPassword(form.email, form.password);
      setLoading(false);
      if (!result.success) { setError(result.error || 'Login failed.'); return; }
      // useEffect handles redirect
    } else {
      const result = await signupWithPassword(form);
      setLoading(false);
      if (!result.success) { setError(result.error || 'Sign up failed.'); return; }
      // useEffect handles redirect
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google sign-in failed.');
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-white font-sans overflow-hidden relative">
      
      <Box className={`hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden transition-colors duration-700 ${isAdmin ? 'bg-slate-900' : 'bg-[#0f172a]'}`}>
        <Box className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 transition-colors duration-700 ${isAdmin ? 'bg-slate-700/30' : 'bg-blue-600/20'}`} />
        <Box className={`absolute bottom-0 left-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 transition-colors duration-700 ${isAdmin ? 'bg-slate-600/20' : 'bg-indigo-600/20'}`} />
        
        <Box className="relative z-10 flex justify-between items-center">
          <Link href="/" className="no-underline">
            <Typography variant="h4" className="font-black text-white tracking-tighter">
              MKUSI {isAdmin && <span className="text-slate-400 font-medium text-lg ml-2">WORKSPACE</span>}
            </Typography>
          </Link>
        </Box>

        <Box className="relative z-10 max-w-md">
          <Typography variant="h2" className="font-black text-white leading-[1.1] mb-6 tracking-tighter text-5xl">
            {isAdmin 
              ? "System Control." 
              : isLogin ? "Welcome back to premium." : "Unlock the full experience."}
          </Typography>
          <Typography className="text-slate-400 text-lg mb-8 leading-relaxed">
            {isAdmin 
              ? "Enter your admin email to receive a secure one-time login code."
              : isLogin 
                ? "Sign in to access your orders, track deliveries, and view your exclusive wishlist." 
                : "Create an account to track orders, save your favorite accessories, and get exclusive member discounts."}
          </Typography>

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

        <Typography className="relative z-10 text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} MKUSI Accessories. All rights reserved.
        </Typography>
      </Box>

      <Box className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
        
        <Box className="lg:hidden absolute top-6 left-6 right-6 flex justify-between items-center">
          <Link href="/" className="no-underline">
            <Typography variant="h5" className="font-black tracking-tighter text-slate-900">
              MKUSI {isAdmin && <span className="text-slate-400 text-sm">WORKSPACE</span>}
            </Typography>
          </Link>
        </Box>

        <Box className="w-full max-w-md">
          
          {!isAdmin && (
            <Box className="flex p-1 bg-slate-100 rounded-full mb-10 border border-slate-200/60">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-3 rounded-full font-bold text-sm transition-all duration-300 ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
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
              {isAdmin
                ? (otpSent ? "Enter the 8-digit code sent to your email." : "Enter your admin email to receive a login code.")
                : isLogin ? "Enter your details to access your account." : "Join us to get the best premium accessories."}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 3, fontWeight: 600 }}>
              {error}
            </Alert>
          )}

          {isAdmin ? (
            !otpSent ? (
              <form onSubmit={handleRequestOtp}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="Admin email"
                    type="email"
                    variant="outlined"
                    sx={inputStyles}
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><MailOutlineRoundedIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-base normal-case shadow-none transition-all mt-2"
                  >
                    {loading ? 'Sending...' : 'Send Login Code'}
                  </Button>
                </Stack>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="8-digit code"
                    variant="outlined"
                    sx={inputStyles}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    inputProps={{ inputMode: 'numeric', maxLength: 8 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-base normal-case shadow-none transition-all"
                  >
                    {loading ? 'Verifying...' : 'Verify & Access Dashboard'}
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    fullWidth
                    onClick={resetAdminFlow}
                    className="text-slate-500 font-bold normal-case text-sm"
                  >
                    Use a different email
                  </Button>
                </Stack>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleCustomerSubmit}>
                <Stack spacing={3}>
                  {!isLogin && (
                    <Stack direction="row" spacing={2}>
                      <TextField 
                        fullWidth placeholder="First Name" variant="outlined" sx={inputStyles}
                        value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                      />
                      <TextField 
                        fullWidth placeholder="Last Name" variant="outlined" sx={inputStyles}
                        value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                      />
                    </Stack>
                  )}

                  <TextField 
                    fullWidth 
                    placeholder="Email address" 
                    type="email"
                    variant="outlined" 
                    sx={inputStyles} 
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                  
                  <Box>
                    <TextField 
                      fullWidth 
                      placeholder="Password" 
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined" 
                      sx={inputStyles}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
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
                  </Box>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    disabled={loading}
                    className="text-white py-4 rounded-2xl font-black text-base normal-case shadow-none transition-all mt-2 bg-blue-600 hover:bg-slate-900"
                  >
                    {loading ? 'Please wait...' : isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </Stack>
              </form>

              <Box className="mt-10">
                <Divider className="text-slate-400 text-xs font-bold uppercase tracking-widest before:border-slate-100 after:border-slate-100 pb-6">
                  Or continue with
                </Divider>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={handleGoogleLogin}
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
                    disabled
                  >
                    Apple
                  </Button>
                </Stack>
              </Box>
            </>
          )}

          <Box className={`text-center ${isAdmin ? 'mt-12' : 'mt-10'}`}>
            <button 
              type="button"
              onClick={() => { setIsAdmin(!isAdmin); setError(''); resetAdminFlow(); }}
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