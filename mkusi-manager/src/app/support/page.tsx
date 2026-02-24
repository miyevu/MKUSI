'use client';
import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, Paper, Accordion, 
  AccordionSummary, AccordionDetails, TextField, Button, Stack 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function SupportPage() {
  const [formStatus, setFormStatus] = useState('');

  const faqs = [
    { q: "How long does delivery take?", a: "Within Accra, we deliver in 24 hours. Outside Accra usually takes 2-3 working days." },
    { q: "Do you offer a warranty on accessories?", a: "Yes, all MKUSI premium accessories come with a 6-month limited warranty against manufacturing defects." },
    { q: "Can I return a product?", a: "Items can be returned within 7 days if they are unused and in original packaging." },
    { q: "Do you have a physical shop?", a: "We currently operate primarily online to keep prices low, but we have pick-up points in East Legon and Osu." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Message sent! We will get back to you soon.');
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* HERO SECTION */}
      <Box className="bg-blue-600 py-16 text-center text-white">
        <Container maxWidth="md">
          <Typography variant="h3" className="font-black mb-4 tracking-tighter">
            How can we help?
          </Typography>
          <Typography variant="h6" className="opacity-90 font-medium">
            Everything you need to know about your MKUSI experience.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" className="py-12 px-6">
        <Grid container spacing={6}>
          
          {/* 1. FAQ SECTION */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h5" className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <HelpOutlineIcon className="text-blue-600" /> Frequently Asked Questions
            </Typography>
            {faqs.map((faq, index) => (
              <Accordion key={index} elevation={0} className="mb-3 rounded-2xl border border-slate-100 before:hidden overflow-hidden">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="font-bold text-slate-700">{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-slate-50">
                  <Typography className="text-slate-600 text-sm leading-relaxed">{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          {/* 2. CONTACT & FORM SECTION */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              {/* Contact Info Card */}
              <Paper elevation={0} className="p-6 rounded-[2rem] border border-slate-100 bg-white">
                <Typography variant="h6" className="font-black mb-4">Direct Contact</Typography>
                <Stack spacing={2}>
                  <Box className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <WhatsAppIcon className="text-green-600" />
                    <Box>
                      <Typography className="text-[10px] uppercase font-black text-green-700">WhatsApp Us</Typography>
                      <Typography className="font-bold">+233 24 000 0000</Typography>
                    </Box>
                  </Box>
                  <Box className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <EmailIcon className="text-blue-600" />
                    <Box>
                      <Typography className="text-[10px] uppercase font-black text-blue-700">Email Support</Typography>
                      <Typography className="font-bold">support@mkusi.com</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              {/* Support Form */}
              <Paper elevation={0} className="p-8 rounded-[2rem] border border-slate-100 bg-white">
                <Typography variant="h6" className="font-black mb-4">Send us a message</Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField fullWidth label="Your Name" variant="outlined" size="small" required className="bg-slate-50" />
                    <TextField fullWidth label="Order ID (Optional)" variant="outlined" size="small" className="bg-slate-50" />
                    <TextField fullWidth label="What's the issue?" variant="outlined" multiline rows={4} required className="bg-slate-50" />
                    
                    {formStatus ? (
                      <Typography className="text-green-600 font-bold text-sm text-center">{formStatus}</Typography>
                    ) : (
                      <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        className="bg-black text-white rounded-full py-3 font-bold normal-case shadow-none hover:bg-slate-800"
                      >
                        Submit Request
                      </Button>
                    )}
                  </Stack>
                </form>
              </Paper>
            </Stack>
          </Grid>

        </Grid>
      </Container>

      <Footer />
    </main>
  );
}