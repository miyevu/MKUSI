'use client';
import React, { useState, useMemo } from 'react';
import {
  Typography, Box, Stack, Button, IconButton, Paper, InputBase,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Snackbar, Alert, CircularProgress, Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Link from 'next/link';
import { useProducts, Product } from '@/context/ProductContext';
import { exportToCSV } from '@/lib/csvExport';

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  Active:         { bg: '#dcfce7', color: '#15803d' },
  'Out of Stock': { bg: '#fee2e2', color: '#b91c1c' },
  'Low Stock':    { bg: '#fef9c3', color: '#a16207' },
};

const FILTERS = ['All', 'Active', 'Low Stock', 'Out of Stock'];
const CATEGORIES = ['Phone Cases', 'Chargers', 'Screen Protectors', 'Audio', 'Cables'];

function clampNonNegative(value: string): string {
  if (value === '') return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  return num < 0 ? '0' : value;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
  },
};

function deriveStatus(stock: number): string {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'Active';
}

export default function InventoryPage() {
  const { products, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', brand: '', category: '', price: '', stock: '', description: '', compatibility: '',
    discountType: '', discountValue: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const status = deriveStatus(p.stock);
    const matchFilter = filter === 'All' ? true : status === filter;
    return matchSearch && matchFilter;
  }), [products, search, filter]);

  const openEdit = (product: Product) => {
    setEditTarget(product);
    setEditForm({
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || '',
      compatibility: product.compatibility || '',
      discountType: product.discountType || '',
      discountValue: product.discountValue ? String(product.discountValue) : '',
    });
  };

  const closeEdit = () => setEditTarget(null);

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setSavingEdit(true);

    const newStock = Number(editForm.stock);
    const result = await updateProduct(editTarget.id, {
      name: editForm.name,
      brand: editForm.brand,
      category: editForm.category,
      price: Number(editForm.price),
      stock: newStock,
      status: newStock > 0 ? 'Active' : 'Out of Stock',
      description: editForm.description,
      compatibility: editForm.compatibility,
      discountType: editForm.discountType ? (editForm.discountType as 'percent' | 'fixed') : null,
      discountValue: editForm.discountType ? Number(editForm.discountValue) : null,
    });

    setSavingEdit(false);

    if (result.success) {
      setToast({ open: true, message: 'Product updated.', severity: 'success' });
      closeEdit();
    } else {
      setToast({ open: true, message: result.error || 'Failed to update product.', severity: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteProduct(deleteTarget.id);
    setDeleting(false);

    if (result.success) {
      setToast({ open: true, message: 'Product deleted.', severity: 'success' });
      setDeleteTarget(null);
    } else {
      setToast({ open: true, message: result.error || 'Failed to delete product.', severity: 'error' });
    }
  };

  const handleExport = () => {
    const rows = filtered.map(p => ({
      'Product ID': p.id,
      Name: p.name,
      Category: p.category,
      Brand: p.brand,
      Price: p.price,
      Stock: p.stock,
      Status: deriveStatus(p.stock),
      DiscountType: p.discountType || '',
      DiscountValue: p.discountValue || '',
      Description: p.description,
      Compatibility: p.compatibility,
    }));
    exportToCSV(`mkusi-inventory-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  const columns: GridColDef<Product>[] = [
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
      width: 130,
      renderCell: (params: GridRenderCellParams<Product>) => (
        params.row.discountType && params.row.discountValue ? (
          <Chip label="Discounted" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.65rem' }} />
        ) : (
          <Typography className="font-bold text-slate-900 text-sm">GH₵ {params.row.price}</Typography>
        )
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 110,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Typography className={`font-bold text-sm ${params.row.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
          {params.row.stock} units
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams<Product>) => {
        const status = deriveStatus(params.row.stock);
        const style = STATUS_CONFIG[status];
        return (
          <Chip
            label={status}
            size="small"
            sx={{ bgcolor: style.bg, color: style.color, fontWeight: 800, fontSize: '0.7rem' }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => openEdit(params.row)}
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <EditRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setDeleteTarget(params.row)}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Inventory
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {products.length} products · {products.filter(p => p.stock <= 5 && p.stock > 0).length} low stock
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} className="shrink-0">
          <Button
            onClick={handleExport}
            variant="outlined"
            startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold normal-case rounded-2xl px-5 py-2.5 text-sm"
          >
            Export CSV
          </Button>
          <Button
            component={Link}
            href="/admin/add-product"
            variant="contained"
            startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
            className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-5 py-2.5 shadow-none transition-colors text-sm"
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Search + Filter Bar */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 2, mb: 4 }}
        className="bg-white"
      >
        <Box className="flex flex-col sm:flex-row gap-3">
          <Box className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2.5 flex-1">
            <SearchRoundedIcon sx={{ fontSize: 18 }} className="text-slate-400 shrink-0" />
            <InputBase
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm font-medium text-slate-900"
              sx={{ '& input::placeholder': { color: '#94a3b8' } }}
            />
          </Box>

          <Stack direction="row" spacing={1} className="flex-wrap gap-y-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  filter === f
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </Stack>
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
                <Typography className="text-slate-400 text-sm">Try a different search or filter.</Typography>
              </Box>
            ),
          }}
        />
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onClose={closeEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle className="font-black text-slate-900">Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={3} className="pt-2">
            <TextField
              fullWidth label="Product Name"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              sx={fieldSx}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth label="Brand"
                value={editForm.brand}
                onChange={e => setEditForm({ ...editForm, brand: e.target.value })}
                sx={fieldSx}
              />
              <TextField
                fullWidth select label="Category"
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                sx={fieldSx}
              >
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth label="Price (GH₵)" type="number"
                value={editForm.price}
                onChange={e => setEditForm({ ...editForm, price: clampNonNegative(e.target.value) })}
                inputProps={{ min: 0 }}
                sx={fieldSx}
              />
              <TextField
                fullWidth label="Stock Qty" type="number"
                value={editForm.stock}
                onChange={e => setEditForm({ ...editForm, stock: clampNonNegative(e.target.value) })}
                inputProps={{ min: 0 }}
                sx={fieldSx}
              />
            </Stack>
            <Box>
              <Typography className="text-xs font-bold text-slate-500 mb-2">Discount (optional)</Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth select label="Discount Type"
                  value={editForm.discountType}
                  onChange={e => setEditForm({ ...editForm, discountType: e.target.value })}
                  sx={fieldSx}
                >
                  <MenuItem value="">No discount</MenuItem>
                  <MenuItem value="percent">Percentage off</MenuItem>
                  <MenuItem value="fixed">Fixed amount off</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label={editForm.discountType === 'fixed' ? 'Amount off (GH₵)' : 'Percent off (%)'}
                  type="number"
                  disabled={!editForm.discountType}
                  value={editForm.discountValue}
                  onChange={e => setEditForm({ ...editForm, discountValue: clampNonNegative(e.target.value) })}
                  inputProps={{ min: 0, max: editForm.discountType === 'percent' ? 100 : undefined }}
                  sx={fieldSx}
                />
              </Stack>
            </Box>
            <TextField
              fullWidth label="Description" multiline rows={3}
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              sx={fieldSx}
            />
            <TextField
              fullWidth label="Compatible Phone Models"
              value={editForm.compatibility}
              onChange={e => setEditForm({ ...editForm, compatibility: e.target.value })}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeEdit} className="text-slate-500 font-bold normal-case">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            disabled={savingEdit}
            variant="contained"
            startIcon={savingEdit ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-xl px-6"
          >
            {savingEdit ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Box className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WarningAmberRoundedIcon sx={{ fontSize: 26 }} className="text-red-500" />
          </Box>
          <Typography className="font-black text-slate-900 text-lg mb-2">Delete this product?</Typography>
          <Typography className="text-slate-500 text-sm">
            "{deleteTarget?.name}" will be permanently removed from your inventory. This can't be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} className="text-slate-500 font-bold normal-case px-6">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            variant="contained"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-red-500 hover:bg-red-600 text-white font-bold normal-case rounded-xl px-6"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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