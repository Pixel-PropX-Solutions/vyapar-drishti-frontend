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
  Autocomplete,
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
import CountryCodes from '../../../internals/data/CountryCodes.json';


const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  // const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [data, setData] = useState({
    first: "",
    last: "",
    email: '',
    code: '',
    number: '',
  });

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function changeCountryCode(
    field: string,
    value: string) {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  // const validateForm = (): boolean => {
  //   const errors: { [key: string]: string } = {};

  //   if (!data.first.trim()) {
  //     errors.first = 'First name is required';
  //   } else if (data.first.length < 2) {
  //     errors.first = 'First name must be at least 2 characters';
  //   }

  //   if (!data.email.trim()) {
  //     errors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(data.email)) {
  //     errors.email = 'Email is invalid';
  //   }

  //   if (!data.code.trim()) {
  //     errors.code = 'Country code is required';
  //   }

  //   if (!data.number.trim()) {
  //     errors.number = 'Phone number is required';
  //   }

  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!validateForm()) {
    //   toast.error('Please fix the form errors before submitting');
    //   return;
    // }

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
              <Box sx={{ width: "20%" }}>
                <Autocomplete
                  fullWidth
                  options={[
                    ...(CountryCodes?.map(con => ({
                      label: `${con.dial_code} (${con.code})`,
                      value: con.dial_code,
                    })) ?? []),
                  ]}
                  freeSolo
                  renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    return (
                      <li
                        key={key}
                        {...rest}
                        style={{
                          fontWeight: 400,
                          color: 'inherit',
                          ...(props.style || {}),
                        }}
                      >
                        {option.label}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      id="code"
                      label="Code"
                      name="code"
                      placeholder="+91 "
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                          </InputAdornment>
                        ),
                      }}
                      margin="normal"
                      autoComplete="off"
                    />
                  )}
                  value={data.code || ''}
                  onChange={(_, newValue) => {
                    changeCountryCode(
                      'code',
                      typeof newValue === 'string' ? newValue : newValue?.value || ''
                    );
                  }}
                  componentsProps={{
                    paper: {
                      sx: {
                        border: '1px solid #000',
                        borderRadius: 1,
                        width: '150px'
                      },
                    },
                  }}
                  sx={{
                    '& .MuiAutocomplete-endAdornment': { display: 'none' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      width: "100%"
                    }
                  }}
                />
              </Box>

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
