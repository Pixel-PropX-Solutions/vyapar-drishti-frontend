import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    InputAdornment,
    Paper,
    Fade,
    CircularProgress,
    useTheme,
    alpha,
    Tooltip,
} from "@mui/material";
import {
    Email as EmailIcon,
    CheckCircle,
    ArrowBack,
    Close,
    Check,
    Security
} from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { forgetPassword } from "@/services/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim() && !validateEmail(value)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!email.trim()) {
            setEmailError("Email address is required");
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await dispatch(forgetPassword(email)).unwrap();
            console.log("Response Forget Password ", response);
            setIsSuccess(true);
            toast.success("Password reset link sent to your email!");
        } catch (error: any) {
            console.error("Forgot Password error:", error);
            toast.error(error || "An unexpected error occurred. Please try again later.");
            setEmailError("Failed to send reset link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
        setIsSuccess(false);
        setEmail('');
        setEmailError('');
    };

    if (isSuccess) {
        return (
            <Grid
                item
                lg={8}
                md={6}
                sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    padding: 4,
                    minHeight: "100vh",
                    justifyContent: "center",
                }}
            >
                <Container component="main" maxWidth="sm">
                    <Fade in={isSuccess} timeout={800}>
                        <Paper
                            elevation={0}
                            sx={{
                                padding: 6,
                                textAlign: "center",
                                borderRadius: 3,
                                backgroundColor: alpha(theme.palette.success.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            }}
                        >
                            <CheckCircle
                                sx={{
                                    fontSize: 64,
                                    color: theme.palette.success.main,
                                    mb: 3,
                                }}
                            />
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                                Check Your Email
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                We've sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and spam folder and follow the instructions to reset your password.
                            </Typography>
                            <Button
                                onClick={handleBackToLogin}
                                startIcon={<ArrowBack />}
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                            >
                                Back to Login
                            </Button>
                        </Paper>
                    </Fade>
                </Container>
            </Grid>
        );
    }

    return (
        <Grid
            item
            lg={12}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: { xs: 2, sm: 4 },
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <Container component="main" maxWidth={false} sx={{ width: { sm: '400px', xs: '100%', md: '550px', lg: '700px' } }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            padding: { xs: 3, sm: 4, md: 5 },
                            borderRadius: 3,
                            textAlign: "center",
                            border: `1px solid ${theme.palette.divider}`,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* Logo Section */}
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    mb: 2,
                                    gap: 2,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    style={{
                                        height: "40px",
                                        // width: "40px",
                                        borderRadius: "8px",
                                    }}
                                />
                                <img
                                    src={logoText}
                                    alt="Logo Text"
                                    style={{ height: "32px" }}
                                />
                            </Box>

                            {/* Header Section */}
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                                    <Security color="primary" sx={{ fontSize: 40, mr: 1 }} />
                                </Box>
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Reset Password
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
                                >
                                    Enter your email address and we'll send you a link to reset your password.
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    autoFocus
                                    autoComplete="email"
                                    disabled={isLoading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color={emailError ? "error" : "action"} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: email && (
                                            <InputAdornment position="end">
                                                {email && emailError ? (
                                                    <Tooltip title={`Clear Email field`}>
                                                        <Close
                                                            onClick={() => setEmail('')}

                                                            sx={{
                                                                color: theme.palette.error.main, fontSize: 20, cursor: 'pointer',
                                                                ':hover': {
                                                                    opacity: 0.8,
                                                                    transition: 'opacity 0.2s ease-in-out',
                                                                }
                                                            }}
                                                        />
                                                    </Tooltip>
                                                ) : (<Check sx={{ color: theme.palette.success.main, fontSize: 20 }} />)}
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                                            },
                                            '&.Mui-focused': {
                                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
                                            }
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading || !email.trim()}
                                    sx={{
                                        mt: 4,
                                        mb: 1,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        background: !emailError && !isLoading
                                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                            : undefined,
                                        boxShadow: !emailError && !isLoading
                                            ? `0 4px 20px ${theme.palette.primary.main}40`
                                            : undefined,
                                        '&:hover': {
                                            background: !emailError && !isLoading
                                                ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                                : undefined,
                                            boxShadow: !emailError && !isLoading
                                                ? `0 6px 25px ${theme.palette.primary.main}50`
                                                : undefined,
                                        },
                                        '&:disabled': {
                                            background: theme.palette.grey[300],
                                            color: theme.palette.grey[500],
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    {isLoading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CircularProgress size={24} color="inherit" />
                                            Sending Link...
                                        </Box>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>

                                <Box sx={{ textAlign: "center", mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Already remembered your password?{" "}
                                        <Button
                                            onClick={handleBackToLogin}
                                            sx={{
                                                fontSize: 'inherit',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                p: 0,
                                                minWidth: 'auto',
                                                '&:hover': {
                                                    background: 'transparent',
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Didn't have an account?{" "}
                                        <Button
                                            onClick={() => navigate("/signup")}
                                            sx={{
                                                fontSize: 'inherit',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                p: 0,
                                                minWidth: 'auto',
                                                '&:hover': {
                                                    background: 'transparent',
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary">
                                        By creating an account and using the platform, you agree to our{" "}
                                        <Button
                                            onClick={() => navigate("/terms")}
                                            sx={{
                                                fontSize: 'inherit',
                                                p: 0,
                                                minWidth: 'auto',
                                                textTransform: 'none',
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    background: 'transparent'
                                                }
                                            }}
                                        >
                                            Terms of Service
                                        </Button>
                                        {" "}and{" "}
                                        <Button
                                            onClick={() => navigate("/privacy")}
                                            sx={{
                                                fontSize: 'inherit',
                                                p: 0,
                                                minWidth: 'auto',
                                                textTransform: 'none',
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    background: 'transparent'
                                                }
                                            }}
                                        >
                                            Privacy Policy
                                        </Button>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Grid >
    );
};

export default ForgotPasswordForm;