import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  useTheme,
  Paper,
  Fade,
  LinearProgress,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Check,
  Close,
  Info,
  PersonAdd
} from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { register } from "@/services/auth";
import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PhoneNumber from "@/common/PhoneNumber";

interface ValidationErrors {
  [key: string]: string;
}

interface UserFormData {
  first: string;
  last: string;
  email: string;
  code: string;
  number: string;
  password: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'error' | 'warning' | 'info' | 'success';
}

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false); // Always false initially
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'error'
  });

  const [data, setData] = useState({
    first: "",
    last: "",
    email: '',
    code: '',
    number: '',
    password: "",
  });

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");

    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push("One special character");

    let color: 'error' | 'warning' | 'info' | 'success' = 'error';
    if (score >= 4) color = 'success';
    else if (score >= 3) color = 'info';
    else if (score >= 2) color = 'warning';

    return { score, feedback, color };
  };

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    Object.keys(data).forEach(key => {
      const field = key as keyof UserFormData;
      const error = validateField(field, String(data[field] || ''));
      if (error) errors[field] = error;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [data]);

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update password strength in real-time
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate form after input change
    setTimeout(() => {
      setIsFormValid(validateForm());
    }, 0);
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function changeCountryCode(field: string, value: string) {
    setData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user changes country code
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Validate form after country code change
    setTimeout(() => {
      setIsFormValid(validateForm());
    }, 0);
  }

  const validateField = (field: string, value: string): string => {
    if (field === 'first' && !value.trim()) return 'First name is required';
    // if (field === 'last' && !value.trim()) return 'Last name is required';
    if (field === 'email' && !value.trim()) return 'Email is required';
    if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
    if (field === 'code' && !value.trim()) return 'Country code is required';
    if (field === 'number' && !value.trim()) return 'Phone number is required';
    if (field === 'number' && value.length < 10) return 'Phone number must be at least 10 digits';
    if (field === 'password' && !value.trim()) return 'Password is required';
    if (field === 'password' && value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    const userData = {
      name: {
        first: data.first,
        last: data.last,
      },
      email: data.email,
      phone: {
        code: data.code,
        number: data.number
      },
      password: data.password,
    }

    try {
      await toast.promise(
        dispatch(register(userData))
          .unwrap()
          .then(() => {
            navigate("/login");
          }),
        {
          loading: "Creating your account...",
          success: <b>Account created successfully! 🎉</b>,
          error: <b>Could not create account. Please try again.</b>,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (fieldName: string, hasError: boolean, hasValue: boolean) => {
    if (!hasValue) return null;
    return hasError ? (
      <Tooltip title={`Clear ${fieldName} field`}>
        <Close
          onClick={() => setData(prev => ({ ...prev, [fieldName]: '' }))}
          sx={{
            color: theme.palette.error.main, fontSize: 20, cursor: 'pointer',
            ':hover': {
              opacity: 0.8,
              transition: 'opacity 0.2s ease-in-out',
            }
          }}
        />
      </Tooltip>
    ) : (
      <Check sx={{ color: theme.palette.success.main, fontSize: 20 }} />
    );
  };

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
              border: `1px solid ${theme.palette.divider}`,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
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

              {/* Header */}
              <Box sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <PersonAdd color="primary" sx={{ fontSize: 40, mr: 1 }} />
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
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}
                >
                  Join us today and start your journey to financial protection
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* Name Fields */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    required
                    fullWidth
                    id="first"
                    label="First Name"
                    name="first"
                    placeholder="Enter your first name"
                    onChange={changeHandler}
                    value={data.first}
                    error={!!validationErrors.first}
                    helperText={validationErrors.first}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'action.active' }} />
                        </InputAdornment>
                      ),
                      endAdornment: data.first && (
                        <InputAdornment position="end">
                          {getFieldIcon('first', !!validationErrors.first, !!data.first)}
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

                  <TextField
                    fullWidth
                    id="last"
                    label="Last Name"
                    name="last"
                    placeholder="Enter your last name"
                    onChange={changeHandler}
                    value={data.last}
                    error={!!validationErrors.last}
                    helperText={validationErrors.last}
                    InputProps={{
                      endAdornment: data.last && (
                        <InputAdornment position="end">
                          {getFieldIcon('last', !!validationErrors.last, !!data.last)}
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
                </Stack>

                {/* Email Field */}
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={changeHandler}
                  value={data.email}
                  placeholder="Enter your email address"
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    endAdornment: data.email && (
                      <InputAdornment position="end">
                        {getFieldIcon('email', !!validationErrors.email, !!data.email)}
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Phone Number */}
                <Box sx={{ mb: 2 }}>
                  <PhoneNumber
                    code={data.code}
                    number={data.number}
                    codeWidth="40%"
                    codeHandler={changeCountryCode}
                    numberHandler={changeHandler}
                    codeLabel="Country Code"
                    required={true}
                    codeError={!!validationErrors.code}
                    numberError={!!validationErrors.number}
                    numberHelperText={validationErrors.number}
                    codePlaceholder="+91"
                    numberLabel="Phone Number"
                    numberPlaceholder="Enter your phone number"
                  />
                </Box>

                {/* Password Field */}
                <TextField
                  onChange={changeHandler}
                  fullWidth
                  required
                  name="password"
                  variant="outlined"
                  value={data.password}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a strong password"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
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
                          {data.password && getFieldIcon('password', !!validationErrors.password, !!data.password)}
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

                {/* Password Strength Indicator */}
                {data.password && (
                  <Fade in timeout={300}>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: .5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Password Strength
                        </Typography>
                        <Tooltip title="A strong password helps protect your account">
                          <Info sx={{ fontSize: 14, ml: 0.5, color: 'text.secondary' }} />
                        </Tooltip>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score / 5) * 100}
                        color={passwordStrength.color}
                        sx={{
                          height: 6,
                          borderRadius: 2,
                          mb: 1.5,
                          backgroundColor: theme.palette.grey[200],
                        }}
                      />
                      {passwordStrength.feedback.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {passwordStrength.feedback.map((feedback, index) => (
                            <Chip
                              key={index}
                              label={feedback}
                              size="small"
                              color={passwordStrength.color}
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Fade>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={!isFormValid || isSubmitting}
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
                    background: isFormValid && !isSubmitting
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : undefined,
                    boxShadow: isFormValid && !isSubmitting
                      ? `0 4px 20px ${theme.palette.primary.main}40`
                      : undefined,
                    '&:hover': {
                      background: isFormValid && !isSubmitting
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                        : undefined,
                      boxShadow: isFormValid && !isSubmitting
                        ? `0 6px 25px ${theme.palette.primary.main}50`
                        : undefined,
                    },
                    '&:disabled': {
                      background: theme.palette.grey[300],
                      color: theme.palette.grey[500],
                    }
                  }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                {/* Footer Links */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Button
                      onClick={() => navigate("/login")}
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
                      Sign In
                    </Button>
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    By creating an account, you agree to our{" "}
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
    </Grid>
  );
};

export default RegistrationForm;
