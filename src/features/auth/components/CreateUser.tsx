import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Email,
  // Lock, Visibility, VisibilityOff
} from "@mui/icons-material";
import Logo from "../../../assets/Logo.png";
import logoText from "../../../assets/Logo_Text.png";

const CreateUserForm = (): JSX.Element => {
  //   const navigate = useNavigate();
  //   const [showPassword, setShowPassword] = React.useState(false);
  //   const handleTogglePasswordVisibility = () => {
  //     setShowPassword(!showPassword);
  //   };

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
        color: "#00405C",
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
              style={{ marginBottom: "20px", height: "50px" }}
            />
          </Box>

          <Typography component="h1" color="#000" variant="h5">
            Sign Up for Account
          </Typography>
          <Typography variant="body2" color="#000" sx={{ marginBottom: 3 }}>
            Your journey to financial protection begins here.
          </Typography>

          {/* Form */}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              required
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
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
            <Select
              required
              margin="none"
              fullWidth
              id="role"
              label="User Role"
              name="role"
              autoComplete="role"
              autoFocus
              defaultValue=""
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Stockist">Stockist</MenuItem>
              <MenuItem value="Chemist">Chemist</MenuItem>
            </Select>

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
                backgroundColor: "#006E89",
                "&:hover": {
                  backgroundColor: "#00405C",
                  color: "#25D9DA",
                },
              }}
            >
              Create User
            </Button>
          </Box>
        </Box>
      </Container>
    </Grid>
  );
};

export default CreateUserForm;
