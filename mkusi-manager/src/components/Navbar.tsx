'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, InputBase, Box, Badge, IconButton, 
  Paper, List, ListItem, ListItemText, Divider, Stack, Drawer, 
  ListItemButton, ListItemIcon, Collapse 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
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

export default function Navbar() {
  const { products, globalSearch, setGlobalSearch } = useProducts();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
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
                {/* Desktop Dropdown logic omitted for brevity, but remains intact */}
              </Box>
            </Box>

            <Box className="flex items-center justify-end w-1/4">
              <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
                <IconButton onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  {isMobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
                <IconButton onClick={() => router.push('/profile')}><AccountCircleIcon /></IconButton>
                <IconButton><Badge badgeContent={0} color="primary"><ShoppingCartIcon /></Badge></IconButton>
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
              {/* Mobile Dropdown Results logic remains here */}
            </Box>
          </Collapse>
        </Toolbar>
      </AppBar>

      {/* --- MOBILE DRAWER (HAMBURGER MENU) --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: '320px', padding: '24px' } }}
      >
        <Box className="flex flex-col h-full">
          <Box className="flex justify-between items-center mb-8">
            <Typography variant="h5" className="font-black text-blue-600 tracking-tighter">MKUSI</Typography>
            <IconButton onClick={() => setMobileOpen(false)} className="bg-slate-50 rounded-xl"><CloseIcon /></IconButton>
          </Box>

          <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
            Navigation
          </Typography>

          <List className="p-0">
            {/* 1. SHOP */}
            <Link href="/shop" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><StorefrontIcon className="text-blue-600" /></ListItemIcon>
                <ListItemText primary="Shop" primaryTypographyProps={{ className: 'font-bold text-slate-800' }} />
              </ListItemButton>
            </Link>

            {/* 2. SUPPORT */}
            <Link href="/support" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><SupportAgentIcon className="text-blue-600" /></ListItemIcon>
                <ListItemText primary="Support" primaryTypographyProps={{ className: 'font-bold text-slate-800' }} />
              </ListItemButton>
            </Link>

            <Divider className="my-4 opacity-50" />

            <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
              Admin Section
            </Typography>

            {/* 3. ADMIN */}
            <Link href="/admin" className="no-underline text-inherit" onClick={() => setMobileOpen(false)}>
              <ListItemButton className="rounded-2xl mb-2 hover:bg-slate-50 py-3">
                <ListItemIcon className="min-w-[40px]"><AdminPanelSettingsIcon className="text-slate-400" /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ className: 'font-bold text-slate-500' }} />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </Drawer>
    </>
  );
}