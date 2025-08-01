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
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";
import { getCurrentUser, register } from "@/services/auth";
import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompany } from "@/services/company";
import PhoneNumber from "@/common/PhoneNumber";


const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = React.useState(false);


  const [data, setData] = useState({
    first: "",
    last: "",
    email: '',
    code: '',
    number: '',
    password: "",
  });

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function changeCountryCode(
    field: string,
    value: string) {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!data.first.trim()) {
      errors.first = 'First name is required';
    } else if (data.first.length < 2) {
      errors.first = 'First name must be at least 2 characters';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!data.code.trim()) {
      errors.code = 'Country code is required';
    }

    if (!data.number.trim()) {
      errors.number = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

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

    toast.promise(
      dispatch(register(userData))
        .unwrap()
        .then(() => {
          // dispatch(getCurrentUser());
          // dispatch(getCompany());
          navigate("/login");
        }),
      {
        loading: "Creating account with the credentials ...",
        success: <b>Account Created Successfully!</b>,
        error: <b>Could not create account.</b>,
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
            <PhoneNumber
              code={data.code}
              number={data.number}
              codeWidth="30%"
              codeHandler={changeCountryCode}
              numberHandler={changeHandler}
              codeLabel="Code"
              required={true}
              codePlaceholder="+91"
              numberLabel="Phone Number"
              numberPlaceholder="******7548"
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
              helperText={"Enter your password"}
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
                  sx={{ fontSize: '1rem', color: theme.palette.primary.main, textDecoration: 'underline' }}
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
