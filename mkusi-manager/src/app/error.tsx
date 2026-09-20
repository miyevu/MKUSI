'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Container, Typography, Box, Button } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <Container maxWidth="sm" className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <Box className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
          <ErrorOutlineRoundedIcon sx={{ fontSize: 36 }} className="text-red-400" />
        </Box>
        <Typography className="font-black text-slate-900 text-3xl md:text-4xl tracking-tight mb-3">
          Something went wrong
        </Typography>
        <Typography className="text-slate-500 text-sm md:text-base mb-8 max-w-sm">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={reset}
            variant="contained"
            startIcon={<RefreshRoundedIcon />}
            className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-8 py-3 shadow-none"
          >
            Try Again
          </Button>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            className="border-slate-200 text-slate-900 hover:bg-slate-50 font-bold normal-case rounded-2xl px-8 py-3"
          >
            Back to Home
          </Button>
        </Box>
      </Container>
      <Footer />
    </main>
  );
}