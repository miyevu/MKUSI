'use client';
import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Paper, Grid, 
  MenuItem, InputAdornment, Snackbar, Alert, Box 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Phone Cases', // Default
    brand: '',
    price: '',
    stock: '',
    description: '',
    compatibility: '', // e.g., "iPhone 15, Samsung S24"
    image: '', 
    // Category Specifics
    color: '',
    material: '',
    power: '',
    connector: '',
    type: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the "specs" object based on category
    const specs: any = {};
    if (formData.category === 'Phone Cases') {
      specs.color = formData.color;
      specs.material = formData.material;
    } else if (formData.category === 'Chargers') {
      specs.power = formData.power;
      specs.connector = formData.connector;
    } else if (formData.category === 'Audio') {
      specs.type = formData.type;
      specs.color = formData.color;
    }

    addProduct({
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      compatibility: formData.compatibility,
      image: formData.image,
      specs: specs
    });

    setOpen(true);
    setTimeout(() => {
      router.push('/admin/inventory');
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
      <Typography variant="h4" fontWeight="900" color="text.primary" sx={{ mb: 1 }}>
        Add New Product
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5 }}>
        Enter detailed specs to help customers find exactly what they need.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        
        {/* SECTION 1: BASIC INFO */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            border: '1px solid', 
            borderColor: 'grey.100', 
            borderRadius: '24px', 
            mb: 4, 
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
            1. Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField 
                fullWidth 
                label="Product Name" 
                required 
                placeholder="e.g. Samsung S23 Ultra Clear Case"
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField 
                fullWidth 
                select 
                label="Category"
                value={formData.category} 
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {['Phone Cases', 'Chargers', 'Screen Protectors', 'Audio', 'Cables'].map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                label="Brand" 
                placeholder="e.g. Apple, Anker, Oraimo"
                value={formData.brand} 
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField 
                fullWidth 
                label="Price" 
                type="number" 
                required
                value={formData.price} 
                onChange={(e) => handleChange('price', e.target.value)}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">₵</InputAdornment> 
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField 
                fullWidth 
                label="Stock Qty" 
                type="number" 
                required
                value={formData.stock} 
                onChange={(e) => handleChange('stock', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline 
                rows={3} 
                placeholder="Describe the key features..."
                value={formData.description} 
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Image URL" 
                placeholder="https://..."
                value={formData.image} 
                onChange={(e) => handleChange('image', e.target.value)}
                InputProps={{ 
                  endAdornment: (
                    <InputAdornment position="end">
                      <CloudUploadIcon sx={{ color: 'grey.400' }}/>
                    </InputAdornment>
                  ) 
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 2: COMPATIBILITY */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            border: '1px solid', 
            borderColor: 'grey.100', 
            borderRadius: '24px', 
            mb: 4, 
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
            2. Compatibility
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Compatible Phone Models" 
                required
                placeholder="e.g. iPhone 13, 14, 15 Pro Max, Samsung S24"
                helperText="List all phones this accessory works with."
                value={formData.compatibility} 
                onChange={(e) => handleChange('compatibility', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 3: CATEGORY SPECIFIC FEATURES */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            border: '1px solid', 
            borderColor: 'grey.100', 
            borderRadius: '24px', 
            mb: 5, 
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
            3. Technical Specs
          </Typography>
          <Grid container spacing={3}>
            
            {/* Logic for Phone Cases */}
            {formData.category === 'Phone Cases' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Color" 
                    placeholder="e.g. Midnight Blue"
                    value={formData.color} 
                    onChange={(e) => handleChange('color', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Material" 
                    placeholder="e.g. Silicone, Leather, Hard Plastic"
                    value={formData.material} 
                    onChange={(e) => handleChange('material', e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* Logic for Chargers/Cables */}
            {(formData.category === 'Chargers' || formData.category === 'Cables') && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Power Output (Watts)" 
                    placeholder="e.g. 20W, 65W"
                    value={formData.power} 
                    onChange={(e) => handleChange('power', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    select 
                    label="Connector Type"
                    value={formData.connector} 
                    onChange={(e) => handleChange('connector', e.target.value)}
                  >
                    <MenuItem value="USB-C">USB-C</MenuItem>
                    <MenuItem value="Lightning">Lightning</MenuItem>
                    <MenuItem value="Micro-USB">Micro-USB</MenuItem>
                    <MenuItem value="MagSafe">MagSafe</MenuItem>
                  </TextField>
                </Grid>
              </>
            )}

            {/* Logic for Audio */}
            {formData.category === 'Audio' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    select 
                    label="Type"
                    value={formData.type} 
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    <MenuItem value="Wireless (Bluetooth)">Wireless (Bluetooth)</MenuItem>
                    <MenuItem value="Wired">Wired</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Color"
                    value={formData.color} 
                    onChange={(e) => handleChange('color', e.target.value)}
                  />
                </Grid>
              </>
            )}
            
            {/* Logic for Screen Protectors */}
            {formData.category === 'Screen Protectors' && (
               <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    select 
                    label="Type"
                    value={formData.material} 
                    onChange={(e) => handleChange('material', e.target.value)}
                  >
                    <MenuItem value="Tempered Glass">Tempered Glass</MenuItem>
                    <MenuItem value="Hydrogel">Hydrogel</MenuItem>
                    <MenuItem value="Privacy Glass">Privacy Glass</MenuItem>
                  </TextField>
               </Grid>
            )}

          </Grid>
        </Paper>

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          size="large" 
          startIcon={<SaveIcon />} 
          sx={{
            bgcolor: '#0f172a', // Tailwind slate-900
            color: 'common.white',
            py: 2,
            borderRadius: 3,
            fontWeight: 'bold',
            fontSize: '1.125rem',
            textTransform: 'none',
            boxShadow: '0 20px 25px -5px rgba(226, 232, 240, 0.5)', // Approximate shadow-xl
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'primary.main', // Tailwind blue-600 equivalent
            }
          }}
        >
          Save Product to Inventory
        </Button>
      </form>

      <Snackbar 
        open={open} 
        autoHideDuration={3000} 
        onClose={() => setOpen(false)} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          variant="filled" 
          sx={{ borderRadius: 3, fontWeight: 'bold' }}
        >
          Product saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}