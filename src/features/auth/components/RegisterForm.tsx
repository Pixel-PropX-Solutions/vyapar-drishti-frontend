import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { getCurrentUser, register } from "@/services/auth";
import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompany } from "@/services/company";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  // const [showPassword, setShowPassword] = React.useState(false);
  const [data, setData] = useState({
    first: "",
    last: "",
    email: '',
    code: '',
    number: '',
  });

  // const handleTogglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Form submitted with data:", data);
    const userData = {
      name: {
        first: data.first,
        last: data.last,
      },
      email: data.email,
      phone: {
        code: data.code,
        number: data.number
      }
    }

    toast.promise(
      dispatch(register(userData))
        .unwrap()
        .then(() => {
          dispatch(getCurrentUser());
          dispatch(getCompany());
          navigate("/");
        }),
      {
        loading: "Creating account and logging in with the credentials ...",
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
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

          <Typography component="h1" variant="h5">
            Sign Up for Account
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 3 }}>
            Your journey to financial protection begins here.
          </Typography>

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                margin="normal"
                fullWidth
                id="first"
                label="First Name"
                name="first"
                autoComplete="first"
                autoFocus
                placeholder="Tohid"
                onChange={changeHandler}
                value={data.first}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                margin="normal"
                fullWidth
                id="last"
                label="Last Name"
                name="last"
                autoComplete="last"
                autoFocus
                onChange={changeHandler}
                value={data.last}
                placeholder="Khan"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              required
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={changeHandler}
              value={data.email}
              autoFocus
              placeholder="johndoe@gmail.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                margin="normal"
                sx={{ width: "20%" }}
                fullWidth
                id="code"
                label="Code"
                name="code"
                autoComplete="code"
                autoFocus
                onChange={changeHandler}
                value={data.code}
                placeholder="+91 "
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                margin="normal"
                fullWidth
                sx={{ width: "80%" }}
                id="number"
                label="Phone Number"
                name="number"
                autoComplete="number"
                onChange={changeHandler}
                value={data.number}
                autoFocus
                placeholder="******7548"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
            </Box>
            {/* <TextField
              required
              margin="normal"
              fullWidth
              id="company_name"
              label="Company Name"
              name="company_name"
              onChange={changeHandler}
              value={data.company_name}
              autoComplete="company_name"
              placeholder="Quality Auto Parts"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <TextField
              required
              margin="normal"
              fullWidth
              id="brand_name"
              label="Brand Name"
              name="brand_name"
              autoComplete="brand_name"
              onChange={changeHandler}
              value={data.brand_name}
              placeholder="Quality Auto Parts"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            /> */}

            {/* <TextField
              required
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="password"
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
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Create Account
            </Button>
            <Box >
              <Typography variant="body2">
                Already have an account?{" "}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{fontSize:'1rem', color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  Sign In
                </Button>
              </Typography>
              <Typography variant="body2">
                By signing up, you agree to our {" "}
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

export default RegistrationForm;
