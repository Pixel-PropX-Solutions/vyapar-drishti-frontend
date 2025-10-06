// import React, { useCallback, useState } from "react";
// import {
//     Box,
//     Button,
//     Checkbox,
//     Container,
//     CssBaseline,
//     FormControlLabel,
//     TextField,
//     Typography,
//     Grid,
//     InputAdornment,
//     useTheme,
// } from "@mui/material";
// import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
// import Logo from "../../../assets/Logo.webp";
// import logoText from "../../../assets/Logo_Text.webp";
// import { getCurrentUser, login, register } from "@/services/auth";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { AuthStates } from "@/utils/enums";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getCompany } from "@/services/company";

// const VerifyOTPForm: React.FC = () => {
//     const { phoneNumber } = useParams();
//     const dispatch = useDispatch<AppDispatch>();
//     const theme = useTheme();
//     const { authState, signupData } = useSelector((state: RootState) => state.auth);
//     const pathName = window.location.pathname;
//     const [data, setData] = useState({
//         username: phoneNumber || "",
//         password: "",
//         user_type: pathName === '/admin' ? 'admin' : 'user',
//     });
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = React.useState(false);

//     const handleTogglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
//         setData((prevData) => ({
//             ...prevData,
//             [event.target.name]: event.target.value,
//         }));
//     }

//     const validateForm = useCallback(() => {
//         const errors: Record<string, string> = {};
//         if (!data.username.trim()) errors.username = 'Username is required';
//         if (!data.password.trim()) errors.password = 'Password is required';
//         return errors;
//     }, [data]);

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const errors = validateForm();
//         if (Object.keys(errors).length > 0) {
//             // Handle validation errors
//             return;
//         }

//         const formData = new FormData();
//         formData.append("username", data.username);
//         formData.append("password", data.password);
//         formData.append("user_type", data.user_type);



//         dispatch(register(signupData))
//             .unwrap()
//             .then((response) => {
//                 console.log("Response Login Form", response)
//                 // if(response)
//                 dispatch(getCurrentUser());
//                 dispatch(getCompany());
//                 navigate("/");
//             }).catch((error) => {
//                 console.error("Login error:", error);
//                 toast.error(error || "An unexpected error occurred. Please try again later.");
//             });

//     };

//     return (
//         <Grid
//             item
//             lg={8}
//             md={6}
//             sx={{
//                 display: "flex",
//                 width: "100%",
//                 flexDirection: "column",
//                 padding: 4,
//             }}
//         >
//             <Container component="main">
//                 <CssBaseline />
//                 <Box
//                     sx={{
//                         display: "flex",
//                         width: "100%",
//                         flexDirection: "column",
//                         alignItems: "start",
//                     }}
//                 >
//                     {/* Logo */}
//                     <Box
//                         sx={{
//                             display: "flex",
//                             width: "100%",
//                             height: "50px",
//                             gap: "10px",
//                             flexDirection: "row",
//                             alignItems: "center",
//                             justifyContent: "start",
//                         }}
//                     >
//                         <img
//                             src={Logo}
//                             alt="Logo"
//                             style={{
//                                 marginBottom: "20px",
//                                 height: "50px",
//                                 borderRadius: "50%",
//                             }}
//                         />
//                         <img
//                             src={logoText}
//                             alt="Logo Text"
//                             style={{ marginBottom: "10px", height: "40px" }}
//                         />
//                     </Box>

//                     {/* Title */}
//                     <Typography component="h1" variant="h5">
//                         Log in to your {pathName === '/admin' ? 'Admin' : 'User'} Account
//                     </Typography>
//                     <Typography variant="body2" sx={{ marginBottom: 3 }}>
//                         Empower your business with advanced document handling and insightful
//                         billing analysis.
//                     </Typography>

//                     {/* Form */}
//                     <Box
//                         component="form"
//                         onSubmit={handleSubmit}
//                         sx={{ mt: 1, width: "100%" }}
//                     >

//                         <TextField
//                             label="User Name"
//                             variant="outlined"
//                             fullWidth
//                             required
//                             value={data.username}
//                             onChange={changeHandler}
//                             helperText={"Enter your email or username"}
//                             margin="normal"
//                             id="username"
//                             name="username"
//                             autoComplete="username"
//                             autoFocus
//                             placeholder="johndoe@gmail.com"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Person />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: 1,
//                                 }
//                             }}
//                         />

//                         <TextField
//                             onChange={changeHandler}
//                             margin="normal"
//                             fullWidth
//                             required
//                             name="password"
//                             variant="outlined"
//                             value={data.password}
//                             label="OTP"
//                             type={showPassword ? "text" : "password"}
//                             id="password"
//                             placeholder="OTP"
//                             autoComplete="current-password"
//                             helperText={"Enter your OTP"}
//                             sx={{
//                                 '& .MuiOutlinedInput-root': {
//                                     borderRadius: 1,
//                                 }
//                             }}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Lock />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         {showPassword ? (
//                                             <VisibilityOff
//                                                 onClick={handleTogglePasswordVisibility}
//                                                 style={{ cursor: "pointer" }}
//                                             />
//                                         ) : (
//                                             <Visibility
//                                                 onClick={handleTogglePasswordVisibility}
//                                                 style={{ cursor: "pointer" }}
//                                             />
//                                         )}
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 justifyContent: "space-between",
//                             }}
//                         >
//                             <FormControlLabel
//                                 sx={{
//                                     "&:hover": {
//                                         textDecoration: "underline",
//                                     },
//                                 }}
//                                 control={<Checkbox value="remember" color="primary" />}
//                                 label="Remember me"
//                             />
//                         </Box>
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             sx={{
//                                 mt: 3,
//                                 mb: 2,
//                             }}
//                         >
//                             {authState === AuthStates.INITIALIZING ? "Loading..." : "Log in"}
//                         </Button>
//                         <Box >
//                             <Typography variant="body2">
//                                 Don't have account Yet?{" "}
//                                 <Button
//                                     onClick={() => navigate("/signup")}
//                                     sx={{ fontSize: '1rem', color: theme.palette.primary.main, textDecoration: 'underline' }}
//                                 >
//                                     Sign Up
//                                 </Button>
//                             </Typography>
//                             <Typography variant="body2">
//                                 By signing in, you agree to our {" "}
//                                 <a
//                                     onClick={() => navigate("/terms")}
//                                     style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
//                                 >
//                                     Terms of Service {" "}
//                                 </a>
//                                 and {" "}
//                                 <a
//                                     onClick={() => navigate("/privacy")}
//                                     style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}

//                                 >
//                                     Privacy Policy
//                                 </a>
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Container>
//         </Grid>
//     );
// };

// export default VerifyOTPForm;
