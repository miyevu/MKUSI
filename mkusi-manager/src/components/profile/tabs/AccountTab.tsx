'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Box, Stack, Divider, Switch, Button, TextField, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function AccountTab() {
  const { currentUser, updateUser, changePassword } = useAuth();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (currentUser) {
      setEmailNotifs(currentUser.notifications.orderUpdates);
      setSmsNotifs(currentUser.notifications.promoSms);
    }
  }, [currentUser]);

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
    },
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    const result = await changePassword(passwordForm.newPassword);
    setSavingPassword(false);

    if (!result.success) {
      setPasswordError(result.error || 'Failed to update password.');
      return;
    }

    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setToast({ open: true, message: 'Password updated.', severity: 'success' });
  };

  const handleToggleEmailNotifs = async (checked: boolean) => {
    setEmailNotifs(checked);
    const result = await updateUser({ notifications: { orderUpdates: checked } });
    if (!result.success) {
      setEmailNotifs(!checked); // revert on failure
      setToast({ open: true, message: result.error || 'Failed to update preference.', severity: 'error' });
    }
  };

  const handleToggleSmsNotifs = async (checked: boolean) => {
    setSmsNotifs(checked);
    const result = await updateUser({ notifications: { promoSms: checked } });
    if (!result.success) {
      setSmsNotifs(!checked);
      setToast({ open: true, message: result.error || 'Failed to update preference.', severity: 'error' });
    }
  };

  return (
    <Box className="max-w-2xl animate-fade-in">
      <Typography variant="h4" className="font-medium text-slate-900 mb-8">
        Account Settings
      </Typography>

      {/* Security Section */}
      <Box className="p-6 border border-slate-200 rounded-3xl bg-slate-50 mb-8">
        <Typography className="font-bold text-slate-900 mb-6">Change Password</Typography>
        <Stack spacing={4}>
          <TextField 
            fullWidth type="password" label="New Password" variant="outlined" 
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            sx={inputStyles}
          />
          <TextField 
            fullWidth type="password" label="Confirm New Password" variant="outlined" 
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            sx={inputStyles}
          />
          {passwordError && (
            <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600 }}>
              {passwordError}
            </Alert>
          )}
          <Button 
            variant="contained" 
            onClick={handleUpdatePassword}
            disabled={savingPassword || !passwordForm.newPassword}
            startIcon={savingPassword ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold normal-case rounded-full px-8 py-3 shadow-none w-max"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </Stack>
      </Box>

      {/* Notifications Section */}
      <Box className="p-6 border border-slate-200 rounded-3xl bg-slate-50">
        <Typography className="font-bold text-slate-900 mb-6">Notification Preferences</Typography>
        
        <Box className="flex justify-between items-center mb-4">
          <Box>
            <Typography className="font-bold text-slate-900 text-sm">Order Updates via Email</Typography>
            <Typography className="text-slate-500 text-xs mt-0.5">Receive receipts and tracking links</Typography>
          </Box>
          <Switch checked={emailNotifs} onChange={(e) => handleToggleEmailNotifs(e.target.checked)} color="primary" />
        </Box>
        
        <Divider className="my-4 border-slate-200" />
        
        <Box className="flex justify-between items-center">
          <Box>
            <Typography className="font-bold text-slate-900 text-sm">Promotional SMS</Typography>
            <Typography className="text-slate-500 text-xs mt-0.5">Get texted about flash sales and VIP discounts</Typography>
          </Box>
          <Switch checked={smsNotifs} onChange={(e) => handleToggleSmsNotifs(e.target.checked)} color="primary" />
        </Box>
      </Box>

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