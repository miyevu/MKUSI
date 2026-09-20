'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Stack, Button, Paper, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, Chip, IconButton, Switch
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { supabase } from '@/lib/supabase';

interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  usage_limit: number | null;
  times_used: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

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

export default function CouponsPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const [form, setForm] = useState({
    code: '', discountType: 'percent', discountValue: '', usageLimit: '', expiresAt: ''
  });

  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to fetch promo codes:', error.message);
      setCodes([]);
    } else {
      setCodes(data as PromoCode[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discountValue) {
      setToast({ open: true, message: 'Code and discount value are required.', severity: 'error' });
      return;
    }

    setCreating(true);
    const { error } = await supabase.from('promo_codes').insert([{
      code: form.code.trim().toUpperCase(),
      discount_type: form.discountType,
      discount_value: Number(form.discountValue),
      usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
      expires_at: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      active: true,
    }]);
    setCreating(false);

    if (error) {
      setToast({ open: true, message: error.code === '23505' ? 'This code already exists.' : error.message, severity: 'error' });
      return;
    }

    setToast({ open: true, message: 'Coupon created.', severity: 'success' });
    setCreateOpen(false);
    setForm({ code: '', discountType: 'percent', discountValue: '', usageLimit: '', expiresAt: '' });
    fetchCodes();
  };

  const handleToggleActive = async (row: PromoCode) => {
    const { error } = await supabase.from('promo_codes').update({ active: !row.active }).eq('id', row.id);
    if (error) {
      setToast({ open: true, message: 'Failed to update coupon.', severity: 'error' });
      return;
    }
    setCodes(prev => prev.map(c => c.id === row.id ? { ...c, active: !c.active } : c));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('promo_codes').delete().eq('id', deleteTarget.id);
    setDeleting(false);

    if (error) {
      setToast({ open: true, message: 'Failed to delete coupon.', severity: 'error' });
      return;
    }
    setCodes(prev => prev.filter(c => c.id !== deleteTarget.id));
    setToast({ open: true, message: 'Coupon deleted.', severity: 'success' });
    setDeleteTarget(null);
  };

  const columns: GridColDef<PromoCode>[] = [
    {
      field: 'code',
      headerName: 'Code',
      width: 160,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <Typography className="font-black text-slate-900 text-sm tracking-wide">{params.row.code}</Typography>
      ),
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 130,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <Typography className="font-bold text-blue-600 text-sm">
          {params.row.discount_type === 'percent' ? `${params.row.discount_value}%` : `₵${params.row.discount_value}`} off
        </Typography>
      ),
    },
    {
      field: 'usage',
      headerName: 'Usage',
      width: 130,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <Typography className="text-slate-600 text-sm font-medium">
          {params.row.times_used} / {params.row.usage_limit ?? '∞'}
        </Typography>
      ),
    },
    {
      field: 'expires_at',
      headerName: 'Expires',
      width: 150,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <Typography className="text-slate-500 text-sm">
          {params.row.expires_at ? new Date(params.row.expires_at).toLocaleDateString() : 'Never'}
        </Typography>
      ),
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 110,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <Switch
          checked={params.row.active}
          onChange={() => handleToggleActive(params.row)}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2563eb', opacity: 1 },
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<PromoCode>) => (
        <IconButton
          size="small"
          onClick={() => setDeleteTarget(params.row)}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Coupons
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            Create and manage discount codes for checkout.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setCreateOpen(true)}
          startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-5 py-2.5 shadow-none transition-colors text-sm shrink-0"
        >
          New Coupon
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}
        className="bg-white"
      >
        <DataGrid
          rows={codes}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          autoHeight
          rowHeight={64}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' },
            '& .MuiDataGrid-columnHeaderTitle': { fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' },
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f8fafc', fontSize: '0.875rem', display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f8fafc60' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #f1f5f9' },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box className="flex flex-col items-center justify-center h-full py-12">
                <Typography className="font-bold text-slate-900 mb-1">No coupons yet</Typography>
                <Typography className="text-slate-400 text-sm">Create your first discount code.</Typography>
              </Box>
            ),
          }}
        />
      </Paper>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle className="font-black text-slate-900">New Coupon</DialogTitle>
        <DialogContent>
          <Stack spacing={3} className="pt-2">
            <TextField
              fullWidth label="Code"
              placeholder="e.g. SAVE10"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              sx={fieldSx}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth select label="Discount Type"
                value={form.discountType}
                onChange={e => setForm({ ...form, discountType: e.target.value })}
                sx={fieldSx}
              >
                <MenuItem value="percent">Percentage off</MenuItem>
                <MenuItem value="fixed">Fixed amount off</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={form.discountType === 'fixed' ? 'Amount off (GH₵)' : 'Percent off (%)'}
                type="number"
                value={form.discountValue}
                onChange={e => setForm({ ...form, discountValue: clampNonNegative(e.target.value) })}
                inputProps={{ min: 0, max: form.discountType === 'percent' ? 100 : undefined }}
                sx={fieldSx}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth label="Usage Limit (optional)"
                type="number"
                placeholder="Unlimited"
                value={form.usageLimit}
                onChange={e => setForm({ ...form, usageLimit: clampNonNegative(e.target.value) })}
                inputProps={{ min: 0 }}
                sx={fieldSx}
              />
              <TextField
                fullWidth label="Expires On (optional)"
                type="date"
                value={form.expiresAt}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setCreateOpen(false)} className="text-slate-500 font-bold normal-case">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            variant="contained"
            startIcon={creating ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-xl px-6"
          >
            {creating ? 'Creating...' : 'Create Coupon'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Box className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WarningAmberRoundedIcon sx={{ fontSize: 26 }} className="text-red-500" />
          </Box>
          <Typography className="font-black text-slate-900 text-lg mb-2">Delete this coupon?</Typography>
          <Typography className="text-slate-500 text-sm">
            "{deleteTarget?.code}" will be permanently removed. This can't be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} className="text-slate-500 font-bold normal-case px-6">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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