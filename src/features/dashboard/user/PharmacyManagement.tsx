// import React, { useState, useMemo, useEffect } from 'react';
// import {
//     Box, Card, CardContent, Grid, Typography, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
//     Stack, Button, Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
//     useTheme
// } from '@mui/material';
// import {
//     LineChart,
//     BarChart
// } from '@mui/x-charts';
// import {
//     Info as InfoIcon,
//     TrendingUp as TrendingUpIcon,
//     WarningAmber as WarningIcon
// } from '@mui/icons-material';

// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { getUserAnalytics } from '@/services/analytics';

// const calculatePerformanceMetrics = (
//     pharmacySalesData: {
//         data?: { labels?: string[]; data?: number[] };
//         stockPurchased?: number;
//         stockRemaining?: number;
//     } | undefined
// ) => {
//     if (!pharmacySalesData?.data) {
//         return {
//             growthRate: 0.0,
//             stockUtilizationRate: 0.0
//         };
//     }

//     const labels = pharmacySalesData.data.labels ?? [];
//     const data = pharmacySalesData.data.data ?? [];

//     // Build a full 12-month array (0s for missing months)
//     const fullYearSales = Array(12).fill(0);
//     labels.forEach((label, idx) => {
//         const month = parseInt(label.split('-')[1], 10); // "2025-03" → 3
//         if (!isNaN(month) && month >= 1 && month <= 12) {
//             fullYearSales[month - 1] = data[idx];
//         }
//     });

//     // Extract the last two non-zero months for growth rate
//     const nonZeroSales = fullYearSales
//         .map((value, idx) => ({ value, idx }))
//         .filter(entry => entry.value !== 0);

//     let growthRate = 0.0;
//     if (nonZeroSales.length >= 2) {
//         const first = nonZeroSales[nonZeroSales.length - 2].value;
//         const last = nonZeroSales[nonZeroSales.length - 1].value;
//         if (first !== 0) {
//             growthRate = ((last - first) / first) * 100;
//         }
//     }

//     const stockPurchased = pharmacySalesData.stockPurchased ?? 0;
//     const stockRemaining = pharmacySalesData.stockRemaining ?? 0;

//     const stockUtilizationRate = stockPurchased === 0
//         ? 0
//         : ((stockPurchased - stockRemaining) / stockPurchased) * 100;

//     return {
//         growthRate: parseFloat(growthRate.toFixed(1)),
//         stockUtilizationRate: parseFloat(stockUtilizationRate.toFixed(1))
//     };
// };


// const UserPharmacyManagement: React.FC = () => {
//     const theme = useTheme();
//     const dispatch = useDispatch<AppDispatch>();
//     const { userAnalyticsData } = useSelector((state: RootState) => state.analytics);
//     const { user } = useSelector((state: RootState) => state.auth);
//     const currentMonth = new Date().getMonth() + 1;
//     const currentYear = new Date().getFullYear();

//     const [selectedPharmacy, _setSelectedPharmacy] = useState<string>('1');
//     const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

//     const pharmacies = useMemo(() =>
//         userAnalyticsData?.top_month_sales
//             ? [...userAnalyticsData.top_month_sales].sort((a, b) => b.totalSales - a.totalSales)
//             : []
//         , [userAnalyticsData]);


//     // Memoize selected pharmacy data for performance
//     const selectedPharmacyData = useMemo(() =>
//         pharmacies?.find(p => p.id === selectedPharmacy),
//         [selectedPharmacy, pharmacies]
//     );

//     const performanceMetrics = useMemo(() =>
//         calculatePerformanceMetrics({ data: { data: userAnalyticsData?.sales_trends_yearly?.data, labels: userAnalyticsData?.sales_trends_yearly?.labels }, stockPurchased: userAnalyticsData?.total_purchased, stockRemaining: userAnalyticsData?.remaining_stock })
//         ,
//         [userAnalyticsData?.sales_trends_yearly?.data, userAnalyticsData?.sales_trends_yearly?.labels, userAnalyticsData?.total_purchased, userAnalyticsData?.remaining_stock]
//     );

//     const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


//     const fullYearSalesData = (() => {
//         if (!userAnalyticsData?.sales_trends_yearly?.labels || !userAnalyticsData?.sales_trends_yearly?.data) return Array(12).fill(0);

//         const { labels = [], data = [] } = userAnalyticsData?.sales_trends_yearly ?? {};

//         const labelToIndexMap = labels.reduce((acc, label, idx) => {
//             const month = parseInt(label.split('-')[1], 10); // '2025-03' -> 3
//             acc[month - 1] = data[idx]; // Month index: 0-based
//             return acc;
//         }, Array(12).fill(0));

//         return labelToIndexMap;
//     })();

//     // Color coding for performance
//     const getPerformanceColor = (value: number) => {
//         if (value > 20) return 'success';
//         if (value > 10) return 'warning';
//         return 'error';
//     };

//     useEffect(() => {
//         dispatch(getUserAnalytics({ month: currentMonth.toString(), year: currentYear.toString() }));
//     }, [dispatch, currentMonth, currentYear]);

//     return (
//         <Box sx={{ p: 3, backgroundColor: theme.palette.mode === 'light' ? '#f4f6f8' : '#121212' }}>
//             <Typography
//                 variant="h4"
//                 component="h1"
//                 gutterBottom
//                 sx={{
//                     fontWeight: 600,
//                     color: 'primary.main',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 2
//                 }}
//             >
//                 Pharmacy Performance Dashboard
//                 <Tooltip title="View performance insights and key metrics">
//                     <IconButton color="primary">
//                         <InfoIcon />
//                     </IconButton>
//                 </Tooltip>
//             </Typography>

//             {/* Performance Overview Table */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12}>
//                     <Card elevation={3}>
//                         <CardContent>
//                             <TableContainer>
//                                 <Table>
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Pharmacy Name</TableCell>
//                                             <TableCell align="right">Total Sales</TableCell>
//                                             <TableCell align="right">Stock Status</TableCell>
//                                             <TableCell align="right">Performance</TableCell>
//                                             <TableCell align="right">Actions</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         <TableRow
//                                             hover
//                                             selected={true}
//                                             // onClick={() => setSelectedPharmacy(pharmacy.id)}
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 '&.Mui-selected': {
//                                                     backgroundColor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
//                                                     color: 'primary.contrastText'
//                                                 }
//                                             }}
//                                         >
//                                             <TableCell>{user?.UserData?.company_name || user?.UserData?.shop_name}</TableCell>
//                                             <TableCell align="right">
//                                                 ${userAnalyticsData?.total_sales.toLocaleString()}
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 <Chip
//                                                     color={
//                                                         (userAnalyticsData?.remaining_stock || 0) / (userAnalyticsData?.total_purchased || 0) < 0.2
//                                                             ? 'error'
//                                                             : 'success'
//                                                     }
//                                                     size="small"
//                                                     label={`${(((userAnalyticsData?.remaining_stock || 0) / (userAnalyticsData?.total_purchased || 0)) * 100).toFixed(0)}% Remaining`}
//                                                 />
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 <Chip
//                                                     icon={
//                                                         <TrendingUpIcon
//                                                             color={getPerformanceColor(
//                                                                 calculatePerformanceMetrics({ data: { data: userAnalyticsData?.sales_trends_yearly?.data, labels: userAnalyticsData?.sales_trends_yearly?.labels }, stockPurchased: userAnalyticsData?.total_purchased, stockRemaining: userAnalyticsData?.remaining_stock }).growthRate
//                                                             )}
//                                                         />
//                                                     }
//                                                     size="small"
//                                                     label={
//                                                         (calculatePerformanceMetrics({ data: { data: userAnalyticsData?.sales_trends_yearly?.data, labels: userAnalyticsData?.sales_trends_yearly?.labels }, stockPurchased: userAnalyticsData?.total_purchased, stockRemaining: userAnalyticsData?.remaining_stock }).growthRate ?? 0) + '% Growth'
//                                                     }
//                                                 />
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 <Button
//                                                     size="small"
//                                                     variant="outlined"
//                                                     onClick={() => setOpenDetailModal(true)}
//                                                 >
//                                                     Details
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Performance Charts */}
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8}>
//                     <Card elevation={3}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Yearly Sales: {userAnalyticsData?.sales_trends_yearly?.year}   
//                             </Typography>
//                             <LineChart
//                                 xAxis={[{
//                                     scaleType: 'point',
//                                     data: MONTH_LABELS
//                                 }]}
//                                 series={[{
//                                     data: fullYearSalesData,
//                                     area: true,
//                                     showMark: false
//                                 }]}
//                                 height={300}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                     <Card elevation={3} sx={{ height: '100%' }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>
//                                 Performance Metrics
//                             </Typography>
//                             <Stack spacing={2}>
//                                 <Chip
//                                     color={getPerformanceColor(performanceMetrics.growthRate)}
//                                     label={`Growth Rate: ${performanceMetrics.growthRate}%`}
//                                     icon={<TrendingUpIcon />}
//                                 />
//                                 <Chip
//                                     color={performanceMetrics.stockUtilizationRate > 80 ? 'success' : 'warning'}
//                                     label={`Stock Utilization: ${performanceMetrics.stockUtilizationRate}%`}
//                                     icon={<WarningIcon />}
//                                 />
//                             </Stack>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Detailed Pharmacy Modal */}
//             <Dialog
//                 open={openDetailModal}
//                 onClose={() => setOpenDetailModal(false)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     Detailed Pharmacy Performance: {selectedPharmacyData?.name}
//                 </DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="subtitle1">Key Metrics</Typography>
//                             <Stack spacing={1}>
//                                 <Chip label={`Total Sales: $${userAnalyticsData?.total_sales.toLocaleString()}`} />
//                                 <Chip label={`Stock Purchased: ${userAnalyticsData?.total_purchased.toLocaleString()}`} />
//                                 <Chip label={`Stock Remaining: ${userAnalyticsData?.remaining_stock.toLocaleString()}`} />
//                                 <Chip label={`Pending Returns: ${userAnalyticsData?.pending_returns.toLocaleString()}`} />
//                             </Stack>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <BarChart
//                                 xAxis={[{
//                                     scaleType: 'band',
//                                     data: ['Stock Purchased', 'Stock Remaining', 'Pending Returns']
//                                 }]}
//                                 series={[{
//                                     data: [
//                                         userAnalyticsData?.total_purchased || 0,
//                                         userAnalyticsData?.remaining_stock || 0,
//                                         userAnalyticsData?.pending_returns || 0
//                                     ]
//                                 }]}
//                                 height={250}
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//             </Dialog>
//         </Box>
//     );
// };

// export default UserPharmacyManagement;