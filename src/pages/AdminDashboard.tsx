import React, { useState } from 'react';
import {
  Box, Container, Typography, Tabs, Tab,
} from '@mui/material';
import OverviewPanel from '@/features/dashboard/admin/OverviewPanel';
import PharmacyManagement from '@/features/dashboard/admin/PharmacyManagement';
import ReportsAndInsights from '@/features/dashboard/admin/ReportsAndInsights';
import UserOverviewPanel from '@/features/dashboard/user/OverviewPanel';
import UserPharmacyManagement from '@/features/dashboard/user/PharmacyManagement';
import UserReportsAndInsights from '@/features/dashboard/user/ReportsAndInsights';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ROLE_ENUM } from '@/utils/enums';



export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard {user?.user_type === ROLE_ENUM.ADMIN ? '(Global View)' : '(User View)'}
        </Typography>

        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="dashboard tabs" sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Pharmacy Management" />
          <Tab label="Reports & Insights" />
        </Tabs>

        {/* 1.1 Overview Panel */}
        {selectedTab === 0 && (
          user?.user_type === ROLE_ENUM.ADMIN ? (
            <OverviewPanel />
          ) : (<UserOverviewPanel />)
        )}

        {/* 1.2 Pharmacy Management */}
        {selectedTab === 1 && (
          user?.user_type === ROLE_ENUM.ADMIN ? (
            <PharmacyManagement />) : (<UserPharmacyManagement />)
        )}

        {/* 1.3 Reports & Insights */}
        {selectedTab === 2 && (
          user?.user_type === ROLE_ENUM.ADMIN ? (
            <ReportsAndInsights />
          ) : (
            <UserReportsAndInsights />
          ))}
      </Box>
    </Container>
  );
};