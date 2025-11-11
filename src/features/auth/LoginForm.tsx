import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  useTheme,
  IconButton,
  Alert,
  Fade,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  Login,
} from "@mui/icons-material";
import Logo from "../../assets/Logo.webp";
import logoText from "../../assets/Logo_Text.webp";
import { getCurrentUser, login } from "@/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { AuthStates } from "@/utils/enums";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCompany } from "@/services/company";

interface UserFormData {
  username: string;
  password: string;
  user_type: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { authState } = useSelector((state: RootState) => state.auth);
  const pathName = window.location.pathname;
  const [data, setData] = useState({
    username: "",
    password: "",
    user_type: pathName === '/admin' ? 'admin' : 'user',
  });
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  const isAdmin = pathName === '/admin';

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      // Validate form after updating data
      setIsFormValid(validateForm(newData));
      return newData;
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }

  // Update validateForm to accept data as argument
  const validateForm = useCallback((formData?: typeof data): boolean => {
    const errors: ValidationErrors = {};
    const checkData = formData || data;
    Object.keys(checkData).forEach(key => {
      const field = key as keyof UserFormData;
      const error = validateField(field, String(checkData[field] || ''));
      if (error) errors[field] = error;
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [data]);

  const validateField = (field: string, value: string): string => {
    if (field === 'username' && !value.trim()) return 'Username or email is required';
    if (field === 'username' && !/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
    if (field === 'password' && !value.trim()) return 'Password is required';
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError || "Please fill in all required fields correctly.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("user_type", data.user_type);

    dispatch(login(formData))
      .unwrap()
      .then((response) => {
        console.log("Response Login Form", response);
        dispatch(getCurrentUser());
        dispatch(getCompany());
        navigate("/");
        setIsSubmitting(false);
        if (rememberMe) {
          localStorage.setItem('rememberMe',
            JSON.stringify({ username: data.username, user_type: data.user_type }));
        } else {
          localStorage.removeItem('rememberMe');
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setIsSubmitting(false);
        toast.error(error || "An unexpected error occurred. Please try again later.");
      });
  };

  const isLoading = authState === AuthStates.INITIALIZING;

  return (
    <Grid
      item
      lg={12}
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
      }}
    >
      <Container component="main" maxWidth={false} sx={{ width: { sm: '100%', xs: '100%', md: '550px', lg: '700px' } }}>
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                mb: 2,
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Logo"
                sx={{
                  height: { xs: "24px", sm: "32px", md: "40px" },
                  borderRadius: "8px",
                }}
              />
              <Box
                component="img"
                src={logoText}
                alt="Logo Text"
                sx={{ height: { xs: "24px", sm: "30px", md: "32px" } }}
              />
            </Box>

            {/* Header Section */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <Login color="primary" sx={{ fontSize: { xs: 24, sm: 32, md: 40 }, mr: 1 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.4rem' },
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: '.9rem', sm: '1.4rem', md: '2rem' }, lineHeight: 1.6 }}
              >
                Sign in to your {isAdmin ? 'Admin' : 'User'} Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '.8rem', sm: '1rem', md: '1.2rem' } }}>
                Empower your business with advanced document handling and insightful billing analysis.
              </Typography>
            </Box>

            {/* Admin Badge */}
            {isAdmin && (
              <Alert
                severity="info"
                icon={<Security />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
              >
                You are signing in as an Administrator
              </Alert>
            )}

            {/* Form Section */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                label="Username or Email"
                variant="outlined"
                fullWidth
                required
                value={data.username}
                onChange={changeHandler}
                error={!!validationErrors.username}
                helperText={validationErrors.username || "Enter your email or username"}
                margin="normal"
                name="username"
                autoComplete="username"
                autoFocus
                placeholder="johndoe@gmail.com"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
                    }
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
                placeholder="Enter your password"
                autoComplete="current-password"
                error={!!validationErrors.password}
                helperText={validationErrors.password || "Enter your password"}
                disabled={isLoading}
                sx={{
                  mb: 1,
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* {data.password && getFieldIcon('password', !!validationErrors.password, !!data.password)} */}
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember Me */}
              <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      disabled={isLoading}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '.7rem', sm: '.9rem', md: '1rem' } }}>
                      Remember me for 30 days
                    </Typography>
                  }
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '.7rem', sm: '.9rem', md: '1rem' } }}>
                  Can't remember password?{" "}
                  <Button
                    onClick={() => navigate("/forgot-password")}
                    sx={{
                      fontSize: { xs: '.7rem', sm: '.9rem', md: '1rem' },
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
                    Reset Password
                  </Button>
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || isSubmitting || !isFormValid}
                size="large"
                sx={{
                  mt: 1,
                  mb: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: isFormValid && !isSubmitting ? isAdmin
                    ? `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    : undefined,
                  boxShadow: isFormValid && !isSubmitting
                    ? `0 4px 20px ${theme.palette.primary.main}40`
                    : undefined,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: isFormValid && !isSubmitting ? isAdmin
                      ? `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.warning.dark})`
                      : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                      : undefined,
                    transform: 'translateY(-1px)',
                    boxShadow: isFormValid && !isSubmitting ? `0 6px 25px ${theme.palette.primary.main}50` : undefined,
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  }
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', px: 2 }}>
                  or
                </Typography>
              </Divider>

              {/* Footer Links */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account yet?{" "}
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

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  By signing in, you agree to our{" "}
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
          </Paper>
        </Fade>
      </Container>
    </Grid>
  );
};

export default LoginForm;