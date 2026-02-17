'use client';
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Stack, 
  Divider, Grid, IconButton, Accordion, AccordionSummary, AccordionDetails, Fade 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const PRODUCT_DATA = {
  id: 1,
  name: "15000mAh Solar Power Bank with 2.1A USB Port & Led Light",
  price: 510.00,
  sku: "SOLARBANK-15.BLACK",
  delivery: "Estimated delivery: 3 days",
  description: "High-capacity solar power bank designed for rugged outdoor use. Features dual USB charging and an integrated LED flashlight for emergency situations.",
  specs: "Battery Capacity: 15000mAh | Input: 5V/2A | Output: 5V/2.1A | Solar Panel: 1.5W",
  images: [
    "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80"
  ]
};

// Expanded list for better scrolling experience
const RELATED_PRODUCTS = [
  { id: 101, name: 'MagSafe Battery Pack', price: 850, category: 'Accessories', image: 'https://images.unsplash.com/photo-1625244506325-1393693a109a?w=500' },
  { id: 102, name: 'Fast Charger 20W', price: 120, category: 'Charger', image: 'https://images.unsplash.com/photo-1619145103073-776269601438?w=500' },
  { id: 103, name: 'Drou Watch Ultra', price: 450, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: 104, name: 'JBL Go 3 Speaker', price: 480, category: 'Mini Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
  { id: 105, name: 'MagSafe Battery Pack', price: 850, category: 'Accessories', image: 'https://images.unsplash.com/photo-1625244506325-1393693a109a?w=500' },
  { id: 106, name: 'Fast Charger 20W', price: 120, category: 'Charger', image: 'https://images.unsplash.com/photo-1619145103073-776269601438?w=500' },
  { id: 107, name: 'Drou Watch Ultra', price: 450, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: 108, name: 'JBL Go 3 Speaker', price: 480, category: 'Mini Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
  { id: 109, name: 'MagSafe Battery Pack', price: 850, category: 'Accessories', image: 'https://images.unsplash.com/photo-1625244506325-1393693a109a?w=500' },
  { id: 110, name: 'Fast Charger 20W', price: 120, category: 'Charger', image: 'https://images.unsplash.com/photo-1619145103073-776269601438?w=500' },
  { id: 111, name: 'Drou Watch Ultra', price: 450, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: 112, name: 'JBL Go 3 Speaker', price: 480, category: 'Mini Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
];

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Logic to show sticky bar after scrolling past the main product info
  useEffect(() => {
    const handleScroll = () => {
      // Shows bar after scrolling down 600px (roughly past the main image)
      if (window.scrollY > 300) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <Container maxWidth="xl" className="pb-10 md:pb-20 pb-6 md:pt-12 mx-20 mb-20">
        <Grid container spacing={8}>
          
          {/* LEFT: Gallery */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction="row" spacing={3}>
              <Stack spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                {PRODUCT_DATA.images.map((img, i) => (
                  <Box 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${activeImg === i ? 'border-blue-600' : 'border-slate-100 opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="thumb" />
                  </Box>
                ))}
              </Stack>

              <Box className="flex-1 bg-slate-50 rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center p-10 border border-slate-100">
                <img src={PRODUCT_DATA.images[activeImg]} className="w-full h-full object-contain mix-blend-multiply" alt="main" />
              </Box>
            </Stack>
          </Grid>

          {/* RIGHT: Main Details */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box>
              <Typography variant="h3" className="font-bold text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">
                {PRODUCT_DATA.name}
              </Typography>

              <Typography variant="h4" className="font-black text-[#1a1a1a] mb-8">
                ₵{PRODUCT_DATA.price.toFixed(2)}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" className="mb-10">
                <Box className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                  <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} className="rounded-none px-3 border-r border-slate-300"><RemoveIcon fontSize="small" /></IconButton>
                  <Typography className="px-6 font-bold">{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(q => q + 1)} className="rounded-none px-3 border-l border-slate-300"><AddIcon fontSize="small" /></IconButton>
                </Box>

                <Button variant="contained" className="bg-[#1e293b] hover:bg-black text-white px-10 py-3 rounded-md font-bold normal-case flex-1 shadow-none">
                  ADD TO CART
                </Button>

                <IconButton className="border border-slate-300 rounded-md p-2">
                  <FavoriteBorderIcon fontSize="small" className="text-slate-600" />
                </IconButton>
              </Stack>

              <Divider className="mb-2" />

              <Box>
                <Accordion elevation={0} className="border-b border-slate-200 before:hidden">
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0 py-1">
                    <Typography className="font-bold uppercase text-sm tracking-wider">Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="px-0 pb-4">
                    <Typography className="text-slate-600 leading-relaxed text-sm">{PRODUCT_DATA.description}</Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion elevation={0} className="border-b border-slate-200 before:hidden">
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0 py-1">
                    <Typography className="font-bold uppercase text-sm tracking-wider">Additional information</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="px-0 pb-4">
                    <Typography className="text-slate-600 text-sm leading-relaxed">{PRODUCT_DATA.specs}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Box className="mt-8">
                <Typography className="text-slate-500 text-sm mb-1">{PRODUCT_DATA.delivery}</Typography>
                <Typography className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">SKU: {PRODUCT_DATA.sku}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* RELATED PRODUCTS: Shows as you scroll down */}
        <Box className="mt-32">
          <Divider className="mb-12" />
          <Typography variant="h4" className="font-black text-slate-900 mb-10 tracking-tight">
            You may also like
          </Typography>
          <Grid container spacing={3}>
            {RELATED_PRODUCTS.map((product) => (
              <Grid key={product.id} size={{ xs: 6, md: 2.4 }}>
                <ProductCard {...product} brand={product.category} viewMode="grid" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* --- CONDITIONAL STICKY BAR --- */}
      <Fade in={showStickyBar} timeout={400}>
        <Box className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[100] py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
          <Container maxWidth="xl" className="flex items-center justify-between gap-4">
            <Stack direction="row" spacing={3} alignItems="center" className="hidden sm:flex max-w-[50%]">
              <Box className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                <img src={PRODUCT_DATA.images[0]} className="w-full h-full object-contain" alt="mini-thumb" />
              </Box>
              <Typography variant="body1" className="font-bold truncate">
                {PRODUCT_DATA.name}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={3} className="flex-1 sm:flex-initial" alignItems="center" justifyContent="flex-end">
              <Box className="text-right">
                <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-tighter">Total Price</Typography>
                <Typography variant="h6" className="font-black leading-tight">₵{(PRODUCT_DATA.price * quantity).toFixed(2)}</Typography>
              </Box>
              
              <Box className="hidden xs:flex items-center border border-slate-300 rounded-md bg-white">
                <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small"><RemoveIcon fontSize="inherit" /></IconButton>
                <Typography className="px-3 font-bold text-sm">{quantity}</Typography>
                <IconButton onClick={() => setQuantity(q => q + 1)} size="small"><AddIcon fontSize="inherit" /></IconButton>
              </Box>

              <Button 
                variant="contained" 
                className="bg-blue-600 hover:bg-black text-white px-8 py-3 rounded-md font-bold normal-case shadow-none transition-colors"
              >
                ADD TO CART
              </Button>
            </Stack>
          </Container>
        </Box>
      </Fade>

      <Footer />
    </main>
  );
}