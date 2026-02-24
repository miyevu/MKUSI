'use client';
import React from 'react';
import { Container, Grid, Typography, Box, Stack, TextField, Button, IconButton, Divider } from '@mui/material';
import Link from 'next/link';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  return (
    <Box className="bg-[#0f172a] text-slate-300 pt-16 pb-10 mt-20 relative overflow-hidden">

      <Container maxWidth="xl" className="relative z-10">
        
        {/* NEWSLETTER SECTION */}
        <Box className="bg-blue-600 rounded-[2rem] p-10 md:p-16 mb-20 relative overflow-hidden shadow-2xl shadow-blue-900/50">  
          {/* 1. The Content Grid (Pushed to the front with relative z-10) */}
          <Grid container alignItems="center" spacing={4} className="relative z-10">
            
            {/* Text Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" className="font-black text-white mb-4">
                Stay in the loop.
              </Typography>
              <Typography className="text-blue-100 text-lg max-w-md">
                Join 15,000+ tech lovers. Get exclusive offers and first access to new drops.
              </Typography>
            </Grid>
            
            {/* Input Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField 
                  fullWidth 
                  placeholder="Enter your email address"
                  variant="outlined"
                  className="bg-white/10 rounded-xl backdrop-blur-sm"
                  sx={{ 
                    input: { color: 'white' }, 
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' } 
                  }}
                />
                <Button 
                  variant="contained" 
                  size="large"
                  endIcon={<SendIcon />}
                  className="bg-white text-blue-600 font-black py-4 px-8 rounded-xl hover:bg-blue-50 whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </Stack>
            </Grid>
          </Grid>
          
          {/* 2. Abstract Circle Decoration (Pushed to the back with z-0 pointer-events-none) */}
          <Box className="absolute -right-20 -bottom-40 w-80 h-80 border-[20px] border-white/10 rounded-full z-0 pointer-events-none" />
        </Box>


        {/* MAIN FOOTER LINKS */}
        <Grid container spacing={8}>
          
          {/* Brand Column */}
          <Grid size={{ xs: 12, md:4 }}>
            <Box className="mb-4 flex items-center gap-2">
              <Box className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white">M</Box>
              <Typography variant="h5" className="font-black text-white tracking-tight">MKUSI</Typography>
            </Box>
            <Typography className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              We craft premium accessories for the modern nomad. Designed in Accra, built for the world. Quality you can feel, speed you can trust.
            </Typography>
            <Stack direction="row" spacing={2}>
              {[
                { icon: <InstagramIcon />, url: "https://instagram.com/yourprofile" },
                { icon: <TwitterIcon />, url: "https://twitter.com/yourprofile" },
                { icon: <FacebookIcon />, url: "https://facebook.com/yourprofile" },
                { 
                  icon: <WhatsAppIcon />, 
                  url: "https://wa.me/233543391481?text=Hi%20I%20want%20to%20make%20enquiries%20on%20" 
                },
              ].map((social, i) => (
                <IconButton 
                  key={i} 
                  component="a" 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-blue-600 hover:scale-110 transition-all duration-300 rounded-xl"
                  sx={{ color: 'whitesmoke' }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Links Column 1 */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography className="font-bold text-white mb-6 uppercase tracking-wider text-sm pb-2">Shop</Typography>
            <Stack spacing={2}>
              {['All Products', 'New Arrivals', 'Best Sellers', 'Flash Sales', 'Gift Cards'].map(item => (
                <Link key={item} href="#" className="no-underline text-slate-400 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Links Column 2 */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography className="font-bold text-white mb-6 uppercase tracking-wider text-sm pb-2">Support</Typography>
            <Stack spacing={2}>
              {['Help Center', 'Shipping Info', 'Returns & Exchange', 'Warranty', 'Contact Us'].map(item => (
                <Link key={item} href="#" className="no-underline text-slate-400 hover:text-white transition-colors text-sm">
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Column */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Typography className="font-bold text-white mb-6 uppercase tracking-wider text-sm pb-2">Contact</Typography>
            <Stack spacing={3}>
              <Box className="flex gap-3">
                <LocationOnIcon className="text-blue-500" />
                <Typography className="text-sm text-slate-400">
                  MKUSI HQ, East Legon,<br/>Accra, Ghana
                </Typography>
              </Box>
              <Box className="flex gap-3">
                <PhoneIcon className="text-blue-500" />
                <Typography className="text-sm text-slate-400">+233 54 123 4567</Typography>
              </Box>
              <Box className="flex gap-3">
                <EmailIcon className="text-blue-500" />
                <Typography className="text-sm text-slate-400">support@mkusi.com</Typography>
              </Box>
            </Stack>
          </Grid>

        </Grid>

        <Divider className="my-10 border-slate-800 pt-4" />

        {/* BOTTOM BAR */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography className="text-xs text-slate-500">
            © 2026 MKUSI Inc. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={4}>
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(text => (
              <Link key={text} href="#" className="no-underline text-xs text-slate-500 hover:text-white">
                {text}
              </Link>
            ))}
          </Stack>
        </Stack>
        
      </Container>
    </Box>
  );
}