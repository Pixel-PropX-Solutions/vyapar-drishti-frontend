import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, Grid, Typography, Chip,
    Stack, Skeleton, CircularProgress, Fade, Zoom,
    useTheme, alpha,
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ArrowBack, Circle } from '@mui/icons-material';
import { viewAnalyticsData, viewDailyData, viewMonthlyData } from '@/services/analytics';
import MonthYearSelector from '@/common/MonthYearSelector';
import { getMonthName } from '@/utils/functions';
import { ActionButton } from '@/common/buttons/ActionButton';
import { useNavigate } from 'react-router-dom';

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

// KPI Card Loading Component
const KPICardSkeleton: React.FC = () => (
    <Card sx={{ height: '100%', minHeight: 100 }}>
        <CardContent>
            <Skeleton variant="text" width="60%" height={20} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <Skeleton variant="text" width={30} height={40} />
                <Skeleton variant="text" width="70%" height={40} />
            </Box>
        </CardContent>
    </Card>
);

// Enhanced KPI Card Component
const KPICard: React.FC<{
    title: string;
    value: number;
    loading: boolean;
    icon?: React.ReactNode;
}> = ({ title, value, loading, icon }) => {
    const theme = useTheme();

    if (loading) return <KPICardSkeleton />;

    return (
        <Zoom in timeout={300}>
            <Card
                sx={{
                    height: '100%',
                    minHeight: 100,
                    transition: 'all 0.3s ease',
                    background: value > 0 ?
                        `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.02)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`,
                    border: value > 0 ? `1px solid ${alpha(theme.palette.primary.main, 0.12)}` : `1px solid ${alpha(theme.palette.error.main, 0.12)}`,
                }}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: value > 0 ? theme.palette.text.primary : theme.palette.error.main }}
                        >
                            {title}
                        </Typography>
                        {icon && (
                            <Box sx={{
                                color: theme.palette.primary.main,
                                opacity: 0.7,
                                '& svg': { fontSize: 20 }
                            }}>
                                {icon}
                            </Box>
                        )}
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: value > 0 ? theme.palette.text.primary : theme.palette.error.main,
                                fontSize: { xs: '1.2rem', sm: '1.5rem' }
                            }}
                        >
                            &#8377;
                        </Typography>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                color: value > 0 ? theme.palette.text.primary : theme.palette.error.main
                            }}
                        >
                            {value || 0}
                        </Typography>
                    </Box>

                </CardContent>
            </Card>
        </Zoom>
    );
};

// Chart Loading Component
const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 250 }) => (
    <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                    <Stack spacing={1}>
                        <Skeleton variant="text" width="40%" height={24} />
                        <Stack direction="row" gap={1}>
                            <Skeleton variant="text" width={80} height={32} />
                            <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                        </Stack>
                    </Stack>
                    <Stack direction="row" gap={2}>
                        <Skeleton variant="rectangular" width={120} height={32} />
                        <Skeleton variant="rectangular" width={150} height={32} />
                    </Stack>
                </Stack>
                <Box sx={{ position: 'relative', height: height }}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ borderRadius: 1 }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <CircularProgress size={40} />
                    </Box>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

const ReportsAndInsights: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { monthlyData, dailyData, statsData } = useSelector((state: RootState) => state.analytics);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const dispatch = useDispatch<AppDispatch>();
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    // Loading states
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingMonthly, setIsLoadingMonthly] = useState(true);
    const [isLoadingDaily, setIsLoadingDaily] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    const colorsLineChart = [
        "#c62828",
        "#2e7d32",
        "hsl(195, 85%, 40%)",
    ];

    const MonthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const financialStartIndex = 3;
    const financialMonths = [...MonthsName.slice(financialStartIndex), ...MonthsName.slice(0, financialStartIndex)];

    const shiftToFinancialYear = <T,>(arr: T[] | undefined): T[] => {
        if (!Array.isArray(arr)) return [];
        const normalized = arr.slice(0, MonthsName.length);
        return [...normalized.slice(financialStartIndex), ...normalized.slice(0, financialStartIndex)].slice(0, financialMonths.length);
    };

    const dailyDataLabels = getDaysInMonth(dailyData?.month ?? month, dailyData?.year ?? year);

    useEffect(() => {
        const loadAnalyticsData = async () => {
            if (!currentCompanyDetails?._id) return;

            setIsLoadingStats(true);
            setIsLoadingMonthly(true);

            try {
                await Promise.all([
                    dispatch(viewAnalyticsData({ company_id: currentCompanyDetails._id, year: year })),
                    dispatch(viewMonthlyData({ company_id: currentCompanyDetails._id, year: year }))
                ]);
            } finally {
                setTimeout(() => {
                    setIsLoadingStats(false);
                    setIsLoadingMonthly(false);
                }, initialLoad ? 1000 : 300);
            }
        };

        loadAnalyticsData();
    }, [currentCompanyDetails?._id, year, dispatch, initialLoad]);

    useEffect(() => {
        const loadDailyData = async () => {
            if (!currentCompanyDetails?._id) return;

            setIsLoadingDaily(true);

            try {
                await dispatch(viewDailyData({ company_id: currentCompanyDetails._id, month: month, year: year }));
            } finally {
                setTimeout(() => {
                    setIsLoadingDaily(false);
                    if (initialLoad) setInitialLoad(false);
                }, initialLoad ? 1200 : 300);
            }
        };

        loadDailyData();
    }, [currentCompanyDetails?._id, month, year, dispatch, initialLoad]);

    return (
        <Fade in timeout={500}>
            <Box>
                <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <ActionButton
                                        icon={<ArrowBack fontSize="small" />}
                                        title="Back"
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                    />
                                    <Box>
                                        <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                            Reports & Analytics
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            View comprehensive reports and analytics for better insights.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Enhanced KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <KPICard
                            title="Opening Value (Yearly)"
                            value={statsData?.opening}
                            loading={isLoadingStats}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <KPICard
                            title="Net Purchases (Yearly)"
                            value={statsData?.purchase}
                            loading={isLoadingStats}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <KPICard
                            title="Net Sales (Yearly)"
                            value={statsData?.sales}
                            loading={isLoadingStats}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <KPICard
                            title="Net Profit (Yearly)"
                            value={statsData?.profit}
                            loading={isLoadingStats}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <KPICard
                            title="Current Remaining"
                            value={statsData?.current}
                            loading={isLoadingStats}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Enhanced Daily Chart */}
                    <Grid item xs={12}>
                        {isLoadingDaily ? (
                            <ChartSkeleton height={320} />
                        ) : (
                            <Fade in timeout={600}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        borderWidth: 2,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Stack direction={'row'} alignItems={'center'} sx={{ justifyContent: 'space-between', mb: 3 }}>
                                            <Stack direction="column">
                                                <Typography
                                                    component="h2"
                                                    variant="h6"
                                                    gutterBottom
                                                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                                                >
                                                    Daily Financial Overview - {getMonthName(month)} {dailyData?.year ?? year}
                                                </Typography>
                                                <Stack direction={'row'} alignItems={'center'} gap={2}>
                                                    <Typography
                                                        variant="h4"
                                                        component="p"
                                                        sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                                                    >
                                                        ₹{dailyData?.sales ?? 0}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        color="success"
                                                        label="Total Sales"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </Stack>
                                            </Stack>

                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                mr: 1
                                            }}>
                                                {/* Legend */}
                                                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "#c62828", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Sales
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "#2e7d32", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Purchases
                                                        </Typography>
                                                    </Box>
                                                    {/* <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "hsl(195, 85%, 40%)", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Profit
                                                        </Typography>
                                                    </Box> */}
                                                </Stack>

                                                <MonthYearSelector
                                                    month={month}
                                                    year={year}
                                                    onMonthChange={setMonth}
                                                    onYearChange={setYear}
                                                    startYear={2020}
                                                    endYear={2030}
                                                />
                                            </Box>
                                        </Stack>

                                        {dailyData && (
                                            <LineChart
                                                colors={colorsLineChart}
                                                xAxis={[
                                                    {
                                                        scaleType: 'point',
                                                        data: dailyDataLabels,
                                                        tickInterval: (_, i) => (i + 1) % 2 === 0,
                                                    },
                                                ]}
                                                series={[
                                                    {
                                                        id: 'sales',
                                                        label: dailyData?.data?.find(d => d.id === 'sales')?.label || 'Daily Sales (₹)',
                                                        showMark: true,
                                                        curve: 'catmullRom',
                                                        connectNulls: true,
                                                        area: true,
                                                        data: dailyData?.data?.find(d => d.id === 'sales')?.data.slice(0, dailyDataLabels.length) || [],
                                                    },
                                                    {
                                                        id: 'purchase',
                                                        label: dailyData?.data?.find(d => d.id === 'purchase')?.label || 'Daily Purchases (₹)',
                                                        showMark: true,
                                                        curve: 'catmullRom',
                                                        connectNulls: true,
                                                        data: dailyData?.data?.find(d => d.id === 'purchase')?.data.slice(0, dailyDataLabels.length) || [],
                                                    },
                                                    // {
                                                    //     id: 'profit',
                                                    //     label: dailyData?.data?.find(d => d.id === 'profit')?.label || 'Daily Profit (₹)',
                                                    //     showMark: true,
                                                    //     curve: 'catmullRom',
                                                    //     connectNulls: true,
                                                    //     area: true,
                                                    //     data: dailyData?.data?.find(d => d.id === 'profit')?.data.slice(0, dailyDataLabels.length) || [],
                                                    // },
                                                ]}
                                                height={280}
                                                margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
                                                grid={{ horizontal: true }}
                                                sx={{
                                                    // '& .MuiAreaElement-series-profit': {
                                                    //     fill: "url('#series')",
                                                    // },
                                                    // '& .MuiAreaElement-series-purchase': {
                                                    //     fill: "url('#purchase')",
                                                    // },
                                                    '& .MuiAreaElement-series-sales': {
                                                        fill: "url('#sales')",
                                                    },
                                                }}
                                                slotProps={{
                                                    legend: { hidden: true },
                                                }}
                                            >
                                                {/* <AreaGradient color={"hsl(195, 70%, 65%)"} id="series" /> */}
                                                {/* <AreaGradient color={"#2e7d32"} id="purchase" /> */}
                                                <AreaGradient color={"#c62828"} id="sales" />
                                            </LineChart>
                                        )}
                                    </CardContent>
                                </Card>
                            </Fade>
                        )}
                    </Grid>

                    {/* Enhanced Monthly Chart */}
                    <Grid item xs={12}>
                        {isLoadingMonthly ? (
                            <ChartSkeleton height={320} />
                        ) : (
                            <Fade in timeout={800}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        width: '100%',
                                        borderWidth: 2,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Stack direction={'row'} alignItems={'center'} sx={{ justifyContent: 'space-between', mb: 3 }}>
                                            <Stack direction="column">
                                                <Typography
                                                    component="h2"
                                                    variant="h6"
                                                    gutterBottom
                                                    sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
                                                >
                                                    Monthly Financial Overview - FY {monthlyData?.year ?? year}
                                                </Typography>

                                                <Stack sx={{ justifyContent: 'space-between', mb: 3 }}>
                                                    <Stack direction="row" alignItems="center" gap={2}>
                                                        <Typography
                                                            variant="h4"
                                                            component="p"
                                                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                                                        >
                                                            ₹{monthlyData?.sales}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            color="success"
                                                            label="Total Sales"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </Stack>
                                                </Stack>
                                            </Stack>

                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                mr: 1
                                            }}>
                                                {/* Legend */}
                                                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "#c62828", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Sales
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "#2e7d32", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Purchases
                                                        </Typography>
                                                    </Box>
                                                    {/* <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                        <Circle sx={{ color: "hsl(195, 85%, 40%)", fontSize: 12 }} />
                                                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                            Profit
                                                        </Typography>
                                                    </Box> */}
                                                </Stack>

                                            </Box>
                                        </Stack>


                                        <LineChart
                                            colors={colorsLineChart}
                                            xAxis={[
                                                {
                                                    scaleType: 'point',
                                                    data: financialMonths,
                                                    tickInterval: (_, i) => (i + 1) % 1 === 0,
                                                },
                                            ]}
                                            series={[
                                                {
                                                    id: 'sales',
                                                    label: monthlyData?.data.find(d => d.id === 'sales')?.label || 'Monthly Sales (₹)',
                                                    showMark: true,
                                                    curve: 'catmullRom',
                                                    connectNulls: true,
                                                    area: true,
                                                    data: shiftToFinancialYear(monthlyData?.data.find(d => d.id === 'sales')?.data),
                                                },
                                                {
                                                    id: 'purchase',
                                                    label: monthlyData?.data.find(d => d.id === 'purchase')?.label || 'Monthly Purchases (₹)',
                                                    showMark: true,
                                                    curve: 'catmullRom',
                                                    connectNulls: true,
                                                    data: shiftToFinancialYear(monthlyData?.data.find(d => d.id === 'purchase')?.data),
                                                },
                                                // {
                                                //     id: 'profit',
                                                //     label: monthlyData?.data.find(d => d.id === 'profit')?.label || 'Monthly Profit (₹)',
                                                //     showMark: true,
                                                //     curve: 'catmullRom',
                                                //     connectNulls: true,
                                                //     area: true,
                                                //     data: shiftToFinancialYear(monthlyData?.data.find(d => d.id === 'profit')?.data),
                                                // },
                                            ]}
                                            height={280}
                                            margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
                                            grid={{ horizontal: true }}
                                            sx={{
                                                // '& .MuiAreaElement-series-profit': {
                                                //     fill: "url('#series')",
                                                // },
                                                // '& .MuiAreaElement-series-purchase': {
                                                //     fill: "url('#purchase')",
                                                // },
                                                '& .MuiAreaElement-series-sales': {
                                                    fill: "url('#sales')",
                                                },
                                            }}
                                            slotProps={{
                                                legend: { hidden: true },
                                            }}
                                        >
                                            {/* <AreaGradient color={"hsl(195, 70%, 65%)"} id="series" /> */}
                                            {/* <AreaGradient color={"#2e7d32"} id="purchase" /> */}
                                            <AreaGradient color={"#c62828"} id="sales" />
                                        </LineChart>
                                    </CardContent>
                                </Card>
                            </Fade>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Fade>
    );
};

export default ReportsAndInsights;