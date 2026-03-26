'use client';
import React, { useState } from 'react';
import {
  Typography, Box, Paper, TextField, Button, Stack,
  Avatar, Switch, Divider, IconButton, Snackbar, Alert, Grid
} from '@mui/material';

// Icons
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

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Box className="mb-6 md:mb-8">
      <Typography className="font-black text-slate-900 text-lg md:text-xl tracking-tight mb-1">{title}</Typography>
      <Typography className="text-slate-500 text-xs md:text-sm font-medium">{desc}</Typography>
    </Box>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab]       = useState('store');
  const [showPassword, setShowPassword] = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [toast, setToast]               = useState(false);

  const [store, setStore] = useState({
    name: 'MKUSI Store', email: 'store@mkusi.com',
    phone: '+233 24 000 0000', address: 'East Legon, Accra, Ghana',
    currency: 'GHS', website: 'https://mkusi.com',
  });

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

  const handleSave = () => setToast(true);

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
          '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
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
                    : 'bg-slate-900 text-white shadow-md shadow-slate-900/20' // Dark active pill
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
                <TextField fullWidth label="Store Name" value={store.name} onChange={e => setStore({ ...store, name: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Store Email" type="email" value={store.email} onChange={e => setStore({ ...store, email: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={store.phone} onChange={e => setStore({ ...store, phone: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Currency" value={store.currency} onChange={e => setStore({ ...store, currency: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Store Address" value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Website URL" value={store.website} onChange={e => setStore({ ...store, website: e.target.value })} sx={fieldSx} />
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

            {/* Avatar editor */}
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
                  Last password change: 30 days ago
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
                        {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    ),
                  }}
                  sx={fieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="New Password"
                  type={showNew ? 'text' : 'password'}
                  value={passwords.newPass}
                  onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" onClick={() => setShowNew(!showNew)} className="text-slate-400">
                        {showNew ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    ),
                  }}
                  sx={fieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} sx={fieldSx} />
              </Grid>
            </Grid>

            {/* Password strength hint */}
            {passwords.newPass.length > 0 && (
              <Box className="mt-4 flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <Box
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                    sx={{
                      bgcolor: i <= Math.min(
                        passwords.newPass.length >= 8 ? 1 : 0,
                        /[A-Z]/.test(passwords.newPass) ? 2 : 1,
                        /[0-9]/.test(passwords.newPass) ? 3 : 2,
                        /[^A-Za-z0-9]/.test(passwords.newPass) ? 4 : 3,
                      ) + 1
                        ? ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][
                            Math.min(
                              (passwords.newPass.length >= 8 ? 1 : 0) +
                              (/[A-Z]/.test(passwords.newPass) ? 1 : 0) +
                              (/[0-9]/.test(passwords.newPass) ? 1 : 0) +
                              (/[^A-Za-z0-9]/.test(passwords.newPass) ? 1 : 0) - 1, 3
                            )
                          ]
                        : '#e2e8f0',
                    }}
                  />
                ))}
              </Box>
            )}
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
              {[
                {
                  title: 'Clear All Orders',
                  desc: 'Permanently delete all order history from the system. This cannot be undone.',
                  btnLabel: 'Clear Orders',
                },
                {
                  title: 'Reset Inventory',
                  desc: 'Remove all products from your store inventory. Stock and product data will be lost.',
                  btnLabel: 'Reset Inventory',
                },
                {
                  title: 'Delete Admin Account',
                  desc: 'Permanently delete this admin account and all associated data.',
                  btnLabel: 'Delete Account',
                },
              ].map((action) => (
                <Box
                  key={action.title}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 md:p-5 rounded-2xl border border-red-100 bg-red-50/50"
                >
                  <Box className="flex items-start gap-3.5">
                    <Box className="w-10 h-10 bg-red-100/80 rounded-xl flex items-center justify-center shrink-0">
                      <WarningAmberRoundedIcon sx={{ fontSize: 20 }} className="text-red-600" />
                    </Box>
                    <Box className="flex-1">
                      <Typography className="font-bold text-slate-900 text-sm mb-1">
                        {action.title}
                      </Typography>
                      <Typography className="text-slate-500 text-xs font-medium leading-relaxed">
                        {action.desc}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-bold normal-case rounded-xl px-5 py-2.5 text-xs transition-all shrink-0"
                  >
                    {action.btnLabel}
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* ── Save button (hidden on danger tab) ── */}
        {activeTab !== 'danger' && (
          <Box className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Typography className="text-slate-500 text-xs font-medium text-center sm:text-left w-full sm:w-auto">
              Changes are saved to your store configuration.
            </Typography>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveRoundedIcon sx={{ fontSize: 18 }} />}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black normal-case rounded-2xl px-8 py-3.5 shadow-none hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-sm shrink-0"
            >
              Save Changes
            </Button>
          </Box>
        )}

      </Paper>

      {/* ── Toast ── */}
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

    </Box>
  );
}