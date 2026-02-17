'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Stack, IconButton, MenuItem, Select, Button, Grid
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// DUMMY PRODUCTS DATA
const DUMMY_PRODUCTS = Array.from({ length: 30 }).map((_, index) => ({
  id: 101 + index,
  name: index % 3 === 0 ? `Drou Watch Ultra ${index}` : index % 3 === 1 ? `iPhone Case ${index}` : `JBL Speaker ${index}`,
  price: Math.floor(Math.random() * 1000) + 100,
  oldPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 1500) + 1100 : undefined,
  // Using more varied categories from your prompt
  category: ['Accessories', 'Laptops', 'Headphones', 'Charger', 'Iphone'][index % 5],
  stock: 10,
  image: `https://images.unsplash.com/photo-${1523275335684 + index}-37898b6baf30?auto=format&fit=crop&w=500&q=80`
}));

export default function ShopPage() {
  const [sortMethod, setSortMethod] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ DYNAMIC CATEGORIES LOGIC: Extracts unique categories from your data
  const categories = useMemo(() => {
    // Get unique categories from the products array
    const uniqueCatNames = Array.from(new Set(DUMMY_PRODUCTS.map(p => p.category)));
    
    return [
      { name: 'All', count: DUMMY_PRODUCTS.length },
      ...uniqueCatNames.map(name => ({
        name,
        count: DUMMY_PRODUCTS.filter(p => p.category === name).length
      }))
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS].filter((p) => selectedCategory === 'All' || p.category === selectedCategory);
    if (sortMethod === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortMethod === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortMethod === 'featured') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [selectedCategory, sortMethod]);

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <Container maxWidth="xl" className="py-8 md:py-12">
        <Grid container spacing={{ xs: 4, lg: 6 }}>
  
          {/* SIDEBAR: Hidden on Mobile */}
          <Grid size={{ md: 3 }} className="hidden md:block">
            <Stack spacing={4} className="md:sticky md:top-24">
              <Box>
                <Typography variant="h6" className="font-black text-slate-900 mb-4">Categories</Typography>
                <List disablePadding className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {categories.map((cat, index) => (
                    <React.Fragment key={cat.name}>
                      <ListItem 
                        component="div"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`hover:bg-blue-50 py-3 px-4 transition-all cursor-pointer ${selectedCategory === cat.name ? 'bg-blue-50' : ''}`}
                      >
                        <ListItemText 
                          primary={cat.name} 
                          primaryTypographyProps={{ className: `text-sm font-bold ${selectedCategory === cat.name ? 'text-blue-600' : 'text-slate-700'}` }} 
                        />
                        <Box className={`text-xs font-bold px-2 py-1 rounded-md ${selectedCategory === cat.name ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                          {cat.count}
                        </Box>
                      </ListItem>
                      {index < categories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="h6" className="font-black text-slate-900 mb-4">Top Rated</Typography>
                <Stack spacing={2}>
                  {DUMMY_PRODUCTS.slice(0, 3).map((product) => (
                    <Stack key={product.id} direction="row" spacing={2} alignItems="center" className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer">
                       <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-slate-50 shrink-0" />
                       <Box>
                         <Typography variant="body2" className="font-black text-slate-800 leading-tight">{product.name}</Typography>
                         <Typography variant="caption" className="text-blue-600 font-bold">GH₵ {product.price}</Typography>
                       </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* CONTENT AREA */}
          <Grid size={{ xs: 12, md: 9 }}>
            
            {/* TOOLBAR */}
            <Paper elevation={0} className="p-4 mb-8 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 shadow-sm">
              <Stack direction="row" spacing={2} alignItems="center" className="w-full sm:w-auto justify-between">
                <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-blue-600 bg-blue-50 rounded-lg' : ''}><GridViewIcon /></IconButton>
                  <IconButton onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-blue-600 bg-blue-50 rounded-lg' : ''}><ViewListIcon /></IconButton>
                </Stack>
                <Typography className="text-slate-500 text-sm font-bold">
                  Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
                </Typography>
              </Stack>

              {/* Sort Dropdown: Always visible */}
              <Stack direction="row" alignItems="center" spacing={2} className="w-full sm:w-auto justify-between bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                <Typography className="text-sm font-bold text-slate-700">Sort By:</Typography>
                <Select
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                  size="small"
                  variant="standard"
                  disableUnderline
                  className="text-sm font-bold text-slate-600 px-2"
                >
                  <MenuItem value="featured">Alphabetically, A-Z</MenuItem>
                  <MenuItem value="price-low">Price, low to high</MenuItem>
                  <MenuItem value="price-high">Price, high to low</MenuItem>
                </Select>
              </Stack>
            </Paper>

            {/* PRODUCT GRID */}
            <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
              {currentItems.map((product) => (
                <Grid key={product.id} size={isMobile ? { xs: 6 } : (viewMode === 'grid' ? { xs: 6, sm: 4, lg: 3 } : { xs: 12 })}>
                  <ProductCard {...product} brand={product.category} viewMode={isMobile ? 'grid' : viewMode} />
                </Grid>
              ))}
            </Grid>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Box className="mt-12 flex flex-col items-center gap-4">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="min-w-0 w-10 h-10 rounded-full border border-slate-200 text-slate-900 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </Button>

                  <Typography className="font-black text-slate-900">
                    {currentPage} <span className="text-slate-400 font-medium mx-1">of</span> {totalPages}
                  </Typography>

                  <Button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="min-w-0 w-10 h-10 rounded-full border border-slate-200 text-slate-900 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </Button>
                </Stack>
              </Box>
            )}

            {filteredProducts.length === 0 && (
              <Box className="py-20 text-center">
                <Typography className="text-slate-400 italic font-bold">No products found for this category.</Typography>
              </Box>
            )}

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </main>
  );
}