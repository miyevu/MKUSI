'use client';
import React, { useState } from 'react';
import { Container, Grid, Typography, Button, Box, Stack, Avatar, Chip, Paper } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
// Icons
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CableIcon from '@mui/icons-material/Cable';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WatchIcon from '@mui/icons-material/Watch';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplayIcon from '@mui/icons-material/Replay';

// --- DATA CONSTANTS ---
interface CategoryItem {
  name: string;
  icon: React.ReactNode;
  image: string;
}

interface FeatureItem {
  icon: React.ElementType; 
  title: string;
  desc: string;
}

interface ProductItem {
  id: number;
  category: "CASES" | "STRAPS" | "MAGSAFE" | string; // Strict but allows future growth
  name: string;
  price: string;
  img: string;
  badge: "HOT" | "NEW" | "SOLD OUT" | ""; // Strict badge types
}

interface BlogPostItem {
  id: number;
  title: string;
  date: string;
  image: string;
}

// 1. Categories for Circles
// const CATEGORIES = [
const CATEGORIES: CategoryItem[] = [
  { name: 'Cases', icon: <PhoneIphoneIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=200&q=60' },
  { name: 'MagSafe', icon: <BatteryChargingFullIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=200&q=60' },
  { name: 'Cables', icon: <CableIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=200&q=60' },
  { name: 'Chargers', icon: <LocalShippingIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=200&q=60' },
  { name: 'Straps', icon: <WatchIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1434494878563-7a6b0c80f643?auto=format&fit=crop&w=200&q=60' },
  { name: 'Audio', icon: <HeadphonesIcon fontSize="large" />, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=60' },
];

// 1. Create a simple data array
// const FEATURES = [
const FEATURES: FeatureItem[] = [
  {
    icon: LocalShippingIcon,
    title: "Fast Delivery",
    desc: "Delivery within 24 hours in Accra."
  },
  {
    icon: ThumbUpIcon,
    title: "Best Quality",
    desc: "Genuine accessories from top brands."
  },
  {
    icon: ReplayIcon,
    title: "Free Return",
    desc: "Don't like it? Return it within 7 days."
  }
];

interface BentoItem {
  subtitle: string;
  title: React.ReactNode;
  btnText: string;
  btnVariant: "text" | "contained" | "outlined";
  btnClass: string;
  imgSrc: string;
  imgAlt: string;
  imgClass: string;
  textWrapperClass?: string;
  justify: string;
  link: string;
}

// 1. Define the data array
// const BENTO_ITEMS = [
const BENTO_ITEMS: BentoItem[] = [
  {
    subtitle: "Something new",
    title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Cases for<br/>Phone</Typography>,
    btnText: "TO SHOP",
    btnVariant: "contained",
    btnClass: "bg-blue-600 shadow-none font-bold rounded-lg px-8 py-3 text-xs",
    imgSrc: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Red Case",
    imgClass: "absolute right-[-20px] bottom-[-20px] w-[280px] h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0",
    justify: "justify-between",
    link: "/shop"
  },
  {
    subtitle: "Accessories for watch",
    title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Straps of<br/>Any Color</Typography>,
    btnText: "TO SHOP",
    btnVariant: "outlined",
    btnClass: "border-slate-300 text-slate-900 font-bold rounded-lg px-8 py-3 text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900",
    imgSrc: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Watch Straps",
    imgClass: "absolute right-[-20px] bottom-[-20px] w-[280px] h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0",
    justify: "justify-between",
    link: "/shop"
  },
  {
    subtitle: "Special Offer",
    title: (
      <>
        <Typography variant="h5" className="font-black text-slate-900 mb-1 leading-tight">Buy One and Get<br/>50% Off</Typography>
        <Typography variant="h5" className="font-black text-slate-900 mb-6 leading-tight">the Second</Typography>
      </>
    ),
    btnText: "READ MORE",
    btnVariant: "outlined",
    btnClass: "border-slate-300 text-slate-900 font-bold rounded-lg px-8 py-3 text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900",
    imgSrc: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Power Bank",
    imgClass: "absolute right-[-20px] bottom-[-20px] w-[280px] h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0",
    textWrapperClass: "max-w-[60%]", 
    justify: "justify-between",
    link: "/shop"
  },
  {
    subtitle: "Try something new",
    title: <Typography variant="h4" className="font-black text-slate-900 mb-6 leading-none">Charger<br/>Discount</Typography>,
    btnText: "BUY NOW",
    btnVariant: "contained",
    btnClass: "bg-blue-600 shadow-none font-bold rounded-lg px-8 py-3 text-xs",
    imgSrc: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=500&q=80",
    imgAlt: "Wireless Charger",
    imgClass: "absolute right-[-20px] bottom-[-20px] w-[280px] h-[280px] object-cover rounded-xl rotate-12 drop-shadow-xl z-0",
    justify: "justify-between",
    link: "/shop" 
  }
];

// 2. Products Data for "New Arrivals" Tab Logic
// const NEW_ARRIVALS_DATA = [
const NEW_ARRIVALS_DATA: ProductItem[] = [
  // CASES
  { id: 1, category: 'CASES', name: 'iPhone 15 Pro Max Case', price: 'GH₵ 150.00', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=500&q=80', badge: 'HOT' },
  { id: 2, category: 'CASES', name: 'Silicone Case - Blue', price: 'GH₵ 120.00', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=500&q=80', badge: '' },
  { id: 3, category: 'CASES', name: 'Leather Wallet Case', price: 'GH₵ 180.00', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=500&q=80', badge: '' },
  { id: 4, category: 'CASES', name: 'Clear MagSafe Case', price: 'GH₵ 100.00', img: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=500&q=80', badge: '' },
  
  // STRAPS
  { id: 5, category: 'STRAPS', name: 'Alpine Loop Orange', price: 'GH₵ 250.00', img: 'https://images.unsplash.com/photo-1663499274883-fa4c25f1906a?auto=format&fit=crop&w=500&q=80', badge: 'NEW' },
  { id: 6, category: 'STRAPS', name: 'Milanese Loop Silver', price: 'GH₵ 300.00', img: 'https://images.unsplash.com/photo-1434494878563-7a6b0c80f643?auto=format&fit=crop&w=500&q=80', badge: '' },
  { id: 7, category: 'STRAPS', name: 'Sport Band Black', price: 'GH₵ 100.00', img: 'https://images.unsplash.com/photo-1517502474097-f9b30659dadb?auto=format&fit=crop&w=500&q=80', badge: '' },
  { id: 8, category: 'STRAPS', name: 'Leather Link', price: 'GH₵ 220.00', img: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=500&q=80', badge: '' },

  // MAGSAFE
  { id: 9, category: 'MAGSAFE', name: 'MagSafe Wallet', price: 'GH₵ 220.00', img: 'https://images.unsplash.com/photo-1625462529731-8979313b67eb?auto=format&fit=crop&w=500&q=80', badge: 'HOT' },
  { id: 10, category: 'MAGSAFE', name: 'Wireless Charger', price: 'GH₵ 350.00', img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=500&q=80', badge: '' },
  { id: 11, category: 'MAGSAFE', name: 'Anker MagGo', price: 'GH₵ 400.00', img: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=500&q=80', badge: 'SOLD OUT' },
  { id: 12, category: 'MAGSAFE', name: 'Belkin 3-in-1', price: 'GH₵ 850.00', img: 'https://images.unsplash.com/photo-1592910793526-7243306bc86a?auto=format&fit=crop&w=500&q=80', badge: '' },
];

// const BLOG_POSTS = [
const BLOG_POSTS: BlogPostItem[] = [
  { id: 1, title: 'Exploring modern MagSafe homes', date: '22 APR', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Green interior design inspiration', date: '25 MAY', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Reinterpreting the classic bookshelf', date: '12 JUN', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'The best cables for 2026', date: '14 JUL', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80' },
];

export default function HomePage() {
  // --- STATE FOR TABS ---
  const [activeTab, setActiveTab] = useState('CASES');

  // Filter products based on active tab
  const filteredProducts = NEW_ARRIVALS_DATA.filter(item => item.category === activeTab);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #eef0f3 100%)'
        }}
        className="relative px-4 sm:px-8 pb-20 pt-10 md:pt-0"
      >
        <Container maxWidth="xl">
          <Grid 
            container 
            alignItems="center" 
            wrap="nowrap"
            spacing={{ xs: 0, md: 0 }} 
          >
            {/* 1. TEXT SIDE */}
            <Grid 
              size={{ md: 6, lg: 4 }} 
              className="z-10 relative"
            >
              <Typography variant="h2" className="font-black text-slate-900 mb-4 leading-tight">
                Charge Your <br/>
                {/* Phone <span className="text-blue-600 ">Safely!</span> */}
                <span className="whitespace-nowrap">
                  Phone <span className="text-blue-600">Safely!</span>
                </span>
              </Typography>
              <Typography className="text-slate-500 text-lg mb-4 max-w-md">
                Premium accessories designed for longevity and speed. Protect your battery life with MKUSI certified gear.
              </Typography>
              <Stack direction="row" spacing={2} className="mt-4">
                <Link href="/shop">
                  <Button 
                    variant="contained" 
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-200"
                  >
                    To Shop
                  </Button>
                </Link>
                <Button 
                  variant="text" 
                  size="large"
                  className="text-slate-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-200"
                >
                  Read More
                </Button>
              </Stack>
            </Grid>
            
            {/* 2. IMAGE SIDE */}
            <Grid 
              size={{ md: 8, lg: 8 }}
              className="relative hidden md:block"   
            >
              <Box className="
                relative 
                rounded-[3rem] 
                flex items-center justify-center
                w-full 
                h-[500px]
                md:w-full
                md:pr-20
                lg:pr-0
              ">
                  <img 
                    src="/hero.png" 
                    alt="iPhone 15 Titanium" 
                    className="object-cover w-full h-full overflow-visible"
                  />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    
      {/* 2. CATEGORY CIRCLES */}
      <Container maxWidth="xl" className="pt-20">
        <Grid container spacing={4} justifyContent="center">
          {CATEGORIES.map((cat) => (
            <Grid 
              key={cat.name} 
              size={{ xs: 4, sm: 2 }}
            >
              <Link href={`/shop?cat=${cat.name}`} className="no-underline group">
                <Stack alignItems="center" spacing={2} className="cursor-pointer">
                  <Avatar 
                    className="w-24 h-24 bg-slate-50 text-slate-400 group-hover:shadow-xl transition-all duration-300 border border-transparent group-hover:border-slate-100 overflow-hidden"
                    sx={{ width: 96, height: 96 }}
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" 
                    />
                  </Avatar>
                  <Typography className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </Typography>
                </Stack>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* 3. QUALITY & BENTO GRID (FIXED) */}
      <Container maxWidth="xl" className="pt-20">        
        {/* Quality Icons */}
        <Box className="text-center">
          <Typography className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-200">There are some redeeming factors</Typography>
          <Typography variant="h3" className="font-black text-slate-900">We Provide High Quality Goods</Typography>

          {/* // 2. Map through it in your JSX */}
          <Grid container spacing={4} justifyContent="center" className="max-w-5xl mx-auto mt-8">
            {FEATURES.map((feature) => (
              <Grid 
                key={feature.title} 
                size={{ xs: 4, sm: 4 }}
              >
                <Stack alignItems="center" spacing={1}>
                  {/* Render the icon component dynamically */}
                  <feature.icon className="text-slate-900 text-5xl mb-2" />
                  
                  <Typography className="font-bold text-slate-900 text-lg">
                    {feature.title}
                  </Typography>
                  
                  <Typography className="text-xs text-slate-500 max-w-[200px]">
                    {feature.desc}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* --- FIXED BENTO GRID --- */}
        <Grid container spacing={4} className="pt-20 md:px-8">
          {BENTO_ITEMS.map((item, index) => (
            <Grid 
              key={index}
              size={{ xs: 12, md: 6 }}
            >
              <Paper 
                elevation={0} 
                // We use template literals to insert the dynamic 'justify' class
                className={`bg-[#f3f4f6] rounded-[2rem] p-8 h-[320px] relative overflow-hidden flex flex-col ${item.justify} items-start`}
                sx={{
                  background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #eef0f3 100%)'
                }}
              >
                {/* Text Container */}
                <Box className={`z-10 relative ${item.textWrapperClass || ''}`}>
                  <Typography className="text-blue-600 text-xs font-bold uppercase mb-2">
                    {item.subtitle}
                  </Typography>
                  
                  {item.title}
                  
                  <Button 
                    component={Link}
                    href={item.link}
                    variant={item.btnVariant} 
                    className={item.btnClass}
                  >
                    {item.btnText}
                  </Button>
                </Box>

                {/* Image */}
                <img 
                  src={item.imgSrc} 
                  className={item.imgClass} 
                  alt={item.imgAlt}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* 4. NEW ARRIVALS (FUNCTIONAL TABS) */}
      <Container maxWidth="xl" className="pt-20">
        <Box className="text-center mb-12">
          <Typography className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">Hurry up to buy</Typography>
          <Typography variant="h3" className="font-black text-slate-900 mb-6">New Arrivals</Typography>
          
          {/* INTERACTIVE TABS */}
          <Stack direction="row" spacing={4} justifyContent="center" className="mb-8">
            {['CASES', 'STRAPS', 'MAGSAFE'].map((tab) => (
              <Typography 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer font-bold text-sm uppercase tracking-widest pb-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab 
                  ? 'text-slate-900 border-slate-900' 
                  : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* DYNAMIC PRODUCT GRID */}
        <Grid container spacing={4} className="min-h-[400px]  md:px-8">
          {filteredProducts.map((item) => (
            <Grid 
              // ❌ Removed 'item'
              // ✅ Updated size syntax
              size={{ xs: 12, sm: 6, md: 3 }}
              key={item.id} 
              className="fade-in"
            >
              <Box className="group cursor-pointer">
                <Box className="relative h-64 bg-slate-50 rounded-[2rem] mb-4 overflow-hidden group-hover:shadow-lg transition-all duration-500">
                  <img 
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small" 
                      className={`absolute top-4 left-4 font-bold ${
                        item.badge === 'HOT' ? 'bg-red-500 text-white' : 
                        item.badge === 'SOLD OUT' ? 'bg-white/90 text-slate-500 backdrop-blur-sm' : 
                        'bg-blue-600 text-white'
                      }`} 
                    />
                  )}
                </Box>
                <Box className="text-center">
                  <Typography className="font-bold text-slate-900 mb-1">{item.name}</Typography>
                  <Typography className="text-xs text-slate-500 mb-2">{item.category} Collection</Typography>
                  <Typography className="font-bold text-blue-600">{item.price}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
          
          {filteredProducts.length === 0 && (
            <Box className="w-full text-center py-20">
              <Typography className="text-slate-400">No products found in this category yet.</Typography>
            </Box>
          )}
        </Grid>
      </Container>

      {/* 5. BLOG SECTION */}
      <Box className="bg-slate-50 pt-20">
        <Container maxWidth="xl">
          <Box className="text-center">
            <Typography className="text-blue-600 font-bold text-sm mb-2">Our latest news</Typography>
            <Typography variant="h4" className="font-black text-slate-900">Interesting About Gadgets</Typography>
          </Box>
          
          <Grid container spacing={4} className=" md:px-8">
            {BLOG_POSTS.map((post) => (
              <Grid 
                key={post.id}
                size={{ xs: 12, sm: 6, md: 3 }}
              >
                <Paper elevation={0} className="rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full group cursor-pointer">
                  <Box className="h-48 bg-slate-200 relative overflow-hidden">
                    <Box className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center min-w-[60px] z-10 shadow-sm">
                      <Typography className="font-black text-slate-900 text-lg leading-none">{post.date.split(' ')[0]}</Typography>
                      <Typography className="text-[10px] font-bold text-slate-500 uppercase">{post.date.split(' ')[1]}</Typography>
                    </Box>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </Box>
                  <Box className="p-6">
                    <Typography className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1} className="mt-2">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 10 }} className="bg-slate-900">M</Avatar>
                      <Typography className="text-xs text-slate-400">Mr. Manager</Typography>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </main>
  );
}