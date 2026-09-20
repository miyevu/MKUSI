'use client';
import React, { useState } from 'react';
import {
  Container, Grid, Typography, Button, Box, Stack, Avatar, Chip, Paper,
  useTheme, useMediaQuery 
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useProducts } from '@/context/ProductContext';

// Icons
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CableIcon from '@mui/icons-material/Cable';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WatchIcon from '@mui/icons-material/Watch';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplayIcon from '@mui/icons-material/Replay';

// --- INTERFACES ---
interface CategoryItem { name: string; icon: React.ReactNode; image: string; }
interface FeatureItem { icon: React.ElementType; title: string; desc: string; }
interface BentoItem { subtitle: string; title: React.ReactNode; btnText: string; btnVariant: "text" | "contained" | "outlined"; btnClass: string; imgSrc: string; imgAlt: string; imgClass: string; textWrapperClass?: string; justify: string; link: string; }

// --- DATA CONSTANTS ---
const CATEGORIES: CategoryItem[] = [
  { name: 'Phone Cases', icon: <PhoneIphoneIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=200&q=60' },
  { name: 'Chargers', icon: <BatteryChargingFullIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=200&q=60' },
  { name: 'Cables', icon: <CableIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=200&q=60' },
  { name: 'Screen Protectors', icon: <LocalShippingIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=200&q=60' },
  { name: 'Audio', icon: <HeadphonesIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=60' },
];

const FEATURES: FeatureItem[] = [
  { icon: LocalShippingIcon, title: "Fast Delivery", desc: "Delivery within 24 hours in Accra." },
  { icon: ThumbUpIcon, title: "Best Quality", desc: "Genuine accessories from top brands." },
  { icon: ReplayIcon, title: "Free Return", desc: "Don't like it? Return it within 7 days." }
];

const BENTO_ITEMS: BentoItem[] = [
  { subtitle: "Something new", title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Cases for<br/>Phone</Typography>, btnText: "TO SHOP", btnVariant: "contained", btnClass: "bg-blue-600 shadow-none font-bold rounded-lg px-8 py-3 text-xs text-white", imgSrc: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=600&q=80", imgAlt: "Red Case", imgClass: "absolute right-[-16px] bottom-[-16px] w-[160px] h-[160px] sm:w-[280px] sm:h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0", justify: "justify-between", link: "/shop?cat=Phone Cases" },
  { subtitle: "Charge Faster", title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Chargers &<br/>Power Banks</Typography>, btnText: "TO SHOP", btnVariant: "outlined", btnClass: "border-slate-300 text-slate-900 font-bold rounded-lg px-8 py-3 text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900", imgSrc: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80", imgAlt: "Charger", imgClass: "absolute right-[-16px] bottom-[-16px] w-[160px] h-[160px] sm:w-[280px] sm:h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0", justify: "justify-between", link: "/shop?cat=Chargers" },
  { subtitle: "Special Offer", title: ( <><Typography variant="h5" className="font-black text-slate-900 mb-1 leading-tight">Buy One and Get<br/>50% Off</Typography><Typography variant="h5" className="font-black text-slate-900 mb-6 leading-tight">the Second</Typography></> ), btnText: "READ MORE", btnVariant: "outlined", btnClass: "border-slate-300 text-slate-900 font-bold rounded-lg px-8 py-3 text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900", imgSrc: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=600&q=80", imgAlt: "Power Bank", imgClass: "absolute right-[-16px] bottom-[-16px] w-[160px] h-[160px] sm:w-[280px] sm:h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0", textWrapperClass: "max-w-[60%]", justify: "justify-between", link: "/shop" },
  { subtitle: "Try something new", title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Audio<br/>Gear</Typography>, btnText: "BUY NOW", btnVariant: "contained", btnClass: "bg-blue-600 shadow-none font-bold rounded-lg px-8 py-3 text-xs text-white", imgSrc: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80", imgAlt: "Audio", imgClass: "absolute right-[-16px] bottom-[-16px] w-[160px] h-[160px] sm:w-[280px] sm:h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0", justify: "justify-between", link: "/shop?cat=Audio" }
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HomePage() {
  const { products } = useProducts();
  const availableCategories = Array.from(new Set(products.map(p => p.category)));
  const [activeTab, setActiveTab] = useState(availableCategories[0] || 'Phone Cases');
  const filteredProducts = products.filter(item => item.category === activeTab);
  
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <main className="bg-white min-h-screen overflow-hidden">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <Box sx={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #eef0f3 100%)' }} className="relative px-4 sm:px-8 pb-20 pt-10 md:pt-0">
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={{ xs: 0, md: 0 }}>
            
            {/* TEXT SIDE */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }} className="z-10 relative">
              <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography variant="h2" className="font-black text-slate-900 mb-4 leading-tight" sx={{ fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}>
                  Charge Your <br/>
                  <span className="sm:whitespace-nowrap">
                    Phone <span className="text-blue-600">Safely!</span>
                  </span>
                </Typography>
                <Typography className="text-slate-500 text-lg mb-4 max-w-md">
                  Premium accessories designed for longevity and speed. Protect your battery life with MKUSI certified gear.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="mt-4">
                  <Link href="/shop" className="w-full sm:w-auto">
                    <Button fullWidth variant="contained" size="large" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-200">
                      To Shop
                    </Button>
                  </Link>
                  <Button 
                    fullWidth
                    variant="text" 
                    size="large" 
                    className="text-slate-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-200 sm:w-auto"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Read More
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            
            {/* IMAGE SIDE */}
            <Grid size={{ md: 8, lg: 8 }} className="relative hidden md:block">
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative rounded-[3rem] flex items-center justify-center w-full h-[500px] md:pr-20 lg:pr-0"
              >
                <img src="/hero.png" alt="iPhone 15 Titanium" className="object-cover w-full h-full overflow-visible" />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    
      {/* 2. CATEGORY CIRCLES */}
      <Container maxWidth="xl" className="pt-20">
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <Grid container spacing={4} justifyContent="center">
            {CATEGORIES.map((cat) => (
              <Grid key={cat.name} size={{ xs: 4, sm: 2 }}>
                <motion.div variants={itemVariants}>
                  <Link href={`/shop?cat=${encodeURIComponent(cat.name)}`} className="no-underline group">
                    <Stack alignItems="center" spacing={2} className="cursor-pointer">
                      <Avatar className="w-24 h-24 bg-slate-50 text-slate-400 group-hover:shadow-xl transition-all duration-300 border border-transparent group-hover:border-slate-100 overflow-hidden" sx={{ width: 96, height: 96 }}>
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </Avatar>
                      <Typography className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors text-center text-sm">{cat.name}</Typography>
                    </Stack>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      
      {/* 3. QUALITY & BENTO GRID */}
      <Container maxWidth="xl" className="pt-20" id="features">        
        <Box className="text-center mb-20">
          <Typography className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">There are some redeeming factors</Typography>
          <Typography variant="h3" className="font-black text-slate-900" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>We Provide High Quality Goods</Typography>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Grid container spacing={4} justifyContent="center" className="max-w-5xl mx-auto mt-8">
              {FEATURES.map((feature) => (
                <Grid key={feature.title} size={{ xs: 12, sm: 4 }}>
                  <motion.div variants={itemVariants}>
                    <Stack alignItems="center" spacing={1}>
                      <feature.icon className="text-slate-900 text-5xl mb-2" />
                      <Typography className="font-bold text-slate-900 text-lg">{feature.title}</Typography>
                      <Typography className="text-xs text-slate-500 max-w-[200px]">{feature.desc}</Typography>
                    </Stack>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* SMART ANIMATED BENTO GRID */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <Grid container spacing={4} className="md:px-8">
            {BENTO_ITEMS.map((item, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <motion.div 
                  variants={itemVariants} 
                  whileHover={isDesktop ? "hover" : undefined} 
                  whileTap={isDesktop ? { scale: 0.98 } : undefined} 
                  className="h-full"
                >
                  <Paper 
                    elevation={0} 
                    className={`bg-[#f3f4f6] rounded-[2rem] p-6 sm:p-8 h-[280px] sm:h-[320px] relative overflow-hidden flex flex-col ${item.justify} items-start shadow-sm transition-shadow duration-500 ${isDesktop ? 'hover:shadow-2xl hover:shadow-slate-200/50' : ''}`} 
                    sx={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #eef0f3 100%)' }}
                  >
                    <Box className={`z-10 relative ${item.textWrapperClass || ''}`}>
                      <Typography className="text-blue-600 text-xs font-bold uppercase mb-2">
                        {item.subtitle}
                      </Typography>
                      {item.title}
                      <Button component={Link} href={item.link} variant={item.btnVariant} className={item.btnClass}>
                        {item.btnText}
                      </Button>
                    </Box>

                    <motion.img 
                      src={item.imgSrc} 
                      className={item.imgClass} 
                      alt={item.imgAlt}
                      variants={{
                        hover: isDesktop ? { 
                          scale: 1.15, 
                          x: -5, 
                          y: -5,
                          transition: { duration: 0.5, ease: "easeOut" } 
                        } : {}
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      
      {/* 4. NEW ARRIVALS (FUNCTIONAL TABS, REAL PRODUCTS) */}
      {products.length > 0 && (
        <Container maxWidth="xl" className="pt-32">
          <Box className="text-center mb-12">
            <Typography className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">Hurry up to buy</Typography>
            <Typography variant="h3" className="font-black text-slate-900 mb-6" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>New Arrivals</Typography>
            
            <Stack direction="row" spacing={{ xs: 2, sm: 4 }} justifyContent="center" className="mb-8 flex-wrap">
              {availableCategories.map((tab) => (
                <Box 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className="relative cursor-pointer px-2 pb-2"
                >
                  <Typography className={`font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors duration-300 ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab}
                  </Typography>
                  {activeTab === tab && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900" />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          <Box className="min-h-[400px] md:px-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Grid container spacing={4}>
                  {filteredProducts.slice(0, 8).map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                      <Link href={`/shop/${item.id}`} className="no-underline group block">
                        <Box className="relative h-64 bg-slate-50 rounded-[2rem] mb-4 overflow-hidden group-hover:shadow-lg transition-all duration-500">
                          <img src={item.image || 'https://via.placeholder.com/500'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          {item.stock === 0 && (
                            <Chip label="SOLD OUT" size="small" className="absolute top-4 left-4 font-bold bg-white/90 text-slate-500 backdrop-blur-sm" />
                          )}
                          {item.stock > 0 && item.stock <= 5 && (
                            <Chip label="LOW STOCK" size="small" className="absolute top-4 left-4 font-bold bg-blue-600 text-white" />
                          )}
                        </Box>
                        <Box className="text-center">
                          <Typography className="font-bold text-slate-900 mb-1">{item.name}</Typography>
                          <Typography className="text-xs text-slate-500 mb-2">{item.category}</Typography>
                          <Typography className="font-bold text-blue-600">GH₵ {item.price.toFixed(2)}</Typography>
                        </Box>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Container>
      )}

      <Footer />
    </main>
  );
}