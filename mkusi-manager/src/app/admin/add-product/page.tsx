'use client';
import React, { useState } from 'react';
import {
  Typography, TextField, Button, Paper, Grid, MenuItem,
  InputAdornment, Snackbar, Alert, Box, Stack
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Phone Cases', 'Chargers', 'Screen Protectors', 'Audio', 'Cables'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#f8f9fb',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: '#e8eaed' },
    '&:hover fieldset': { borderColor: '#c4c9d4' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root': { fontSize: '0.875rem' },
};

function SectionCard({
  step, title, children
}: { step: string; title: string; children: React.ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', p: { xs: 3, md: 4 }, mb: 4 }}
      className="bg-white"
    >
      <Box className="flex items-center gap-3 mb-5">
        <Box className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
          <Typography className="text-white font-black text-xs">{step}</Typography>
        </Box>
        <Typography className="font-black text-slate-900 text-base">{title}</Typography>
      </Box>
      {children}
    </Paper>
  );
}

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', category: 'Phone Cases', brand: '', price: '', stock: '',
    description: '', compatibility: '', image: '',
    color: '', material: '', power: '', connector: '', type: ''
  });

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specs: Record<string, string> = {};
    if (formData.category === 'Phone Cases') {
      specs.color = formData.color;
      specs.material = formData.material;
    } else if (['Chargers', 'Cables'].includes(formData.category)) {
      specs.power = formData.power;
      specs.connector = formData.connector;
    } else if (formData.category === 'Audio') {
      specs.type = formData.type;
      specs.color = formData.color;
    }
    addProduct({
      name: formData.name, category: formData.category, brand: formData.brand,
      price: Number(formData.price), stock: Number(formData.stock),
      description: formData.description, compatibility: formData.compatibility,
      image: formData.image, specs,
    });
    setOpen(true);
    setTimeout(() => router.push('/admin/inventory'), 1500);
  };

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[900px] mx-auto">

      {/* ── Header ── */}
      <Box className="mb-8">
        <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
          Add New Product
        </Typography>
        <Typography className="text-slate-400 text-sm font-medium">
          Fill in the details below to add a product to your inventory.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>

        {/* ── Section 1: Basic Info ── */}
        <SectionCard step="1" title="Basic Information">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth label="Product Name" required
                placeholder="e.g. Samsung S23 Ultra Clear Case"
                value={formData.name} onChange={e => set('name', e.target.value)}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth select label="Category"
                value={formData.category} onChange={e => set('category', e.target.value)}
                sx={fieldSx}
              >
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Brand"
                placeholder="e.g. Apple, Anker, Oraimo"
                value={formData.brand} onChange={e => set('brand', e.target.value)}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth label="Price (GH₵)" type="number" required
                value={formData.price} onChange={e => set('price', e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth label="Stock Qty" type="number" required
                value={formData.stock} onChange={e => set('stock', e.target.value)}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth label="Description" multiline rows={3}
                placeholder="Describe key features and selling points…"
                value={formData.description} onChange={e => set('description', e.target.value)}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </SectionCard>

        {/* ── Section 2: Image ── */}
        <SectionCard step="2" title="Product Image">
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth label="Image URL"
                placeholder="https://images.unsplash.com/…"
                value={formData.image} onChange={e => set('image', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CloudUploadRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="w-full h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="preview" className="w-full h-full object-contain p-2 mix-blend-multiply" />
                ) : (
                  <Typography className="text-slate-300 text-xs font-medium">Preview</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </SectionCard>

        {/* ── Section 3: Compatibility ── */}
        <SectionCard step="3" title="Compatibility">
          <TextField
            fullWidth label="Compatible Phone Models" required
            placeholder="e.g. iPhone 13, 14, 15 Pro Max, Samsung S24"
            helperText="List all phones this accessory is compatible with."
            value={formData.compatibility} onChange={e => set('compatibility', e.target.value)}
            sx={fieldSx}
          />
        </SectionCard>

        {/* ── Section 4: Tech Specs ── */}
        <SectionCard step="4" title="Technical Specs">
          {formData.category === 'Phone Cases' && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Color" placeholder="e.g. Midnight Blue"
                  value={formData.color} onChange={e => set('color', e.target.value)} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Material" placeholder="e.g. Silicone, Leather"
                  value={formData.material} onChange={e => set('material', e.target.value)} sx={fieldSx} />
              </Grid>
            </Grid>
          )}
          {['Chargers', 'Cables'].includes(formData.category) && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Power Output" placeholder="e.g. 20W, 65W"
                  value={formData.power} onChange={e => set('power', e.target.value)} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Connector Type"
                  value={formData.connector} onChange={e => set('connector', e.target.value)} sx={fieldSx}>
                  {['USB-C', 'Lightning', 'Micro-USB', 'MagSafe'].map(c =>
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>
          )}
          {formData.category === 'Audio' && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Type"
                  value={formData.type} onChange={e => set('type', e.target.value)} sx={fieldSx}>
                  <MenuItem value="Wireless (Bluetooth)">Wireless (Bluetooth)</MenuItem>
                  <MenuItem value="Wired">Wired</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Color"
                  value={formData.color} onChange={e => set('color', e.target.value)} sx={fieldSx} />
              </Grid>
            </Grid>
          )}
          {formData.category === 'Screen Protectors' && (
            <TextField fullWidth select label="Protector Type"
              value={formData.material} onChange={e => set('material', e.target.value)} sx={fieldSx}>
              {['Tempered Glass', 'Hydrogel', 'Privacy Glass'].map(t =>
                <MenuItem key={t} value={t}>{t}</MenuItem>
              )}
            </TextField>
          )}
          {!['Phone Cases', 'Chargers', 'Cables', 'Audio', 'Screen Protectors'].includes(formData.category) && (
            <Box className="flex items-center gap-2 text-slate-400 py-4">
              <InfoOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography className="text-sm font-medium">No additional specs for this category.</Typography>
            </Box>
          )}
        </SectionCard>

        {/* ── Submit ── */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<SaveRoundedIcon />}
          className="bg-slate-900 hover:bg-blue-600 text-white font-black normal-case rounded-2xl py-4 shadow-none transition-colors text-base"
        >
          Save Product to Inventory
        </Button>

      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
          Product saved! Redirecting…
        </Alert>
      </Snackbar>

    </Box>
  );
}
