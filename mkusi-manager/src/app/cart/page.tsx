'use client';
import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, // Imports the new modern Grid (formerly Grid2)
  Box, 
  Button, 
  IconButton, 
  Divider, 
  Stack,
  Card
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Link from 'next/link';

const CART_ITEMS = [
  { 
    id: 1, 
    name: "MagSafe Silicone Case", 
    price: 150, 
    brand: "iPhone 15 Pro", 
    qty: 1, 
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT4L3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693593574244" 
  },
];

export default function CartPage() {
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="900" 
          sx={{ mb: { xs: 4, md: 6 }, color: 'text.primary' }}
        >
          Your Bag
        </Typography>
        
        <Grid container spacing={4}>
          
          {/* Left Side: Items */}
          {/* UPDATED MUI RULE: 
            No 'item' prop needed. 
            'xs' and 'md' are now passed inside the 'size' prop. 
          */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              {CART_ITEMS.map((item) => (
                <Card 
                  key={item.id} 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3, 
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  {/* Product Image */}
                  <Box 
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ 
                      width: 96, 
                      height: 96, 
                      objectFit: 'contain', 
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      p: 1,
                      flexShrink: 0
                    }} 
                  />
                  
                  {/* Product Details */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="overline" 
                      color="primary.main" 
                      fontWeight="bold" 
                      sx={{ lineHeight: 1 }}
                    >
                      {item.brand}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {item.name}
                    </Typography>
                    
                    {/* Controls */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1.5 }}>
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}
                      >
                        <IconButton size="small" aria-label="decrease quantity">
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography fontWeight="bold" sx={{ px: 2 }}>
                          {item.qty}
                        </Typography>
                        <IconButton size="small" aria-label="increase quantity">
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <IconButton color="error" size="small" aria-label="remove item">
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Price */}
                  <Typography variant="h6" fontWeight="900" color="text.primary">
                    GH₵ {item.price}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Right Side: Summary */}
          {/* UPDATED MUI RULE: Replaced item and xs/md with size={{...}} */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                border: '1px solid',
                borderColor: 'grey.200',
                position: 'sticky', 
                top: 24 
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Order Summary
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="bold">GH₵ {subtotal}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight="bold" color="success.main">
                    Calculated at checkout
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="900" color="primary.main">
                    GH₵ {subtotal}
                  </Typography>
                </Stack>
              </Stack>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ 
                  py: 1.5, 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  boxShadow: 3
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                component={Link} 
                href="/shop"
                fullWidth 
                sx={{ 
                  mt: 2, 
                  textTransform: 'none', 
                  fontWeight: 'bold',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
}