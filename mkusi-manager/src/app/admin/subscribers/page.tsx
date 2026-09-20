'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { supabase } from '@/lib/supabase';
import { exportToCSV } from '@/lib/csvExport';

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setSubscribers(data as Subscriber[]);
      }
      setLoading(false);
    };
    fetchSubscribers();
  }, []);

  const handleExport = () => {
    const rows = subscribers.map(s => ({
      Email: s.email,
      SubscribedAt: s.created_at,
    }));
    exportToCSV(`mkusi-subscribers-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  const columns: GridColDef<Subscriber>[] = [
    { field: 'email', headerName: 'Email', width: 320 },
    {
      field: 'created_at',
      headerName: 'Subscribed',
      width: 200,
      flex: 1,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
  ];

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Subscribers
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {subscribers.length} newsletter subscribers
          </Typography>
        </Box>
        <Button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          variant="outlined"
          startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
          className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold normal-case rounded-2xl px-5 py-2.5 text-sm shrink-0"
        >
          Export CSV
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}
        className="bg-white"
      >
        <DataGrid
          rows={subscribers}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          autoHeight
          rowHeight={56}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
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
                <Typography className="font-bold text-slate-900 mb-1">No subscribers yet</Typography>
                <Typography className="text-slate-400 text-sm">They'll show up here once someone joins your list.</Typography>
              </Box>
            ),
          }}
        />
      </Paper>
    </Box>
  );
}