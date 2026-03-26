'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, Typography,
  Avatar, IconButton, AppBar, Toolbar
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { ProductProvider } from '@/context/ProductContext';

const DRAWER_WIDTH = 272;

const MENU_GROUPS = [
  {
    label: 'General',
    items: [
      { text: 'Overview',    icon: DashboardRoundedIcon,  href: '/admin',             badge: null },
      { text: 'Inventory',   icon: Inventory2RoundedIcon, href: '/admin/inventory',    badge: null },
      { text: 'Add Product', icon: AddCircleRoundedIcon,  href: '/admin/add-product',  badge: 'New' },
    ],
  },
  {
    label: 'System',
    items: [
      { text: 'Storefront',  icon: StorefrontRoundedIcon, href: '/',    badge: null },
      { text: 'Settings',    icon: SettingsRoundedIcon,   href: '/admin/settings', badge: null },
    ],
  },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <Box
      sx={{ 
        display: 'flex', flexDirection: 'column', height: '100%', 
        bgcolor: '#ffffff', // Clean white background
        borderRight: '1px solid #f1f5f9' // slate-100 border
      }}
    >
      {/* ── Logo area ── */}
      <Box sx={{ px: 3, pt: 3, pb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" className="no-underline flex items-center gap-3">
          {/* Icon mark */}
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '12px',
              bgcolor: '#2563eb', // blue-600
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(37,99,235,0.2)',
            }}
          >
            <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', lineHeight: 1 }}>M</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
              MKUSI
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Admin Panel
            </Typography>
          </Box>
        </Link>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' }, borderRadius: '10px' }}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* ── Nav groups ── */}
      <Box sx={{ flex: 1, px: 2, overflowY: 'auto' }}>
        {MENU_GROUPS.map((group) => (
          <Box key={group.label} sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.16em',
                color: '#94a3b8', textTransform: 'uppercase', px: 1.5, mb: 1.5,
              }}
            >
              {group.label}
            </Typography>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <ListItem key={item.text} disablePadding>
                    <Link href={item.href} className="w-full no-underline" onClick={onClose}>
                      <Box
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          px: 1.5, py: 1.3, borderRadius: '12px',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          position: 'relative', overflow: 'hidden',
                          bgcolor: isActive ? '#eff6ff' : 'transparent', // blue-50 when active
                          color: isActive ? '#2563eb' : '#64748b', // blue-600 vs slate-500
                          '&:hover': {
                            bgcolor: isActive ? '#eff6ff' : '#f8fafc', // slate-50 hover
                            color: isActive ? '#2563eb' : '#0f172a',
                          },
                        }}
                      >
                        {/* Active left bar */}
                        {isActive && (
                          <Box
                            sx={{
                              position: 'absolute', left: 0, top: '25%', bottom: '25%',
                              width: 3, borderRadius: '0 4px 4px 0',
                              bgcolor: '#2563eb', // blue-600
                            }}
                          />
                        )}

                        {/* Icon container */}
                        <Box
                          sx={{
                            width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            bgcolor: isActive ? '#dbeafe' : '#f1f5f9', // blue-100 vs slate-100
                            transition: 'all 0.2s',
                          }}
                        >
                          <Icon
                            sx={{
                              fontSize: 18,
                              color: 'inherit',
                              transition: 'color 0.2s',
                            }}
                          />
                        </Box>

                        {/* Label */}
                        <Typography
                          sx={{
                            flex: 1,
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 800 : 600,
                            color: 'inherit',
                            transition: 'color 0.2s',
                          }}
                        >
                          {item.text}
                        </Typography>

                        {/* Badge */}
                        {item.badge && (
                          <Box
                            sx={{
                              px: 1.2, py: 0.3, borderRadius: '6px',
                              bgcolor: isActive ? '#2563eb' : '#e2e8f0', // blue-600 vs slate-200
                            }}
                          >
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: isActive ? '#fff' : '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                              {item.badge}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* ── User profile ── */}
      <Box
        sx={{
          mx: 2, mb: 3, p: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
          borderRadius: '16px', cursor: 'pointer',
          bgcolor: 'transparent',
          border: '1px solid transparent',
          transition: 'all 0.2s',
          '&:hover': { bgcolor: '#f8fafc', border: '1px solid #f1f5f9' },
        }}
      >
        <Avatar
          src="https://i.pravatar.cc/150?u=mkusi"
          variant="rounded"
          sx={{ width: 40, height: 40, borderRadius: '12px', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            Manager
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }} noWrap>
            admin@mkusi.com
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            color: '#94a3b8', borderRadius: '10px',
            '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' },
            transition: 'all 0.2s',
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProductProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}> {/* Matching slate-50 background */}

        {/* ── Mobile top bar ── */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            display: { lg: 'none' },
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #f1f5f9',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '64px !important' }}>
            <Link href="/" className="no-underline flex items-center gap-2.5">
              <Box
                sx={{
                  width: 32, height: 32, borderRadius: '10px',
                  bgcolor: '#2563eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '0.875rem' }}>M</Typography>
              </Box>
              <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                MKUSI
              </Typography>
            </Link>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#0f172a', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' }, borderRadius: '10px' }}
            >
              <MenuRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* ── Mobile drawer ── */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH, boxSizing: 'border-box',
              border: 'none', bgcolor: '#ffffff',
            },
          }}
        >
          <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
        </Drawer>

        {/* ── Desktop permanent drawer ── */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: DRAWER_WIDTH, flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH, boxSizing: 'border-box',
              border: 'none', bgcolor: '#ffffff',
            },
          }}
        >
          <SidebarContent pathname={pathname} />
        </Drawer>

        {/* ── Main content ── */}
        <Box
          component="main"
          sx={{ flexGrow: 1, minWidth: 0, pt: { xs: 8, lg: 0 } }}
        >
          {children}
        </Box>

      </Box>
    </ProductProvider>
  );
}