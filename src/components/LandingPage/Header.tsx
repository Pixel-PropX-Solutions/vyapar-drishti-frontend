import React, { useState } from 'react';
import {
    Box,
    Container,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from "../../assets/Logo.webp";
import logoText from "../../assets/Logo_Text.webp";
import ColorModeIconDropdown from '@/theme/ColorModeIconDropdown';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get current location to compare with path
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Define the navigation links and their labels
    const navLinks = [
        // { label: 'Features', path: '/features' },
        // { label: 'Solutions', path: '#solutions' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    // Function to check if the current link is active
    const isActive = (path: string) => location.pathname === path;

    // Function to handle mobile menu toggle
    const handleDrawerToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #000' }}>
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
                            onClick={() => navigate("/")}
                        >
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
                                        height: "50px",
                                        borderRadius: "50%",
                                        cursor: 'pointer',
                                    }}
                                />
                                <img
                                    src={logoText}
                                    alt="Logo Text"
                                    style={{ marginBottom: "-10px", height: "40px", cursor: 'pointer', }}
                                />
                            </Box>
                        </Box>

                        {/* Desktop navigation links */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.label}
                                    color={isActive(link.path) ? 'primary' : 'inherit'}  // Highlight active link
                                    onClick={() => navigate(link.path)}
                                    sx={{
                                        fontWeight: isActive(link.path) ? 'bold' : 'normal',  // Optional: Add more styles for active state
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Desktop buttons for Login and Get Started */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ mr: 2 }}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                                onClick={() => navigate("/signup")}
                            >
                                Get Started
                            </Button>
                            <ColorModeIconDropdown />

                        </Box>

                        {/* Mobile menu icon */}
                        <IconButton
                            color="inherit"
                            sx={{ display: { xs: 'block', md: 'none' } }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer for Navigation */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250, // Drawer width
                        backgroundColor: '#fff',
                    },
                }}
            >
                <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
                    <List>
                        {navLinks.map((link) => (
                            <ListItem button key={link.label} onClick={() => navigate(link.path)}>
                                <ListItemText
                                    primary={link.label}
                                    sx={{
                                        fontWeight: isActive(link.path) ? 'bold' : 'normal',
                                        color: isActive(link.path) ? 'primary.main' : 'text.primary',
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => navigate("/login")}>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/signup")}>
                            <ListItemText primary="Get Started" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;
