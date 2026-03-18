'use client';
import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import your separated components
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import EditProfileTab from '@/components/profile/tabs/EditProfileTab';
import OrdersTab from '@/components/profile/tabs/OrdersTab';
import WishlistTab from '@/components/profile/tabs/WishlistTab';
import AccountTab from '@/components/profile/tabs/AccountTab';
import WalletsTab from '@/components/profile/tabs/WalletsTab';

export default function ProfilePage() {
  // State to track which tab is currently selected in the sidebar
  const [activeTab, setActiveTab] = useState('edit_profile');

  // DEBUGGING: This will print to your terminal. 
  // Look for any component that says "undefined" or "{}" instead of "[Function: ComponentName]"
  console.log("Checking Imports:", { 
    ProfileSidebar, EditProfileTab, OrdersTab, WishlistTab, AccountTab, WalletsTab 
  });

  // Function to render the correct component based on the active tab
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

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* <Container maxWidth="xl" className="py-12 sm:py-0 px-4 md:px-8 flex-1"> */}
      <Container maxWidth="xl" className="py-10 md:py-14 lg:py-12 px-8 md:px-8 flex-1">
        <Grid container spacing={{ xs: 6, md: 10 }} >
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <Grid size={{ xs: 12, md: 3 }}>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Grid>

          {/* RIGHT MAIN CONTENT */}
          <Grid size={{ xs: 12, md: 9 }}>
            {renderContent()}
          </Grid>

        </Grid>
      </Container>
    </main>
  );
}