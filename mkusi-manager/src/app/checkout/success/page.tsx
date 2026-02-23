'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CheckIcon from '@mui/icons-material/Check';

export default function SuccessPage() {
  const router = useRouter();
  
  // State to hold the securely retrieved data
  const [orderId, setOrderId] = useState<string | null>(null);
  const [name, setName] = useState<string>('there');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Grab the hidden data from sessionStorage when the page loads
    const storedId = sessionStorage.getItem('mkusi_order_id');
    const storedName = sessionStorage.getItem('mkusi_customer_name');

    // 2. If it exists, set it. If not, generate a fallback.
    if (storedId) {
      setOrderId(storedId);
    } else {
      const part1 = Math.floor(1000 + Math.random() * 9000); 
      const part2 = Math.floor(1000 + Math.random() * 9000); 
      setOrderId(`MK-${part1}-${part2}`);
    }

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const sendWhatsApp = () => {
    const managerNumber = "233XXXXXXXXX"; // Replace with your actual WhatsApp number
    const message = `Hello MKUSI Team! 👋%0A%0AI just placed an order for some accessories and wanted to confirm my delivery.%0A%0A*Order ID:* ${orderId}%0A*Name:* ${name}%0A%0AThank you!`;
    window.open(`https://wa.me/${managerNumber}?text=${message}`, '_blank');
  };

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show a clean loading state for a split second while grabbing the session data
  if (!orderId) {
    return (
      <main className="bg-[#fafafa] min-h-screen flex items-center justify-center">
        <Box className="flex flex-col items-center justify-center h-screen">
          <Box className="w-12 h-12 border-4 border-slate-200 border-t-[#25D366] rounded-full animate-spin mb-4" />
          <Typography className="font-bold text-slate-400 uppercase tracking-widest text-xs">
            Finalizing Order...
          </Typography>
        </Box>
      </main>
    );
  }

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <Container maxWidth="sm" className="py-16 md:py-24 flex flex-col items-center">
        
        {/* Animated Success Icon */}
        <Box className="relative mb-8 flex justify-center items-center">
          <Box className="absolute w-32 h-32 bg-green-100 rounded-full animate-ping opacity-60"></Box>
          <Box className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-green-100/50">
            <CheckCircleIcon sx={{ fontSize: 64 }} className="text-[#25D366]" />
          </Box>
        </Box>

        {/* Hero Typography */}
        <Typography variant="h3" className="font-black text-slate-900 mb-3 text-center tracking-tight leading-none">
          Order Confirmed!
        </Typography>
        <Typography className="text-slate-500 pb-3 text-center text-lg max-w-sm leading-relaxed">
          Thank you, <span className="font-bold text-slate-900">{name}</span>. Your order has been securely recorded.
        </Typography>

        {/* Clean Receipt Block */}
        <Paper elevation={0} className="w-full bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm relative overflow-hidden">
          <Box className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box className="flex items-center gap-3">
              <Box className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                <LocalMallOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" className="font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                  Order Number
                </Typography>
                <Typography variant="h6" className="font-black text-slate-900 leading-none tracking-tight">
                  #{orderId}
                </Typography>
              </Box>
            </Box>
            
            <Button 
              onClick={copyOrderId}
              className={`min-w-0 p-2 rounded-xl transition-all duration-300 ${
                copied 
                  ? 'bg-green-50 text-green-600 px-3' 
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1 text-xs font-bold">
                  <CheckIcon fontSize="small" /> Copied
                </span>
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </Button>
          </Stack>
        </Paper>

        {/* VIP WhatsApp Fast-Track Card */}
        <Paper elevation={0} className="w-full p-8 rounded-[2rem] border-2 border-[#25D366]/20 bg-[#25D366]/[0.03] mb-10 relative overflow-hidden">
          <Box className="absolute -top-10 -right-10 w-40 h-40 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
          
          <Box className="relative z-10 text-center">
            <Box className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#25D366]/20 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              <Typography variant="caption" className="font-black uppercase tracking-widest text-[#25D366]">
                Priority Delivery
              </Typography>
            </Box>
            
            <Typography variant="h6" className="font-black text-slate-900 mb-2">
              Want your order faster?
            </Typography>
            <Typography className="text-slate-600 text-sm pb-4 leading-relaxed px-4">
              Skip the waiting line. Send your order ID directly to our dispatch team on WhatsApp to arrange immediate delivery.
            </Typography>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<WhatsAppIcon sx={{ fontSize: 24 }} />}
              onClick={sendWhatsApp}
              className="bg-[#25D366] hover:bg-[#20bd5a] py-4 rounded-2xl font-black shadow-lg shadow-[#25D366]/30 text-white normal-case text-lg transition-all duration-300 hover:-translate-y-1"
            >
              Chat with MKUSI
            </Button>
          </Box>
        </Paper>

        {/* Back Navigation */}
        <Button 
          variant="text" 
          startIcon={<KeyboardBackspaceIcon />}
          className="text-slate-500 font-bold hover:bg-slate-50 py-3 px-6 rounded-xl normal-case transition-colors"
          onClick={() => {
            // Optional: Clear the session storage so they don't see the same receipt if they somehow click back
            sessionStorage.removeItem('mkusi_order_id');
            sessionStorage.removeItem('mkusi_customer_name');
            router.push('/shop');
          }}
        >
          Continue Shopping
        </Button>

      </Container>
    </main>
  );
}