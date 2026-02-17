'use client';
import React from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { useProducts } from '@/context/ProductContext';

export default function InventoryPage() {
  const { products } = useProducts();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className="font-black mb-8">Live Inventory</Typography>
      <Paper elevation={0} className="rounded-3xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell className="font-bold">Product</TableCell>
              <TableCell className="font-bold">Category</TableCell>
              <TableCell className="font-bold">Price</TableCell>
              <TableCell className="font-bold">Stock</TableCell>
              <TableCell className="font-bold">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>GH₵ {item.price}</TableCell>
                <TableCell>{item.stock} units</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={item.status === 'Active' ? 'success' : 'error'} 
                    size="small" 
                    className="font-bold"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}