import React from 'react';
import { Box, Typography, Container, Grid, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/Logo.png";
import logoText from "../../assets/Logo_Text.png";

const Footer: React.FC = () => {
    const navigate = useNavigate();  // useNavigate hook to navigate on link click

    // Define links for each section
    const productLinks = ['Features', 'Solutions', 'Pricing', 'Updates'];
    const companyLinks = ['About', 'Careers', 'Blog', 'Contact'];
    const resourcesLinks = ['Documentation', 'Support', 'FAQs', 'Community'];
    const legalLinks = ['Privacy', 'Terms', 'Security', 'Cookies'];

    // Define the corresponding paths for each link (assuming the routes exist)
    const linkPaths: { [key in typeof productLinks[number] | typeof companyLinks[number] | typeof resourcesLinks[number] | typeof legalLinks[number]]: string } = {
        Features: '/features',
        Solutions: '/solutions',
        Pricing: '/pricing',
        Updates: '/updates',
        About: '/about',
        Careers: '/careers',
        Blog: '/blog',
        Contact: '/contact',
        Documentation: '/documentation',
        Support: '/support',
        FAQs: '/faqs',
        Community: '/community',
        Privacy: '/privacy',
        Terms: '/terms',
        Security: '/security',
        Cookies: '/cookies',
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    height: "50px",
                                    gap: "10px",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "start",
                                }}
                            >
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    style={{
                                        height: "40px",
                                        // borderRadius: "50%",
                                    }}
                                />
                                <img
                                    src={logoText}
                                    alt="Logo Text"
                                    style={{ height: "30px", marginTop: "10px" }}
                                />
                            </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Intelligent billing and inventory management solution that streamlines operations and boosts productivity.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ©  Vyapar Drishti. All rights reserved.
                        </Typography>
                    </Grid>

                    {/* Product Links */}
                    <Grid item xs={6} sm={3} md={2} >
                        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, px: 2 }}>
                            Product
                        </Typography>
                        <Stack spacing={1}>
                            {productLinks.map((item) => (
                                <Button
                                    key={item}
                                    color="inherit"
                                    sx={{
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        textTransform: 'none',
                                        color: 'text.secondary'
                                    }}
                                    // onClick={() => navigate(linkPaths[item])}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Company Links */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, px: 2, }}>
                            Company
                        </Typography>
                        <Stack spacing={1}>
                            {companyLinks.map((item) => (
                                <Button
                                    key={item}
                                    color="inherit"
                                    sx={{
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        textTransform: 'none',
                                        color: 'text.secondary'
                                    }}
                                    // onClick={() => navigate(linkPaths[item])} 
                                >
                                    {item}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Resources Links */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, px: 2, }}>
                            Resources
                        </Typography>
                        <Stack spacing={1}>
                            {resourcesLinks.map((item) => (
                                <Button
                                    key={item}
                                    color="inherit"
                                    sx={{
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        textTransform: 'none',
                                        color: 'text.secondary'
                                    }}
                                    // onClick={() => navigate(linkPaths[item])}
                                >
                                    {item}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Legal Links */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 2, px: 2, }}>
                            Legal
                        </Typography>
                        <Stack spacing={1}>
                            {legalLinks.map((item) => (
                                <Button
                                    key={item}
                                    color="inherit"
                                    sx={{
                                        justifyContent: 'flex-start',
                                        px: 2,
                                        textTransform: 'none',
                                        color: 'text.secondary'
                                    }}
                                    onClick={() => navigate(linkPaths[item])} 
                                >
                                    {item}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
