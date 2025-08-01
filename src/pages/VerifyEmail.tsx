import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    CircularProgress,
    Button,
    Alert,
    Stack,
    useTheme,
    alpha,
} from "@mui/material";
import {
    CheckCircleOutline,
    ErrorOutline,
    Email,
    Refresh,
    Home,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { emailVerify } from "@/services/auth";
import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";

interface VerificationState {
    isVerified: boolean;
    isVerifying: boolean;
    error: string | null;
}

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();

    const [state, setState] = useState<VerificationState>({
        isVerified: false,
        isVerifying: true,
        error: null,
    });

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleVerification = async () => {
        if (!token || !email) {
            setState({
                isVerified: false,
                isVerifying: false,
                error: "Invalid verification link. Please check your email for a valid verification link.",
            });
            toast.error("Invalid verification link");
            return;
        }

        setState(prev => ({ ...prev, isVerifying: true, error: null }));

        await dispatch(emailVerify({ email, token })).then((res) => {
            console.log("Email verification response:", res);
            if (res.meta.requestStatus === "fulfilled") {
                setState({
                    isVerified: true,
                    isVerifying: false,
                    error: null,
                });
                toast.success("Email verified successfully!");
            } else {
                setState({
                    isVerified: false,
                    isVerifying: false,
                    error: res.payload as string || "Email verification failed. Please try again.",
                });
                toast.error(res.payload as string || "Email verification failed. Please try again.");
            }
        }).catch((error: any) => {
            const errorMessage = error || "An unexpected error occurred";
            setState({
                isVerified: false,
                isVerifying: false,
                error: errorMessage,
            });
        });
    };

    const handleRetry = () => {
        handleVerification();
    };

    const handleGoToLogin = () => {
        navigate("/login");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    useEffect(() => {
        handleVerification();
    }, [token, email, dispatch]);

    const renderVerifyingState = () => (
        <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            <Box
                sx={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: theme.palette.primary.main,
                    }}
                />
                <Email
                    sx={{
                        position: "absolute",
                        fontSize: 24,
                        color: theme.palette.primary.main,
                    }}
                />
            </Box>

            <Typography variant="h5" component="h1" fontWeight="medium">
                Verifying Your Email
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
                Please wait while we verify your email address...
            </Typography>

            {email && (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Verifying: <strong>{email}</strong>
                </Typography>
            )}
        </Stack>
    );

    const renderSuccessState = () => (
        <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
            <CheckCircleOutline
                sx={{
                    fontSize: 80,
                    color: theme.palette.success.main,
                }}
            />

            <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
                Email Verified Successfully!
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
                Your email address has been verified. You can now access your account with full functionality.
            </Typography>

            {email && (
                <Alert severity="success" sx={{ width: "100%" }}>
                    <Typography variant="body2">
                        <strong>{email}</strong> has been successfully verified
                    </Typography>
                </Alert>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleGoToLogin}
                    sx={{ flex: 1 }}
                >
                    Go to Login
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleGoHome}
                    startIcon={<Home />}
                    sx={{ flex: 1 }}
                >
                    Go Home
                </Button>
            </Stack>
        </Stack>
    );

    const renderErrorState = () => (
        <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center" sx={{ py: { xs: 2, sm: 4 } }}>
            <ErrorOutline
                sx={{
                    fontSize: 80,
                    color: theme.palette.error.main,
                }}
            />

            <Typography variant="h5" component="h1" fontWeight="medium" textAlign="center">
                Email Verification Failed
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
                We couldn't verify your email address. This might be due to an expired or invalid verification link.
            </Typography>

            <Alert severity="error" sx={{ width: "100%", m: 0, }}>
                <Typography variant="body2">
                    {state.error}
                </Typography>
            </Alert>

            <Stack direction={{ xs: "column", sm: "row" }} sx={{ width: "100%", gap: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleRetry}
                    startIcon={<Refresh />}
                    sx={{ flex: 1 }}
                >
                    Try Again
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleGoHome}
                    startIcon={<Home />}
                    sx={{ flex: 1 }}
                >
                    Go Home
                </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" textAlign="center">
                If the problem persists, please contact our support team for assistance.
            </Typography>
        </Stack>
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                display: "flex",
                alignItems: { sm: "center", xs: "flex-start" },
                py: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        background: theme.palette.background.paper,
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        {state.isVerifying && renderVerifyingState()}
                        {!state.isVerifying && state.isVerified && renderSuccessState()}
                        {!state.isVerifying && !state.isVerified && renderErrorState()}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default VerifyEmail;