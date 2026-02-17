'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Stack } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { ProductProvider } from '@/context/ProductContext';

const drawerWidth = 280;

const MENU_ITEMS = [
  { text: 'Overview', icon: <DashboardIcon />, href: '/admin' },
  { text: 'Inventory', icon: <Inventory2Icon />, href: '/admin/inventory' },
  { text: 'Add Product', icon: <AddCircleIcon />, href: '/admin/add-product' },
  { text: 'Settings', icon: <SettingsIcon />, href: '#' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProductProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Modern Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              border: 'none',
              background: '#ffffff',
              padding: '24px'
            },
          }}
        >
          {/* Logo Area */}
          <Box className="mb-10 px-2 flex items-center gap-3">
            <Box className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
              M
            </Box>
            <Typography variant="h5" className="font-black text-slate-800 tracking-tight">
              MKUSI<span className="text-blue-600">.</span>
            </Typography>
          </Box>
          
          {/* Menu Items */}
          <List className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <ListItem key={item.text} disablePadding>
                  <Link href={item.href} className="w-full no-underline">
                    <ListItemButton 
                      className={`rounded-2xl py-3 transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'hover:bg-slate-50'}`}
                    >
                      <ListItemIcon className={`min-w-[44px] ${isActive ? 'text-white' : 'text-white'}`}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          className: `font-bold text-sm ${isActive ? 'text-white' : 'text-slate-500'}` 
                        }} 
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </List>

          {/* User Profile at Bottom */}
          <Box className="mt-auto pt-6 border-t border-slate-100">
            <Stack direction="row" spacing={2} alignItems="center" className="p-3 rounded-2xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <Avatar src="https://i.pravatar.cc/150?u=mkusi" variant="rounded" className="w-10 h-10 rounded-lg" />
              <Box className="flex-1">
                <Typography className="text-sm font-bold text-slate-900">Manager</Typography>
                <Typography className="text-xs text-slate-500">Admin Account</Typography>
              </Box>
              <LogoutIcon className="text-slate-400 text-sm" />
            </Stack>
          </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          {children}
        </Box>
      </Box>
    </ProductProvider>
  );
}