'use client';
import React from 'react';
import { Box, Button, Stack, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const TABS = [
  { id: 'edit_profile', label: 'EDIT PROFILE', icon: <EditIcon fontSize="small" /> },
  { id: 'orders', label: 'ORDERS', icon: <GridViewIcon fontSize="small" /> },
  { id: 'wishlist', label: 'WISHLIST', icon: <FavoriteBorderIcon fontSize="small" /> },
  { id: 'account', label: 'ACCOUNT', icon: <PersonIcon fontSize="small" />, badge: 1 },
  { id: 'wallets', label: 'WALLETS', icon: <AccountBalanceWalletIcon fontSize="small" /> },
];

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  const router = useRouter();

  return (
    <Box className="sticky top-[64px] md:top-28 z-40 bg-white/95 backdrop-blur-xl md:bg-transparent pt-2 pb-3 md:py-0 mb-4 md:mb-0 border-b border-slate-100 md:border-none">
      
      {/* Desktop Back Button */}
      <Box className="hidden md:block mb-10">
        <Button 
          startIcon={<ArrowBackIcon fontSize="small" />}
          className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold normal-case rounded-full px-6 py-2 shadow-none w-max transition-colors"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Divider className="mt-8 border-dashed border-slate-200" />
      </Box>

      {/* Navigation - Horizontal on Mobile, Vertical on Desktop */}
      <Stack 
        direction={{ xs: 'row', md: 'column' }} 
        spacing={{ xs: 1.5, md: 1 }}
        className="overflow-x-auto no-scrollbar"
        sx={{
          // Hides scrollbar
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          // Allows edge-to-edge scrolling on mobile while keeping alignment, resets on desktop
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
              disableElevation
              variant={isActive ? "contained" : "text"}
              sx={{ 
                // Auto width and center content on mobile; 100% width and left-align on desktop
                width: { xs: 'auto', md: '100%' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                minWidth: 'max-content' // Prevents text from wrapping on small screens
              }}
              className={`rounded-full md:rounded-lg px-5 md:px-5 py-2.5 md:py-3 transition-all flex-shrink-0 ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-none' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className={`text-[13px] md:text-sm tracking-wide font-bold`}>
                {tab.label}
              </span>
              
              {/* Notification Badge */}
              {tab.badge && (
                <Box className={`w-[18px] h-[18px] md:w-5 md:h-5 rounded-full flex items-center justify-center ml-2 ${
                  isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  <Typography className="font-bold text-[9px] md:text-[10px] leading-none">
                    {tab.badge}
                  </Typography>
                </Box>
              )}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}