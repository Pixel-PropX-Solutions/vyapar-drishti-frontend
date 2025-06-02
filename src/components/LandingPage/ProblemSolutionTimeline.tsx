import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Grid,
    Container
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    CloudUpload,
    Inventory,
    Insights,
    Notifications,
    Info,
    CheckCircle
} from '@mui/icons-material';
import theme from '@/theme';


// Problem card data
const problemCards = [
    {
        title: "Manual Data Entry",
        shortDescription: "Time-consuming and error-prone manual input of stock data",
        fullDescription: "Pharmacy staff spend hours manually entering inventory data from paper invoices and receipts. This tedious process is highly susceptible to human error, leading to discrepancies between actual stock levels and recorded information. These inaccuracies cascade through your business operations, affecting ordering, sales, and financial reporting.",
        icon: <CloudUpload fontSize="large" />,
        color: theme.palette.primary.main,
        stat: "23% error rate in manual inventory records",
        solution: "Automated document scanning and data extraction"
    },
    {
        title: "Disorganized Data",
        shortDescription: "Poorly structured information makes tracking trends impossible",
        fullDescription: "Without a unified system, your valuable business data remains scattered across spreadsheets, notebooks, and disconnected software. This fragmentation prevents you from identifying sales patterns, inventory trends, or opportunities for optimization. It's like having puzzle pieces from different sets – impossible to form a complete picture of your pharmacy's performance.",
        icon: <Inventory fontSize="large" />,
        color: '#1976D2', // Secondary blue
        stat: "85% of pharmacies can't access historical data easily",
        solution: "Centralized data management system"
    },
    {
        title: "Lack of Business Insights",
        shortDescription: "Missing critical information for strategic decision-making",
        fullDescription: "Without automated analytics, pharmacies make business decisions based on intuition rather than data. You might be missing opportunities to optimize your inventory, unaware of which products drive your profits, or blind to seasonal trends that could inform your purchasing strategy. In today's competitive market, operating without data-driven insights places your pharmacy at a significant disadvantage.",
        icon: <Insights fontSize="large" />,
        color: '#7B1FA2', // Purple
        stat: "42% revenue increase with data-driven decisions",
        solution: "Advanced analytics and reporting dashboard"
    },
    {
        title: "Inefficient Returns",
        shortDescription: "Lost revenue from forgotten or mismanaged returns",
        fullDescription: "Expired medications and unsold inventory represent significant financial losses when return processes are managed manually. Without systematic tracking, return deadlines are missed, supplier policies aren't optimized, and your pharmacy absorbs unnecessary costs. Additionally, the administrative burden of processing returns manually diverts staff time away from customer service and other value-adding activities.",
        icon: <Notifications fontSize="large" />,
        color: '#C2185B', // Pink
        stat: "$4,200 average monthly losses from missed returns",
        solution: "Automated returns management system"
    }
];

const ProblemSolutionTimeline = () => {
    const [expandedCard, setExpandedCard] = useState(null);

    const handleCardClick = (index: any) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    // Animation variants
    const timelineAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const cardAnimation = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const iconAnimation = {
        rest: { scale: 1 },
        hover: { scale: 1.1, rotate: 5 }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box
                component={motion.div}
                variants={timelineAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                sx={{
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '50%',
                        width: '2px',
                        backgroundColor: 'divider',
                        transform: 'translateX(-50%)'
                    }
                }}
            >
                {problemCards.map((problem, index) => (
                    <Box
                        key={index}
                        component={motion.div}
                        variants={cardAnimation}
                        sx={{
                            position: 'relative',
                            mb: 6,
                            display: 'flex',
                            justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                            paddingLeft: index % 2 === 0 ? '50%' : 0,
                            paddingRight: index % 2 === 1 ? '50%' : 0,
                            pr: index % 2 === 0 ? 0 : 4,
                            pl: index % 2 === 1 ? 0 : 4,
                        }}
                    >
                        {/* Timeline dot */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '24px',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: problem.color,
                                border: '3px solid white',
                                boxShadow: 1,
                                zIndex: 2
                            }}
                        />

                        <Card
                            sx={{
                                width: '100%',
                                maxWidth: '500px',
                                borderRadius: 1,
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: expandedCard === index ? 3 : 1,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '6px',
                                    bgcolor: problem.color,
                                }
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                    <motion.div
                                        variants={iconAnimation}
                                        initial="rest"
                                        whileHover="hover"
                                        animate={expandedCard === index ? "hover" : "rest"}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                p: 1.5,
                                                borderRadius: '50%',
                                                bgcolor: `${problem.color}15`,
                                                color: problem.color,
                                                mr: 2,
                                                flexShrink: 0
                                            }}
                                        >
                                            {React.cloneElement(problem.icon, {
                                                sx: { fontSize: 28 }
                                            })}
                                        </Box>
                                    </motion.div>

                                    <Box>
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: problem.color
                                            }}
                                        >
                                            {problem.title}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {problem.shortDescription}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Chip
                                        icon={<Info fontSize="small" />}
                                        label={expandedCard === index ? "Less info" : "More info"}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'rgba(46, 125, 50, 0.08)'
                                            }
                                        }}
                                    />
                                </Box>

                                {expandedCard === index && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            pt: 2,
                                            borderTop: '1px dashed',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                                            {problem.fullDescription}
                                        </Typography>

                                        <Divider sx={{ mb: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                        INDUSTRY STATISTIC
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {problem.stat}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                        OUR SOLUTION
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {problem.solution}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default ProblemSolutionTimeline;