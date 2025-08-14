// // CreateUserProfile.tsx
// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   MenuItem,
//   InputAdornment,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { Email, AccountCircle } from "@mui/icons-material";
// import { AppDispatch } from "@/store/store";
// import { useDispatch } from "react-redux";
// import { createUser } from "@/services/user";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// interface ProfileFormData {
//   email: string;
//   role: string;
// }

// export default function CreateUserProfile() {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [userProfile, setUserProfile] = useState<ProfileFormData>({
//     email: "",
//     role: "",
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//   });

//   const validateEmail = (email: string) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserProfile((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));

//     // Clear error when user types
//     if (name === "email") {
//       setErrors((prev) => ({ ...prev, email: "" }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate email
//     if (!validateEmail(userProfile.email)) {
//       setErrors((prev) => ({
//         ...prev,
//         email: "Please enter a valid email address",
//       }));
//       return;
//     }

//     // Validate role
//     if (!userProfile.role) {
//       toast.error("Please select a user role");
//       return;
//     }

//     setLoading(true);
//     dispatch(createUser(userProfile))
//       .unwrap()
//       .then((result) => {
//         toast.success("User created successfully! Redirecting to profile setup...");
//         navigate(
//           `/create/user/${userProfile.role.toLowerCase()}/${result.id}`
//         );
//       }).catch((error) => {
//         toast.error(error || "An unexpected error occurred. Please try again later.");
//       })
//       .finally(() => setLoading(false));
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, mb: 4, mt: 5, borderRadius: 2 }}>
//       <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto" }}>
//         <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
//           Create New User
//         </Typography>

//         <Stepper activeStep={0} sx={{ mb: 4 }}>
//           <Step completed={false}>
//             <StepLabel>Basic Information</StepLabel>
//           </Step>
//           <Step>
//             <StepLabel>Profile Details</StepLabel>
//           </Step>
//         </Stepper>

//         <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//           Enter the user's email address and select their role to get started.
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{ display: "flex", flexDirection: "column", gap: 3 }}
//         >
//           <TextField
//             required
//             fullWidth
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             value={userProfile.email}
//             onChange={handleInputChange}
//             placeholder="johndoe@gmail.com"
//             error={!!errors.email}
//             helperText={errors.email}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Email color="primary" />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <TextField
//             required
//             fullWidth
//             select
//             onChange={handleInputChange}
//             name="role"
//             id="role"
//             label="User Role"
//             value={userProfile.role}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <AccountCircle color="primary" />
//                 </InputAdornment>
//               ),
//             }}
//           >
//             <MenuItem value="Stockist">Stockist</MenuItem>
//             <MenuItem value="Chemist">Chemist</MenuItem>
//           </TextField>

//           <Button
//             type="submit"
//             variant="contained"
//             size="large"
//             disabled={loading}
//             sx={{
//               mt: 2,
//               py: 1.2,
//               fontWeight: 600,
//             }}
//             startIcon={
//               loading ? <CircularProgress size={20} color="inherit" /> : null
//             }
//           >
//             {loading ? "Creating User..." : "Continue to Profile Setup"}
//           </Button>

//           <Alert severity="info" sx={{ mt: 2 }}>
//             After creating the user, you'll be directed to set up their profile
//             details.
//           </Alert>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }
