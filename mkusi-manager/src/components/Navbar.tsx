'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, Accordion, AccordionDetails, AccordionSummary, Toolbar, Typography, InputBase, Box, Badge, IconButton, 
  Paper, List, ListItem, ListItemText, Divider, Stack, Drawer, 
  ListItemButton, ListItemIcon, Collapse, Button, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

// --- STYLED COMPONENTS ---
const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: '#f1f5f9', 
  '&:hover': { backgroundColor: '#e2e8f0' }, 
  width: '100%',
  maxWidth: '400px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b', 
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#0f172a',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    '&::placeholder': { color: '#94a3b8', opacity: 1 },
  },
}));

// --- MOCK CART DATA (Replace with Cart Context later) ---
const MOCK_CART_ITEMS = [
  { id: 1, name: "15000mAh Solar Power Bank", price: 510.00, quantity: 1, image: "https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=200" },
  { id: 2, name: "MagSafe Silicone Case", price: 150.00, quantity: 2, image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=200" }
];

export default function Navbar() {
  const { products, globalSearch, setGlobalSearch } = useProducts();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // --- CART STATE ---
  const [cartOpen, setCartOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null); 
  const router = useRouter();

  const liveResults = products.filter(p => 
    globalSearch && p.name.toLowerCase().includes(globalSearch.toLowerCase())
  ).slice(0, 5);

  const handleSearchEntered = () => {
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id: number) => {
    setShowDropdown(false);
    setIsMobileSearchOpen(false);
    setGlobalSearch(''); 
    router.push(`/shop/${id}`); 
  };

  const cartSubtotal = MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} className="border-b border-slate-100 bg-white/90 backdrop-blur-md z-50">
        <Toolbar className="container mx-auto flex flex-col py-1 px-4">
          
          <Box className="w-full flex justify-between items-center py-1">
            {/* Logo */}
            <Box className="flex items-center w-1/4">
              <Link href="/" className="no-underline">
                <Typography variant="h5" className="font-black text-blue-600 tracking-tighter">MKUSI</Typography>
              </Link>
            </Box>

            {/* Desktop Search */}
            <Box className="hidden md:flex justify-center w-2/4" ref={searchRef} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Box className="relative w-full flex justify-center">
                <SearchContainer>
                  <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search accessories..."
                    value={globalSearch}
                    onChange={(e) => { setGlobalSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                </SearchContainer>
                
                {/* Desktop Search Dropdown */}
                {showDropdown && globalSearch && (
                  <Paper 
                    elevation={0}
                    className="absolute top-[calc(100%+12px)] left-0 right-0 max-h-[480px] overflow-y-auto rounded-[2rem] border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl z-50 p-3"
                  >
                    {liveResults.length > 0 ? (
                      <>
                        <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3 pt-2">
                          Top Matches
                        </Typography>
                        <List className="p-0">
                          {liveResults.map((product) => (
                            <ListItemButton 
                              key={product.id} 
                              onClick={() => handleResultClick(product.id)}
                              className="rounded-2xl mb-1 hover:bg-slate-50 transition-all duration-300 group p-2.5 flex items-center gap-4"
                            >
                              <Box className="w-14 h-14 bg-white shadow-sm rounded-xl shrink-0 border border-slate-100 p-1.5 transition-transform group-hover:scale-105">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </Box>
                              
                              <Box className="flex-1">
                                <Typography className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                                  {product.name}
                                </Typography>
                                <Typography className="font-black text-blue-600 text-xs mt-0.5">
                                  ₵{product.price.toFixed(2)}
                                </Typography>
                              </Box>
                              
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0 ${
                                  product.stock !== 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                  {product.stock !== 0 ? "In Stock" : "Sold Out"}
                                </Box>
                                <ArrowForwardIosIcon 
                                  className="text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                                  sx={{ fontSize: 12 }} 
                                />
                              </Stack>
                            </ListItemButton>
                          ))}
                        </List>
                        <Box className="pt-2 mt-2 border-t border-slate-100">
                          <Button 
                            fullWidth 
                            className="text-slate-500 font-bold normal-case text-sm hover:text-blue-600 hover:bg-blue-50 rounded-xl py-3 transition-colors"
                            onClick={() => {
                              setShowDropdown(false);
                              router.push(`/shop?search=${globalSearch}`);
                            }}
                          >
                            View all results for "{globalSearch}"
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box className="py-12 px-6 text-center flex flex-col items-center">
                        <Box className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <SearchIcon className="text-slate-300" sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography className="font-black text-slate-900 text-base mb-1">No matches found</Typography>
                        <Typography className="text-slate-500 text-sm mb-6 max-w-[250px]">
                          We couldn't find anything for "{globalSearch}".
                        </Typography>
                        {/* <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                          <Typography className="text-xs font-bold text-slate-400 w-full mb-2">TRY SEARCHING FOR</Typography>
                          {['Cases', 'Chargers', 'Power Banks'].map(term => (
                            <Chip 
                              key={term} 
                              label={term} 
                              onClick={() => setGlobalSearch(term)}
                              className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer border border-slate-200"
                            />
                          ))}
                        </Stack> */}
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Box>

            {/* Action Icons */}
            <Box className="flex items-center justify-end w-1/4">
              <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
                <IconButton onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  {isMobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
                <IconButton onClick={() => router.push('/profile')} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <AccountCircleIcon />
                </IconButton>
                <IconButton onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={MOCK_CART_ITEMS.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* Mobile Search Collapse */}
          <Collapse in={isMobileSearchOpen} className="w-full md:hidden" onEntered={handleSearchEntered}>
            <Box className="pb-4 pt-1 px-2 relative">
              <SearchContainer className="!max-w-full">
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase
                  inputRef={mobileInputRef} 
                  placeholder="Search MKUSI store..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  type="search"
                />
              </SearchContainer>

              {/* Mobile Search Dropdown */}
              {globalSearch && (
                <Paper 
                  elevation={0}
                  className="absolute top-[calc(100%+8px)] left-2 right-2 max-h-[400px] overflow-y-auto rounded-[1.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-xl z-50 p-2"
                >
                  {liveResults.length > 0 ? (
                    <>
                      <List className="p-0">
                        {liveResults.map((product) => (
                          <ListItemButton 
                            key={product.id} 
                            onClick={() => handleResultClick(product.id)}
                            className="rounded-2xl mb-1 hover:bg-slate-50 transition-colors p-2 flex items-center gap-3"
                          >
                            <Box className="w-12 h-12 bg-white rounded-xl shrink-0 border border-slate-100 p-1">
                              <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </Box>
                            <Box className="flex-1">
                              <Typography className="font-bold text-slate-900 text-sm line-clamp-1">
                                {product.name}
                              </Typography>
                              <Typography className="font-black text-blue-600 text-xs mt-0.5">
                                ₵{product.price.toFixed(2)}
                              </Typography>
                            </Box>
                            <Box className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0 ${
                              product.stock !== 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {product.stock !== 0 ? "In Stock" : "Sold Out"}
                            </Box>
                          </ListItemButton>
                        ))}
                      </List>
                      <Button 
                        fullWidth 
                        className="mt-1 text-slate-500 font-bold normal-case text-sm bg-slate-50 hover:bg-slate-100 rounded-xl py-3"
                        onClick={() => {
                          setIsMobileSearchOpen(false);
                          router.push(`/shop?search=${globalSearch}`);
                        }}
                      >
                        See all results
                      </Button>
                    </>
                  ) : (
                    <Box className="py-10 px-4 text-center">
                      <SearchIcon className="text-slate-200 mb-2" sx={{ fontSize: 40 }} />
                      <Typography className="font-bold text-slate-900 text-sm mb-1">No results</Typography>
                      <Typography className="text-slate-500 text-xs mb-4">No accessories match "{globalSearch}"</Typography>
                      <Button 
                        size="small"
                        variant="outlined" 
                        className="rounded-lg text-slate-500 border-slate-200 font-bold normal-case"
                        onClick={() => setGlobalSearch('')}
                      >
                        Clear Search
                      </Button>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          </Collapse>
        </Toolbar>
      </AppBar>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: '320px', padding: '24px' } }}
      >
        <Box className="flex flex-col h-full">
          <Box className="flex justify-between items-center mb-8">
            <Typography variant="h5" className="font-black text-blue-600 tracking-tighter">MKUSI</Typography>
            <IconButton onClick={() => setMobileOpen(false)} className="bg-slate-50 rounded-xl">
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
            Navigation
          </Typography>

          <List className="p-0">
            <Link href="/shop" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><StorefrontIcon className="text-blue-600" /></ListItemIcon>
                <ListItemText primary="Shop" primaryTypographyProps={{ className: 'font-bold text-slate-800' }} />
              </ListItemButton>
            </Link>

            <Link href="/support" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><SupportAgentIcon className="text-blue-600" /></ListItemIcon>
                <ListItemText primary="Support" primaryTypographyProps={{ className: 'font-bold text-slate-800' }} />
              </ListItemButton>
            </Link>

            <Divider className="my-4 opacity-50 border-dashed" />

            <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
              Account & Admin
            </Typography>

            <Link href="/profile" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><AccountCircleIcon className="text-slate-400" /></ListItemIcon>
                <ListItemText primary="My Profile" primaryTypographyProps={{ className: 'font-bold text-slate-500' }} />
              </ListItemButton>
            </Link>

            <Link href="/admin" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><AdminPanelSettingsIcon className="text-slate-400" /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ className: 'font-bold text-slate-500' }} />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </Drawer>

      {/* --- SHOPPING CART DRAWER --- */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{ sx: { width: '100%', maxWidth: '450px', backgroundColor: '#fafafa' } }}
      >
        <Box className="flex flex-col h-full">
          
          {/* Cart Header */}
          <Box className="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
            <Typography variant="h5" className="font-black text-slate-900 tracking-tight">
              Your Cart ({MOCK_CART_ITEMS.length})
            </Typography>
            <IconButton onClick={() => setCartOpen(false)} className="bg-slate-50 hover:bg-slate-100 rounded-xl">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cart Items List */}
          <Box 
            className="flex-1 overflow-y-auto p-6"
            sx={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { backgroundColor: '#f8fafc', borderRadius: '10px' },
              '&::-webkit-scrollbar-thumb': { 
                backgroundColor: '#cbd5e1', 
                borderRadius: '10px', 
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: '#94a3b8' },
              },
            }}
          >
            {MOCK_CART_ITEMS.length === 0 ? (
              <Box className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCartIcon sx={{ fontSize: 80 }} className="text-slate-200 mb-4" />
                <Typography variant="h6" className="font-black text-slate-900 mb-2">Your cart is empty</Typography>
                <Typography className="text-slate-500 mb-6">Looks like you haven't added anything yet.</Typography>
                <Button variant="contained" className="bg-blue-600 font-bold px-8 py-3 rounded-xl normal-case shadow-none" onClick={() => {setCartOpen(false); router.push('/shop');}}>
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Stack spacing={4}>
                {MOCK_CART_ITEMS.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Cart Footer / Checkout Area */}
          {MOCK_CART_ITEMS.length > 0 && (
            <Box className="px-6 py-3 bg-white border-t border-slate-100">
              <Accordion 
                elevation={0} 
                disableGutters
                className="before:hidden bg-transparent flex flex-col-reverse"
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon className="text-slate-900" />} 
                  className="px-2 hover:bg-slate-50 transition-colors rounded-lg border-t border-slate-100"
                >
                  <Box className="flex justify-between items-center w-full pr-4">
                    <Typography className="font-black text-lg text-slate-900">Total</Typography>
                    <Typography className="font-black text-xl text-blue-600">₵{cartSubtotal.toFixed(2)}</Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails className="px-2 pb-0 pt-0 text-slate-500 text-sm leading-relaxed">
                  <Stack spacing={2}>
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm">Subtotal</Typography>
                      <Typography className="font-bold text-sm">₵{cartSubtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box className="flex justify-between items-center text-slate-500">
                      <Typography className="font-bold text-sm">Shipping</Typography>
                      <Typography className="font-bold text-sm uppercase text-[10px] tracking-wider">Calculated at checkout</Typography>
                    </Box>
                    <Divider/>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              
              <Button 
                variant="contained" 
                fullWidth 
                className="bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black text-base tracking-wide normal-case shadow-none transition-colors"
                onClick={() => {
                  setCartOpen(false);
                  router.push('/checkout');
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          )}

        </Box>
      </Drawer>
    </>
  );
}