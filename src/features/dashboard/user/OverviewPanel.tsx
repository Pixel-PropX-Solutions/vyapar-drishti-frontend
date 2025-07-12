import React, { useEffect } from 'react';
import {
    Box, Card, CardContent, Grid, Typography, Chip, Stack, useTheme,
} from '@mui/material';

import {
    Inventory, AssignmentReturn,
} from '@mui/icons-material';
import { BarChart, LineChart } from '@mui/x-charts';
import { RootState, AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAnalytics } from '@/services/analytics';


function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}


const UserOverviewPanel: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { userAnalyticsData } = useSelector((state: RootState) => state.analytics);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, currentMonth, 0);
    const monthName = date.toLocaleDateString('en-US', {
        month: 'long',
    });
    const colorPalette = [
        theme.palette.primary.dark,
        theme.palette.primary.main,
        theme.palette.primary.light,
    ];

    const colorsLineChart = [
        "hsl(195, 90%, 32%)",
        "hsl(195, 85%, 40%)",
        "hsl(195, 75%, 50%)",
        "hsl(195, 70%, 65%)",
        "hsl(195, 70%, 80%)",
    ];

    const data = getDaysInMonth(currentMonth, currentYear);


    const fullMonthSalesData = (() => {
        if (!userAnalyticsData?.sales_trends_monthly?.labels || !userAnalyticsData?.sales_trends_monthly?.data) return Array(12).fill(0);

        const { labels = [], data = [] } = userAnalyticsData?.sales_trends_monthly ?? {};

        const labelToIndexMap = labels.reduce((acc, label, idx) => {
            const day = parseInt(label.split('-')[2], 10); // '2025-02-11' -> 11
            acc[day - 1] = data[idx]; // Month index: 0-based
            return acc;
        }, Array(12).fill(0));

        return labelToIndexMap;
    })();

    useEffect(() => {
        dispatch(getUserAnalytics({ month: currentMonth.toString(), year: currentYear.toString() }));
    }, [currentMonth, currentYear, dispatch]);

    const top5Pharmacies = userAnalyticsData?.top_month_sales
        ? [...userAnalyticsData.top_month_sales].sort((a, b) => b.totalSales - a.totalSales)
        : undefined;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                User Overview Panel
            </Typography>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Sales
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mr: 0.5,
                                        color: 'primary.main',
                                    }}
                                >
                                    &#8377;
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {userAnalyticsData?.total_sales.toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Stock Purchased
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <Inventory color="primary" />
                                <Typography variant="h4" component="div">
                                    &#8377;  {userAnalyticsData?.total_purchased.toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>


                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Remaining
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <Inventory color="primary" />
                                <Typography variant="h4" component="div">
                                    &#8377;  {userAnalyticsData?.remaining_stock.toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending Stock Returns
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <AssignmentReturn color="primary" />
                                <Typography variant="h4" component="div">
                                    &#8377;   {userAnalyticsData?.pending_returns.toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Line Chart - Sales Trends */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ width: '100%' }}>
                        <CardContent>
                            <Typography component="h2" variant="subtitle2" gutterBottom>
                                Sales Trends
                            </Typography>
                            <Stack sx={{ justifyContent: 'space-between' }}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        alignContent: { xs: 'center', sm: 'flex-start' },
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography variant="h4" component="p">
                                        {monthName}
                                    </Typography>
                                    <Chip size="small" color="success" label={currentYear} />
                                </Stack>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Sales Trends
                                </Typography>
                            </Stack>
                            {userAnalyticsData?.sales_trends_monthly?.data && userAnalyticsData.sales_trends_monthly.data.length > 0 ? (
                                <LineChart
                                    colors={colorsLineChart}
                                    xAxis={[
                                        {
                                            scaleType: 'point',
                                            data,
                                            tickInterval: (_, i) => (i + 1) % 2 === 0,
                                        },
                                    ]}
                                    series={[
                                        {
                                            id: 'salesTrends',
                                            label: 'Sales Trends',
                                            showMark: false,
                                            curve: 'linear',
                                            stack: 'total',
                                            stackOffset: 'none',
                                            area: true,
                                            data: fullMonthSalesData,
                                        },
                                    ]}
                                    height={250}
                                    margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
                                    grid={{ horizontal: true }}
                                    sx={{
                                        '& .MuiAreaElement-series-salesTrends': {
                                            fill: "url('#salesTrends')",
                                        },
                                    }}
                                    slotProps={{
                                        legend: {
                                            hidden: true,
                                        },
                                    }}
                                >
                                    <AreaGradient color={"hsl(195, 70%, 65%)"} id="salesTrends" />
                                </LineChart>
                            ) : (
                                <Box sx={{
                                    height: 250,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <Typography color="text.secondary">No sales data available for this period</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            {/* Bar Chart - Top 5 Performing Pharmacies & Stock vs. Sales Comparison */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ width: '100%' }}>
                        <CardContent>
                            <Typography component="h2" variant="subtitle2" gutterBottom>
                                Top  Months by Sales
                            </Typography>
                            <Stack sx={{ justifyContent: 'space-between' }}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        alignContent: { xs: 'center', sm: 'flex-start' },
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography variant="h4" component="p">
                                        {userAnalyticsData?.top_month_sales
                                            ? userAnalyticsData.top_month_sales.reduce((sum: number, val: any) => sum + (val.totalSales ?? 0), 0).toLocaleString()
                                            : '0'}
                                    </Typography>

                                    <Chip size="small" color="success" label="Total Sales of Top Months" />
                                </Stack>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Top Months by Sales
                                </Typography>
                            </Stack>
                            {userAnalyticsData?.top_month_sales && userAnalyticsData.top_month_sales.length > 0 ? (<BarChart
                                borderRadius={8}
                                colors={colorPalette}
                                xAxis={
                                    [
                                        {
                                            scaleType: 'band',
                                            categoryGapRatio: 0.5,
                                            data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.name),
                                        },
                                    ] as any
                                }
                                series={[
                                    {
                                        id: 'totalSales',
                                        label: 'Total Sales',
                                        data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.totalSales),
                                        stack: 'A',
                                    },
                                ]}
                                height={250}
                                margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                                grid={{ horizontal: true }}
                                slotProps={{
                                    legend: {
                                        hidden: true,
                                    },
                                }}
                            />) : (
                                <Box sx={{
                                    height: 250,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <Typography color="text.secondary">No sales data available for this period</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ width: '100%' }}>
                        <CardContent>
                            <Typography component="h2" variant="subtitle2" gutterBottom>
                                Stock vs. Sales Comparison
                            </Typography>
                            <Stack sx={{ justifyContent: 'space-between' }}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        alignContent: { xs: 'center', sm: 'flex-start' },
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Typography variant="h4" component="p">
                                        {top5Pharmacies
                                            ? top5Pharmacies
                                                .slice(0, 5)
                                                .reduce(
                                                    (sum, pharmacy) =>
                                                        sum + (pharmacy.stockPurchased ?? 0),
                                                    0
                                                )
                                                .toLocaleString()
                                            : '0'}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color="success"
                                        label="Total Stock Purchased"
                                    />
                                    <Typography variant="h4" component="p" sx={{ ml: 2 }}>
                                        {top5Pharmacies
                                            ? top5Pharmacies
                                                .slice(0, 5)
                                                .reduce(
                                                    (sum, pharmacy) =>
                                                        sum + (pharmacy.totalSales ?? 0),
                                                    0
                                                )
                                                .toLocaleString()
                                            : '0'}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        color="info"
                                        label="Total Sales"
                                    />
                                </Stack>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Stock vs. Sales Comparison
                                </Typography>
                            </Stack>
                            {userAnalyticsData?.top_month_sales && userAnalyticsData.top_month_sales.length > 0 ? (
                                <BarChart
                                    borderRadius={8}
                                    colors={colorPalette}
                                    xAxis={
                                        [
                                            {
                                                scaleType: 'band',
                                                // categoryGapRatio: 0.5,
                                                data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.name),
                                            },
                                        ] as any
                                    }
                                    series={[
                                        {
                                            id: 'stockPurchased',
                                            label: 'Stock Purchased',
                                            data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.stockPurchased),
                                            // stack: 'A',
                                        },
                                        // {
                                        //     id: 'stockRemaining',
                                        //     label: 'Stock Remaining',
                                        //     data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.stockRemaining),
                                        //     stack: 'A',
                                        // },
                                        {
                                            id: 'totalSales',
                                            label: 'Total Sales',
                                            data: top5Pharmacies?.slice(0, 5).map((pharmacy) => pharmacy.totalSales),
                                            // stack: 'A',
                                        },
                                    ]}
                                    height={250}
                                    margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                                    grid={{ horizontal: true }}
                                    slotProps={{
                                        legend: {
                                            hidden: true,
                                        },
                                    }}
                                />
                            ) : (
                                <Box sx={{
                                    height: 250,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1
                                }}>
                                    <Typography color="text.secondary">No comparison data available for this period</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
        </Box>
    );
};

export default UserOverviewPanel;

