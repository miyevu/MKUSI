'use client';
import React, { useState, useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

import ProfileSidebar from '@/components/profile/ProfileSidebar';
import EditProfileTab from '@/components/profile/tabs/EditProfileTab';
import OrdersTab from '@/components/profile/tabs/OrdersTab';
import WishlistTab from '@/components/profile/tabs/WishlistTab';
import AccountTab from '@/components/profile/tabs/AccountTab';
import WalletsTab from '@/components/profile/tabs/WalletsTab';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('edit_profile');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    } else if (currentUser.isAdmin) {
      router.push('/admin'); // admins don't have a customer profile
    } else {
      setChecked(true);
    }
  }, [currentUser, router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'edit_profile': return <EditProfileTab />;
      case 'orders': return <OrdersTab />;
      case 'wishlist': return <WishlistTab />;
      case 'account': return <AccountTab />;
      case 'wallets': return <WalletsTab />;
      default: return null;
    }
  };

  if (!checked) return null;

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <Container maxWidth="xl" className="py-10 md:py-14 lg:py-12 px-4 sm:px-6 md:px-8 flex-1">
        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {renderContent()}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </main>
  );
}