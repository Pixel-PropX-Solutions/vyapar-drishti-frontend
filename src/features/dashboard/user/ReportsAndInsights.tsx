// import React, { useEffect } from 'react';
// import {
//     Box, Card, CardContent, Grid, Typography, Chip,
//     Stack,
//     useTheme,
// } from '@mui/material';
// // import { ScatterChart } from '@mui/x-charts/ScatterChart';
// // import { ScatterValueType } from '@mui/x-charts/models';
// import { styled } from '@mui/material/styles';
// import { useDrawingArea } from '@mui/x-charts/hooks';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
// // import { BubbleData, } from '@/utils/types';
// import { BarChart, LineChart, PieChart } from '@mui/x-charts';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { getUserAnalytics } from '@/services/analytics';
// interface StyledTextProps {
//     variant: 'primary' | 'secondary';
// }

// // const Piedata = [
// //     { label: 'Pain Relievers', value: 25, },
// //     { label: 'Antibiotics', value: 20, },
// //     { label: 'Vitamins', value: 15, },
// //     { label: 'Heart Medications', value: 30, },
// //     { label: 'Diabetes Medications', value: 10, },
// // ];

// // const medicineCategoryData = [
// //     { label: 'Pain Relievers', value: 25, color: "hsl(195, 95.30%, 24.90%)", },
// //     { label: 'Vitamins', value: 15, color: "hsl(195, 85%, 40%)", },
// //     { label: 'Antibiotics', value: 20, color: "hsl(195, 90%, 32%)", },
// //     { label: 'Heart Medications', value: 30, color: "hsl(195, 75%, 50%)", },
// //     { label: 'Diabetes Medications', value: 10, color: "hsl(195, 70%, 65%)", },
// // ];


// // const bubbleData: BubbleData[] = [
// //     { pharmacy: 'MediLife Pharmacy', returns: 150, sales: 95000, stockRemaining: 1800 },
// //     { pharmacy: 'HealthFirst Drugs', returns: 220, sales: 87000, stockRemaining: 1400 },
// //     { pharmacy: 'WellCare Pharmacy', returns: 180, sales: 75000, stockRemaining: 1200 },
// //     { pharmacy: 'MediPlus Drugstore', returns: 100, sales: 68000, stockRemaining: 950 },
// //     { pharmacy: 'QuickMeds Pharmacy', returns: 260, sales: 118000, stockRemaining: 2050 },
// //     { pharmacy: 'CarePoint Pharmacy', returns: 190, sales: 91000, stockRemaining: 1750 },
// //     { pharmacy: 'LifeMed Drugs', returns: 175, sales: 81000, stockRemaining: 1350 },
// //     { pharmacy: 'GoodHealth Pharmacy', returns: 120, sales: 72000, stockRemaining: 1150 },
// // ];


// function AreaGradient({ color, id }: { color: string; id: string }) {
//     return (
//         <defs>
//             <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
//                 <stop offset="0%" stopColor={color} stopOpacity={0.5} />
//                 <stop offset="100%" stopColor={color} stopOpacity={0} />
//             </linearGradient>
//         </defs>
//     );
// }


// const StyledText = styled('text', {
//     shouldForwardProp: (prop) => prop !== 'variant',
// })<StyledTextProps>(({ theme }) => ({
//     textAnchor: 'middle',
//     dominantBaseline: 'central',
//     fill: theme.palette.text.secondary,
//     variants: [
//         {
//             props: {
//                 variant: 'primary',
//             },
//             style: {
//                 fontSize: theme.typography.h5.fontSize,
//             },
//         },
//         {
//             props: ({ variant }) => variant !== 'primary',
//             style: {
//                 fontSize: theme.typography.body2.fontSize,
//             },
//         },
//         {
//             props: {
//                 variant: 'primary',
//             },
//             style: {
//                 fontWeight: theme.typography.h5.fontWeight,
//             },
//         },
//         {
//             props: ({ variant }) => variant !== 'primary',
//             style: {
//                 fontWeight: theme.typography.body2.fontWeight,
//             },
//         },
//     ],
// }));
// interface PieCenterLabelProps {
//     primaryText: string;
//     secondaryText: string;
// }

// function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
//     const { width, height, left, top } = useDrawingArea();
//     const primaryY = top + height / 2 - 10;
//     const secondaryY = primaryY + 24;

//     return (
//         <React.Fragment>
//             <StyledText variant="primary" x={left + width / 2} y={primaryY}>
//                 {primaryText}
//             </StyledText>
//             <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
//                 {secondaryText}
//             </StyledText>
//         </React.Fragment>
//     );
// }

// // const scatterData = bubbleData.map((item, index) => ({
// //     x: item.returns,
// //     y: item.sales / 1000,
// //     id: index,
// //     size: item.stockRemaining / 100,
// //     pharmacy: item.pharmacy
// // }));

// // const series = [
// //     {
// //         data: scatterData,
// //     },
// // ].map((s) => ({
// //     ...s,
// //     valueFormatter: (v: ScatterValueType) => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
// // }));

// const UserReportsAndInsights: React.FC = () => {
//     const theme = useTheme();
//     const dispatch = useDispatch<AppDispatch>();
//     const { userAnalyticsData } = useSelector((state: RootState) => state.analytics);

//     const { user } = useSelector((state: RootState) => state.auth);
//     const currentMonth = new Date().getMonth() + 1;
//     const currentYear = new Date().getFullYear();
//     const colorPalette = [
//         theme.palette.primary.dark,
//         theme.palette.primary.main,
//         theme.palette.primary.light,
//     ];

//     const colorsLineChart = [
//         "hsl(195, 90%, 32%)",
//         "hsl(195, 85%, 40%)",
//         "hsl(195, 75%, 50%)",
//         "hsl(195, 70%, 65%)",
//     ];

//     const colorsPieChart = [
//         "hsl(195, 95%, 25%)",
//         "hsl(195, 95%, 25%)",
//         "hsl(195, 90%, 32%)",
//         "hsl(195, 90%, 32%)",
//         "hsl(195, 85%, 40%)",
//         "hsl(195, 85%, 40%)",
//         "hsl(195, 75%, 50%)",
//         "hsl(195, 75%, 50%)",
//         "hsl(195, 70%, 65%)",
//         "hsl(195, 70%, 65%)",
//         "hsl(195, 70%, 80%)",
//     ];

//     const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



//     useEffect(() => {
//         dispatch(getUserAnalytics({ month: currentMonth.toString(), year: currentYear.toString() }));
//     }, [currentMonth, currentYear, dispatch]);


//     return (
//         <Box>
//             <Typography variant="h5" component="h2" gutterBottom>
//                 User Reports & Insights
//             </Typography>

//             {/* Stacked Bar Chart - Stock Analysis */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ width: '100%' }}>
//                         <CardContent>
//                             <Typography component="h2" variant="subtitle2" gutterBottom>
//                                 Stock Analysis
//                             </Typography>
//                             <Stack sx={{ justifyContent: 'space-between' }}>
//                                 <Stack
//                                     direction="row"
//                                     sx={{
//                                         alignContent: { xs: 'center', sm: 'flex-start' },
//                                         alignItems: 'center',
//                                         gap: 1,
//                                     }}
//                                 >
//                                     <Typography variant="h4" component="p">
//                                         {[
//                                             userAnalyticsData?.stock_level?.find(item => item.stock_level === "Overstock")?.count ?? 0,
//                                             userAnalyticsData?.stock_level?.find(item => item.stock_level === "Normal")?.count ?? 0,
//                                             userAnalyticsData?.stock_level?.find(item => item.stock_level === "Low")?.count ?? 0,
//                                         ].reduce((a, b) => a + b, 0).toLocaleString()}
//                                     </Typography>
//                                     <Chip size="small" color="success" label="Total Stock Items" />
//                                 </Stack>
//                                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                                     Stock Analysis
//                                 </Typography>
//                             </Stack>
//                             <BarChart
//                                 borderRadius={8}
//                                 colors={colorPalette}
//                                 height={250}
//                                 xAxis={
//                                     [
//                                         {
//                                             scaleType: 'band',
//                                             categoryGapRatio: 0.5,
//                                             data: [user?.UserData?.company_name || user?.UserData?.shop_name],
//                                         },
//                                     ] as any
//                                 }
//                                 series={[
//                                     {
//                                         id: 'overstocked',
//                                         label: 'Over Stocked',
//                                         data: [userAnalyticsData?.stock_level?.find(item => item.stock_level === "Overstock")?.count ?? 0],
//                                     },
//                                     {
//                                         id: 'normal',
//                                         label: 'Normal',
//                                         data: [userAnalyticsData?.stock_level?.find(item => item.stock_level === "Normal")?.count ?? 0],
//                                     },
//                                     {
//                                         id: 'lowStock',
//                                         label: 'Low Stocks',
//                                         data: [userAnalyticsData?.stock_level?.find(item => item.stock_level === "Low")?.count ?? 0],
//                                     }]}
//                                 margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
//                                 grid={{ horizontal: true }}
//                                 slotProps={{
//                                     legend: {
//                                         hidden: true,
//                                     },
//                                 }}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Area Chart - Medicine Sales Trends */}
//                 <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ width: '100%' }}>
//                         <CardContent>
//                             <Typography component="h2" variant="subtitle2" gutterBottom>
//                                 Medicine Sales Trends (Overall)
//                             </Typography>
//                             <Stack sx={{ justifyContent: 'space-between' }}>
//                                 <Stack
//                                     direction="row"
//                                     sx={{
//                                         alignContent: { xs: 'center', sm: 'flex-start' },
//                                         alignItems: 'center',
//                                         gap: 1,
//                                     }}
//                                 >
//                                     <Typography variant="h4" component="p">
//                                         {userAnalyticsData?.top_5_categories_all_time?.total_sales}
//                                     </Typography>
//                                     <Chip size="small" color="success" label="Total Sales" />
//                                 </Stack>
//                                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                                     Medicine Sales Trends (Overall)
//                                 </Typography>
//                             </Stack>
//                             <LineChart
//                                 colors={colorsLineChart}
//                                 xAxis={[
//                                     {
//                                         scaleType: 'point',
//                                         data: data,
//                                         tickInterval: (_, i) => (i + 1) % 1 === 0,
//                                     },
//                                 ]}
//                                 series={[
//                                     {
//                                         id: 'series-0',
//                                         label: userAnalyticsData?.top_5_categories_all_time?.data[0]?.label || 'Series 1',
//                                         showMark: false,
//                                         curve: 'linear',
//                                         area: true,
//                                         data: userAnalyticsData?.top_5_categories_all_time?.data[0]?.data.slice(0, data.length) || [],
//                                     },
//                                     {
//                                         id: 'series-1',
//                                         label: userAnalyticsData?.top_5_categories_all_time?.data[1]?.label || 'Series 2',
//                                         showMark: false,
//                                         curve: 'linear',
//                                         area: true,
//                                         data: userAnalyticsData?.top_5_categories_all_time?.data[1]?.data.slice(0, data.length) || [],
//                                     },
//                                     {
//                                         id: 'series-2',
//                                         label: userAnalyticsData?.top_5_categories_all_time?.data[2]?.label || 'Series 3',
//                                         showMark: false,
//                                         curve: 'linear',
//                                         area: true,
//                                         data: userAnalyticsData?.top_5_categories_all_time?.data[2]?.data.slice(0, data.length) || [],
//                                     },
//                                     {
//                                         id: 'series-3',
//                                         label: userAnalyticsData?.top_5_categories_all_time?.data[3]?.label || 'Series 4',
//                                         showMark: false,
//                                         curve: 'linear',
//                                         area: true,
//                                         data: userAnalyticsData?.top_5_categories_all_time?.data[3]?.data.slice(0, data.length) || [],
//                                     },
//                                 ]}
//                                 height={250}
//                                 margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
//                                 grid={{ horizontal: true }}
//                                 sx={{
//                                     '& .MuiAreaElement-series-series-0': {
//                                         fill: 'url(#gradient-0)',
//                                     },
//                                     '& .MuiAreaElement-series-series-1': {
//                                         fill: 'url(#gradient-1)',
//                                     },
//                                     '& .MuiAreaElement-series-series-2': {
//                                         fill: 'url(#gradient-2)',
//                                     },
//                                     '& .MuiAreaElement-series-series-3': {
//                                         fill: 'url(#gradient-3)',
//                                     },
//                                 }}
//                                 slotProps={{
//                                     legend: {
//                                         hidden: true,
//                                     },
//                                 }}
//                             >
//                                 <AreaGradient color={"hsl(195, 91.50%, 36.90%)"} id="gradient-0" />
//                                 <AreaGradient color={"hsl(195, 85%, 40%)"} id="gradient-1" />
//                                 <AreaGradient color={"hsl(195, 75%, 50%)"} id="gradient-2" />
//                                 <AreaGradient color={"hsl(195, 70%, 65%)"} id="gradient-3" />
//                             </LineChart>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Pie Chart - Sales Distribution & Bubble Chart - Returns Status */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//                 <Grid item xs={12} md={6}>
//                     <Card
//                         variant="outlined"
//                         sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
//                     >
//                         <CardContent>
//                             <Typography component="h2" variant="subtitle2">
//                                 Sales Distribution by Medicine Category
//                             </Typography>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                     {userAnalyticsData?.category_wise_percent && userAnalyticsData.category_wise_percent.length > 0 ? (<PieChart
//                                         colors={colorsPieChart}
//                                         margin={{
//                                             left: 80,
//                                             right: 80,
//                                             top: 80,
//                                             bottom: 80,
//                                         }}
//                                         series={[
//                                             {
//                                                 data: userAnalyticsData?.category_wise_percent,
//                                                 innerRadius: 75,
//                                                 outerRadius: 100,
//                                                 paddingAngle: 0,
//                                                 highlightScope: { faded: 'global', highlighted: 'item' },
//                                             },
//                                         ]}
//                                         height={260}
//                                         width={260}
//                                         slotProps={{
//                                             legend: { hidden: true },
//                                         }}
//                                     >
//                                         <PieCenterLabel primaryText="100%" secondaryText="Total" />
//                                     </PieChart>) : (
//                                         <Box sx={{
//                                             height: 250,
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             backgroundColor: 'background.paper',
//                                             borderRadius: 1
//                                         }}>
//                                             <Typography color="text.secondary">No sales data available for this period</Typography>
//                                         </Box>
//                                     )}
//                                 </Box>
//                                 <Box sx={{ flexGrow: 1, pl: 2 }}>
//                                     {userAnalyticsData?.category_wise_percent.map((entry, index) => (
//                                         <Stack
//                                             key={index}
//                                             direction="row"
//                                             sx={{ alignItems: 'center', gap: 2, pb: 2 }}
//                                         >
//                                             {/* {entry.flag} */}
//                                             <Stack sx={{ gap: 1, flexGrow: 1 }}>
//                                                 <Stack
//                                                     direction="row"
//                                                     sx={{
//                                                         justifyContent: 'space-between',
//                                                         alignItems: 'center',
//                                                         gap: 2,
//                                                     }}
//                                                 >
//                                                     <Typography variant="body2" sx={{ fontWeight: '500' }}>
//                                                         {entry.label}
//                                                     </Typography>
//                                                     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                                                         {entry.value}%
//                                                     </Typography>
//                                                 </Stack>
//                                                 <LinearProgress
//                                                     variant="determinate"
//                                                     aria-label="Number of users by country"
//                                                     value={entry.value}
//                                                     sx={{
//                                                         [`& .${linearProgressClasses.bar}`]: {
//                                                             // backgroundColor: entry.total_amount,
//                                                         },
//                                                     }}
//                                                 />
//                                             </Stack>
//                                         </Stack>
//                                     ))}
//                                 </Box>

//                             </Box>

//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ width: '100%' }}>
//                         <CardContent>
//                             <Typography component="h2" variant="subtitle2" gutterBottom>
//                                 Returns Status Per Pharmacy
//                             </Typography>
//                             <Stack sx={{ justifyContent: 'space-between' }}>
//                                 <Stack
//                                     direction="row"
//                                     sx={{
//                                         alignContent: { xs: 'center', sm: 'flex-start' },
//                                         alignItems: 'center',
//                                         gap: 1,
//                                     }}
//                                 >
//                                     <Typography variant="h4" component="p">
//                                         1.3M
//                                     </Typography>
//                                     <Chip size="small" color="error" label="-8%" />
//                                 </Stack>
//                                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                                     Returns Status Per Pharmacy
//                                 </Typography>
//                             </Stack>
//                             <ScatterChart
//                                 height={260}
//                                 grid={{ horizontal: true, vertical: true }}
//                                 series={series}
//                                 margin={{
//                                     top: 10,
//                                     bottom: 20,
//                                 }}
//                                 yAxis={[
//                                     {
//                                         colorMap: {
//                                             type: 'piecewise',
//                                             thresholds: [-1.5, 0, 1.5],
//                                             colors: ['lightblue', 'blue', 'orange', 'red'],
//                                         }
//                                     },
//                                 ]}
//                                 xAxis={[
//                                     {
//                                         colorMap:
//                                         {
//                                             type: 'piecewise',
//                                             thresholds: [-1.5, 0, 1.5],
//                                             colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
//                                         }
//                                     },
//                                 ]}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid> */}
//             </Grid>

//             {/* Notification Panel for Critical Alerts */}
//             {/* <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Notifications sx={{ mr: 1 }} />
//                 Critical Alerts
//               </Typography>
//               <List>
//                 {criticalAlerts.map((alert) => (
//                   <React.Fragment key={alert.id}>
//                     <ListItem>
//                       <ListItemIcon>
//                         <Warning color={alert.severity === 'error' ? 'error' : 'warning'} />
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={
//                           <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
//                             {alert.message}
//                             <Chip
//                               label={alert.type}
//                               color={alert.severity === 'error' ? 'error' : 'warning'}
//                               size="small"
//                               sx={{ ml: 2 }}
//                             />
//                           </Typography>
//                         }
//                       />
//                     </ListItem>
//                     <Divider variant="inset" component="li" />
//                   </React.Fragment>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>
//         </Grid> */}
//         </Box>
//     );
// };

// export default UserReportsAndInsights;