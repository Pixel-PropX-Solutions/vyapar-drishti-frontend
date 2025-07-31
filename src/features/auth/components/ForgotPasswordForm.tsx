import React, { useCallback, useState } from "react";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Grid,
    InputAdornment,
    // useTheme,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { getCurrentUser, register } from "@/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { AuthStates } from "@/utils/enums";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCompany } from "@/services/company";

const ForgotPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const dispatch = useDispatch<AppDispatch>();
    // const theme = useTheme();
    const { authState, signupData } = useSelector((state: RootState) => state.auth);
    // const pathName = window.location.pathname;
    const [data, setData] = useState({
        email: email || "",
        password: "",
        confirmPassword: "",
        user_type: 'user',
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    }

    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {};
        if (!data.email.trim()) errors.email = 'Email is required';
        if (!data.password.trim()) errors.password = 'Password is required';
        if (!data.confirmPassword.trim()) errors.confirmPassword = 'Confirm Password is required';
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    }, [data]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            // Handle validation errors
            return;
        }

        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("user_type", data.user_type);
        formData.append("token", token || "");



        dispatch(register(signupData))
            .unwrap()
            .then((response) => {
                console.log("Response Login Form", response)
                // if(response)
                dispatch(getCurrentUser());
                dispatch(getCompany());
                navigate("/");
            }).catch((error) => {
                console.error("Login error:", error);
                toast.error(error || "An unexpected error occurred. Please try again later.");
            });

    };

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
            }}
        >
            <Container component="main">
                <CssBaseline />
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "start",
                    }}
                >
                    {/* Logo */}
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
                                marginBottom: "20px",
                                height: "50px",
                                borderRadius: "50%",
                            }}
                        />
                        <img
                            src={logoText}
                            alt="Logo Text"
                            style={{ marginBottom: "10px", height: "40px" }}
                        />
                    </Box>

                    {/* Title */}
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: 3 }}>
                        Please enter your new password below. Make sure to remember it for future logins.
                    </Typography>

                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 1, width: "100%" }}
                    >

                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            required
                            disabled
                            value={data.email}
                            margin="normal"
                            id="email"
                            name="email"
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                }
                            }}
                        />

                        <TextField
                            onChange={changeHandler}
                            margin="normal"
                            fullWidth
                            required
                            name="password"
                            variant="outlined"
                            value={data.password}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            helperText={"Enter your Password"}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {showPassword ? (
                                            <VisibilityOff
                                                onClick={handleTogglePasswordVisibility}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <Visibility
                                                onClick={handleTogglePasswordVisibility}
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            onChange={changeHandler}
                            margin="normal"
                            fullWidth
                            required
                            name="password"
                            variant="outlined"
                            value={data.password}
                            label="Confirm Password"
                            type={showPassword ? "text" : "password"}
                            id="confirm-password"
                            placeholder="Confirm Password"
                            helperText={"Enter your Confirm Password"}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {showPassword ? (
                                            <VisibilityOff
                                                onClick={handleToggleConfirmPasswordVisibility}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <Visibility
                                                onClick={handleToggleConfirmPasswordVisibility}
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                            }}
                        >
                            {authState === AuthStates.INITIALIZING ? "Loading..." : "Reset Password"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Grid>
    );
};

export default ForgotPasswordForm;
