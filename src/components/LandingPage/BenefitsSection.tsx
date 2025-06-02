import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid
} from '@mui/material';
import {
    Check,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const BenefitsSection: React.FC = () => {
    return (
        <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            sx={{ py: { xs: 6, md: 10 } }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="overline"
                        component="div"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            letterSpacing: 1.5
                        }}
                    >
                        KEY BENEFITS
                    </Typography>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 2
                        }}
                    >
                        Why Pharmacies Choose Us
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        color="text.secondary"
                        sx={{
                            maxWidth: 700,
                            mx: 'auto',
                            fontWeight: 400
                        }}
                    >
                        Our solution delivers measurable improvements to your pharmacy operations, helping you save time and increase profitability.
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={4}
                    component={motion.div}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        "99% reduction in data entry errors",
                        "Save 15+ hours per week on inventory management",
                        "Real-time access to critical business data",
                        "25% average reduction in excess inventory costs",
                        "Improved supplier relationships through timely returns",
                        "Increased customer satisfaction with better stock availability"
                    ].map((benefit, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            component={motion.div}
                            variants={fadeIn}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                p: 2,
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'rgba(46, 125, 50, 0.05)'
                                }
                            }}>
                                <Check
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5
                                    }}
                                />
                                <Typography variant="h6" component="div">
                                    {benefit}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BenefitsSection;