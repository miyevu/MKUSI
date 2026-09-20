'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, Accordion, AccordionDetails, AccordionSummary, Toolbar, Typography, InputBase, Box, Badge, IconButton, 
  Paper, List, ListItemButton, Divider, Stack, Drawer, 
  ListItemIcon, Collapse, Button, Menu, MenuItem, ListItemIcon as MenuItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- ICONS ---
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CableIcon from '@mui/icons-material/Cable';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/lib/search';

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

export default function Navbar() {
  const { products, cartItems, updateCartQty, removeFromCart, globalSearch, setGlobalSearch } = useProducts();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null); 
  const router = useRouter();

  // Debounce: wait 200ms after the last keystroke before filtering
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(globalSearch), 200);
    return () => clearTimeout(handle);
  }, [globalSearch]);

  const liveResults = searchProducts(products, debouncedSearch).slice(0, 5);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [debouncedSearch]);

  const handleSearchEntered = () => {
    if (mobileInputRef.current) mobileInputRef.current.focus();
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

  const handleViewAllResults = () => {
    setShowDropdown(false);
    router.push(`/shop?search=${encodeURIComponent(globalSearch)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || liveResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % liveResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + liveResults.length) % liveResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < liveResults.length) {
        handleResultClick(liveResults[highlightedIndex].id);
      } else {
        handleViewAllResults();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const resolvedCartItems = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    })
    .filter((item): item is { id: number; name: string; price: number; quantity: number; image: string } => item !== null);

  const cartCount = resolvedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = resolvedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAccountIconClick = (e: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(e.currentTarget);
  };

  const closeAccountMenu = () => setAccountMenuAnchor(null);

  const handleGoToProfile = () => {
    closeAccountMenu();
    router.push(currentUser?.isAdmin ? '/admin' : '/profile');
  };

  const handleGoToAuth = () => {
    closeAccountMenu();
    router.push('/auth');
  };

  const handleLogout = async () => {
    closeAccountMenu();
    await logout();
    setMobileOpen(false);
    router.push('/auth');
  };

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
                    onKeyDown={handleSearchKeyDown}
                  />
                </SearchContainer>
                
                {showDropdown && debouncedSearch && (
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
                          {liveResults.map((product, index) => (
                            <ListItemButton 
                              key={product.id} 
                              onClick={() => handleResultClick(product.id)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={`rounded-2xl mb-1 transition-all duration-300 group p-2.5 flex items-center gap-4 ${index === highlightedIndex ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                            >
                              <Box className="w-14 h-14 bg-white shadow-sm rounded-xl shrink-0 border border-slate-100 p-1.5 transition-transform group-hover:scale-105">
                                <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                              </Box>
                              
                              <Box className="flex-1">
                                <Typography className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                                  {product.name}
                                </Typography>
                                <Typography className="text-slate-400 text-[11px] font-medium">
                                  {product.category}{product.brand ? ` · ${product.brand}` : ''}
                                </Typography>
                                <Typography className="font-black text-blue-600 text-xs mt-0.5">
                                  ₵{product.price.toFixed(2)}
                                </Typography>
                              </Box>
                            </ListItemButton>
                          ))}
                        </List>
                        <Box className="pt-2 mt-2 border-t border-slate-100">
                          <Button 
                            fullWidth 
                            className="text-slate-500 font-bold normal-case text-sm hover:text-blue-600 hover:bg-blue-50 rounded-xl py-3 transition-colors"
                            onClick={handleViewAllResults}
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

                <IconButton
                  onClick={handleAccountIconClick}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  {currentUser?.isAdmin
                    ? <AdminPanelSettingsOutlinedIcon />
                    : <AccountCircleIcon className={currentUser ? 'text-blue-600' : ''} />}
                </IconButton>

                <Menu
                  anchorEl={accountMenuAnchor}
                  open={Boolean(accountMenuAnchor)}
                  onClose={closeAccountMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: '16px',
                      minWidth: 240,
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {currentUser ? [
                    <Box key="header" className="px-4 pt-3 pb-2 border-b border-slate-100 mb-1">
                      <Typography className="font-bold text-slate-900 text-sm truncate">
                        {currentUser.isAdmin ? 'Manager' : `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Account'}
                      </Typography>
                      <Typography className="text-slate-400 text-xs truncate">
                        {currentUser.email}
                      </Typography>
                    </Box>,
                    <MenuItem key="profile" onClick={handleGoToProfile} sx={{ py: 1.2, px: 2, gap: 1.5 }}>
                      <MenuItemIcon sx={{ minWidth: 'unset' }}>
                        {currentUser.isAdmin
                          ? <DashboardOutlinedIcon fontSize="small" className="text-slate-500" />
                          : <PersonOutlineRoundedIcon fontSize="small" className="text-slate-500" />}
                      </MenuItemIcon>
                      <Typography className="font-semibold text-sm text-slate-700">
                        {currentUser.isAdmin ? 'Admin Dashboard' : 'Profile'}
                      </Typography>
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout} sx={{ py: 1.2, px: 2, gap: 1.5 }}>
                      <MenuItemIcon sx={{ minWidth: 'unset' }}>
                        <LogoutRoundedIcon fontSize="small" className="text-red-500" />
                      </MenuItemIcon>
                      <Typography className="font-semibold text-sm text-red-500">
                        Log Out
                      </Typography>
                    </MenuItem>
                  ] : (
                    <Box key="signed-out" className="px-4 py-3">
                      <Box className="flex items-center gap-2 mb-1">
                        <AccountCircleIcon fontSize="small" className="text-slate-300" />
                        <Typography className="font-bold text-slate-900 text-sm">
                          You're not signed in
                        </Typography>
                      </Box>
                      <Typography className="text-slate-400 text-xs mb-3">
                        Sign in to view your orders, wishlist, and profile.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleGoToAuth}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case text-xs rounded-xl py-2 shadow-none"
                      >
                        Sign In / Create Account
                      </Button>
                    </Box>
                  )}
                </Menu>

                <IconButton onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={cartCount} color="primary">
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
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleViewAllResults(); } }}
                  type="search"
                />
              </SearchContainer>
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
        <Box className="flex flex-col h-full justify-between">
          
          <Box>
            <Box className="flex justify-between items-center mb-6">
              <Typography variant="h5" className="font-black text-blue-600 tracking-tighter">MKUSI</Typography>
              <IconButton onClick={() => setMobileOpen(false)} className="bg-slate-50 rounded-xl">
                <CloseIcon />
              </IconButton>
            </Box>

            {currentUser ? (
              <Box className="mb-4 p-3 bg-blue-50 rounded-xl">
                <Typography className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">
                  {currentUser.isAdmin ? 'Admin' : 'Signed in as'}
                </Typography>
                <Typography className="font-bold text-slate-900 text-sm truncate">
                  {currentUser.isAdmin ? 'Manager' : `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email}
                </Typography>
              </Box>
            ) : (
              <Box className="mb-4 p-3 bg-slate-50 rounded-xl">
                <Typography className="font-bold text-slate-900 text-sm">
                  You're not signed in
                </Typography>
                <Typography className="text-slate-400 text-xs mt-0.5">
                  Sign in to view your orders and wishlist.
                </Typography>
              </Box>
            )}

            <List className="p-0">
              <Link href="/shop" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-3 px-2 border-b border-slate-100">
                  <ListItemIcon className="min-w-[40px]"><StorefrontIcon className="text-blue-600" /></ListItemIcon>
                  <Typography className="font-bold text-slate-800">Shop All</Typography>
                </ListItemButton>
              </Link>

              <Link href="/shop?cat=Phone%20Cases" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-3 px-2 border-b border-slate-100">
                  <ListItemIcon className="min-w-[40px]"><PhoneIphoneIcon className="text-blue-600" /></ListItemIcon>
                  <Typography className="font-bold text-slate-800">Cases & Covers</Typography>
                </ListItemButton>
              </Link>

              <Link href="/shop?cat=Chargers" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-3 px-2 border-b border-slate-100">
                  <ListItemIcon className="min-w-[40px]"><BatteryChargingFullIcon className="text-blue-600" /></ListItemIcon>
                  <Typography className="font-bold text-slate-800">Chargers</Typography>
                </ListItemButton>
              </Link>

              <Link href="/shop?cat=Cables" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-3 px-2 border-b border-slate-100">
                  <ListItemIcon className="min-w-[40px]"><CableIcon className="text-blue-600" /></ListItemIcon>
                  <Typography className="font-bold text-slate-800">Cables</Typography>
                </ListItemButton>
              </Link>

              <Link href="/shop?cat=Audio" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-3 px-2 border-b border-slate-100">
                  <ListItemIcon className="min-w-[40px]"><SmartphoneIcon className="text-blue-600" /></ListItemIcon>
                  <Typography className="font-bold text-slate-800">Audio</Typography>
                </ListItemButton>
              </Link>
            </List>
          </Box>

          <Box className="pt-4 mt-auto">
            <List className="p-0 mb-4">
              {currentUser && !currentUser.isAdmin && (
                <Link href="/profile" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                  <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-2.5 px-2">
                    <ListItemIcon className="min-w-[36px]"><AccountCircleIcon fontSize="small" className="text-slate-500" /></ListItemIcon>
                    <Typography className="font-bold text-sm text-slate-600 uppercase tracking-wide">My Account</Typography>
                  </ListItemButton>
                </Link>
              )}

              {currentUser ? (
                <ListItemButton onClick={handleLogout} className="rounded-xl mb-1 hover:bg-red-50 py-2.5 px-2">
                  <ListItemIcon className="min-w-[36px]"><LogoutRoundedIcon fontSize="small" className="text-red-500" /></ListItemIcon>
                  <Typography className="font-bold text-sm text-red-500 uppercase tracking-wide">Log Out</Typography>
                </ListItemButton>
              ) : (
                <Link href="/auth" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
                  <ListItemButton className="rounded-xl mb-1 hover:bg-slate-50 py-2.5 px-2">
                    <ListItemIcon className="min-w-[36px]"><LoginRoundedIcon fontSize="small" className="text-slate-500" /></ListItemIcon>
                    <Typography className="font-bold text-sm text-slate-600 uppercase tracking-wide">Sign In / Create Account</Typography>
                  </ListItemButton>
                </Link>
              )}
            </List>
          </Box>
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
          <Box className="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
            <Typography variant="h5" className="font-black text-slate-900 tracking-tight">Your Cart ({cartCount})</Typography>
            <IconButton onClick={() => setCartOpen(false)} className="bg-slate-50 hover:bg-slate-100 rounded-xl"><CloseIcon /></IconButton>
          </Box>

          <Box className="flex-1 overflow-y-auto p-6" sx={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '10px'} }}>
            {resolvedCartItems.length === 0 ? (
              <Box className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCartIcon sx={{ fontSize: 80 }} className="text-slate-200 mb-4" />
                <Typography variant="h6" className="font-black text-slate-900 mb-2">Your cart is empty</Typography>
                <Button variant="contained" className="bg-blue-600 font-bold px-8 py-3 rounded-xl normal-case" onClick={() => {setCartOpen(false); router.push('/shop');}}>Continue Shopping</Button>
              </Box>
            ) : (
              <Stack spacing={4}>
                {resolvedCartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={() => updateCartQty(item.id, 1)}
                    onDecrease={() => updateCartQty(item.id, -1)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {resolvedCartItems.length > 0 && (
            <Box className="px-6 py-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              <Accordion elevation={0} disableGutters className="before:hidden bg-transparent flex flex-col-reverse mb-2">
                <AccordionSummary expandIcon={<ExpandMoreIcon className="text-slate-900" />} className="px-2 border-t border-slate-100">
                  <Box className="flex justify-between items-center w-full pr-4">
                    <Typography className="font-black text-lg text-slate-900">Total</Typography>
                    <Typography className="font-black text-xl text-blue-600">₵{cartSubtotal.toFixed(2)}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails className="px-2 pb-0 pt-0 text-slate-500 text-sm">
                  <Stack spacing={2}>
                    <Box className="flex justify-between"><Typography className="font-bold text-sm">Subtotal</Typography><Typography className="font-bold text-sm">₵{cartSubtotal.toFixed(2)}</Typography></Box>
                    <Box className="flex justify-between"><Typography className="font-bold text-sm">Shipping</Typography><Typography className="font-bold text-sm uppercase text-[10px]">Calculated at checkout</Typography></Box>
                    <Divider/>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  className="bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-black text-base normal-case shadow-none transition-colors" 
                  onClick={() => {
                    setCartOpen(false); 
                    router.push('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  variant="outlined" 
                  fullWidth 
                  className="border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300 py-3 rounded-xl font-bold text-sm normal-case shadow-none transition-colors" 
                  onClick={() => {
                    setCartOpen(false); 
                    router.push('/cart');
                  }}
                >
                  View Full Cart
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}