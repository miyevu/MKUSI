'use client';
import { Typography, Box, Stack, Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';
import { useProducts, getDiscountedPrice } from '@/context/ProductContext';

interface ProductProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  stock: number;
  discountType?: 'percent' | 'fixed' | null;
  discountValue?: number | null;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ id, name, price, oldPrice, image, brand, stock, discountType, discountValue, viewMode = 'grid' }: ProductProps) {
  const isList = viewMode === 'list';
  const rating = (4.0 + (id % 10) * 0.1).toFixed(1);
  const { addToCart } = useProducts();
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'warning' | 'error' }>({ open: false, message: '', severity: 'success' });

  const { finalPrice, hasDiscount } = getDiscountedPrice({ price, discountType, discountValue } as any);
  const discountPercent = hasDiscount
    ? (discountType === 'percent' ? Math.round(discountValue!) : Math.round(((price - finalPrice) / price) * 100))
    : (oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(id, 1);
    if (!result.success) {
      setToast({ open: true, message: result.message || 'Could not add to cart.', severity: 'error' });
    } else if (result.message) {
      setToast({ open: true, message: result.message, severity: 'warning' });
    } else {
      setToast({ open: true, message: 'Added to cart.', severity: 'success' });
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(id, 1);
    if (!result.success) {
      setToast({ open: true, message: result.message || 'Could not add to cart.', severity: 'error' });
      return;
    }
    window.location.href = '/cart';
  };

  return (
    <Link href={`/shop/${id}`} className="no-underline block group h-full">
      <Box className={`flex ${isList ? 'flex-row items-center p-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm' : 'flex-col'} h-full gap-3`}>
        
        {/* 1. IMAGE SECTION */}
        <Box className={`relative bg-[#F6F6F6] rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:bg-[#EAEAEA] 
          ${isList ? 'w-48 h-48 shrink-0' : 'aspect-square w-full'}`}
        >
          {isList ? (
            <Stack spacing={0.8} className="absolute top-3 left-3 z-10 items-start">
              {discountPercent && (
                <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm uppercase">
                  {discountPercent}% OFF
                </span>
              )}
              <span className="bg-white px-2.5 py-1 rounded-full text-[9px] font-bold text-slate-900 shadow-sm whitespace-nowrap">
                {brand}
              </span>
            </Stack>
          ) : (
            <>
              {discountPercent && (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm uppercase z-10">
                  {discountPercent}% OFF
                </span>
              )}
              <span className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-[9.5px] font-bold text-slate-900 shadow-sm whitespace-nowrap z-10">
                {brand}
              </span>
            </>
          )}

          <img 
            src={image || "https://via.placeholder.com/300x300?text=MKUSI"} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Box>

        {/* 2. DETAILS SECTION */}
        <Box className="flex flex-col flex-grow min-w-0">
          
          <Typography className={`font-extrabold text-slate-900 mb-1 leading-tight truncate ${isList ? 'text-xl' : 'text-[16px]'}`}>
            {name}
          </Typography>

          <div className={`flex justify-between items-center mt-3 mb-2 flex-nowrap gap-2 ${isList ? 'flex-col  items-start !mb-12' : ''}`}>
            
            <Stack direction="row" alignItems="center" spacing={0.5} className="min-w-0 overflow-hidden opacity-80">
              <StarIcon className="text-orange-400 text-xs flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-700 flex-shrink-0">{rating}</span>
            </Stack>

            {hasDiscount ? (
              <Stack alignItems={isList ? "flex-start" : "flex-end"} className="flex-shrink-0">
                <Typography className={`font-black text-blue-800 whitespace-nowrap ${isList ? 'text-2xl' : 'text-lg'}`}>
                  GH₵ {finalPrice.toFixed(2)}
                </Typography>
                <Typography className="text-slate-400 line-through text-xs whitespace-nowrap">
                  GH₵ {price.toFixed(2)}
                </Typography>
              </Stack>
            ) : (
              <Stack alignItems={isList ? "flex-start" : "flex-end"} className="flex-shrink-0">
                <Typography className={`font-black text-blue-800 whitespace-nowrap ${isList ? 'text-2xl' : 'text-lg'}`}>
                  GH₵ {price.toFixed(2)}
                </Typography>
              </Stack>
            )}
          </div>

          {/* 3. BUTTONS SECTION */}
          <div className={`flex gap-2 ${isList ? 'w-fit' : 'mt-auto'}`}>
            <Button 
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`rounded-full py-2 font-bold normal-case shadow-sm transition-colors whitespace-nowrap 
                ${isList ? 'px-8 bg-black text-white hover:bg-slate-800' : 'flex-1 border border-slate-200 text-slate-900 bg-white hover:bg-slate-50 text-[10px]'}`}
              variant={isList ? "contained" : "outlined"}
            >
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            
            {isList && (
               <Button 
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="rounded-full px-8 py-2 font-bold normal-case border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm"
               >
                Buy Now
               </Button>
            )}
          </div>
        </Box>

      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Link>
  );
}