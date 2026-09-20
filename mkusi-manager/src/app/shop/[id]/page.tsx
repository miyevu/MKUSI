'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { 
  Container, Typography, Box, Button, Stack, 
  IconButton, Accordion, AccordionSummary, AccordionDetails, Grid, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useProducts, getDiscountedPrice } from '@/context/ProductContext';

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { products, productsLoading, addToCart, toggleWishlist, isInWishlist } = useProducts();

  const product = products.find(p => p.id === productId);
  const relatedProducts = products
    .filter(p => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  const gallery = product?.images && product.images.length > 0
    ? product.images
    : product?.image ? [product.image] : [];

  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [added, setAdded] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | false>('description');

  useEffect(() => {
    setActiveImg(0);
  }, [productId]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    if (y > 480 && !showStickyBar) setShowStickyBar(true);
    else if (y <= 300 && showStickyBar) setShowStickyBar(false);
  }, [showStickyBar]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (productsLoading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <Container maxWidth="sm" className="py-24 flex flex-col items-center text-center">
          <CircularProgress size={28} sx={{ color: '#0f172a', mb: 2 }} />
          <Typography className="text-slate-400 text-sm font-medium">Loading...</Typography>
        </Container>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <Container maxWidth="sm" className="py-24 flex flex-col items-center text-center">
          <Box className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Inventory2OutlinedIcon sx={{ fontSize: 30 }} className="text-slate-300" />
          </Box>
          <Typography className="font-black text-slate-900 text-2xl mb-2">Product not found</Typography>
          <Typography className="text-slate-400 text-sm mb-8 max-w-xs">
            This product may have been removed or the link is incorrect.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" className="bg-slate-900 hover:bg-slate-800 text-white font-bold normal-case rounded-full px-8 py-3 shadow-none text-sm">
            Back to Shop
          </Button>
        </Container>
        <Footer />
      </main>
    );
  }

  const specEntries = product.specs ? Object.entries(product.specs).filter(([, v]) => v) : [];
  const wishlisted = isInWishlist(product.id);
  const displayedImage = gallery[activeImg] || product.image;
  const { finalPrice, hasDiscount, originalPrice } = getDiscountedPrice(product);

  const panels = [
    { id: 'description', title: 'Description', content: product.description || 'No description provided.' },
    { id: 'specs', title: 'Specifications', content: specEntries.length > 0 ? specEntries.map(([k, v]) => `${k}: ${v}`).join(' · ') : 'No specifications listed.' },
    { id: 'compatibility', title: 'Compatibility', content: product.compatibility || 'Not specified.' },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Slim breadcrumb */}
      <Container maxWidth="xl" className="pt-8 pb-2">
        <Button
          component={Link}
          href="/shop"
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 15 }} />}
          className="text-slate-400 hover:text-slate-900 font-semibold normal-case text-xs tracking-wide px-0"
          disableRipple
        >
          All Products
        </Button>
      </Container>

      <Container maxWidth="xl" className="pt-8 pb-24">
        <Grid container spacing={{ xs: 6, md: 10 }}>

          {/* LEFT — full-bleed gallery, no card chrome */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box className="relative bg-gradient-to-b from-[#fafafa] to-[#f0f1f3] rounded-[2rem] overflow-hidden aspect-square flex items-center justify-center">
                {hasDiscount && (
                  <Box className="absolute top-5 left-5 bg-red-600 text-white text-[11px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full z-10">
                    {product.discountType === 'percent'
                      ? `${Math.round(product.discountValue!)}% OFF`
                      : `₵${product.discountValue!.toFixed(0)} OFF`}
                  </Box>
                )}
                <IconButton
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-5 right-5 bg-white/80 backdrop-blur-md hover:bg-white z-10 shadow-sm"
                  size="small"
                >
                  {wishlisted
                    ? <FavoriteRoundedIcon className="text-slate-900" fontSize="small" />
                    : <FavoriteBorderRoundedIcon className="text-slate-500" fontSize="small" />}
                </IconButton>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={displayedImage}
                    src={displayedImage || 'https://via.placeholder.com/700'}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-[78%] h-[78%] object-contain"
                  />
                </AnimatePresence>
              </Box>
            </motion.div>

            {gallery.length > 1 && (
              <Box
                className="flex gap-[10px] mt-5 overflow-x-auto pb-1"
                sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
              >
                {gallery.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="relative w-[60px] h-[60px] rounded-2xl overflow-hidden cursor-pointer shrink-0"
                    sx={{
                      border: activeImg === i ? '2px solid #0f172a' : '2px solid transparent',
                      opacity: activeImg === i ? 1 : 0.45,
                      transition: 'all 0.25s ease',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
                  </Box>
                ))}
              </Box>
            )}

            {/* Trust strip */}
            <Grid container spacing={2} className="mt-8">
              {[
                { icon: LocalShippingOutlinedIcon, label: 'Fast delivery', sub: 'Within 24hrs in Accra' },
                { icon: VerifiedOutlinedIcon, label: 'Genuine stock', sub: 'Verified accessories' },
                { icon: ReplayRoundedIcon, label: 'Easy returns', sub: '7-day window' },
              ].map((item) => (
                <Grid key={item.label} size={4}>
                  <Stack alignItems="center" spacing={0.5} className="text-center">
                    <item.icon sx={{ fontSize: 22 }} className="text-slate-400 mb-1" />
                    <Typography className="text-slate-900 text-xs font-bold">{item.label}</Typography>
                    <Typography className="text-slate-400 text-[10px]">{item.sub}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* RIGHT — sticky info panel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box className="md:sticky md:top-28">

                {product.brand && (
                  <Typography className="text-slate-400 font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                    {product.brand}
                  </Typography>
                )}

                <Typography className="font-black text-slate-900 leading-[1.05] tracking-tight mb-4" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
                  {product.name}
                </Typography>

                <Stack direction="row" alignItems="baseline" spacing={1.5} className="mb-2 flex-wrap">
                  <Typography className="font-bold text-slate-900" sx={{ fontSize: '1.75rem' }}>
                    ₵{finalPrice.toFixed(2)}
                  </Typography>
                  {hasDiscount && (
                    <Typography className="text-slate-400 line-through" sx={{ fontSize: '1.1rem' }}>
                      ₵{originalPrice.toFixed(2)}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5} className="mb-6">
                  <Box
                    className="w-1.5 h-1.5 rounded-full"
                    sx={{ bgcolor: product.stock > 0 ? '#16a34a' : '#dc2626' }}
                  />
                  <Typography className={`text-sm font-semibold ${product.stock > 0 ? 'text-slate-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
                  </Typography>
                </Stack>

                {product.description && (
                  <Typography className="text-slate-500 text-[15px] leading-relaxed mb-10 max-w-md">
                    {product.description}
                  </Typography>
                )}

                {/* Quantity — minimal underline style */}
                <Box className="mb-6">
                  <Typography className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Quantity</Typography>
                  <Stack direction="row" alignItems="center" spacing={0} className="w-fit border border-slate-200 rounded-full">
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small" className="text-slate-900">
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Typography className="px-5 font-bold text-base min-w-[20px] text-center">{quantity}</Typography>
                    <IconButton onClick={() => setQuantity(q => Math.min(q + 1, product.stock))} size="small" className="text-slate-900">
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                {/* CTA */}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-full font-bold normal-case text-[15px] shadow-none transition-all duration-300"
                    sx={{ letterSpacing: '0.01em', whiteSpace: 'normal', lineHeight: 1.3 }}
                  >
                    {product.stock === 0
                      ? 'Out of Stock'
                      : added
                        ? '✓ Added to Bag'
                        : `Add to Bag — ₵${(finalPrice * quantity).toFixed(2)}`}
                  </Button>
                </motion.div>

                {/* Trust row */}
                <Stack direction="row" spacing={3} className="mt-8 pt-8 border-t border-slate-100">
                  {[
                    { icon: LocalShippingOutlinedIcon, label: 'Fast delivery' },
                    { icon: VerifiedOutlinedIcon, label: 'Genuine stock' },
                    { icon: ReplayRoundedIcon, label: '7-day returns' },
                  ].map((item) => (
                    <Stack key={item.label} spacing={0.75} alignItems="center" className="flex-1 text-center">
                      <item.icon sx={{ fontSize: 20 }} className="text-slate-400" />
                      <Typography className="text-slate-500 text-[11px] font-semibold leading-tight">{item.label}</Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* Minimal accordions */}
                <Box className="mt-8">
                  {panels.map((panel) => {
                    const isOpen = openPanel === panel.id;
                    return (
                      <Accordion
                        key={panel.id}
                        elevation={0}
                        expanded={isOpen}
                        onChange={() => setOpenPanel(isOpen ? false : panel.id)}
                        disableGutters
                        className="before:hidden bg-transparent border-b border-slate-100 last:border-none"
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon className="text-slate-400" />}
                          className="px-0 py-2"
                        >
                          <Typography className="font-bold text-[15px] text-slate-900">{panel.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="px-0 pb-6 text-slate-500 text-sm leading-relaxed">
                          {panel.content}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* RELATED — using shared ProductCard */}
      {relatedProducts.length > 0 && (
        <Box className="border-t border-slate-100 py-20">
          <Container maxWidth="xl">
            <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight mb-10">
              Complete the set
            </Typography>

            <Grid container spacing={{ xs: 3, md: 4 }}>
              {relatedProducts.map((p, i) => (
                <Grid key={p.id} size={{ xs: 6, md: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <ProductCard {...p} viewMode="grid" />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* STICKY BAR — glass style */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-[1000]"
          >
            <Box className="bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
              <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 } }}>
                <Stack direction="row" spacing={{ xs: 1, sm: 4 }} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2.5} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' }, maxWidth: '45%' }}>
                    <Box className="w-11 h-11 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                      <img src={product.image || 'https://via.placeholder.com/100'} className="w-full h-full object-contain p-1" alt="mini-thumb" />
                    </Box>
                    <Box>
                      <Typography variant="body2" className="font-bold truncate max-w-[220px] md:max-w-[320px]">{product.name}</Typography>
                      <Typography className="text-[11px] font-bold text-slate-500">₵{finalPrice.toFixed(2)}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={{ xs: 1, sm: 3 }} className="w-full sm:w-auto" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" className="text-slate-400 font-bold uppercase block sm:hidden leading-none mb-1">Total</Typography>
                      <Typography variant="h6" className="font-black text-slate-900 leading-tight">
                        ₵{(finalPrice * quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flex={1} justifyContent="flex-end" alignItems="center">
                      <Box className="flex items-center border border-slate-200 rounded-full bg-white h-10 md:h-11">
                        <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small" className="px-1 md:px-2">
                          <RemoveRoundedIcon fontSize="inherit" />
                        </IconButton>
                        <Typography className="px-2 md:px-3 font-bold text-sm">{quantity}</Typography>
                        <IconButton onClick={() => setQuantity(q => Math.min(q + 1, product.stock))} size="small" className="px-1 md:px-2">
                          <AddRoundedIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                      <Button
                        variant="contained"
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 md:px-10 h-10 md:h-11 rounded-full font-bold normal-case shadow-none transition-all flex-1 md:flex-initial text-sm"
                      >
                        {added ? '✓ Added' : 'Add to Bag'}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}