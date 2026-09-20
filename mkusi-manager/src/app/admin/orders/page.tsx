'use client';
import React, { useState, useMemo } from 'react';
import {
  Typography, Box, Stack, Chip, Paper, InputBase,
  Select, MenuItem, CircularProgress, Snackbar, Alert, Dialog, DialogContent, DialogActions, Button, IconButton, Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useProducts, Order } from '@/context/ProductContext';
import { exportToCSV } from '@/lib/csvExport';

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  Pending:   { bg: '#fef9c3', color: '#a16207' },
  Delivered: { bg: '#dcfce7', color: '#15803d' },
};

const FILTERS = ['All', 'Pending', 'Delivered', 'Removed'];
const RESTORE_WINDOW_DAYS = 14;

function daysRemaining(removedAt: string): number {
  const removedDate = new Date(removedAt);
  const deadline = new Date(removedDate.getTime() + RESTORE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const msRemaining = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
}

export default function AdminOrdersPage() {
  const { orders, ordersLoading, setOrderStatus, removeOrder, restoreOrder } = useProducts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Order | null>(null);
  const [removing, setRemoving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const visibleOrders = useMemo(() => {
    if (filter === 'Removed') return orders.filter(o => !!o.removedAt);
    return orders.filter(o => !o.removedAt);
  }, [orders, filter]);

  const filtered = useMemo(() => visibleOrders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || filter === 'Removed' ? true : o.status === filter;
    return matchSearch && matchFilter;
  }), [visibleOrders, search, filter]);

  const handleStatusChange = async (orderId: string, newStatus: 'Pending' | 'Delivered') => {
    setUpdatingId(orderId);
    const result = await setOrderStatus(orderId, newStatus);
    setUpdatingId(null);

    if (!result.success) {
      setToast({ open: true, message: result.error || 'Failed to update status.', severity: 'error' });
    }
  };

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;

    if (removeTarget.status === 'Delivered') {
      setToast({ open: true, message: 'Delivered orders cannot be removed.', severity: 'error' });
      setRemoveTarget(null);
      return;
    }

    setRemoving(true);
    const result = await removeOrder(removeTarget.id);
    setRemoving(false);

    if (result.success) {
      setToast({ open: true, message: `Order removed. It will be permanently deleted in ${RESTORE_WINDOW_DAYS} days unless restored.`, severity: 'success' });
      setRemoveTarget(null);
    } else {
      setToast({ open: true, message: result.error || 'Failed to remove order.', severity: 'error' });
    }
  };

  const handleRestore = async (orderId: string) => {
    setUpdatingId(orderId);
    const result = await restoreOrder(orderId);
    setUpdatingId(null);

    if (result.success) {
      setToast({ open: true, message: 'Order restored.', severity: 'success' });
    } else {
      setToast({ open: true, message: result.error || 'Failed to restore order.', severity: 'error' });
    }
  };

  const handleExport = () => {
    const rows = orders.map(o => ({
      OrderID: o.id,
      CustomerName: o.customerName,
      CustomerEmail: o.customerEmail || '',
      Phone: o.phone,
      Address: o.address,
      Items: o.items,
      Total: o.total,
      Status: o.removedAt ? 'Removed' : o.status,
      Date: o.date,
      RemovedAt: o.removedAt || '',
    }));
    exportToCSV(`mkusi-orders-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  const columns: GridColDef<Order>[] = [
    {
        field: 'id',
        headerName: 'Order',
        width: 160,
        renderCell: (params: GridRenderCellParams<Order>) => (
            <Box className="flex flex-col justify-center h-full py-1">
            <button
                onClick={() => setDetailOrder(params.row)}
                className="font-bold text-blue-600 text-sm text-left bg-transparent border-none cursor-pointer p-0 hover:underline leading-tight"
            >
                #{params.row.id}
            </button>
            <Typography className="text-slate-400 text-[11px] font-medium leading-tight mt-0.5">
                {params.row.date}
            </Typography>
            </Box>
        ),
    },
    {
      field: 'customerName',
      headerName: 'Customer',
      width: 220,
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Box className="min-w-0">
          <Typography className="font-bold text-slate-900 text-sm truncate">{params.row.customerName}</Typography>
          <Typography className="text-slate-400 text-[11px] font-medium truncate">{params.row.customerEmail || 'Guest'}</Typography>
        </Box>
      ),
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 240,
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Typography className="text-slate-600 text-sm truncate">{params.row.items}</Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Typography className="font-black text-slate-900 text-sm">{params.row.total}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Order>) => {
        if (params.row.removedAt) {
          const remaining = daysRemaining(params.row.removedAt);
          return (
            <Tooltip title={`Permanently deleted in ${remaining} day${remaining === 1 ? '' : 's'} unless restored`}>
              <Chip
                label={`Removed · ${remaining}d left`}
                size="small"
                sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 800, fontSize: '0.7rem' }}
              />
            </Tooltip>
          );
        }

        const style = STATUS_CONFIG[params.row.status];
        const isUpdating = updatingId === params.row.id;

        if (isUpdating) return <CircularProgress size={18} />;

        return (
          <Select
            value={params.row.status}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value as 'Pending' | 'Delivered')}
            size="small"
            variant="standard"
            disableUnderline
            sx={{
              bgcolor: style.bg,
              color: style.color,
              borderRadius: '10px',
              px: 1.5,
              py: 0.3,
              fontSize: '0.75rem',
              fontWeight: 800,
              '& .MuiSelect-icon': { color: style.color },
            }}
          >
            <MenuItem value="Pending" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Pending</MenuItem>
            <MenuItem value="Delivered" sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Delivered</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const isUpdating = updatingId === params.row.id;
        if (params.row.removedAt) {
          return (
            <IconButton
              size="small"
              disabled={isUpdating}
              onClick={() => handleRestore(params.row.id)}
              className="text-slate-400 hover:text-green-600 hover:bg-green-50"
            >
              {isUpdating ? <CircularProgress size={16} /> : <RestoreRoundedIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          );
        }
        if (params.row.status === 'Delivered') {
          return (
            <Tooltip title="Delivered orders can't be removed">
              <span>
                <IconButton size="small" disabled className="text-slate-200">
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          );
        }
        return (
          <IconButton
            size="small"
            onClick={() => setRemoveTarget(params.row)}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Orders
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {orders.filter(o => !o.removedAt).length} active orders · {orders.filter(o => o.status === 'Pending' && !o.removedAt).length} pending
            {orders.some(o => o.removedAt) && ` · ${orders.filter(o => o.removedAt).length} removed`}
          </Typography>
        </Box>
        <Button
          onClick={handleExport}
          variant="outlined"
          startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
          className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold normal-case rounded-2xl px-5 py-2.5 text-sm shrink-0"
        >
          Export CSV
        </Button>
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
              placeholder="Search by order ID, customer name, or email…"
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
          loading={ordersLoading}
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
                <Typography className="font-bold text-slate-900 mb-1">
                  {filter === 'Removed' ? 'No removed orders' : 'No orders found'}
                </Typography>
                <Typography className="text-slate-400 text-sm">
                  {filter === 'Removed' ? 'Removed orders will appear here.' : 'Try a different search or filter.'}
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog open={!!detailOrder} onClose={() => setDetailOrder(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        {detailOrder && (
          <>
            <DialogContent className="pt-6">
              <Typography className="font-black text-slate-900 text-lg mb-1">Order #{detailOrder.id}</Typography>
              <Typography className="text-slate-400 text-xs mb-6">Placed on {detailOrder.date}</Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</Typography>
                  <Typography className="font-bold text-slate-900 text-sm">{detailOrder.customerName}</Typography>
                  <Typography className="text-slate-500 text-sm">{detailOrder.customerEmail || 'Guest checkout'}</Typography>
                  <Typography className="text-slate-500 text-sm">{detailOrder.phone}</Typography>
                </Box>

                <Box>
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</Typography>
                  <Typography className="text-slate-700 text-sm">{detailOrder.address}</Typography>
                </Box>

                <Box>
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</Typography>
                  <Typography className="text-slate-700 text-sm">{detailOrder.items}</Typography>
                </Box>

                <Box className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Typography className="font-black text-slate-900">Total</Typography>
                  <Typography className="font-black text-blue-600 text-lg">{detailOrder.total}</Typography>
                </Box>

                <Box className="flex items-center gap-2">
                  <Typography className="text-sm font-bold text-slate-700">Status:</Typography>
                  {detailOrder.removedAt ? (
                    <Chip
                      label={`Removed · ${daysRemaining(detailOrder.removedAt)}d left`}
                      size="small"
                      sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 800 }}
                    />
                  ) : (
                    <Chip
                      label={detailOrder.status}
                      size="small"
                      sx={{ bgcolor: STATUS_CONFIG[detailOrder.status].bg, color: STATUS_CONFIG[detailOrder.status].color, fontWeight: 800 }}
                    />
                  )}
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setDetailOrder(null)} className="text-slate-500 font-bold normal-case">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Remove Confirm Dialog */}
      <Dialog open={!!removeTarget} onClose={() => setRemoveTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Box className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WarningAmberRoundedIcon sx={{ fontSize: 26 }} className="text-red-500" />
          </Box>
          <Typography className="font-black text-slate-900 text-lg mb-2">Remove this order?</Typography>
          <Typography className="text-slate-500 text-sm">
            Order #{removeTarget?.id} will be marked as removed and hidden from the customer's view as "Incomplete."
            It can be restored within {RESTORE_WINDOW_DAYS} days — after that it's permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setRemoveTarget(null)} className="text-slate-500 font-bold normal-case px-6">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            disabled={removing}
            variant="contained"
            startIcon={removing ? <CircularProgress size={16} color="inherit" /> : null}
            className="bg-red-500 hover:bg-red-600 text-white font-bold normal-case rounded-xl px-6"
          >
            {removing ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
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