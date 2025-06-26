import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
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

const CTASection: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            sx={{
                py: { xs: 8, md: 12 },
                borderColor: 'primary.dark',
                borderWidth: 1,
                borderStyle: 'solid',
                // color: 'white',
                borderRadius: { md: 4 },
                mx: { md: 4 },
                my: 4
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                    >
                        Ready to Transform Your Billing & Inventory?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 4,
                            maxWidth: 700,
                            mx: 'auto',
                            opacity: 0.9
                        }}
                    >
                        Join hundreds of businesses who have simplified their billing and inventory operations and increased profitability with our solution.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        justifyContent="center"
                    >
                        {/* <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Start 14-Day Free Trial
            </Button> */}
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                // borderColor: 'white',
                                '&:hover': {
                                    // borderColor: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            onClick={() => navigate("/contact")}
                        >
                            Schedule Demo
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};


export default CTASection;