'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, CircularProgress, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface PaymentMethod {
  id: number;
  provider: string;
  phone_number: string;
}

const PROVIDERS = [
  { name: 'MTN Mobile Money', short: 'MTN', color: '#FFC107', textColor: '#0f172a', prefixes: ['024', '054', '055', '059'] },
  { name: 'Vodafone Cash', short: 'VOD', color: '#E60000', textColor: '#ffffff', prefixes: ['020', '050'] },
  { name: 'AirtelTigo Money', short: 'ATM', color: '#0057A8', textColor: '#ffffff', prefixes: ['026', '027', '056', '057'] },
];

function getProviderStyle(providerName: string) {
  return PROVIDERS.find(p => p.name === providerName) || { short: providerName.slice(0, 3).toUpperCase(), color: '#94a3b8', textColor: '#ffffff' };
}

function validatePhoneForProvider(phone: string, providerName: string): string {
  if (!/^\d{10}$/.test(phone)) {
    return 'Enter a valid 10-digit phone number';
  }

  const provider = PROVIDERS.find(p => p.name === providerName);
  if (!provider) return '';

  const prefix = phone.slice(0, 3);
  if (!provider.prefixes.includes(prefix)) {
    return `That number doesn't match a ${provider.short} prefix (${provider.prefixes.join(', ')})`;
  }

  return '';
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

export default function WalletsTab() {
  const { currentUser } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const [form, setForm] = useState({ provider: 'MTN Mobile Money', phoneNumber: '' });
  const [formError, setFormError] = useState('');

  const fetchMethods = async () => {
    if (!currentUser) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMethods(data as PaymentMethod[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleAdd = async () => {
    if (!currentUser) return;
    const err = validatePhoneForProvider(form.phoneNumber, form.provider);
    if (err) {
      setFormError(err);
      return;
    }

    setFormError('');
    setAdding(true);

    const { error } = await supabase.from('payment_methods').insert([{
      user_id: currentUser.id,
      provider: form.provider,
      phone_number: form.phoneNumber,
    }]);

    setAdding(false);

    if (error) {
      setToast({ open: true, message: 'Failed to save payment method.', severity: 'error' });
      return;
    }

    setToast({ open: true, message: 'Payment method added.', severity: 'success' });
    setAddOpen(false);
    setForm({ provider: 'MTN Mobile Money', phoneNumber: '' });
    fetchMethods();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase.from('payment_methods').delete().eq('id', deleteTarget.id);

    setDeleting(false);

    if (error) {
      setToast({ open: true, message: 'Failed to remove payment method.', severity: 'error' });
      return;
    }

    setMethods(prev => prev.filter(m => m.id !== deleteTarget.id));
    setToast({ open: true, message: 'Payment method removed.', severity: 'success' });
    setDeleteTarget(null);
  };

  return (
    <Box className="max-w-2xl animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-2">
        Wallets & Payment
      </Typography>
      <Typography className="text-slate-400 text-sm mb-8">
        Save your mobile money details for faster checkout. No payments are processed here.
      </Typography>

      {loading ? (
        <Box className="py-12 flex items-center justify-center">
          <CircularProgress size={24} sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <Stack spacing={4}>
          {methods.length === 0 ? (
            <Box className="p-10 border border-dashed border-slate-200 rounded-3xl bg-slate-50 text-center flex flex-col items-center">
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 32 }} className="text-slate-300 mb-3" />
              <Typography className="text-slate-500 text-sm">No saved payment methods yet.</Typography>
            </Box>
          ) : (
            methods.map((method) => {
              const style = getProviderStyle(method.provider);
              return (
                <Box
                  key={method.id}
                  className="p-6 border border-slate-200 rounded-3xl bg-white flex items-center justify-between group hover:border-blue-300 transition-colors"
                >
                  <Box className="flex items-center gap-4">
                    <Box
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs tracking-tighter shadow-sm"
                      sx={{ bgcolor: style.color, color: style.textColor }}
                    >
                      {style.short}
                    </Box>
                    <Box>
                      <Typography className="font-bold text-slate-900">{method.provider}</Typography>
                      <Typography className="text-slate-500 text-sm tracking-widest mt-0.5">
                        •••• {method.phone_number.slice(-4)}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setDeleteTarget(method)}
                    className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            className="border-dashed border-2 border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-slate-400 rounded-3xl py-6 font-bold normal-case w-full"
          >
            Add new payment method
          </Button>
        </Stack>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle className="font-black text-slate-900">Add Payment Method</DialogTitle>
        <DialogContent>
          <Stack spacing={3} className="pt-2">
            <TextField
              fullWidth select label="Provider"
              value={form.provider}
              onChange={e => {
                setForm({ ...form, provider: e.target.value });
                if (formError) setFormError('');
              }}
              sx={fieldSx}
            >
              {PROVIDERS.map(p => <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>)}
            </TextField>
            <TextField
              fullWidth label="Phone Number"
              placeholder="e.g. 054XXXXXXX"
              value={form.phoneNumber}
              error={!!formError}
              helperText={formError || `Valid prefixes: ${PROVIDERS.find(p => p.name === form.provider)?.prefixes.join(', ')}`}
              onChange={e => {
                const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm({ ...form, phoneNumber: onlyNums });
                if (formError) setFormError('');
              }}
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              sx={fieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setAddOpen(false)} className="text-slate-500 font-bold normal-case">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={adding || !form.phoneNumber}
            variant="contained"
            startIcon={adding ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-xl px-6"
          >
            {adding ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Typography className="font-black text-slate-900 text-lg mb-2">Remove this payment method?</Typography>
          <Typography className="text-slate-500 text-sm">
            {deleteTarget?.provider} •••• {deleteTarget?.phone_number.slice(-4)} will be removed from your saved methods.
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
            {deleting ? 'Removing...' : 'Remove'}
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