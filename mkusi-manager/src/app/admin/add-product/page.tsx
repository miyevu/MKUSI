'use client';
import React, { useState } from 'react';
import {
  Typography, TextField, Button, Paper, Grid, MenuItem,
  InputAdornment, Snackbar, Alert, Box, CircularProgress, Chip, Stack, Divider, IconButton,
  Dialog, DialogContent, DialogActions
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useProducts } from '@/context/ProductContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Phone Cases', 'Chargers', 'Screen Protectors', 'Audio', 'Cables'];
const MAX_IMAGES = 6;

function clampNonNegative(value: string): string {
  if (value === '') return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  return num < 0 ? '0' : value;
}

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

interface ImageSlot {
  file: File;
  previewUrl: string;
}

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [savedProduct, setSavedProduct] = useState<{ id: number; name: string; price: number; image: string } | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState('');

  const [formData, setFormData] = useState({
    name: '', category: 'Phone Cases', brand: '', price: '', stock: '',
    description: '', compatibility: '',
    color: '', material: '', power: '', connector: '', type: '',
    discountType: '', discountValue: ''
  });

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorMsg('');

    const room = MAX_IMAGES - imageSlots.length;
    if (room <= 0) {
      setErrorMsg(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    const toAdd = files.slice(0, room);
    const rejected: string[] = [];

    const validSlots: ImageSlot[] = [];
    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) {
        rejected.push(`${file.name} — not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        rejected.push(`${file.name} — over 5MB`);
        continue;
      }
      validSlots.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (rejected.length > 0) {
      setErrorMsg(`Some files were skipped: ${rejected.join(', ')}`);
    }
    if (files.length > room) {
      setErrorMsg(prev => (prev ? prev + ' ' : '') + `Only ${room} more image(s) could be added (max ${MAX_IMAGES}).`);
    }

    setImageSlots(prev => [...prev, ...validSlots]);
    e.target.value = '';
  };

  const removeSlot = (index: number) => {
    setImageSlots(prev => prev.filter((_, i) => i !== index));
    if (primaryIndex === index) {
      setPrimaryIndex(0);
    } else if (primaryIndex > index) {
      setPrimaryIndex(prev => prev - 1);
    }
  };

  const uploadAllImages = async (): Promise<string[] | null> => {
    if (imageSlots.length === 0) return null;

    setUploading(true);
    setUploadProgress({ done: 0, total: imageSlots.length });

    const urls: string[] = [];

    for (const slot of imageSlots) {
      const fileExt = slot.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, slot.file);

      if (uploadError) {
        setUploading(false);
        setErrorMsg(`Image upload failed: ${uploadError.message}`);
        return null;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      urls.push(data.publicUrl);
      setUploadProgress(prev => ({ ...prev, done: prev.done + 1 }));
    }

    setUploading(false);
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (imageSlots.length === 0) {
      setErrorMsg('Please select at least one product image.');
      return;
    }

    setSubmitting(true);

    const uploadedUrls = await uploadAllImages();
    if (!uploadedUrls) {
      setSubmitting(false);
      return;
    }

    const orderedUrls = [
      uploadedUrls[primaryIndex],
      ...uploadedUrls.filter((_, i) => i !== primaryIndex),
    ];

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

    const result = await addProduct({
      name: formData.name, category: formData.category, brand: formData.brand,
      price: Number(formData.price), stock: Number(formData.stock),
      description: formData.description, compatibility: formData.compatibility,
      image: orderedUrls[0],
      images: orderedUrls,
      discountType: formData.discountType ? (formData.discountType as 'percent' | 'fixed') : null,
      discountValue: formData.discountType ? Number(formData.discountValue) : null,
      specs,
    });

    setSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to save product.');
      return;
    }

    if (result.product) {
      setSavedProduct({
        id: result.product.id,
        name: formData.name,
        price: Number(formData.price),
        image: orderedUrls[0],
      });
      setNotifyDialogOpen(true);
    } else {
      setOpen(true);
      setTimeout(() => router.push('/admin/inventory'), 1500);
    }
  };

  const handleNotifySubscribers = async () => {
    if (!savedProduct) return;
    setNotifying(true);

    try {
      const res = await fetch('/api/notify-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: savedProduct.id,
          productName: savedProduct.name,
          productPrice: savedProduct.price,
          productImage: savedProduct.image,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setNotifyResult(`Failed: ${data.error}`);
      } else if (data.sent === 0 && data.total === 0) {
        setNotifyResult('No subscribers yet.');
      } else {
        setNotifyResult(`Sent to ${data.sent} of ${data.total} subscribers.`);
      }
    } catch {
      setNotifyResult('Failed to send notifications.');
    }

    setNotifying(false);
  };

  const handleSkipNotify = () => {
    setNotifyDialogOpen(false);
    router.push('/admin/inventory');
  };

  const priceNum = Number(formData.price) || 0;
  const stockNum = Number(formData.stock) || 0;
  const primaryPreview = imageSlots[primaryIndex]?.previewUrl;
  const discountValueNum = Number(formData.discountValue) || 0;
  const previewFinalPrice = formData.discountType === 'percent'
    ? priceNum * (1 - discountValueNum / 100)
    : formData.discountType === 'fixed'
      ? Math.max(0, priceNum - discountValueNum)
      : priceNum;

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <Box className="mb-8">
        <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
          Add New Product
        </Typography>
        <Typography className="text-slate-400 text-sm font-medium">
          Fill in the details below to add a product to your inventory.
        </Typography>
      </Box>

      <Grid container spacing={4}>

        {/* LEFT: FORM */}
        <Grid size={{ xs: 12, lg: 7.5 }}>
          <Box component="form" onSubmit={handleSubmit}>

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
                    value={formData.price} onChange={e => set('price', clampNonNegative(e.target.value))}
                    inputProps={{ min: 0 }}
                    InputProps={{ startAdornment: <InputAdornment position="start">₵</InputAdornment> }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    fullWidth label="Stock Qty" type="number" required
                    value={formData.stock} onChange={e => set('stock', clampNonNegative(e.target.value))}
                    inputProps={{ min: 0 }}
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
                <Grid size={{ xs: 12 }}>
                  <Box className="flex items-center gap-2 mb-1">
                    <Typography className="text-sm font-bold text-slate-700">Discount (optional)</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        fullWidth select label="Discount Type"
                        value={formData.discountType}
                        onChange={e => set('discountType', e.target.value)}
                        sx={fieldSx}
                      >
                        <MenuItem value="">No discount</MenuItem>
                        <MenuItem value="percent">Percentage off</MenuItem>
                        <MenuItem value="fixed">Fixed amount off</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <TextField
                        fullWidth
                        label={formData.discountType === 'fixed' ? 'Amount off (GH₵)' : 'Percent off (%)'}
                        type="number"
                        disabled={!formData.discountType}
                        value={formData.discountValue}
                        onChange={e => set('discountValue', clampNonNegative(e.target.value))}
                        inputProps={{ min: 0, max: formData.discountType === 'percent' ? 100 : undefined }}
                        sx={fieldSx}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard step="2" title="Product Images">
              <Button
                component="label"
                fullWidth
                disabled={imageSlots.length >= MAX_IMAGES}
                startIcon={<CloudUploadRoundedIcon />}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-600 font-bold normal-case rounded-2xl py-6 shadow-none transition-colors disabled:opacity-50"
              >
                {imageSlots.length === 0 ? 'Click to select images' : `Add more images (${imageSlots.length}/${MAX_IMAGES})`}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
              <Typography className="text-slate-400 text-xs font-medium mt-2 mb-4">
                JPG, PNG or WEBP. Max 5MB each, up to {MAX_IMAGES} images. Click the star to set the main image.
              </Typography>

              {imageSlots.length > 0 && (
                <Box className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {imageSlots.map((slot, index) => (
                    <Box
                      key={slot.previewUrl}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-colors ${
                        index === primaryIndex ? 'border-blue-500' : 'border-slate-100'
                      }`}
                    >
                      <img
                        src={slot.previewUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Box className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-start justify-between p-1.5 opacity-0 hover:opacity-100">
                        <IconButton
                          size="small"
                          onClick={() => setPrimaryIndex(index)}
                          sx={{ bgcolor: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'white' } }}
                        >
                          <StarRoundedIcon sx={{ fontSize: 14 }} className={index === primaryIndex ? 'text-amber-400' : 'text-slate-400'} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeSlot(index)}
                          sx={{ bgcolor: 'white', width: 24, height: 24, '&:hover': { bgcolor: 'white' } }}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 14 }} className="text-red-500" />
                        </IconButton>
                      </Box>
                      {index === primaryIndex && (
                        <Chip
                          label="Main"
                          size="small"
                          sx={{ position: 'absolute', bottom: 4, left: 4, height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#2563eb', color: 'white' }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </SectionCard>

            <SectionCard step="3" title="Compatibility">
              <TextField
                fullWidth label="Compatible Phone Models" required
                placeholder="e.g. iPhone 13, 14, 15 Pro Max, Samsung S24"
                helperText="List all phones this accessory is compatible with."
                value={formData.compatibility} onChange={e => set('compatibility', e.target.value)}
                sx={fieldSx}
              />
            </SectionCard>

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

            {errorMsg && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 3, fontWeight: 600 }}>
                {errorMsg}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
              className="bg-slate-900 hover:bg-blue-600 text-white font-black normal-case rounded-2xl py-4 shadow-none transition-colors text-base"
            >
              {uploading
                ? `Uploading images... (${uploadProgress.done}/${uploadProgress.total})`
                : submitting ? 'Saving...' : 'Save Product to Inventory'}
            </Button>
          </Box>
        </Grid>

        {/* RIGHT: LIVE PREVIEW */}
        <Grid size={{ xs: 12, lg: 4.5 }}>
          <Box className="lg:sticky lg:top-6">
            <Box className="flex items-center gap-2 mb-4">
              <VisibilityRoundedIcon sx={{ fontSize: 18 }} className="text-slate-400" />
              <Typography className="text-slate-500 text-sm font-bold">Live Preview</Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{ borderRadius: '28px', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}
              className="bg-white"
            >
              <Box className="relative aspect-square bg-[#F6F6F6] flex items-center justify-center p-6">
                {formData.brand && (
                  <span className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm z-10">
                    {formData.brand}
                  </span>
                )}
                {imageSlots.length > 1 && (
                  <span className="absolute top-4 left-4 bg-black/60 text-white px-2 py-0.5 rounded-full text-[10px] font-bold z-10">
                    1/{imageSlots.length}
                  </span>
                )}
                {primaryPreview ? (
                  <img src={primaryPreview} alt="preview" className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <Box className="flex flex-col items-center gap-2 text-slate-300">
                    <CloudUploadRoundedIcon sx={{ fontSize: 40 }} />
                    <Typography className="text-xs font-medium">Image preview</Typography>
                  </Box>
                )}
              </Box>

              <Box className="p-5">
                <Typography className="font-extrabold text-slate-900 text-base mb-1 leading-tight">
                  {formData.name || 'Product name'}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5} className="mb-3">
                  <StarIcon className="text-orange-400" sx={{ fontSize: 14 }} />
                  <Typography className="text-[11px] font-bold text-slate-700">4.5</Typography>
                  <Chip
                    label={formData.category}
                    size="small"
                    className="ml-2"
                    sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                  />
                </Stack>

                {formData.discountType && discountValueNum > 0 ? (
                  <Stack direction="row" alignItems="baseline" spacing={1.5} className="mb-3">
                    <Typography className="font-black text-blue-800 text-xl">
                      GH₵ {previewFinalPrice.toFixed(2)}
                    </Typography>
                    <Typography className="text-slate-400 text-sm line-through">
                      GH₵ {priceNum.toFixed(2)}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography className="font-black text-blue-800 text-xl mb-3">
                    GH₵ {priceNum.toFixed(2)}
                  </Typography>
                )}

                <Divider className="mb-3" />

                <Stack spacing={1.5}>
                  <Box className="flex justify-between">
                    <Typography className="text-slate-400 text-xs font-semibold">Stock</Typography>
                    <Typography className={`text-xs font-bold ${stockNum === 0 ? 'text-red-500' : stockNum <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {stockNum === 0 ? 'Out of stock' : `${stockNum} units`}
                    </Typography>
                  </Box>
                  {formData.compatibility && (
                    <Box className="flex justify-between gap-4">
                      <Typography className="text-slate-400 text-xs font-semibold shrink-0">Fits</Typography>
                      <Typography className="text-slate-700 text-xs font-medium text-right line-clamp-2">
                        {formData.compatibility}
                      </Typography>
                    </Box>
                  )}
                  {formData.description && (
                    <Box>
                      <Typography className="text-slate-400 text-xs font-semibold mb-1">Description</Typography>
                      <Typography className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {formData.description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Paper>

            <Typography className="text-slate-400 text-[11px] text-center mt-3">
              This is roughly how the product will appear in the shop.
            </Typography>
          </Box>
        </Grid>

      </Grid>

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

      {/* Notify Subscribers Dialog */}
      <Dialog open={notifyDialogOpen} onClose={handleSkipNotify} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogContent className="text-center pt-8">
          <Typography className="font-black text-slate-900 text-lg mb-2">Product saved! 🎉</Typography>
          <Typography className="text-slate-500 text-sm mb-2">
            Want to email your newsletter subscribers about this new arrival?
          </Typography>
          {notifyResult && (
            <Alert severity={notifyResult.startsWith('Failed') ? 'error' : 'success'} sx={{ borderRadius: 2, mt: 2, fontWeight: 600 }}>
              {notifyResult}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1 }}>
          {!notifyResult ? (
            <>
              <Button onClick={handleSkipNotify} className="text-slate-500 font-bold normal-case px-6">
                Skip
              </Button>
              <Button
                onClick={handleNotifySubscribers}
                disabled={notifying}
                variant="contained"
                startIcon={notifying ? <CircularProgress size={16} color="inherit" /> : null}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold normal-case rounded-xl px-6"
              >
                {notifying ? 'Sending...' : 'Notify Subscribers'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSkipNotify}
              variant="contained"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold normal-case rounded-xl px-6"
            >
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
}