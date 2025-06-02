import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import HeroSectionImage from "../../assets/herosection.jpg";
import {
    ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';


// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};


const HeroSection: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const navigate = useNavigate();

    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            sx={{
                py: { xs: 6, md: 12 },
                background: 'linear-gradient(180deg, rgba(46, 125, 50, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant={isMobile ? 'h3' : 'h2'}
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                                color: 'primary.dark'
                            }}
                        >
                            Smart Pharmacy Inventory Management
                            <Box component="span" sx={{ color: 'secondary.main' }}> Made Simple</Box>
                        </Typography>

                        <Typography
                            variant="h6"
                            component="p"
                            color="text.secondary"
                            sx={{ mb: 4, fontWeight: 400 }}
                        >
                            Automate your pharmacy stock tracking, sales analysis, and returns management with our intelligent platform powered by AI.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate("/login")}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={() => navigate("/contact")}
                            >
                                Book a Demo
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src={HeroSectionImage}
                            alt="Pharmacy management dashboard"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 1,
                                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
