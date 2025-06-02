import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Divider,
    Chip,
    useMediaQuery,
    useTheme,
    Stack
} from '@mui/material';
import {
    CloudUpload,
    Analytics,
    Inventory,
    Notifications,
    TrendingUp,
    AccessTime,
    MonetizationOn,
    CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const solutions = [
    {
        title: "Document Upload & AI Data Extraction",
        description: "Simply upload invoices and receipts. Our AI technology automatically extracts and organizes all relevant data, eliminating manual entry.",
        icon: <CloudUpload fontSize="large" />,
        benefits: [
            { text: "Reduce data entry time by 90%", icon: <AccessTime fontSize="small" /> },
            { text: "99.8% accuracy on data extraction", icon: <CheckCircle fontSize="small" /> },
            { text: "Support for all major invoice formats", icon: <CheckCircle fontSize="small" /> }
        ],
        stats: "Pharmacies save 15+ hours per week on manual data entry",
        color: "#3f51b5"
    },
    {
        title: "Real-time Stock Tracking",
        description: "Automatically track stock received, sold, and remaining in real-time. Get alerts for low stock items before they run out.",
        icon: <Inventory fontSize="large" />,
        benefits: [
            { text: "Reduce stockouts by 85%", icon: <TrendingUp fontSize="small" /> },
            { text: "Automated reorder suggestions", icon: <CheckCircle fontSize="small" /> },
            { text: "Batch and expiry date tracking", icon: <CheckCircle fontSize="small" /> }
        ],
        stats: "Average inventory holding costs reduced by 23%",
        color: "#2e7d32"
    },
    {
        title: "Comprehensive Sales Analytics",
        description: "Access detailed reports on sales trends across different time periods. Identify your best-selling products and optimize your inventory.",
        icon: <Analytics fontSize="large" />,
        benefits: [
            { text: "Identify seasonal sales patterns", icon: <TrendingUp fontSize="small" /> },
            { text: "Product profitability analysis", icon: <MonetizationOn fontSize="small" /> },
            { text: "Customizable reporting dashboard", icon: <CheckCircle fontSize="small" /> }
        ],
        stats: "Customers report 18% increase in high-margin product sales",
        color: "#f57c00"
    },
    {
        title: "Intelligent Returns Management",
        description: "Never miss a return deadline again. Receive timely reminders for stock returns to maintain healthy supplier relationships.",
        icon: <Notifications fontSize="large" />,
        benefits: [
            { text: "Reduce expired stock losses by 75%", icon: <MonetizationOn fontSize="small" /> },
            { text: "Automated return deadline tracking", icon: <AccessTime fontSize="small" /> },
            { text: "Supplier-specific return policies", icon: <CheckCircle fontSize="small" /> }
        ],
        stats: "Average pharmacy saves $12,000+ annually on returnable stock",
        color: "#d32f2f"
    },
    // {
    //     title: "Interactive Dashboard",
    //     description: "Get a bird's-eye view of your entire operation with our intuitive dashboard. Monitor key metrics and make data-driven decisions.",
    //     icon: <Dashboard fontSize="large" />,
    //     benefits: [
    //         { text: "Real-time KPI monitoring", icon: <TrendingUp fontSize="small" /> },
    //         { text: "Customizable widget layout", icon: <CheckCircle fontSize="small" /> },
    //         { text: "Role-based access controls", icon: <CheckCircle fontSize="small" /> }
    //     ],
    //     stats: "92% of users report making better business decisions with our dashboard",
    //     color: "#9c27b0"
    // }
];

const SolutionSection = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleFeatureClick = (index: any) => {
        setActiveFeature(activeFeature === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const expandVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3 }
        }
    };

    return (
        <section id="solutions">
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    backgroundImage: "linear-gradient(180deg, rgba(46, 125, 50, 0.03) 0%, rgba(46, 125, 50, 0.08) 100%)",
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        component={motion.div}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        sx={{ textAlign: 'center', mb: 8 }}
                    >
                        <Chip
                            label="OUR SOLUTION"
                            color="primary"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 28,
                                mb: 2,
                                '& .MuiChip-label': {
                                    px: 2
                                }
                            }}
                        />
                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                            }}
                        >
                            Transforming Pharmacy Operations
                        </Typography>
                        <Typography
                            variant="h6"
                            component="p"
                            color="text.secondary"
                            sx={{
                                maxWidth: 700,
                                mx: 'auto',
                                fontWeight: 400,
                                lineHeight: 1.6
                            }}
                        >
                            Our comprehensive software solution streamlines the entire inventory management process
                            from stock receipt to returns, helping you save time and boost profitability.
                        </Typography>
                    </Box>

                    <Box
                        component={motion.div}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <Grid container spacing={isMobile ? 3 : 4}>
                            {solutions.map((feature, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={index === 4 ? 12 : 6}
                                    key={index}
                                    component={motion.div}
                                    variants={itemVariants}
                                >
                                    <Paper
                                        elevation={activeFeature === index ? 4 : 1}
                                        sx={{
                                            p: 0,
                                            height: '100%',
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            border: '1px solid',
                                            borderColor: activeFeature === index ? feature.color : 'divider',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: 3
                                            }
                                        }}
                                        onClick={() => handleFeatureClick(index)}
                                    >
                                        <Box sx={{ p: 3 }}>
                                            <Box
                                                sx={{
                                                    display: activeFeature === index ? 'none' : 'block'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }} minHeight={140}>
                                                    <Box
                                                        sx={{
                                                            mr: 2,
                                                            p: 1.5,
                                                            borderRadius: '12px',
                                                            bgcolor: `${feature.color}15`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {React.cloneElement(feature.icon, {
                                                            sx: { color: feature.color }
                                                        })}
                                                    </Box>
                                                    <Stack display={"flex"} >

                                                        <Typography
                                                            variant="h5"
                                                            component="h3"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'text.primary'
                                                            }}
                                                        >
                                                            {feature.title}
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary">
                                                            {feature.description}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        borderColor: feature.color,
                                                        zIndex: 1,
                                                        color: feature.color,
                                                        position: 'relative',
                                                        '&:hover': {
                                                            borderColor: feature.color,
                                                            backgroundColor: `${feature.color}10`
                                                        }
                                                    }}
                                                >
                                                    {activeFeature === index ? "Show Less" : "Learn More"}
                                                </Button>
                                            </Box>


                                        </Box>
                                        <AnimatePresence>
                                            {activeFeature === index && (
                                                <Box
                                                    component={motion.div}
                                                    variants={expandVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        width: '100%',
                                                        zIndex: 0.9,
                                                        paddingY: '16px',
                                                        paddingLeft: '1rem',
                                                        backgroundColor: `${feature.color}10`,
                                                        display: 'block',
                                                    }}
                                                >
                                                    {/* <Divider sx={{ my: 2 }} /> */}
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            mb: 1.5,
                                                            color: feature.color,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        KEY BENEFITS
                                                    </Typography>

                                                    {feature.benefits.map((benefit, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                mb: 1
                                                            }}
                                                        >
                                                            <Box sx={{ mr: 1, color: feature.color }}>
                                                                {benefit.icon}
                                                            </Box>
                                                            <Typography variant="body2">
                                                                {benefit.text}
                                                            </Typography>
                                                        </Box>
                                                    ))}

                                                    <Divider sx={{ my: 2 }} />
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            mb: 1.5,
                                                            color: feature.color,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        IMPACT
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {feature.stats}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </AnimatePresence>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </section>
    );
};

export default SolutionSection;
