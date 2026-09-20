'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, TextField, Button, Stack,
  Avatar, Switch, Divider, IconButton, Snackbar, Alert, Grid,
  Dialog, DialogContent, DialogActions, CircularProgress, Tooltip
} from '@mui/material';

import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useProducts } from '@/context/ProductContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#f8fafc',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

const TABS = [
  { id: 'store',         label: 'Store',          icon: StoreRoundedIcon },
  { id: 'account',       label: 'Account',        icon: PersonRoundedIcon },
  { id: 'notifications', label: 'Notifications',  icon: NotificationsRoundedIcon },
  { id: 'security',      label: 'Security',       icon: LockRoundedIcon },
  { id: 'danger',        label: 'Delete',    icon: DeleteOutlineRoundedIcon },
];

const NOTIFICATION_ITEMS = [
  { id: 'new_order',     label: 'New Order',        desc: 'Get notified when a customer places an order.' },
  { id: 'low_stock',     label: 'Low Stock Alert',  desc: 'Alert when a product drops below 5 units.' },
  { id: 'new_message',   label: 'Support Message',  desc: 'Receive alerts for new support requests.' },
  { id: 'daily_summary', label: 'Daily Summary',    desc: 'Receive a daily sales digest every morning.' },
  { id: 'promo',         label: 'Promotional Tips', desc: 'Tips and suggestions to grow your store.' },
];

// Prevents negative numbers being typed into any numeric field on this page.
function clampNonNegative(value: string): string {
  if (value === '') return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  return num < 0 ? '0' : value;
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Box className="mb-6 md:mb-8">
      <Typography className="font-black text-slate-900 text-lg md:text-xl tracking-tight mb-1">{title}</Typography>
      <Typography className="text-slate-500 text-xs md:text-sm font-medium">{desc}</Typography>
    </Box>
  );
}

type DangerAction = 'clear_orders' | 'reset_inventory' | null;

export default function SettingsPage() {
  const { clearOrders, deleteAllProducts, orders, products, storeSettings, updateStoreSettings } = useProducts();
  const [activeTab, setActiveTab]       = useState('store');
  const [showPassword, setShowPassword] = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [toast, setToast]               = useState(false);
  const [savingStore, setSavingStore]   = useState(false);

  const [storeForm, setStoreForm] = useState(storeSettings);

  useEffect(() => {
    setStoreForm(storeSettings);
  }, [storeSettings]);

  const [account, setAccount] = useState({
    firstName: 'Manager', lastName: '',
    email: 'admin@mkusi.com', phone: '',
  });

  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_ITEMS.map(n => [n.id, n.id !== 'promo']))
  );

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const [dangerConfirm, setDangerConfirm] = useState<DangerAction>(null);
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerToast, setDangerToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleSave = async () => {
    if (activeTab === 'store') {
      const fee = Number(storeForm.deliveryFee);
      if (isNaN(fee) || fee < 0) {
        setDangerToast({ open: true, message: 'Enter a valid delivery fee.', severity: 'error' });
        return;
      }

      setSavingStore(true);
      const result = await updateStoreSettings({
        deliveryFee: fee,
        storeName: storeForm.storeName,
        storeEmail: storeForm.storeEmail,
        storePhone: storeForm.storePhone,
        storeAddress: storeForm.storeAddress,
        storeWebsite: storeForm.storeWebsite,
        currency: storeForm.currency,
      });
      setSavingStore(false);

      if (!result.success) {
        setDangerToast({ open: true, message: result.error || 'Failed to update store settings.', severity: 'error' });
        return;
      }
    }
    setToast(true);
  };

  const runDangerAction = async () => {
    if (!dangerConfirm) return;
    setDangerLoading(true);

    if (dangerConfirm === 'clear_orders') {
      const result = await clearOrders();
      setDangerToast({
        open: true,
        message: result.success ? 'All orders cleared.' : (result.error || 'Failed to clear orders.'),
        severity: result.success ? 'success' : 'error',
      });
    } else if (dangerConfirm === 'reset_inventory') {
      const result = await deleteAllProducts();
      setDangerToast({
        open: true,
        message: result.success ? 'Inventory reset — all products removed.' : (result.error || 'Failed to reset inventory.'),
        severity: result.success ? 'success' : 'error',
      });
    }

    setDangerLoading(false);
    setDangerConfirm(null);
  };

  const dangerCopy: Record<Exclude<DangerAction, null>, { title: string; body: string }> = {
    clear_orders: {
      title: 'Clear all orders?',
      body: `This will permanently delete ${orders.length} order${orders.length === 1 ? '' : 's'} from the system. This cannot be undone.`,
    },
    reset_inventory: {
      title: 'Reset inventory?',
      body: `This will permanently delete all ${products.length} product${products.length === 1 ? '' : 's'} from your store. This cannot be undone.`,
    },
  };

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1000px] mx-auto w-full">

      {/* ── Header ── */}
      <Box className="mb-6">
        <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-2">
          Settings
        </Typography>
        <Typography className="text-slate-500 text-sm font-medium">
          Manage your store preferences and account configuration.
        </Typography>
      </Box>

      {/* ── Horizontal Pill Tabs ── */}
      <Box 
        className="flex overflow-x-auto gap-2 mb-6 pb-2"
        sx={{
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDanger = tab.id === 'danger';
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 border-none outline-none ${
                isActive
                  ? isDanger 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : isDanger 
                    ? 'bg-transparent text-red-500 hover:bg-red-50' 
                    : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon sx={{ fontSize: 18 }} />
              {tab.label}
            </button>
          );
        })}
      </Box>

      {/* ── Content Panel ── */}
      <Paper
        elevation={0}
        sx={{ 
          borderRadius: { xs: '20px', md: '24px' }, 
          border: '1px solid #f1f5f9', 
          p: { xs: 3, sm: 4, md: 5 } 
        }}
        className="bg-white w-full"
      >

        {/* ══ STORE ══ */}
        {activeTab === 'store' && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader
              title="Store Information"
              desc="Update your public store details visible to customers."
            />
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Store Name" value={storeForm.storeName} onChange={e => setStoreForm({ ...storeForm, storeName: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Store Email" type="email" value={storeForm.storeEmail} onChange={e => setStoreForm({ ...storeForm, storeEmail: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={storeForm.storePhone} onChange={e => setStoreForm({ ...storeForm, storePhone: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Currency" value={storeForm.currency} onChange={e => setStoreForm({ ...storeForm, currency: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Delivery Fee (GH₵)" type="number"
                  value={storeForm.deliveryFee}
                  onChange={e => setStoreForm({ ...storeForm, deliveryFee: Number(clampNonNegative(e.target.value)) })}
                  inputProps={{ min: 0 }}
                  helperText="Applied to home delivery orders at checkout."
                  sx={fieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Store Address" value={storeForm.storeAddress} onChange={e => setStoreForm({ ...storeForm, storeAddress: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Website URL" value={storeForm.storeWebsite} onChange={e => setStoreForm({ ...storeForm, storeWebsite: e.target.value })} sx={fieldSx} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ══ ACCOUNT ══ */}
        {activeTab === 'account' && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader
              title="Account Profile"
              desc="Update your personal admin profile and photo."
            />

            <Box className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-8 p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <Box className="relative shrink-0 w-[72px]">
                <Avatar
                  src="https://i.pravatar.cc/150?u=mkusi"
                  variant="rounded"
                  sx={{ width: 72, height: 72, borderRadius: '18px' }}
                />
                <Box className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                  <CameraAltRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
              </Box>
              <Box>
                <Typography className="font-bold text-slate-900 text-sm mb-0.5">Profile Photo</Typography>
                <Typography className="text-slate-500 text-xs font-medium">
                  JPG or PNG up to 2MB recommended.
                </Typography>
                <Button size="small" className="text-blue-600 hover:bg-blue-50 font-bold normal-case text-xs px-3 py-1.5 mt-2 rounded-lg transition-colors" disableRipple>
                  Upload new photo
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="First Name" value={account.firstName} onChange={e => setAccount({ ...account, firstName: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Last Name" value={account.lastName} onChange={e => setAccount({ ...account, lastName: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email Address" type="email" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={account.phone} onChange={e => setAccount({ ...account, phone: e.target.value })} sx={fieldSx} />
              </Grid>
            </Grid>
            <Typography className="text-slate-400 text-xs mt-4">
              Account profile changes aren't saved yet — admin login is tied to a single authorized email rather than a stored profile.
            </Typography>
          </Box>
        )}

        {/* ══ NOTIFICATIONS ══ */}
        {activeTab === 'notifications' && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader
              title="Notification Preferences"
              desc="Choose which alerts and updates you want to receive."
            />
            <Stack spacing={0} divider={<Divider sx={{ borderColor: '#f1f5f9' }} />}>
              {NOTIFICATION_ITEMS.map((item) => (
                <Box key={item.id} className="flex items-start sm:items-center justify-between py-4 gap-4">
                  <Box className="flex-1 pr-4">
                    <Typography className="font-bold text-slate-900 text-sm mb-1">
                      {item.label}
                    </Typography>
                    <Typography className="text-slate-500 text-xs font-medium leading-relaxed">
                      {item.desc}
                    </Typography>
                  </Box>
                  <Switch
                    checked={!!notifications[item.id]}
                    onChange={e => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                    size="medium"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2563eb', opacity: 1 },
                      flexShrink: 0,
                      mr: -1 
                    }}
                  />
                </Box>
              ))}
            </Stack>
            <Typography className="text-slate-400 text-xs mt-6">
              Notification preferences aren't saved yet.
            </Typography>
          </Box>
        )}

        {/* ══ SECURITY ══ */}
        {activeTab === 'security' && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader
              title="Security & Password"
              desc="Keep your admin account safe with a strong password."
            />

            <Box className="flex items-center gap-3.5 bg-green-50 border border-green-100 rounded-2xl p-4 mb-8">
              <Box className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckRoundedIcon sx={{ fontSize: 20 }} className="text-green-600" />
              </Box>
              <Box>
                <Typography className="font-bold text-green-900 text-sm leading-none mb-1">
                  Account Secured
                </Typography>
                <Typography className="text-green-700 text-xs font-medium">
                  Admin access uses one-time email codes — no password to manage.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* ══ DANGER ZONE ══ */}
        {activeTab === 'danger' && (
          <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionHeader
              title="Danger Zone"
              desc="These actions are irreversible. Please proceed with caution."
            />

            <Stack spacing={3}>
              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 md:p-5 rounded-2xl border border-red-100 bg-red-50/50">
                <Box className="flex items-start gap-3.5">
                  <Box className="w-10 h-10 bg-red-100/80 rounded-xl flex items-center justify-center shrink-0">
                    <WarningAmberRoundedIcon sx={{ fontSize: 20 }} className="text-red-600" />
                  </Box>
                  <Box className="flex-1">
                    <Typography className="font-bold text-slate-900 text-sm mb-1">Clear All Orders</Typography>
                    <Typography className="text-slate-500 text-xs font-medium leading-relaxed">
                      Permanently delete all order history from the system. This cannot be undone.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => setDangerConfirm('clear_orders')}
                  disabled={orders.length === 0}
                  className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-bold normal-case rounded-xl px-5 py-2.5 text-xs transition-all shrink-0"
                >
                  Clear Orders
                </Button>
              </Box>

              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 md:p-5 rounded-2xl border border-red-100 bg-red-50/50">
                <Box className="flex items-start gap-3.5">
                  <Box className="w-10 h-10 bg-red-100/80 rounded-xl flex items-center justify-center shrink-0">
                    <WarningAmberRoundedIcon sx={{ fontSize: 20 }} className="text-red-600" />
                  </Box>
                  <Box className="flex-1">
                    <Typography className="font-bold text-slate-900 text-sm mb-1">Reset Inventory</Typography>
                    <Typography className="text-slate-500 text-xs font-medium leading-relaxed">
                      Remove all products from your store inventory. Stock and product data will be lost.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => setDangerConfirm('reset_inventory')}
                  disabled={products.length === 0}
                  className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-bold normal-case rounded-xl px-5 py-2.5 text-xs transition-all shrink-0"
                >
                  Reset Inventory
                </Button>
              </Box>

              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 md:p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                <Box className="flex items-start gap-3.5">
                  <Box className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <WarningAmberRoundedIcon sx={{ fontSize: 20 }} className="text-slate-400" />
                  </Box>
                  <Box className="flex-1">
                    <Typography className="font-bold text-slate-900 text-sm mb-1">Delete Admin Account</Typography>
                    <Typography className="text-slate-500 text-xs font-medium leading-relaxed">
                      Not available yet — admin access is controlled by a single authorized email, not a database account.
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="Admin login is tied to a fixed authorized email — this will be enabled once admin accounts are fully database-backed.">
                  <span className="w-full sm:w-auto shrink-0">
                    <Button
                      variant="outlined"
                      disabled
                      className="w-full sm:w-auto border-slate-200 text-slate-400 font-bold normal-case rounded-xl px-5 py-2.5 text-xs"
                    >
                      Delete Account
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        )}

        {/* ── Save button (hidden on danger + security tabs — nothing to persist there) ── */}
        {activeTab !== 'danger' && activeTab !== 'security' && (
          <Box className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Typography className="text-slate-500 text-xs font-medium text-center sm:text-left w-full sm:w-auto">
              {activeTab === 'store' ? 'Changes are saved to your store configuration.' : 'Preview only — not yet saved.'}
            </Typography>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={savingStore}
              startIcon={savingStore ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon sx={{ fontSize: 18 }} />}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black normal-case rounded-2xl px-8 py-3.5 shadow-none hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-sm shrink-0"
            >
              {savingStore ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}

      </Paper>

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      <Dialog open={!!dangerConfirm} onClose={() => setDangerConfirm(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Box className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WarningAmberRoundedIcon sx={{ fontSize: 26 }} className="text-red-500" />
          </Box>
          {dangerConfirm && (
            <>
              <Typography className="font-black text-slate-900 text-lg mb-2">{dangerCopy[dangerConfirm].title}</Typography>
              <Typography className="text-slate-500 text-sm">{dangerCopy[dangerConfirm].body}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setDangerConfirm(null)} className="text-slate-500 font-bold normal-case px-6">
            Cancel
          </Button>
          <Button
            onClick={runDangerAction}
            disabled={dangerLoading}
            variant="contained"
            startIcon={dangerLoading ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-red-500 hover:bg-red-600 text-white font-bold normal-case rounded-xl px-6"
          >
            {dangerLoading ? 'Working...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={dangerToast.open}
        autoHideDuration={3000}
        onClose={() => setDangerToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={dangerToast.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
          {dangerToast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}