'use client';
import { useSearchParams } from 'next/navigation';
import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const name = searchParams.get('name');

  const sendWhatsApp = () => {
    const managerNumber = "233XXXXXXXXX"; // Friend's number
    const message = `Hello MKUSI! I just placed an order.%0A*Order ID:* ${orderId}%0A*Name:* ${name}%0A%0APlease confirm my delivery!`;
    window.open(`https://wa.me/${managerNumber}?text=${message}`, '_blank');
  };

  return (
    <Container maxWidth="sm" className="py-20 text-center">
      <CheckCircleIcon className="text-green-500 text-8xl mb-6" />
      <Typography variant="h3" className="font-black text-slate-900 mb-2">Order Received!</Typography>
      <Typography className="text-slate-500 mb-8 text-lg">
        Thank you, {name}. Your order **{orderId}** has been recorded.
      </Typography>

      <Paper className="p-8 rounded-3xl border border-blue-100 bg-blue-50 mb-8">
        <Typography className="font-bold text-blue-900 mb-4">
          Want faster delivery?
        </Typography>
        <Typography className="text-blue-700 text-sm mb-6">
          Send your order ID to us on WhatsApp to chat directly with our delivery team.
        </Typography>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<WhatsAppIcon />}
          onClick={sendWhatsApp}
          className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold shadow-lg shadow-green-100 text-white"
        >
          Chat with MKUSI on WhatsApp
        </Button>
      </Paper>

      <Link href="/" className="no-underline">
        <Button variant="text" className="text-slate-500 font-bold">Back to Home</Button>
      </Link>
    </Container>
  );
}