'use client';
import React, { useState, useMemo } from 'react';
import {
  Typography, Box, Stack, Button, Paper, InputBase, CircularProgress, Alert, Snackbar, Chip, Checkbox
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { useProducts, Product } from '@/context/ProductContext';

export default function PromotionsPage() {
  const { products, productsLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const filtered = useMemo(() => products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  const selectedProducts = products.filter(p => selectedIds.has(p.id));

  const toggleSelected = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNotify = async () => {
    if (selectedProducts.length === 0) return;
    setSending(true);

    try {
      const res = await fetch('/api/notify-subscribers-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: selectedProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
          })),
        }),
      });
      const data = await res.json();

      if (data.error) {
        setToast({ open: true, message: data.error, severity: 'error' });
      } else if (data.total === 0) {
        setToast({ open: true, message: 'No subscribers yet.', severity: 'error' });
      } else {
        setToast({ open: true, message: `Sent to ${data.sent} of ${data.total} subscribers.`, severity: 'success' });
        setSelectedIds(new Set());
      }
    } catch {
      setToast({ open: true, message: 'Failed to send notifications.', severity: 'error' });
    }

    setSending(false);
  };

  const columns: GridColDef<Product>[] = [
    {
      field: 'select',
      headerName: '',
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Checkbox
          checked={selectedIds.has(params.row.id)}
          onChange={() => toggleSelected(params.row.id)}
          size="small"
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Product',
      width: 260,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Box className="flex items-center gap-3 h-full">
          <Box className="w-9 h-9 bg-[#f0f2f5] rounded-lg overflow-hidden flex items-center justify-center shrink-0 p-1">
            <img
              src={params.row.image || 'https://via.placeholder.com/100'}
              alt={params.row.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </Box>
          <Box className="min-w-0">
            <Typography className="font-bold text-slate-900 text-sm truncate">{params.row.name}</Typography>
            <Typography className="text-slate-400 text-[11px] font-medium">{params.row.brand || 'MKUSI'}</Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Typography className="font-bold text-slate-900 text-sm">GH₵ {params.row.price}</Typography>
      ),
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Promotions
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            Pick products to feature in an email to your subscribers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled={selectedProducts.length === 0 || sending}
          onClick={handleNotify}
          startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <CampaignRoundedIcon sx={{ fontSize: 18 }} />}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-2xl px-5 py-2.5 shadow-none transition-colors text-sm shrink-0"
        >
          {sending ? 'Sending...' : `Notify Subscribers${selectedProducts.length > 0 ? ` (${selectedProducts.length})` : ''}`}
        </Button>
      </Box>

      {selectedProducts.length > 0 && (
        <Paper
          elevation={0}
          sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'blue.100', p: 2, mb: 4 }}
          className="bg-blue-50/50"
        >
          <Typography className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
            Selected for this email
          </Typography>
          <Stack direction="row" spacing={1} className="flex-wrap gap-y-2">
            {selectedProducts.map(p => (
              <Chip key={p.id} label={p.name} size="small" className="bg-white font-semibold text-xs" />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Search */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 2, mb: 4 }}
        className="bg-white"
      >
        <Box className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2.5">
          <SearchRoundedIcon sx={{ fontSize: 18 }} className="text-slate-400 shrink-0" />
          <InputBase
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm font-medium text-slate-900"
            sx={{ '& input::placeholder': { color: '#94a3b8' } }}
          />
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}
        className="bg-white"
      >
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          loading={productsLoading}
          autoHeight
          rowHeight={72}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#94a3b8',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f8fafc',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8fafc60',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #f1f5f9',
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box className="flex flex-col items-center justify-center h-full py-12">
                <Typography className="font-bold text-slate-900 mb-1">No products found</Typography>
                <Typography className="text-slate-400 text-sm">Try a different search.</Typography>
              </Box>
            ),
          }}
        />
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}