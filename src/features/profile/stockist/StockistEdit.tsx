// import React, { useState, useEffect, useCallback } from "react";
// import {
//   // Dialog,
//   DialogTitle,
//   DialogContent,
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
// import { Stockist } from "@/utils/types";
// import toast from "react-hot-toast";
// import { updateStockist } from "@/services/stockist";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";

// interface StockistEditProps {
//   // open: boolean;
//   stockist: Stockist;
//   onClose: () => void;
//   // onSave: (updatedStockist: Stockist) => void;
// }

// const StockistEdit: React.FC<StockistEditProps> = ({
//   stockist,
//   onClose,
// }) => {
//   // console.log("StockistEdit stockist", stockist);
//   const theme = useTheme();
//   const [formData, setFormData] = useState<Stockist>({} as Stockist);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const dispatch = useDispatch<AppDispatch>();

//   // Initialize form data when stockist prop changes
//   useEffect(() => {
//     if (stockist) {
//       setFormData({ ...stockist });
//     }
//   }, [stockist]);

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
//             ...(prev[parent as keyof Stockist] as Record<string, any>),
//             [child]: {
//               ...(prev[parent as keyof Stockist] as Record<string, any>)[child],
//               [subChild]: value,
//             },
//           },
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [parent]: {
//             ...(prev[parent as keyof Stockist] as Record<string, any>),
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
//       !formData.StockistData.name.first_name ||
//       !formData.StockistData.name.first_name.trim()
//     ) {
//       newErrors["StockistData.name.first_name"] = "First name is required";
//     }

//     if (
//       !formData.StockistData.name.last_name ||
//       !formData.StockistData.name.last_name.trim()
//     ) {
//       newErrors["StockistData.name.last_name"] = "Last name is required";
//     }

//     if (
//       // "formData.StockistData.phone_number.phone_number" ||
//       !'formData.StockistData.phone_number.phone_number'.trim()
//     ) {
//       newErrors["StockistData.phone_number.phone_number"] =
//         "Phone number is required";
//     }

//     if (
//       !formData.StockistData.company_name ||
//       !formData.StockistData.company_name.trim()
//     ) {
//       newErrors["StockistData.shop_name"] = "Shop name is required";
//     }

//     if (
//       !formData.StockistData.address.street_address ||
//       !formData.StockistData.address.street_address.trim()
//     ) {
//       newErrors["StockistData.address.street_address"] =
//         "Street address is required";
//     }

//     if (
//       !formData.StockistData.address.city ||
//       !formData.StockistData.address.city.trim()
//     ) {
//       newErrors["StockistData.address.city"] = "City is required";
//     }

//     if (
//       !formData.StockistData.address.state ||
//       !formData.StockistData.address.state.trim()
//     ) {
//       newErrors["StockistData.address.state"] = "State is required";
//     }

//     if (
//       !formData.StockistData.address.zip_code ||
//       !formData.StockistData.address.zip_code.trim()
//     ) {
//       newErrors["StockistData.address.zip_code"] = "ZIP code is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     if (validateForm()) {
//       handleSaveStockist(formData);
//     }
//   };

//   // Handle save edits
//   const handleSaveStockist = useCallback(
//     (updatedStockist: Stockist) => {
//       toast
//         .promise(
//           dispatch(
//             updateStockist({ data: updatedStockist, id: updatedStockist._id })
//           ),
//           {
//             loading: "Updating Stockist data ...",
//             success: <b>Stockist Updated!</b>,
//             error: <b>Could not update.</b>,
//           }
//         )
//         .then(() => {
//           onClose()
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
//       <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6">Edit Stockist Details</Typography>
//         </Box>
//       </DialogTitle>
//       <DialogContent dividers sx={{ p: 3 }}>
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
//                   name="StockistData.name.first_name"
//                   value={formData.StockistData?.name?.first_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.name.first_name"]}
//                   helperText={errors["StockistData.name.first_name"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Middle Name"
//                   name="StockistData.name.middle_name"
//                   value={formData.StockistData?.name?.middle_name || ""}
//                   onChange={handleChange}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Last Name"
//                   name="StockistData.name.last_name"
//                   value={formData.StockistData?.name?.last_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.name.last_name"]}
//                   helperText={errors["StockistData.name.last_name"]}
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
//                   name="StockistData.phone_number.country_code"
//                   value={
//                     ""
//                   }
//                   onChange={handleChange}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={8}>
//                 <TextField
//                   fullWidth
//                   label="Phone Number"
//                   name="StockistData.phone_number.phone_number"
//                   value={
//                      ""
//                   }
//                   onChange={handleChange}
//                   error={!!errors["StockistData.phone_number.phone_number"]}
//                   helperText={errors["StockistData.phone_number.phone_number"]}
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
//                   value={stockist.role}
//                 >
//                   <MenuItem value="Stockist">Stockist</MenuItem>
//                   <MenuItem value="Chemist">Chemist</MenuItem>
//                 </TextField>
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* Distribution information */}
//           <Grid item xs={12} md={6}>
//             <Typography
//               variant="h6"
//               gutterBottom
//               color={theme.palette.primary.main}
//             >
//               Distribution information
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Shop Name"
//                   name="StockistData.shop_name"
//                   value={formData.StockistData?.company_name || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.shop_name"]}
//                   helperText={errors["StockistData.shop_name"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>

//               <Grid item xs={12} sx={{ mt: 0, mb: 0 }}>
//                 <Divider sx={{ mt: 1, mb: 1 }} />
//                 <Typography
//                   sx={{ mt: 0, mb: 0 }}
//                   variant="subtitle2"
//                   color="textSecondary"
//                   gutterBottom
//                 >
//                   Address
//                 </Typography>
//               </Grid>

//               <Grid item xs={12} sx={{ mt: 0, mb: 0 }}>
//                 <TextField
//                   sx={{ mt: 1, mb: 1 }}
//                   fullWidth
//                   label="Street Address"
//                   name="StockistData.address.street_address"
//                   value={formData.StockistData?.address?.street_address || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.address.street_address"]}
//                   helperText={errors["StockistData.address.street_address"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   sx={{ mt: 1, mb: 1 }}
//                   fullWidth
//                   label="Street Address Line 2"
//                   name="StockistData.address.street_address_line_2"
//                   value={
//                     formData.StockistData?.address?.street_address_line_2 || ""
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
//                   name="StockistData.address.city"
//                   value={formData.StockistData?.address?.city || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.address.city"]}
//                   helperText={errors["StockistData.address.city"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="State"
//                   name="StockistData.address.state"
//                   value={formData.StockistData?.address?.state || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.address.state"]}
//                   helperText={errors["StockistData.address.state"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="ZIP Code"
//                   name="StockistData.address.zip_code"
//                   value={formData.StockistData?.address?.zip_code || ""}
//                   onChange={handleChange}
//                   error={!!errors["StockistData.address.zip_code"]}
//                   helperText={errors["StockistData.address.zip_code"]}
//                   margin="normal"
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </DialogContent>
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
//       </DialogActions>
//     </>
//   );
// };

// export default StockistEdit;
