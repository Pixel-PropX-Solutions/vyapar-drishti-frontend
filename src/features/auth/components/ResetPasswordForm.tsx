import React, { useCallback, useState } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    InputAdornment,
    Alert,
    LinearProgress,
    Chip,
    Fade,
    Paper,
    useTheme,
    useMediaQuery,
    Theme,
} from "@mui/material";
import {
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    CheckCircle,
    Cancel,
    Security
} from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { getCurrentUser, resetPassword } from "@/services/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCompany } from "@/services/company";

interface PasswordStrength {
    score: number;
    label: string;
    color: 'error' | 'warning' | 'info' | 'success';
}

interface ValidationErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const ResetPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();

    const [data, setData] = useState({
        email: email || "",
        password: "",
        confirmPassword: "",
        user_type: 'user',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Password strength calculation
    const getPasswordStrength = (password: string): PasswordStrength => {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        const strengthMap: Record<number, PasswordStrength> = {
            0: { score: 0, label: 'Very Weak', color: 'error' },
            1: { score: 20, label: 'Weak', color: 'error' },
            2: { score: 40, label: 'Fair', color: 'warning' },
            3: { score: 60, label: 'Good', color: 'info' },
            4: { score: 80, label: 'Strong', color: 'success' },
            5: { score: 100, label: 'Very Strong', color: 'success' },
        };

        return strengthMap[score] || strengthMap[0];
    };

    const passwordStrength = getPasswordStrength(data.password);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, data[fieldName as keyof typeof data]);
    };

    const validateField = (fieldName: string, value: string) => {
        const newErrors: ValidationErrors = { ...errors };

        switch (fieldName) {
            case 'email':
                if (!value.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'password':
                if (!value.trim()) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters long';
                } else if (passwordStrength.score < 60) {
                    newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and symbols';
                } else {
                    delete newErrors.password;
                }
                // Revalidate confirm password if it exists
                if (data.confirmPassword && value !== data.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else if (data.confirmPassword && value === data.confirmPassword) {
                    delete newErrors.confirmPassword;
                }
                break;
            case 'confirmPassword':
                if (!value.trim()) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (value !== data.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Real-time validation for touched fields
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const validateForm = useCallback((): boolean => {
        const fields = ['email', 'password', 'confirmPassword'];
        let isValid = true;

        fields.forEach(field => {
            const fieldValue = data[field as keyof typeof data];
            if (!validateField(field, fieldValue)) {
                isValid = false;
            }
        });

        // Mark all fields as touched
        const allTouched = fields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        return isValid;
    }, [data, passwordStrength]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the validation errors before submitting.");
            return;
        }

        setIsSubmitting(true);

        await dispatch(resetPassword({ email: data.email, new_password: data.password, token: token || "" })).unwrap().then((response) => {
            // if (response)
            console.log("Response Reset Password Form", response);
            dispatch(getCurrentUser());
            dispatch(getCompany());
            toast.success("Password reset successfully!");
            navigate("/");
        }).catch((error: any) => {
            console.error("Reset password error:", error);
            toast.error(error?.message || "An unexpected error occurred. Please try again later.");
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const getPasswordRequirements = () => {
        const requirements = [
            { text: "At least 8 characters", met: data.password.length >= 8 },
            { text: "One lowercase letter", met: /[a-z]/.test(data.password) },
            { text: "One uppercase letter", met: /[A-Z]/.test(data.password) },
            { text: "One number", met: /[0-9]/.test(data.password) },
            { text: "One special character", met: /[^A-Za-z0-9]/.test(data.password) },
        ];

        return requirements;
    };

    return (
        <Grid
            item
            lg={12}
            sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: { xs: 1, sm: 2, md: 3, lg: 4 },
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: 2, sm: 2, md: 3, lg: 4 },
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/* Logo */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: isMobile ? "column" : "row",
                                gap: 1,
                                mb: 1,
                            }}
                        >
                            <img
                                src={Logo}
                                alt="Logo"
                                style={{
                                    height: isTablet ? '50px' : '40px',
                                    borderRadius: "50%",
                                }}
                            />
                            <img
                                src={logoText}
                                alt="Logo Text"
                                style={{ height: isTablet ? '40px' : isMobile ? '35px' : '40px', }}
                            />
                        </Box>

                        {/* Header */}
                        <Box sx={{ textAlign: "center", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                                <Security color="primary" sx={{ fontSize: { xs: 30, sm: 40,} }} />
                            </Box>
                            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                                Reset Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Create a strong new password to secure your account
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ width: "100%" }}
                        >
                            {/* Email Field */}
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                disabled
                                value={data.email}
                                margin="normal"
                                id="email"
                                name="email"
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />

                            {/* Password Field */}
                            <TextField
                                onChange={changeHandler}
                                onBlur={() => handleBlur('password')}
                                margin="normal"
                                fullWidth
                                required
                                name="password"
                                variant="outlined"
                                value={data.password}
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your new password"
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {showPassword ? (
                                                <VisibilityOff
                                                    onClick={handleTogglePasswordVisibility}
                                                    sx={{ cursor: "pointer", color: "action.active" }}
                                                />
                                            ) : (
                                                <Visibility
                                                    onClick={handleTogglePasswordVisibility}
                                                    sx={{ cursor: "pointer", color: "action.active" }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Password Strength Indicator */}
                            {data.password && (
                                <Fade in={!!data.password}>
                                    <Box sx={{ mt: 1, mb: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Password Strength:
                                            </Typography>
                                            <Chip
                                                label={passwordStrength.label}
                                                color={passwordStrength.color}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={passwordStrength.score}
                                            color={passwordStrength.color}
                                            sx={{ height: 6, borderRadius: 3 }}
                                        />

                                        {/* Password Requirements */}
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Password Requirements:
                                            </Typography>
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                                {getPasswordRequirements().map((req, index) => (
                                                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        {req.met ? (
                                                            <CheckCircle sx={{ fontSize: 14, color: "success.main" }} />
                                                        ) : (
                                                            <Cancel sx={{ fontSize: 14, color: "error.main" }} />
                                                        )}
                                                        <Typography
                                                            variant="caption"
                                                            color={req.met ? "success.main" : "error.main"}
                                                        >
                                                            {req.text}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Fade>
                            )}

                            {/* Confirm Password Field */}
                            <TextField
                                onChange={changeHandler}
                                onBlur={() => handleBlur('confirmPassword')}
                                margin="normal"
                                fullWidth
                                required
                                name="confirmPassword"
                                variant="outlined"
                                value={data.confirmPassword}
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                placeholder="Confirm your new password"
                                error={touched.confirmPassword && !!errors.confirmPassword}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {showConfirmPassword ? (
                                                <VisibilityOff
                                                    onClick={handleToggleConfirmPasswordVisibility}
                                                    sx={{ cursor: "pointer", color: "action.active" }}
                                                />
                                            ) : (
                                                <Visibility
                                                    onClick={handleToggleConfirmPasswordVisibility}
                                                    sx={{ cursor: "pointer", color: "action.active" }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Success Message for Password Match */}
                            {data.confirmPassword && data.password === data.confirmPassword && !errors.confirmPassword && (
                                <Fade in={true}>
                                    <Alert severity="success" sx={{ mt: 1, borderRadius: 2 }}>
                                        Passwords match!
                                    </Alert>
                                </Fade>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitting || Object.keys(errors).length > 0}
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: Object.keys(errors).length === 0 && !isSubmitting
                                        ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                        : undefined,
                                    boxShadow: Object.keys(errors).length === 0 && !isSubmitting
                                        ? `0 4px 20px ${theme.palette.primary.main}40`
                                        : undefined,
                                    '&:hover': {
                                        background: Object.keys(errors).length === 0 && !isSubmitting
                                            ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                            : undefined,
                                        boxShadow: Object.keys(errors).length === 0 && !isSubmitting
                                            ? `0 6px 25px ${theme.palette.primary.main}50`
                                            : undefined,
                                    },
                                    '&:disabled': {
                                        background: theme.palette.grey[300],
                                        color: theme.palette.grey[500],
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LinearProgress
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                borderRadius: 2,
                                            }}
                                        />
                                        Updating Password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>

                            {/* Security Notice */}
                            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                                <Typography variant="body2">
                                    For your security, you'll be automatically logged in after resetting your password.
                                </Typography>
                            </Alert>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Grid>
    );
};

export default ResetPasswordForm;
