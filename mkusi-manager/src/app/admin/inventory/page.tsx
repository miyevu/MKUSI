'use client';
import React, { useState } from 'react';
import {
  Typography, Box, Stack, Chip, Button, IconButton, Paper, InputBase, Avatar
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  Active:      { bg: '#dcfce7', color: '#15803d' },
  Inactive:    { bg: '#fee2e2', color: '#b91c1c' },
  'Low Stock': { bg: '#fef9c3', color: '#a16207' },
};

const FILTERS = ['All', 'Active', 'Low Stock', 'Inactive'];

export default function InventoryPage() {
  const { products } = useProducts();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All'
      ? true
      : filter === 'Low Stock'
        ? p.stock > 0 && p.stock <= 5
        : p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Box className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Box>
          <Typography className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none mb-1">
            Inventory
          </Typography>
          <Typography className="text-slate-400 text-sm font-medium">
            {products.length} products · {products.filter(p => p.stock <= 5 && p.stock > 0).length} low stock
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/admin/add-product"
          variant="contained"
          startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold normal-case rounded-2xl px-5 py-2.5 shadow-none transition-colors text-sm shrink-0"
        >
          Add Product
        </Button>
      </Box>

      {/* ── Search + Filter Bar ── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 2, mb: 4 }}
        className="bg-white"
      >
        <Box className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <Box className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2.5 flex-1">
            <SearchRoundedIcon sx={{ fontSize: 18 }} className="text-slate-400 shrink-0" />
            <InputBase
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm font-medium text-slate-900"
              sx={{ '& input::placeholder': { color: '#94a3b8' } }}
            />
          </Box>

          {/* Filters */}
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

      {/* ── Table (desktop) / Cards (mobile) ── */}
      {filtered.length === 0 ? (
        <Box className="flex flex-col items-center justify-center py-24 text-center">
          <Box className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
            <Inventory2RoundedIcon sx={{ fontSize: 28 }} className="text-slate-300" />
          </Box>
          <Typography className="font-bold text-slate-900 mb-1">No products found</Typography>
          <Typography className="text-slate-400 text-sm">Try a different search or filter.</Typography>
        </Box>
      ) : (
        <>
          {/* Desktop Table */}
          <Paper
            elevation={0}
            sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'grey.100', overflow: 'hidden' }}
            className="bg-white hidden md:block"
          >
            {/* Table Header */}
            <Box className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-50 bg-slate-50/50">
              {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h, i) => (
                <Box
                  key={h}
                  className={`${i === 0 ? 'col-span-4' : i === 5 ? 'col-span-1' : 'col-span-1'} ${i === 4 ? 'col-span-2' : ''}`}
                >
                  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">{h}</Typography>
                </Box>
              ))}
            </Box>

            {/* Rows */}
            {filtered.map((item, index) => {
              const stockStatus = item.stock === 0
                ? 'Inactive'
                : item.stock <= 5
                  ? 'Low Stock'
                  : 'Active';
              const style = STATUS_CONFIG[stockStatus];

              return (
                <Box
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors ${index < filtered.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  {/* Product */}
                  <Box className="col-span-4 flex items-center gap-3">
                    <Box className="w-11 h-11 bg-[#f0f2f5] rounded-xl overflow-hidden flex items-center justify-center shrink-0 p-1.5">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Box>
                    <Box className="min-w-0">
                      <Typography className="font-bold text-slate-900 text-sm truncate">{item.name}</Typography>
                      <Typography className="text-slate-400 text-[11px] font-medium">{item.brand || 'MKUSI'}</Typography>
                    </Box>
                  </Box>

                  {/* Category */}
                  <Box className="col-span-1">
                    <Typography className="text-slate-500 text-sm font-medium truncate">{item.category}</Typography>
                  </Box>

                  {/* Price */}
                  <Box className="col-span-1">
                    <Typography className="font-bold text-slate-900 text-sm">GH₵ {item.price}</Typography>
                  </Box>

                  {/* Stock */}
                  <Box className="col-span-1">
                    <Typography className={`font-bold text-sm ${item.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {item.stock}
                    </Typography>
                    <Typography className="text-slate-400 text-[10px] font-medium">units</Typography>
                  </Box>

                  {/* Status */}
                  <Box className="col-span-2">
                    <Box
                      sx={{ bgcolor: style.bg, color: style.color }}
                      className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-black"
                    >
                      <Box
                        className="w-1.5 h-1.5 rounded-full mr-1.5"
                        sx={{ bgcolor: style.color }}
                      />
                      {stockStatus}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box className="col-span-1 flex items-center justify-end gap-1">
                    <IconButton size="small" className="text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <EditRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Paper>

          {/* Mobile Cards */}
          <Stack spacing={2} className="md:hidden">
            {filtered.map((item) => {
              const stockStatus = item.stock === 0 ? 'Inactive' : item.stock <= 5 ? 'Low Stock' : 'Active';
              const style = STATUS_CONFIG[stockStatus];

              return (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'grey.100', p: 3 }}
                  className="bg-white"
                >
                  <Box className="flex items-start gap-3">
                    <Box className="w-14 h-14 bg-[#f0f2f5] rounded-2xl flex items-center justify-center shrink-0 p-2">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Box>
                    <Box className="flex-1 min-w-0">
                      <Box className="flex items-start justify-between gap-2">
                        <Typography className="font-bold text-slate-900 text-sm leading-snug">{item.name}</Typography>
                        <Box
                          sx={{ bgcolor: style.bg, color: style.color }}
                          className="text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0"
                        >
                          {stockStatus}
                        </Box>
                      </Box>
                      <Typography className="text-slate-400 text-xs font-medium mt-0.5">{item.category}</Typography>
                    </Box>
                  </Box>

                  <Box className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <Box className="flex gap-4">
                      <Box>
                        <Typography className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</Typography>
                        <Typography className="font-black text-slate-900 text-sm">GH₵ {item.price}</Typography>
                      </Box>
                      <Box>
                        <Typography className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stock</Typography>
                        <Typography className={`font-black text-sm ${item.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                          {item.stock} units
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="flex gap-1">
                      <IconButton size="small" className="text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                        <EditRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small" className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl">
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}
