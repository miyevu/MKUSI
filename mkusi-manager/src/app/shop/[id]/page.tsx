'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Box, Button, Stack, 
  Divider, IconButton, Accordion, AccordionSummary, AccordionDetails, Grid, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StarIcon from '@mui/icons-material/Star';
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

const RELATED_PRODUCTS = [
  { id: 101, name: 'MagSafe Battery Pack', price: 850, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: 102, name: 'Fast Charger 20W', price: 120, category: 'Charger', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
  { id: 103, name: 'Drou Watch Ultra', price: 450, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { id: 104, name: 'JBL Go 3 Speaker', price: 480, category: 'Mini Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500' },
];

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // High-performance scroll handler for instant UI updates
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 350 && !showStickyBar) {
      setShowStickyBar(true);
    } else if (currentScrollY <= 200 && showStickyBar) {
      setShowStickyBar(false);
    }
  }, [showStickyBar]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <Container maxWidth="xl" className="py-10 md:pt-20">
        <Grid container spacing={{ xs: 4, md: 8 }}>
          
          {/* LEFT: GALLERY SECTION */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Stack direction="column" spacing={3}>
              <Box className="flex-1 bg-slate-50 rounded-3xl overflow-hidden aspect-[4.5/5] flex row items-center justify-center p-10 border border-slate-100">
                <img src={PRODUCT_DATA.images[activeImg]} className="w-full h-full object-contain mix-blend-multiply" alt="main" />
              </Box>
              <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
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
            </Stack>
          </Grid>

          {/* RIGHT: PRODUCT INFORMATION - REIMAGINED FOR MKUSI */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="lg:pl-0">
              {/* Breadcrumbs or Category Tag */}
              <Typography variant="overline" className="text-blue-600 font-bold tracking-widest mb-2 block">
                {PRODUCT_DATA.sku.split('-')[0]} // Category Label
              </Typography>

              <Typography variant="h3" className="font-black text-slate-900 mb-4 leading-tight tracking-tighter">
                {PRODUCT_DATA.name}
              </Typography>
              
              {/* Ratings & Status Row */}
              <Stack direction="row" spacing={2} alignItems="center" className="mb-4">
                <Stack direction="row" spacing={0.5} className="text-yellow-400">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
                </Stack>
                <Typography variant="body2" className="text-slate-400 font-bold border-l pl-2 border-slate-200">
                  4.8 (120+ Reviews)
                </Typography>
                <Chip label="In Stock" size="small" className="bg-green-50 text-green-600 font-bold rounded-md" />
              </Stack>

              <Box className="bg-slate-50 p-6 rounded-2xl mb-4 border border-slate-100">
                <Typography variant="h4" className="font-black text-slate-900 mb-1">
                  ₵{PRODUCT_DATA.price.toFixed(2)}
                </Typography>
                <Typography variant="caption" className="text-slate-400 font-medium">
                  Price inclusive of all taxes
                </Typography>
              </Box>

              {/* CTA Section */}
              <Stack direction="row" spacing={2} alignItems="stretch" className="mb-6">
                <Box className="flex items-center border-2 border-slate-200 rounded-xl bg-white p-1">
                  <IconButton 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography className="px-4 font-black text-lg">{quantity}</Typography>
                  <IconButton 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  className="bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black normal-case text-lg shadow-xl shadow-slate-200 transition-all duration-300"
                >
                  Add to Cart
                </Button>

                <IconButton className="border-2 border-slate-200 rounded-xl px-4 hover:border-blue-600 hover:text-blue-600 transition-all">
                  <FavoriteBorderIcon />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl py-6">
        <Divider className="mb-4" />
        {/* Information Toggles */}
        <Box className="space-y-2 pt-6">
          {[
            { title: "Description", content: PRODUCT_DATA.description },
            { title: "Technical Specifications", content: PRODUCT_DATA.specs },
            { title: "Delivery & Returns", content: PRODUCT_DATA.delivery }
          ].map((item, index) => (
            <Accordion key={index} elevation={0} className="before:hidden bg-transparent border-b border-slate-100 last:border-none">
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon className="text-slate-900" />} 
                className="px-0 py-2 hover:bg-slate-50 transition-colors rounded-lg"
              >
                <Typography className="font-black uppercase text-xs tracking-widest text-slate-900">
                  {item.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="px-0 pb-6 text-slate-500 text-sm leading-relaxed">
                {item.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* RELATED PRODUCTS */}
      <Container maxWidth="xl" className="bg-slate-50/50 py-4">
        <Box className="pb-20 pt-10 border-t border-slate-100">
          <Box className="text-center mb-12">
            <Typography variant="h3" className="font-black text-slate-900 mb-4">Related Products</Typography>
            
            {/* INTERACTIVE TABS */}
            <Stack direction="row" spacing={4} justifyContent="center" className="mb-8">
              <Button 
                variant="text" 
                className="text-slate-900 font-bold hover:text-blue-600 normal-case text-lg group"
              >
                View all accessories 
                <Box component="span" className="ml-2 transition-transform group-hover:translate-x-1">→</Box>
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {RELATED_PRODUCTS.map((product) => (
              <Grid key={product.id} size={{ xs: 6, md: 3 }}>
                {/* We wrap the card in a subtle hover-lift effect container */}
                <Box className="transition-all duration-300 hover:-translate-y-2">
                  <ProductCard 
                    {...product} 
                    brand={product.category} 
                    viewMode="grid" 
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* --- RESPONSIVE INSTANT STICKY BAR --- */}
      {showStickyBar && (
        <Box 
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.12)]"
          style={{ willChange: 'transform, opacity' }} 
        >
          <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 } }}>
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 4 }} 
              alignItems="center"
              justifyContent="space-between"
            >
              
              {/* Desktop/Tablet: Show Product Info */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' }, max_width: '50%' }}>
                <Box className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                  <img src={PRODUCT_DATA.images[0]} className="w-full h-full object-contain" alt="mini-thumb" />
                </Box>
                <Box>
                  <Typography variant="body2" className="font-bold truncate max-w-[200px] md:max-w-[300px]">{PRODUCT_DATA.name}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon className="text-yellow-400 w-3 h-3" />
                    <Typography className="text-[10px] font-bold text-slate-400">4.8 / 5.0 Rating</Typography>
                  </Stack>
                </Box>
              </Stack>
              
              {/* Mobile Focus: Price, Quantity & Button */}
              <Stack 
                direction="row" 
                spacing={{ xs: 1, sm: 3 }} 
                className="w-full sm:w-auto" 
                alignItems="center" 
                justifyContent="space-between"
              >
                {/* Price Label (Visible on Mobile) */}
                <Box>
                  <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-tighter block sm:hidden leading-none mb-1">Total</Typography>
                  <Typography variant="h6" className="font-black text-blue-600 leading-tight">
                    ₵{(PRODUCT_DATA.price * quantity).toFixed(2)}
                  </Typography>
                </Box>
                
                <Stack direction="row" spacing={1} flex={1} justifyContent="flex-end" alignItems="center">
                  {/* Quantity Selector - Compact on Mobile */}
                  <Box className="flex items-center border border-slate-300 rounded-lg bg-white h-10 md:h-12">
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small" className="px-1 md:px-2">
                      <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <Typography className="px-2 md:px-3 font-bold text-sm">{quantity}</Typography>
                    <IconButton onClick={() => setQuantity(q => q + 1)} size="small" className="px-1 md:px-2">
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Box>

                  {/* Add to Cart Button */}
                  <Button 
                    variant="contained" 
                    className="bg-[#1e293b] hover:bg-blue-600 text-white px-4 md:px-10 h-10 md:h-12 rounded-lg font-bold normal-case shadow-none transition-all flex-1 md:flex-initial"
                  >
                    ADD TO CART
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>
      )}

      <Footer />
    </main>
  );
}