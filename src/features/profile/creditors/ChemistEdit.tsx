// import React, { useState, useEffect, useCallback } from "react";
// import {
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Grid,
//   TextField,
//   MenuItem,
//   Divider,
//   useTheme,
// } from "@mui/material";
// import { Save as SaveIcon } from "@mui/icons-material";
// import { Chemist } from "@/utils/types";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";
// import toast from "react-hot-toast";
// import { updateChemist } from "@/services/creditors";

// interface ChemistEditProps {
//   chemist: Chemist;
//   onClose: () => void;
// }

// const ChemistEdit: React.FC<ChemistEditProps> = ({
//   chemist,
//   onClose,
// }) => {
//   const theme = useTheme();
//   const [formData, setFormData] = useState<Chemist>({} as Chemist);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const dispatch = useDispatch<AppDispatch>();

//   // Initialize form data when chemist prop changes
//   useEffect(() => {
//     if (chemist) {
//       setFormData({ ...chemist });
//     }
//   }, [chemist]);

//   // Handle form input changes
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
//   ) => {
//     const { name, value } = e.target;

//     if (!name) return;

//     // Handle nested properties
//     if (name.includes(".")) {
//       const [parent, child, subChild] = name.split(".");

//       if (subChild) {
//         setFormData((prev) => ({
//           ...prev,
//           [parent]: {
//             ...(prev[parent as keyof Chemist] as Record<string, any>),
//             [child]: {
//               ...(prev[parent as keyof Chemist] as Record<string, any>)[child],
//               [subChild]: value,
//             },
//           },
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [parent]: {
//             ...(prev[parent as keyof Chemist] as Record<string, any>),
//             [child]: value,
//           },
//         }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     // Clear error when field is updated
//     if (errors[name]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Validate form before submission
//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.email || !formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (
//       !formData.ChemistData.name.first_name ||
//       !formData.ChemistData.name.first_name.trim()
//     ) {
//       newErrors["ChemistData.name.first_name"] = "First name is required";
//     }

//     if (
//       !formData.ChemistData.name.last_name ||
//       !formData.ChemistData.name.last_name.trim()
//     ) {
//       newErrors["ChemistData.name.last_name"] = "Last name is required";
//     }

//     if (
//       // !formData.ChemistData.phone_number.phone_number ||
//       '!formData.ChemistData.phone_number.phone_number'.trim()
//     ) {
//       newErrors["ChemistData.phone_number.phone_number"] =
//         "Phone number is required";
//     }

//     if (
//       !formData.ChemistData.shop_name ||
//       !formData.ChemistData.shop_name.trim()
//     ) {
//       newErrors["ChemistData.shop_name"] = "Shop name is required";
//     }

//     if (
//       !formData.ChemistData.licence_number ||
//       !formData.ChemistData.licence_number.trim()
//     ) {
//       newErrors["ChemistData.licence_number"] = "License number is required";
//     }

//     if (
//       !formData.ChemistData.address.street_address ||
//       !formData.ChemistData.address.street_address.trim()
//     ) {
//       newErrors["ChemistData.address.street_address"] =
//         "Street address is required";
//     }

//     if (
//       !formData.ChemistData.address.city ||
//       !formData.ChemistData.address.city.trim()
//     ) {
//       newErrors["ChemistData.address.city"] = "City is required";
//     }

//     if (
//       !formData.ChemistData.address.state ||
//       !formData.ChemistData.address.state.trim()
//     ) {
//       newErrors["ChemistData.address.state"] = "State is required";
//     }

//     if (
//       !formData.ChemistData.address.zip_code ||
//       !formData.ChemistData.address.zip_code.trim()
//     ) {
//       newErrors["ChemistData.address.zip_code"] = "ZIP code is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       handleSaveChemist(formData);
//     }
//   };

//   const handleSaveChemist = useCallback(
//     (updatedChemist: Chemist) => {
//       toast
//         .promise(
//           dispatch(
//             updateChemist({ data: updatedChemist, id: updatedChemist._id })
//           ),
//           {
//             loading: "Updating Chemist data ...",
//             success: <b>Chemist Updated!</b>,
//             error: <b>Could not update.</b>,
//           }
//         )
//         .then(() => {
//           onClose();
//         });
//     },
//     [dispatch, onClose]
//   );

//   // Handle cancel
//   const handleCancel = () => {
//     setErrors({});
//     onClose();
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           bgcolor: theme.palette.primary.main,
//           color: "white",
//           padding: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           borderRadius: 1,
//           boxShadow: 1,
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold">Edit Chemist Details</Typography>
//       </Box>

//       <Box sx={{ p: 3 }}>
//         <Grid container spacing={3}>
//           {/* Personal Information */}
//           <Grid item xs={12} md={6}>
//             <Typography
//               variant="h6"
//               gutterBottom
//               color={theme.palette.primary.main}
//             >
//               Personal Information
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="First Name"
//                   name="ChemistData.name.first_name"
//                   value={formData.ChemistData?.name?.first_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.name.first_name"]}
//                   helperText={errors["ChemistData.name.first_name"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Middle Name"
//                   name="ChemistData.name.middle_name"
//                   value={formData.ChemistData?.name?.middle_name || ""}
//                   onChange={handleChange}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Last Name"
//                   name="ChemistData.name.last_name"
//                   value={formData.ChemistData?.name?.last_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.name.last_name"]}
//                   helperText={errors["ChemistData.name.last_name"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   name="email"
//                   type="email"
//                   value={formData.email || ""}
//                   onChange={handleChange}
//                   error={!!errors.email}
//                   helperText={errors.email}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Country Code"
//                   name="ChemistData.phone_number.country_code"
//                   value={ ""}
//                   onChange={handleChange}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={8}>
//                 <TextField
//                   fullWidth
//                   label="Phone Number"
//                   name="ChemistData.phone_number.phone_number"
//                   value={ ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.phone_number.phone_number"]}
//                   helperText={errors["ChemistData.phone_number.phone_number"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   disabled
//                   margin="normal"
//                   size="small"
//                   select
//                   name="role"
//                   id="role"
//                   label="Role"
//                   value={chemist.role}
//                 >
//                   <MenuItem value="Stockist">Stockist</MenuItem>
//                   <MenuItem value="Chemist">Chemist</MenuItem>
//                 </TextField>
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* Pharmacy Information */}
//           <Grid item xs={12} md={6}>
//             <Typography
//               variant="h6"
//               gutterBottom
//               color={theme.palette.primary.main}
//             >
//               Pharmacy Information
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Shop Name"
//                   name="ChemistData.shop_name"
//                   value={formData.ChemistData?.shop_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.shop_name"]}
//                   helperText={errors["ChemistData.shop_name"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="License Number"
//                   name="ChemistData.licence_number"
//                   value={formData.ChemistData?.licence_number || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.licence_number"]}
//                   helperText={errors["ChemistData.licence_number"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Divider sx={{ mt: 1, mb: 2 }} />
//                 <Typography
//                   variant="subtitle2"
//                   color="textSecondary"
//                   gutterBottom
//                 >
//                   Address
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Street Address"
//                   name="ChemistData.address.street_address"
//                   value={formData.ChemistData?.address?.street_address || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.address.street_address"]}
//                   helperText={errors["ChemistData.address.street_address"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Street Address Line 2"
//                   name="ChemistData.address.street_address_line_2"
//                   value={
//                     formData.ChemistData?.address?.street_address_line_2 || ""
//                   }
//                   onChange={handleChange}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="City"
//                   name="ChemistData.address.city"
//                   value={formData.ChemistData?.address?.city || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.address.city"]}
//                   helperText={errors["ChemistData.address.city"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="State"
//                   name="ChemistData.address.state"
//                   value={formData.ChemistData?.address?.state || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.address.state"]}
//                   helperText={errors["ChemistData.address.state"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="ZIP Code"
//                   name="ChemistData.address.zip_code"
//                   value={formData.ChemistData?.address?.zip_code || ""}
//                   onChange={handleChange}
//                   error={!!errors["ChemistData.address.zip_code"]}
//                   helperText={errors["ChemistData.address.zip_code"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Box>

//       <DialogActions sx={{ p: 2 }}>
//         <Button onClick={handleCancel} variant="outlined">
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           startIcon={<SaveIcon />}
//         >
//           Save Changes
//         </Button>
//       </DialogActions></>
//   );
// };

// export default ChemistEdit;