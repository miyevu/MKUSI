'use client';
import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  Chip, 
  IconButton, 
  Avatar, 
  Button 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { BarChart } from '@mui/x-charts/BarChart';
import { useProducts } from '@/context/ProductContext';

export default function AdminDashboard() {
  const { orders, products } = useProducts();

  // Stats Logic
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (parseInt(order.total.replace(/[^0-9]/g, '')) || 0);
  }, 0);
  
  const activeOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  // Chart Data
  const chartData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]; 
  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Container maxWidth="xl" className="fade-in" sx={{ py: 6 }}>
      
      {/* Header */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="flex-end" 
        sx={{ mb: 5 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography fontWeight="500" color="text.secondary">
            Tuesday, 24 Feb 2026
          </Typography>
        </Box>
        <Chip 
          label="Live Data" 
          size="small" 
          sx={{ 
            bgcolor: '#dcfce7', // Tailwind green-100
            color: '#15803d', // Tailwind green-700
            fontWeight: 'bold' 
          }} 
        />
      </Stack>

      {/* METRIC CARDS ROW */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        
        {/* HERO CARD: REVENUE */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper 
            elevation={0} 
            sx={{
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              p: 4,
              borderRadius: '32px',
              bgcolor: '#1e293b',
              color: 'common.white',
              boxShadow: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, backdropFilter: 'blur(12px)' }}>
                <TrendingUpIcon sx={{ color: 'common.white' }} />
              </Box>
              <Chip 
                label="+12.5%" 
                size="small" 
                sx={{ bgcolor: '#10b981', color: 'common.white', fontWeight: 'bold', border: 'none' }} 
              />
            </Stack>
            
            <Box sx={{ mt: 4 }}>
              <Typography fontWeight="500" sx={{ color: 'grey.400', mb: 1 }}>
                Total Revenue
              </Typography>
              <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-0.02em', mb: 1 }}>
                GH₵ {totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ color: 'common.white', fontWeight: 'bold' }}>
                  +GH₵ 1,200
                </Box> 
                from last month
              </Typography>
            </Box>

            {/* Abstract Background Decoration */}
            <Box 
              sx={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: 256,
                height: 256,
                bgcolor: 'rgba(59, 130, 246, 0.2)', // Tailwind blue-500/20
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }} 
            />
          </Paper>
        </Grid>

        {/* SECONDARY STATS */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Grid container spacing={4} sx={{ height: '100%' }}>
            
            {/* Active Orders */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper 
                elevation={0} 
                sx={{
                  p: 4,
                  borderRadius: '32px',
                  bgcolor: 'common.white',
                  border: '1px solid',
                  borderColor: 'grey.100',
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 2 }
                }}
              >
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#fff7ed', color: '#ea580c', borderRadius: 4 }}>
                    <ShoppingCartIcon />
                  </Box>
                  <IconButton size="small">
                    <ArrowOutwardIcon sx={{ color: 'grey.300' }} />
                  </IconButton>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mb: 0.5 }}>
                  {activeOrders}
                </Typography>
                <Typography fontWeight="500" color="text.secondary">
                  Active Orders
                </Typography>
              </Paper>
            </Grid>

            {/* Inventory Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper 
                elevation={0} 
                sx={{
                  p: 4,
                  borderRadius: '32px',
                  bgcolor: 'common.white',
                  border: '1px solid',
                  borderColor: 'grey.100',
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 2 }
                }}
              >
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#faf5ff', color: '#9333ea', borderRadius: 4 }}>
                    <InventoryIcon />
                  </Box>
                  <IconButton size="small">
                    <ArrowOutwardIcon sx={{ color: 'grey.300' }} />
                  </IconButton>
                </Stack>
                <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mb: 0.5 }}>
                  {lowStock}
                </Typography>
                <Typography fontWeight="500" color="text.secondary">
                  Low Stock Items
                </Typography>
              </Paper>
            </Grid>

          </Grid>
        </Grid>
      </Grid>

      {/* MAIN CONTENT SPLIT */}
      <Grid container spacing={4}>
        
        {/* CHART SECTION */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: '32px', 
              bgcolor: 'common.white', 
              border: '1px solid', 
              borderColor: 'grey.100' 
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Sales Analytics
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Monthly" clickable sx={{ bgcolor: '#0f172a', color: 'common.white', fontWeight: 'bold' }} />
                <Chip label="Weekly" clickable variant="outlined" sx={{ borderColor: 'grey.200', fontWeight: 'bold' }} />
              </Stack>
            </Stack>
            
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                series={[{ data: chartData, color: '#1e293b' }]}
                height={350}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                hideLegend 
                borderRadius={8}
              />
            </Box>
          </Paper>
        </Grid>

        {/* RECENT TRANSACTIONS SIDE LIST */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: '32px', 
              bgcolor: 'common.white', 
              border: '1px solid', 
              borderColor: 'grey.100', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Recent Sales
              </Typography>
              <IconButton><MoreHorizIcon /></IconButton>
            </Stack>

            <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
              {orders.slice(0, 5).map((order, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    p: 1.5, 
                    borderRadius: 4, 
                    transition: 'background-color 0.2s', 
                    cursor: 'pointer', 
                    '&:hover': { 
                      bgcolor: 'grey.50',
                      '& .hover-text': { color: 'primary.main' }
                    } 
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 'bold', borderRadius: 3 }}>
                      {order.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" color="text.primary" className="hover-text" sx={{ transition: 'color 0.2s' }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.items.split(',')[0]}...
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" fontWeight="bold" color="text.primary">
                    {order.total}
                  </Typography>
                </Box>
              ))}
              
              {orders.length === 0 && (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 5 }}>
                  No recent sales
                </Typography>
              )}
            </Stack>
            
            {orders.length > 0 && (
               <Button 
                 fullWidth 
                 variant="outlined" 
                 sx={{ 
                   mt: 3, 
                   borderRadius: 3, 
                   borderColor: 'grey.200', 
                   color: 'text.secondary', 
                   fontWeight: 'bold', 
                   textTransform: 'none', 
                   py: 1.5, 
                   '&:hover': { borderColor: 'text.primary', color: 'text.primary' } 
                 }}
               >
                 View All Orders
               </Button>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}