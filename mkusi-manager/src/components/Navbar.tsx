'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, Accordion, AccordionDetails, AccordionSummary, Toolbar, Typography, InputBase, Box, Badge, IconButton, 
  Paper, List, ListItem, ListItemText, Divider, Stack, Drawer, 
  ListItemButton, ListItemIcon, Collapse, Button
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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
  
  // --- NEW CART STATE ---
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
            <Box className="flex items-center w-1/4">
              <Link href="/" className="no-underline">
                <Typography variant="h5" className="font-black text-blue-600 tracking-tighter">MKUSI</Typography>
              </Link>
            </Box>

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
                {/* Desktop Dropdown logic omitted for brevity */}
              </Box>
            </Box>

            <Box className="flex items-center justify-end w-1/4">
              <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
                <IconButton onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  {isMobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
                <IconButton onClick={() => router.push('/profile')} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <AccountCircleIcon />
                </IconButton>
                
                {/* --- UPDATED CART ICON BUTTON --- */}
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
            </Box>
          </Collapse>
        </Toolbar>
      </AppBar>

      {/* --- EXISTING NAVIGATION DRAWER --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: '320px', padding: '24px' } }}
      >
         {/* Navigation Drawer Content Omitted for Brevity - Remains exactly the same */}
      </Drawer>

      {/* --- NEW SHOPPING CART DRAWER --- */}
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
              // Custom Scrollbar Styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: '10px',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#94a3b8',
                },
              },
            }}
          >
            {MOCK_CART_ITEMS.length === 0 ? (
              <Box className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCartIcon sx={{ fontSize: 80 }} className="text-slate-200 mb-4" />
                <Typography variant="h6" className="font-black text-slate-900 mb-2">Your cart is empty</Typography>
                <Typography className="text-slate-500 mb-6">Looks like you haven't added anything yet.</Typography>
                {/* <Button variant="contained" className="bg-blue-600 font-bold px-8 py-3 rounded-xl normal-case shadow-none" onClick={() => {setCartOpen(false); router.push('/shop');}}>
                  Continue Shopping
                </Button> */}
              </Box>
            ) : (
              <Stack spacing={4}>
                {MOCK_CART_ITEMS.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    // You can pass the actual functions here later when Context is ready
                    // onIncrease={() => increaseQuantity(item.id)}
                    // onDecrease={() => decreaseQuantity(item.id)}
                    // onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Cart Footer / Checkout Area */}
          {MOCK_CART_ITEMS.length > 0 && (
            <Box className="px-6 py-3 bg-white border-t border-slate-100">
              {/* <Stack spacing={2} className="mb-4">
                <Box className="flex justify-between items-center text-slate-500">
                  <Typography className="font-bold text-sm">Subtotal</Typography>
                  <Typography className="font-bold text-sm">₵{cartSubtotal.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between items-center text-slate-500">
                  <Typography className="font-bold text-sm">Shipping</Typography>
                  <Typography className="font-bold text-sm uppercase text-xs">Calculated at checkout</Typography>
                </Box>
                <Divider />
                <Box className="flex justify-between items-center">
                  <Typography className="font-black text-lg text-slate-900">Total</Typography>
                  <Typography className="font-black text-xl text-blue-600">₵{cartSubtotal.toFixed(2)}</Typography>
                </Box>
              </Stack> */}
              <Accordion 
                elevation={0} 
                disableGutters
                className="before:hidden bg-transparent flex flex-col-reverse"
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon className="text-slate-900" />} 
                  className="px-2 hover:bg-slate-50 transition-colors rounded-lg border-t border-slate-100"
                >
                  {/* Always Visible: Total (Forced to the bottom visually) */}
                  <Box className="flex justify-between items-center w-full pr-4">
                    <Typography className="font-black text-lg text-slate-900">Total</Typography>
                    <Typography className="font-black text-xl text-blue-600">₵{cartSubtotal.toFixed(2)}</Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails className="px-2 pb-0 pt-0 text-slate-500 text-sm leading-relaxed">
                  {/* Hidden Breakdown: Expands above the Total */}
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