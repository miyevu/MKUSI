'use client';
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { 
  Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Stack, IconButton, MenuItem, Select, Button, Grid, Skeleton
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { searchProducts } from '@/lib/search';

function ProductCardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" sx={{ borderRadius: '1.5rem', aspectRatio: '1', width: '100%' }} />
      <Skeleton variant="text" width="80%" height={22} sx={{ mt: 1.5 }} />
      <Skeleton variant="text" width="40%" height={18} />
    </Box>
  );
}

function ShopPageContent() {
  const { products, productsLoading } = useProducts();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [sortMethod, setSortMethod] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = useMemo(() => {
    const uniqueCatNames = Array.from(new Set(products.map(p => p.category)));
    return [
      { name: 'All', count: products.length },
      ...uniqueCatNames.map(name => ({
        name,
        count: products.filter(p => p.category === name).length
      }))
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = searchQuery
      ? searchProducts(products, searchQuery)
      : [...products];

    result = result.filter((p) => selectedCategory === 'All' || p.category === selectedCategory);

    if (sortMethod === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortMethod === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortMethod === 'featured' && !searchQuery) result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, selectedCategory, sortMethod, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const topRated = products.slice(0, 3);

  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      
      <Container maxWidth="xl" className="py-8 md:py-12">

        {searchQuery && !productsLoading && (
          <Box className="mb-6 flex items-center gap-3 flex-wrap">
            <Typography className="text-slate-600 text-sm">
              Showing results for <span className="font-black text-slate-900">"{searchQuery}"</span>
              {' '}· {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </Typography>
            <Button
              component={Link}
              href="/shop"
              className="text-blue-600 hover:text-blue-700 font-bold normal-case text-sm px-2 py-0.5 min-w-0"
            >
              Clear search
            </Button>
          </Box>
        )}

        {/* Mobile category chips */}
        {!productsLoading && (
          <Box
            className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4"
            sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {cat.name} <span className="opacity-70">({cat.count})</span>
              </button>
            ))}
          </Box>
        )}

        <Grid container spacing={{ xs: 4, lg: 6 }}>
  
          {/* SIDEBAR: Hidden on Mobile */}
          <Grid size={{ md: 3 }} className="hidden md:block">
            <Stack spacing={4} className="md:sticky md:top-24">
              <Box>
                <Typography variant="h6" className="font-black text-slate-900 mb-4">Categories</Typography>
                {productsLoading ? (
                  <Box className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                    <Stack spacing={2}>
                      {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="text" height={22} />)}
                    </Stack>
                  </Box>
                ) : (
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
                )}
              </Box>

              {!productsLoading && topRated.length > 0 && (
                <Box>
                  <Typography variant="h6" className="font-black text-slate-900 mb-4">Top Rated</Typography>
                  <Stack spacing={2}>
                    {topRated.map((product) => (
                      <Stack key={product.id} direction="row" spacing={2} alignItems="center" className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer">
                         <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-slate-50 shrink-0" />
                         <Box>
                           <Typography variant="body2" className="font-black text-slate-800 leading-tight">{product.name}</Typography>
                           <Typography variant="caption" className="text-blue-600 font-bold">GH₵ {product.price}</Typography>
                         </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}
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
                <Typography className="text-slate-500 text-xs sm:text-sm font-bold">
                  {productsLoading ? 'Loading...' : `Showing ${filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredProducts.length)} of ${filteredProducts.length}`}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1.5} className="w-full sm:w-auto justify-between bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                <Typography className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">Sort By:</Typography>
                <Select
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                  size="small"
                  variant="standard"
                  disableUnderline
                  className="text-xs sm:text-sm font-bold text-slate-600 px-2"
                >
                  <MenuItem value="featured">{searchQuery ? 'Relevance' : 'Alphabetically, A-Z'}</MenuItem>
                  <MenuItem value="price-low">Price, low to high</MenuItem>
                  <MenuItem value="price-high">Price, high to low</MenuItem>
                </Select>
              </Stack>
            </Paper>

            {productsLoading ? (
              <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Grid key={i} size={isMobile ? { xs: 6 } : (viewMode === 'grid' ? { xs: 6, sm: 4, lg: 3 } : { xs: 12 })}>
                    <ProductCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : products.length === 0 ? (
              <Box className="py-24 text-center flex flex-col items-center">
                <Box className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                  <Inventory2OutlinedIcon sx={{ fontSize: 28 }} className="text-slate-300" />
                </Box>
                <Typography className="font-bold text-slate-900 mb-1">No products yet</Typography>
                <Typography className="text-slate-400 text-sm">Check back soon — new stock is on the way.</Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
                  {currentItems.map((product) => (
                    <Grid key={product.id} size={isMobile ? { xs: 6 } : (viewMode === 'grid' ? { xs: 6, sm: 4, lg: 3 } : { xs: 12 })}>
                      <ProductCard {...product} viewMode={isMobile ? 'grid' : viewMode} />
                    </Grid>
                  ))}
                </Grid>

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
                    <Typography className="text-slate-400 italic font-bold">
                      {searchQuery ? `No results for "${searchQuery}".` : 'No products found for this category.'}
                    </Typography>
                  </Box>
                )}
              </>
            )}

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}