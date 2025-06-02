import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Slide,
  useTheme,
  Tooltip,
  alpha,
  Chip,
  CircularProgress,
  Fade,
  Snackbar,
  Grid,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  DeleteOutline,
  CheckCircleOutline,
  SecurityOutlined,
  AccountCircleOutlined,
  HelpOutline,
  InfoOutlined,
  ArrowBack,
  Check,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login } from "@/services/auth";
import { TransitionProps } from "@mui/material/transitions";

// Password strength meter component with improved visual feedback
const PasswordStrengthMeter: React.FC<{ password: string }> = ({
  password,
}) => {
  const theme = useTheme();

  const getStrength = (
    password: string
  ): { value: number; label: string; color: string } => {
    if (!password)
      return { value: 0, label: "None", color: theme.palette.text.disabled };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;

    const strengthMap = [
      { value: 0, label: "None", color: theme.palette.text.disabled },
      { value: 1, label: "Weak", color: theme.palette.error.main },
      { value: 2, label: "Fair", color: theme.palette.warning.main },
      { value: 3, label: "Good", color: theme.palette.info.main },
      { value: 4, label: "Strong", color: theme.palette.success.main },
    ];

    return strengthMap[strength];
  };

  const strength = getStrength(password);

  return (
    <Box sx={{ width: "100%", mt: 1.5, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.75,
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Password Strength
        </Typography>
        <Chip
          label={strength.label}
          size="small"
          sx={{
            bgcolor: alpha(strength.color, 0.1),
            color: strength.color,
            fontWeight: "medium",
            minWidth: 60,
            height: 24,
          }}
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={(strength.value / 4) * 100}
        sx={{
          height: 6,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.divider, 0.3),
          "& .MuiLinearProgress-bar": {
            borderRadius: 1,
            bgcolor: strength.color,
            transition: "all 0.4s ease",
          },
        }}
      />
    </Box>
  );
};

// Password requirements component with improved visual feedback
const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least 1 number", met: /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const allRequirementsMet = requirements.every((req) => req.met); // Check if all requirements are met

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", display: "block", mb: 1 }}
      >
        Password requirements:
      </Typography>
      <Grid container spacing={1}>
        {requirements.map((req, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0.75,
                borderRadius: 1,
                bgcolor: req.met
                  ? alpha(theme.palette.success.main, 0.08)
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Box
                sx={{
                  color: req.met
                    ? theme.palette.success.main
                    : theme.palette.text.disabled,
                  mr: 1,
                  display: "flex",
                  transition: "color 0.2s ease",
                }}
              >
                {req.met ? (
                  <Check fontSize="small" />
                ) : (
                  <CheckCircleOutline fontSize="small" />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: req.met ? "text.primary" : "text.secondary",
                  fontWeight: req.met ? "medium" : "regular",
                  transition: "all 0.2s ease",
                }}
              >
                {req.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Typography
        variant="caption"
        sx={{
          color: allRequirementsMet
            ? theme.palette.success.main
            : theme.palette.error.main,
        }}
      >
        {allRequirementsMet
          ? "All requirements met!"
          : "Please meet all requirements."}
      </Typography>
    </Box>
  );
};

// Slide up transition for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Settings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Enhanced UI states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [activeSection, setActiveSection] = useState<"password" | "account">(
    "password"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [_, setPasswordModified] = useState(false);
  const [passwordLastChanged, setPasswordLastChanged] =
    useState<string>("2023-12-15");

  // Error states
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Calculate days since last password change for security indicator
  const daysSincePasswordChange = () => {
    const lastChange = new Date(passwordLastChanged);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastChange.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get password age warning level
  const getPasswordAgeStatus = () => {
    const days = daysSincePasswordChange();
    if (days <= 30)
      return {
        status: "good",
        color: theme.palette.success.main,
        message: "Your password is up to date",
      };
    if (days <= 90)
      return {
        status: "warning",
        color: theme.palette.warning.main,
        message: "Consider updating your password soon",
      };
    return {
      status: "critical",
      color: theme.palette.error.main,
      message: "Your password is outdated",
    };
  };

  const passwordAgeInfo = getPasswordAgeStatus();

  // Toggle password visibility with improved animation
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle password form input changes with enhanced validation feedback
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (name === "password") {
      setPasswordError("");
      setPasswordModified(true);
    } else if (name === "confirmPassword") {
      setConfirmPasswordError("");
    }
  };

  const handleSetSection = (section: "password" | "account") => {
    setActiveSection(section);
  };

  // Enhanced password validation with more specific feedback
  const validatePasswordForm = (): boolean => {
    let isValid = true;

    // Enhanced validation with specific feedback messages
    if (passwordData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else if (!passwordData.password.match(/[A-Z]/)) {
      setPasswordError("Password must contain at least one uppercase letter");
      isValid = false;
    } else if (!passwordData.password.match(/[0-9]/)) {
      setPasswordError("Password must contain at least one number");
      isValid = false;
    } else if (!passwordData.password.match(/[^A-Za-z0-9]/)) {
      setPasswordError("Password must contain at least one special character");
      isValid = false;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  // Handle password update submission with improved user feedback
  const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("password", passwordData.password);
    formData.append("confirmPassword", passwordData.confirmPassword);

    // Simulate API call with timeout
    setTimeout(() => {
      // Use your existing login function (consider renaming it to updatePassword in the future)
      dispatch(login(formData))
        .unwrap()
        .then(() => {
          // Success
          setIsSubmitting(false);
          setPasswordData({
            password: "",
            confirmPassword: "",
          });
          setPasswordModified(false);
          setPasswordLastChanged(new Date().toISOString().split("T")[0]);
          setSnackbarMessage(
            "Password updated successfully! Your account is now more secure."
          );
          setSnackbarSeverity("success");
          setShowSnackbar(true);
        })
        .catch((error) => {
          // Error
          setIsSubmitting(false);
          setSnackbarMessage("Failed to update password. Please try again.");
          setSnackbarSeverity("error");
          setShowSnackbar(true);
          console.error("Failed to update password:", error);
        });
    }, 1500); // Simulate network delay
  };

  // Enhanced delete account dialog with text confirmation
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    setDeleteConfirmText("");
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeleteConfirmText(e.target.value);
  };

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(false);
    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSnackbarMessage("Account deleted successfully. Redirecting...");
      setSnackbarSeverity("info");
      setShowSnackbar(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  // Add tablet/mobile back button
  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  onClick={handleBackNavigation}
                  sx={{
                    mr: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  <ArrowBack />
                </IconButton>
              )}
              <Typography variant="h4" component="h1" fontWeight="medium">
                Account Settings
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "30%",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Grid item xs={12} sm={12} sx={{ width: "45%" }}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "password" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("password")}
                  startIcon={<SecurityOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "password" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Security
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} sx={{ width: "45%" }}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "account" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("account")}
                  startIcon={<AccountCircleOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "account" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Account
                </Button>
              </Grid>
              {/* <Chip
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                    }}
                  >
                    <AccountCircleOutlined />
                  </Avatar>
                }
                label="John Doe"
                variant="outlined"
                sx={{
                  borderRadius: 8,
                  px: 2,
                  py: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  transition: "all 0.2s ease",
                }}
              /> */}
            </Box>
          </Box>

          {/* Improved Settings Navigation */}
          {/* <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "password" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("password")}
                  startIcon={<SecurityOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "password" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Security
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "account" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("account")}
                  startIcon={<AccountCircleOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "account" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Account
                </Button>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "preferences" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("preferences")}
                  startIcon={<LightModeOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "preferences" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Preferences
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant={
                    activeSection === "privacy" ? "contained" : "outlined"
                  }
                  onClick={() => handleSetSection("privacy")}
                  startIcon={<PrivacyTipOutlined />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: activeSection === "privacy" ? 2 : 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  Privacy
                </Button>
              </Grid> 
            </Grid>
          </Box> */}

          {/* Enhanced Password/Security Section */}
          <Fade in={activeSection === "password"} timeout={500}>
            <Box
              sx={{ display: activeSection === "password" ? "block" : "none" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <SecurityOutlined color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h5" component="h2">
                    Password & Security
                  </Typography>
                  <Tooltip title="Regularly updating your password helps keep your account secure">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <HelpOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Add password age indicator */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 3,
                    borderRadius: 1,
                    bgcolor: alpha(passwordAgeInfo.color, 0.05),
                    border: `1px solid ${alpha(passwordAgeInfo.color, 0.2)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: alpha(passwordAgeInfo.color, 0.1),
                      color: passwordAgeInfo.color,
                      mr: 2,
                    }}
                  >
                    <SecurityOutlined />
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ mb: 0.5 }}
                    >
                      {passwordAgeInfo.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last changed:{" "}
                      {new Date(passwordLastChanged).toLocaleDateString()}(
                      {daysSincePasswordChange()} days ago)
                    </Typography>
                  </Box>
                </Box>

                <Box
                  component="form"
                  onSubmit={handleUpdatePassword}
                  noValidate
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        margin="normal"
                        id="password"
                        name="password"
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            transition: "all 0.2s ease",
                            "&.Mui-focused": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderWidth: 2,
                              },
                            },
                          },
                        }}
                      />

                      {passwordData.password && (
                        <Fade in={!!passwordData.password}>
                          <Box>
                            <PasswordStrengthMeter
                              password={passwordData.password}
                            />
                            <PasswordRequirements
                              password={passwordData.password}
                            />
                          </Box>
                        </Fade>
                      )}
                    </Box>

                    <TextField
                      fullWidth
                      margin="normal"
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!confirmPasswordError}
                      helperText={confirmPasswordError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          transition: "all 0.2s ease",
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                  >
                    <Button
                      onClick={() => handleSetSection("password")}
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 1,
                        textTransform: "none",
                        minWidth: 180,
                        boxShadow: activeSection === "password" ? 2 : 0,
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress
                            size={24}
                            color="inherit"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                          <Box sx={{ opacity: 1 }}>Update Password</Box>
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Fade>

          {/* Enhanced Account Management Section */}
          <Fade in={activeSection === "account"} timeout={500}>
            <Box
              sx={{ display: activeSection === "account" ? "block" : "none" }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AccountCircleOutlined color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h5" component="h2">
                    Account Management
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Account information summary */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        john.doe@example.com
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Role
                      </Typography>
                      <Chip
                        label="Stockist"
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: "medium",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Member Since
                      </Typography>
                      <Typography variant="body1">Jan 15, 2023</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Alert
                  severity="warning"
                  icon={<InfoOutlined />}
                  sx={{
                    mb: 3,
                    alignItems: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>Warning:</strong> Deleting your account is permanent
                    and cannot be undone. All your data will be removed from our
                    servers.
                  </Typography>
                </Alert>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    borderRadius: 1,
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                        mr: 2,
                      }}
                    >
                      <DeleteOutline />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Delete Your Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All your account data will be permanently deleted.
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenDeleteDialog}
                    sx={{ mt: { xs: 2, sm: 0 } }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Fade>

          {/* Enhanced Delete Account Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            TransitionComponent={Transition}
          >
            <DialogTitle>Confirm Account Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To delete your account, please type "DELETE" below to confirm.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Confirmation Text"
                type="text"
                fullWidth
                variant="outlined"
                value={deleteConfirmText}
                onChange={handleDeleteConfirmTextChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for feedback */}
          <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
}

// import React, { useState } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Divider,
//   IconButton,
//   InputAdornment,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Alert,
//   Slide,
//   useTheme,
//   Tooltip,
//   alpha,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   ArrowBack,
//   LockOutlined,
//   DeleteOutline,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";
// import { login } from "@/services/auth";
// import { TransitionProps } from "@mui/material/transitions";

// // Slide up transition for dialog
// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const Settings: React.FC = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Form data
//   const [passwordData, setPasswordData] = useState({
//     password: "",
//     confirmPassword: "",
//   });

//   // Dialog states
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   // Error states
//   const [passwordError, setPasswordError] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState("");

//   // Toggle password visibility
//   const handleTogglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleToggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   // Handle password form input changes
//   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when typing
//     if (name === "password") {
//       setPasswordError("");
//     } else if (name === "confirmPassword") {
//       setConfirmPasswordError("");
//     }
//   };

//   // Validate password form
//   const validatePasswordForm = (): boolean => {
//     let isValid = true;

//     if (passwordData.password.length < 8) {
//       setPasswordError("Password must be at least 8 characters");
//       isValid = false;
//     }

//     if (passwordData.password !== passwordData.confirmPassword) {
//       setConfirmPasswordError("Passwords do not match");
//       isValid = false;
//     }

//     return isValid;
//   };

//   // Handle password update submission
//   const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validatePasswordForm()) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append("password", passwordData.password);
//     formData.append("confirmPassword", passwordData.confirmPassword);

//     // Use your existing login function (consider renaming it to updatePassword in the future)
//     dispatch(login(formData))
//       .unwrap()
//       .then(() => {
//         // Success - show success message and reset form
//         setPasswordData({
//           password: "",
//           confirmPassword: "",
//         });
//       })
//       .catch((error) => {
//         // Handle error appropriately
//         console.error("Failed to update password:", error);
//       });
//   };

//   // Handle delete account dialog
//   const handleOpenDeleteDialog = () => {
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleDeleteAccount = () => {
//     // Implement account deletion logic here
//     console.log("Account deletion requested");
//     setOpenDeleteDialog(false);
//     // Navigate to login page or home after successful deletion
//     // navigate("/login");
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Box
//         sx={{
//           mb: 4,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography variant="h4" component="h1" fontWeight="medium">
//           Settings
//         </Typography>
//       </Box>

//       {/* Password Update Section */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 1,
//           bgcolor: alpha(theme.palette.background.paper, 0.8),
//           backdropFilter: "blur(8px)",
//         }}
//       >
//         <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
//           Change Password
//         </Typography>

//         <Box component="form" onSubmit={handleUpdatePassword} noValidate>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", md: "row" },
//               gap: 2,
//             }}
//           >
//             <TextField
//               fullWidth
//               margin="normal"
//               id="password"
//               name="password"
//               label="New Password"
//               type={showPassword ? "text" : "password"}
//               value={passwordData.password}
//               onChange={handlePasswordChange}
//               error={!!passwordError}
//               helperText={passwordError}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockOutlined color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleTogglePasswordVisibility}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               fullWidth
//               margin="normal"
//               id="confirmPassword"
//               name="confirmPassword"
//               label="Confirm New Password"
//               type={showConfirmPassword ? "text" : "password"}
//               value={passwordData.confirmPassword}
//               onChange={handlePasswordChange}
//               error={!!confirmPasswordError}
//               helperText={confirmPasswordError}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockOutlined color="action" />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle confirm password visibility"
//                       onClick={handleToggleConfirmPasswordVisibility}
//                       edge="end"
//                     >
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{
//                 px: 3,
//                 borderRadius: 1.5,
//                 textTransform: "none",
//               }}
//             >
//               Update Password
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Account Deletion Section */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 1,
//           bgcolor: alpha(theme.palette.background.paper, 0.8),
//           backdropFilter: "blur(8px)",
//         }}
//       >
//         <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
//           Account Management
//         </Typography>

//         <Alert
//           severity="warning"
//           sx={{
//             mb: 3,
//             alignItems: "center",
//           }}
//         >
//           Deleting your account is permanent and cannot be undone.
//         </Alert>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <DeleteOutline color="error" sx={{ mr: 1 }} />
//             <Typography variant="body1">
//               Permanently delete your account and all associated data
//             </Typography>
//           </Box>

//           <Button
//             variant="outlined"
//             color="error"
//             onClick={handleOpenDeleteDialog}
//             sx={{
//               ml: 2,
//               borderRadius: 1.5,
//               textTransform: "none",
//             }}
//           >
//             Delete Account
//           </Button>
//         </Box>
//       </Paper>

//       {/* Delete Account Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={handleCloseDeleteDialog}
//         aria-describedby="delete-account-dialog-description"
//       >
//         <DialogTitle sx={{ pb: 1 }}>{"Delete your account?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="delete-account-dialog-description">
//             This action cannot be undone. All your personal data will be
//             permanently removed from our servers.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button
//             onClick={handleCloseDeleteDialog}
//             variant="outlined"
//             sx={{ textTransform: "none" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteAccount}
//             color="error"
//             variant="contained"
//             sx={{ textTransform: "none" }}
//           >
//             Delete Account
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default Settings;

// import React, { useState } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Divider,
//   IconButton,
//   InputAdornment,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Alert,
//   Slide,
//   useTheme,
//   Tooltip,
//   alpha,
//   Stepper,
//   Step,
//   StepLabel,
//   Chip,
//   CircularProgress,
//   Fade,
//   Zoom,
//   Snackbar,
//   Avatar,
//   Grid
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   ArrowBack,
//   LockOutlined,
//   DeleteOutline,
//   CheckCircleOutline,
//   SecurityOutlined,
//   AccountCircleOutlined,
//   ErrorOutline,
//   HelpOutline,
//   InfoOutlined
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";
// import { login } from "@/services/auth";
// import { TransitionProps } from "@mui/material/transitions";

// // Password strength meter component
// const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
//   const getStrength = (password: string): { value: number; label: string; color: string } => {
//     if (!password) return { value: 0, label: "None", color: "#e0e0e0" };

//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (password.match(/[A-Z]/)) strength += 1;
//     if (password.match(/[0-9]/)) strength += 1;
//     if (password.match(/[^A-Za-z0-9]/)) strength += 1;

//     const strengthMap = [
//       { value: 0, label: "None", color: "#e0e0e0" },
//       { value: 1, label: "Weak", color: "#f44336" },
//       { value: 2, label: "Fair", color: "#ff9800" },
//       { value: 3, label: "Good", color: "#2196f3" },
//       { value: 4, label: "Strong", color: "#4caf50" }
//     ];

//     return strengthMap[strength];
//   };

//   const strength = getStrength(password);

//   return (
//     <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//         <Typography variant="caption" sx={{ mr: 1 }}>Password Strength:</Typography>
//         <Chip
//           label={strength.label}
//           size="small"
//           sx={{
//             bgcolor: alpha(strength.color, 0.1),
//             color: strength.color,
//             fontWeight: 'medium',
//             minWidth: 60
//           }}
//         />
//       </Box>
//       <Box sx={{ display: 'flex', width: '100%', height: 4, borderRadius: 1, bgcolor: '#e0e0e0', overflow: 'hidden' }}>
//         <Box sx={{ width: `${(strength.value / 4) * 100}%`, bgcolor: strength.color, transition: 'width 0.3s ease' }} />
//       </Box>
//     </Box>
//   );
// };

// // Password requirements component
// const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
//   const requirements = [
//     { label: "At least 8 characters", met: password.length >= 8 },
//     { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
//     { label: "At least 1 number", met: /[0-9]/.test(password) },
//     { label: "At least 1 special character", met: /[^A-Za-z0-9]/.test(password) }
//   ];

//   return (
//     <Box sx={{ mt: 1, mb: 2 }}>
//       <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
//         Password requirements:
//       </Typography>
//       <Grid container spacing={1}>
//         {requirements.map((req, index) => (
//           <Grid item xs={12} sm={6} key={index}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Box sx={{
//                 color: req.met ? 'success.main' : 'text.disabled',
//                 mr: 1,
//                 display: 'flex'
//               }}>
//                 <CheckCircleOutline fontSize="small" />
//               </Box>
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: req.met ? 'text.primary' : 'text.secondary',
//                   transition: 'color 0.2s'
//                 }}
//               >
//                 {req.label}
//               </Typography>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// // Slide up transition for dialog
// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const Settings: React.FC = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Form data
//   const [passwordData, setPasswordData] = useState({
//     password: "",
//     confirmPassword: ""
//   });

//   // UI states
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [activeSection, setActiveSection] = useState<'password' | 'account'>('password');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

//   // Error states
//   const [passwordError, setPasswordError] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState("");

//   // Toggle password visibility
//   const handleTogglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleToggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   // Handle password form input changes
//   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear error when typing
//     if (name === "password") {
//       setPasswordError("");
//     } else if (name === "confirmPassword") {
//       setConfirmPasswordError("");
//     }
//   };

//   const handleSetSection = (section: 'password' | 'account') => {
//     setActiveSection(section);
//   };

//   // Validate password form
//   const validatePasswordForm = (): boolean => {
//     let isValid = true;

//     if (passwordData.password.length < 8) {
//       setPasswordError("Password must be at least 8 characters");
//       isValid = false;
//     }

//     if (passwordData.password !== passwordData.confirmPassword) {
//       setConfirmPasswordError("Passwords do not match");
//       isValid = false;
//     }

//     return isValid;
//   };

//   // Handle password update submission
//   const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validatePasswordForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append("password", passwordData.password);
//     formData.append("confirmPassword", passwordData.confirmPassword);

//     // Simulate API call with timeout
//     setTimeout(() => {
//       // Use your existing login function (consider renaming it to updatePassword in the future)
//       dispatch(login(formData))
//         .unwrap()
//         .then(() => {
//           // Success
//           setIsSubmitting(false);
//           setPasswordData({
//             password: "",
//             confirmPassword: ""
//           });
//           setSnackbarMessage("Password updated successfully!");
//           setSnackbarSeverity("success");
//           setShowSnackbar(true);
//         })
//         .catch((error) => {
//           // Error
//           setIsSubmitting(false);
//           setSnackbarMessage("Failed to update password. Please try again.");
//           setSnackbarSeverity("error");
//           setShowSnackbar(true);
//           console.error("Failed to update password:", error);
//         });
//     }, 1500); // Simulate network delay
//   };

//   // Handle delete account dialog
//   const handleOpenDeleteDialog = () => {
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleDeleteAccount = () => {
//     setOpenDeleteDialog(false);
//     setIsSubmitting(true);

//     // Simulate API call with timeout
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setSnackbarMessage("Account deleted successfully. Redirecting...");
//       setSnackbarSeverity("success");
//       setShowSnackbar(true);

//       // Redirect after a short delay
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     }, 2000);
//   };

//   const handleSnackbarClose = () => {
//     setShowSnackbar(false);
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Fade in={true} timeout={800}>
//         <Box>
//           <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>

//               <Typography variant="h4" component="h1" fontWeight="medium">
//                 Settings
//               </Typography>
//             </Box>
//             <Chip
//               avatar={<Avatar sx={{ bgcolor: 'transparent' }}><AccountCircleOutlined /></Avatar>}
//               label="John Doe"
//               variant="outlined"
//               sx={{
//                 borderRadius: 8,
//                 px: 1,
//                 borderColor: alpha(theme.palette.primary.main, 0.3),
//                 bgcolor: alpha(theme.palette.primary.main, 0.05)
//               }}
//             />
//           </Box>

//           {/* Settings Navigation */}
//           <Box sx={{ mb: 4 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Button
//                   fullWidth
//                   variant={activeSection === 'password' ? "contained" : "outlined"}
//                   onClick={() => handleSetSection('password')}
//                   startIcon={<SecurityOutlined />}
//                   sx={{
//                     py: 1.5,
//                     borderRadius: 1,
//                     textTransform: "none",
//                     boxShadow: activeSection === 'password' ? 4 : 0
//                   }}
//                 >
//                   Password Settings
//                 </Button>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Button
//                   fullWidth
//                   variant={activeSection === 'account' ? "contained" : "outlined"}
//                   onClick={() => handleSetSection('account')}
//                   startIcon={<AccountCircleOutlined />}
//                   sx={{
//                     py: 1.5,
//                     borderRadius: 1,
//                     textTransform: "none",
//                     boxShadow: activeSection === 'account' ? 4 : 0
//                   }}
//                 >
//                   Account Management
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Password Update Section */}
//           <Fade in={activeSection === 'password'} timeout={500}>
//             <Box sx={{ display: activeSection === 'password' ? 'block' : 'none' }}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 4,
//                   borderRadius: 1,
//                   bgcolor: alpha(theme.palette.background.paper, 0.8),
//                   backdropFilter: "blur(8px)",
//                   border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//                   transition: "all 0.3s ease"
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//                   <SecurityOutlined color="primary" sx={{ mr: 1.5 }} />
//                   <Typography variant="h5" component="h2">
//                     Change Password
//                   </Typography>
//                   <Tooltip title="Regularly updating your password helps keep your account secure">
//                     <IconButton size="small" sx={{ ml: 1 }}>
//                       <HelpOutline fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 <Box component="form" onSubmit={handleUpdatePassword} noValidate>
//                   <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
//                     <Box sx={{ width: "100%" }}>
//                       <TextField
//                         fullWidth
//                         margin="normal"
//                         id="password"
//                         name="password"
//                         label="New Password"
//                         type={showPassword ? "text" : "password"}
//                         value={passwordData.password}
//                         onChange={handlePasswordChange}
//                         error={!!passwordError}
//                         helperText={passwordError}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <LockOutlined color="action" />
//                             </InputAdornment>
//                           ),
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={handleTogglePasswordVisibility}
//                                 edge="end"
//                               >
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                       />

//                       {passwordData.password && (
//                         <Fade in={!!passwordData.password}>
//                           <Box>
//                             <PasswordStrengthMeter password={passwordData.password} />
//                             <PasswordRequirements password={passwordData.password} />
//                           </Box>
//                         </Fade>
//                       )}
//                     </Box>

//                     <TextField
//                       fullWidth
//                       margin="normal"
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       label="Confirm New Password"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={passwordData.confirmPassword}
//                       onChange={handlePasswordChange}
//                       error={!!confirmPasswordError}
//                       helperText={confirmPasswordError}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <LockOutlined color="action" />
//                           </InputAdornment>
//                         ),
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <IconButton
//                               aria-label="toggle confirm password visibility"
//                               onClick={handleToggleConfirmPasswordVisibility}
//                               edge="end"
//                             >
//                               {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   </Box>

//                   <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       size="large"
//                       disabled={isSubmitting}
//                       sx={{
//                         px: 3,
//                         py: 1.2,
//                         borderRadius: 1,
//                         textTransform: "none",
//                         minWidth: 180
//                       }}
//                     >
//                       {isSubmitting ? (
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
//                           Updating...
//                         </Box>
//                       ) : "Update Password"}
//                     </Button>
//                   </Box>
//                 </Box>
//               </Paper>
//             </Box>
//           </Fade>

//           {/* Account Management Section */}
//           <Fade in={activeSection === 'account'} timeout={500}>
//             <Box sx={{ display: activeSection === 'account' ? 'block' : 'none' }}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 4,
//                   borderRadius: 1,
//                   bgcolor: alpha(theme.palette.background.paper, 0.8),
//                   backdropFilter: "blur(8px)",
//                   border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//                   transition: "all 0.3s ease"
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//                   <AccountCircleOutlined color="primary" sx={{ mr: 1.5 }} />
//                   <Typography variant="h5" component="h2">
//                     Account Management
//                   </Typography>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 <Alert
//                   severity="warning"
//                   icon={<InfoOutlined />}
//                   sx={{
//                     mb: 3,
//                     alignItems: "center",
//                     borderRadius: 2
//                   }}
//                 >
//                   <Typography variant="body2">
//                     <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. All your data will be removed from our servers.
//                   </Typography>
//                 </Alert>

//                 <Box sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   justifyContent: "space-between",
//                   alignItems: { xs: "flex-start", sm: "center" },
//                   bgcolor: alpha(theme.palette.error.main, 0.05),
//                   border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
//                   borderRadius: 1,
//                   p: 2
//                 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 0 } }}>
//                     <DeleteOutline color="error" sx={{ mr: 1.5 }} />
//                     <Box>
//                       <Typography variant="body1" fontWeight="medium">
//                         Delete Your Account
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         All your account data will be permanently erased
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={handleOpenDeleteDialog}
//                     sx={{
//                       px: 3,
//                       py: 1,
//                       borderRadius: 1,
//                       textTransform: "none",
//                       borderWidth: 2,
//                       '&:hover': {
//                         borderWidth: 2
//                       }
//                     }}
//                   >
//                     Delete Account
//                   </Button>
//                 </Box>
//               </Paper>
//             </Box>
//           </Fade>

//           {/* Delete Account Confirmation Dialog */}
//           <Dialog
//             open={openDeleteDialog}
//             TransitionComponent={Transition}
//             keepMounted
//             onClose={handleCloseDeleteDialog}
//             aria-describedby="delete-account-dialog-description"
//             PaperProps={{
//               sx: {
//                 borderRadius: 1,
//                 overflow: 'hidden'
//               }
//             }}
//           >
//             <Box sx={{ borderBottom: `4px solid ${theme.palette.error.main}` }} />
//             <DialogTitle sx={{ pt: 3, pb: 1 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <ErrorOutline color="error" sx={{ mr: 1.5 }} />
//                 <Typography variant="h6">Delete your account?</Typography>
//               </Box>
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="delete-account-dialog-description">
//                 This action <strong>cannot be undone</strong>. All your personal data, preferences, and history will be permanently removed from our servers.
//               </DialogContentText>

//               <Box sx={{ mt: 2, mb: 1, p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 1 }}>
//                 <Typography variant="body2" color="error.main">
//                   To confirm, type "DELETE" in the field below:
//                 </Typography>
//                 <TextField
//                   margin="dense"
//                   fullWidth
//                   size="small"
//                   placeholder="DELETE"
//                   sx={{ mt: 1 }}
//                 />
//               </Box>
//             </DialogContent>
//             <DialogActions sx={{ px: 3, pb: 3 }}>
//               <Button
//                 onClick={handleCloseDeleteDialog}
//                 variant="outlined"
//                 sx={{ textTransform: "none", borderRadius: 2 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleDeleteAccount}
//                 color="error"
//                 variant="contained"
//                 disabled={isSubmitting}
//                 sx={{ textTransform: "none", borderRadius: 2 }}
//               >
//                 {isSubmitting ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
//                     Deleting...
//                   </Box>
//                 ) : "Delete Account"}
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Success/Error Snackbar */}
//           <Snackbar
//             open={showSnackbar}
//             autoHideDuration={5000}
//             onClose={handleSnackbarClose}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//           >
//             <Alert
//               onClose={handleSnackbarClose}
//               severity={snackbarSeverity}
//               variant="filled"
//               sx={{ width: '100%', borderRadius: 2 }}
//             >
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default Settings;
