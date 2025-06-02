// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   Paper,
//   Typography,
//   Stepper,
//   Step,
//   StepLabel,
//   InputAdornment,
//   Divider,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Person,
//   Store,
//   LocationOn,
//   Phone,
//   ArrowBack,
//   Check,
//   Badge,
// } from "@mui/icons-material";
// import { useDispatch} from "react-redux";
// import { AppDispatch } from "@/store/store";
// import { createChemist } from "@/services/customers";
// import { useParams, useNavigate } from "react-router-dom";
// import { setId } from "@/store/reducers/userReducer";
// import toast from "react-hot-toast";

// interface ChemistData {
//   first_name: string;
//   middle_name: string;
//   last_name: string;
//   country_code: string;
//   phone_number: string;
//   shop_name: string;
//   licence_number: string;
//   street_address: string;
//   street_address_line_2: string;
//   city: string;
//   state: string;
//   zip_code: string;
//   userId: string | undefined;
// }

// export default function CreateChemistProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const [loading, setLoading] = useState(false);
//   const [formErrors, setFormErrors] = useState({
//     first_name: "",
//     phone_number: "",
//     shop_name: "",
//     licence_number: "",
//   });

//   const [data, setData] = useState<ChemistData>({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     country_code: "+91",
//     phone_number: "",
//     shop_name: "",
//     licence_number: "",
//     street_address: "",
//     street_address_line_2: "",
//     city: "",
//     state: "",
//     zip_code: "",
//     userId: id,
//   });

//   useEffect(() => {
//     if (!id) {
//       toast.error("User ID not found. Please create a user first.");
//       navigate("/create/user");
//     }
//   }, [id, navigate]);

//   const validateForm = () => {
//     let isValid = true;
//     const errors = {
//       first_name: "",
//       phone_number: "",
//       shop_name: "",
//       licence_number: "",
//     };

//     if (!data.first_name.trim()) {
//       errors.first_name = "First name is required";
//       isValid = false;
//     }

//     if (!data.phone_number.trim()) {
//       errors.phone_number = "Phone number is required";
//       isValid = false;
//     } else if (!/^\d{10}$/.test(data.phone_number)) {
//       errors.phone_number = "Please enter a valid 10-digit phone number";
//       isValid = false;
//     }

//     if (!data.shop_name.trim()) {
//       errors.shop_name = "Shop name is required";
//       isValid = false;
//     }

//     if (!data.licence_number.trim()) {
//       errors.licence_number = "Licence number is required";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     if (name in formErrors) {
//       setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     }

//     setData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fill in all required fields correctly");
//       return;
//     }

//     setLoading(true);

//     const chemistData = {
//       data: {
//         _id: "",
//         email: "",
//         role: "",
//         ChemistData: {
//           name: {
//             first_name: data.first_name,
//             middle_name: data.middle_name,
//             last_name: data.last_name,
//           },
//           shop_name: data.shop_name,
//           licence_number: data.licence_number,
//           address: {
//             street_address: data.street_address,
//             street_address_line_2: data.street_address_line_2,
//             city: data.city,
//             state: data.state,
//             zip_code: data.zip_code,
//           },
//           phone_number: {
//             country_code: data.country_code,
//             phone_number: data.phone_number,
//           },
//         },
//       },
//       id: data.userId || "",
//     };

//     dispatch(setId());

//     // toast.promise(
//     //   dispatch(createChemist(chemistData))
//     //     .unwrap()
//     //     .then(() => {
//     //       setTimeout(() => navigate("/chemists"), 1500);
//     //     })
//     //     .finally(() => setLoading(false)),
//     //   {
//     //     loading: "Creating Chemist profile...",
//     //     success: <b>Chemist profile created successfully!</b>,
//     //     error: <b>Could not create profile. Please try again.</b>,
//     //   }
//     // );
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, my: 5, borderRadius: 2 }}>
//       <Box sx={{ width: "100%", maxWidth: "1000px", mx: "auto" }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
//             Create Chemist Profile
//           </Typography>
//         </Box>

//         <Stepper activeStep={1} sx={{ mb: 4 }}>
//           <Step completed={true}>
//             <StepLabel>Basic Information</StepLabel>
//           </Step>
//           <Step completed={false}>
//             <StepLabel>Profile Details</StepLabel>
//           </Step>
//         </Stepper>

//         <form onSubmit={handleSubmit}>
//           <Box sx={{ mb: 4 }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{ display: "flex", alignItems: "center", mb: 2 }}
//             >
//               <Person sx={{ mr: 1 }} /> Personal Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="first_name"
//                   label="First Name"
//                   value={data.first_name}
//                   onChange={handleInputChange}
//                   error={!!formErrors.first_name}
//                   helperText={formErrors.first_name}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   name="middle_name"
//                   label="Middle Name"
//                   value={data.middle_name}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   name="last_name"
//                   label="Last Name"
//                   value={data.last_name}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Divider sx={{ my: 3 }} />

//           <Box sx={{ mb: 4 }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{ display: "flex", alignItems: "center", mb: 2 }}
//             >
//               <Badge sx={{ mr: 1 }} /> Licence Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="licence_number"
//                   label="Licence Number"
//                   value={data.licence_number}
//                   onChange={handleInputChange}
//                   error={!!formErrors.licence_number}
//                   helperText={formErrors.licence_number}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Divider sx={{ my: 3 }} />

//           <Box sx={{ mb: 4 }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{ display: "flex", alignItems: "center", mb: 2 }}
//             >
//               <Store sx={{ mr: 1 }} /> Shop Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="shop_name"
//                   label="Shop Name"
//                   value={data.shop_name}
//                   onChange={handleInputChange}
//                   error={!!formErrors.shop_name}
//                   helperText={formErrors.shop_name}
//                 />
//               </Grid>
//             </Grid>
//           </Box>

//           <Divider sx={{ my: 3 }} />

//           <Box sx={{ mb: 4 }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{ display: "flex", alignItems: "center", mb: 2 }}
//             >
//               <LocationOn sx={{ mr: 1 }} /> Address Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="street_address"
//                   label="Street Address"
//                   value={data.street_address}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   name="street_address_line_2"
//                   label="Street Address Line 2"
//                   value={data.street_address_line_2}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   name="city"
//                   label="City"
//                   value={data.city}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   name="state"
//                   label="State"
//                   value={data.state}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   name="zip_code"
//                   label="Zip Code"
//                   value={data.zip_code}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//             </Grid>
//           </Box>

//           <Divider sx={{ my: 3 }} />

//           <Box sx={{ mb: 4 }}>
//             <Typography
//               variant="h6"
//               color="primary"
//               sx={{ display: "flex", alignItems: "center", mb: 2 }}
//             >
//               <Phone sx={{ mr: 1 }} /> Contact Information
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   fullWidth
//                   name="country_code"
//                   label="Country Code"
//                   disabled
//                   value={data.country_code}
//                   onChange={handleInputChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Phone fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={9}>
//                 <TextField
//                   fullWidth
//                   required
//                   name="phone_number"
//                   label="Phone Number"
//                   value={data.phone_number}
//                   onChange={handleInputChange}
//                   error={!!formErrors.phone_number}
//                   helperText={formErrors.phone_number}
//                   placeholder="10-digit number"
//                 />
//               </Grid>
//             </Grid>
//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//             <Button
//               variant="outlined"
//               onClick={() => navigate("/create/user")}
//               startIcon={<ArrowBack />}
//             >
//               Back
//             </Button>

//             <Button
//               variant="contained"
//               size="large"
//               type="submit"
//               disabled={loading}
//               startIcon={
//                 loading ? (
//                   <CircularProgress size={20} color="inherit" />
//                 ) : (
//                   <Check />
//                 )
//               }
//               sx={{ px: 4, py: 1.2, fontWeight: 600 }}
//             >
//               {loading ? "Creating Profile..." : "Submit Profile"}
//             </Button>
//           </Box>

//           <Alert severity="info" sx={{ mt: 4 }}>
//             All fields marked with * are required. After submission, you'll be
//             redirected to the users list.
//           </Alert>
//         </form>
//       </Box>
//     </Paper>
//   );
// }
