import Link from 'next/link';
import { Container, Typography, Box, Button } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <Container maxWidth="sm" className="flex-1 flex flex-col items-center justify-center py-24 text-center">
        <Box className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
          <SearchOffRoundedIcon sx={{ fontSize: 36 }} className="text-slate-300" />
        </Box>
        <Typography className="font-black text-slate-900 text-3xl md:text-4xl tracking-tight mb-3">
          Page not found
        </Typography>
        <Typography className="text-slate-500 text-sm md:text-base mb-8 max-w-sm">
          The page you're looking for doesn't exist or may have been moved.
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <Button
              variant="contained"
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-8 py-3 shadow-none"
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button
              variant="outlined"
              className="border-slate-200 text-slate-900 hover:bg-slate-50 font-bold normal-case rounded-2xl px-8 py-3"
            >
              Browse Shop
            </Button>
          </Link>
        </Box>
      </Container>
      <Footer />
    </main>
  );
}