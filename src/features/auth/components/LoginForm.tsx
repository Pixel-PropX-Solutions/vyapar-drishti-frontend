import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { getCurrentUser, login } from "@/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { AuthStates } from "@/utils/enums";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCompany } from "@/services/company";
// import { getCompany } from "@/services/user";

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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Form submitted with data:", data);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("user_type", data.user_type);
    toast.promise(
      dispatch(login(formData))
        .unwrap()
        .then(() => {
          dispatch(getCurrentUser());
          dispatch(getCompany());

          navigate("/");
        }),
      {
        loading: "Login with the credentials ...",
        success: <b>Login Successfully!</b>,
        error: <b>Could not Login.</b>,
      }
    );
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
            Log in to your {pathName === '/admin' ? 'Admin' : 'User'} Account
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 3 }}>
            Empower your business with advanced document handling and insightful
            billing analysis.
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >

            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              color="primary"
              placeholder="johndoe@gmail.com"
              onChange={changeHandler}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              onChange={changeHandler}
              margin="normal"
              fullWidth
              name="password"
              variant="outlined"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              autoComplete="current-password"
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              {authState === AuthStates.INITIALIZING ? "Loading..." : "Log in"}
            </Button>
            <Box >
              <Typography variant="body2">
                Don't have account Yet?{" "}
                <Button
                  onClick={() => navigate("/signup")}
                  sx={{ fontSize: '1rem', color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  Sign Up
                </Button>
              </Typography>
              <Typography variant="body2">
                By signing in, you agree to our {" "}
                <a
                  onClick={() => navigate("/terms")}
                  style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  Terms of Service {" "}
                </a>
                and {" "}
                <a
                  onClick={() => navigate("/privacy")}
                  style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}

                >
                  Privacy Policy
                </a>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  );
};

export default LoginForm;
