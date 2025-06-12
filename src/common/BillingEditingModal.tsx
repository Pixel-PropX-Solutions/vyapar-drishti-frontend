// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     TextField,
//     Button,
//     Typography,
//     IconButton,
//     Paper,
//     Drawer,
//     useTheme,
//     Tooltip,
//     Grow,
//     Stack,
//     Chip,
//     InputAdornment,
//     CircularProgress,
//     Fade,
//     Zoom,
//     Slide,
//     Card,
//     CardContent,
//     alpha,
//     useMediaQuery,
// } from "@mui/material";
// import {
//     Close as CloseIcon,
//     Business,
//     CheckCircle,
//     Warning,
//     Close,
//     Save,
//     LocationOn,
//     Home,
//     Edit,
//     Add,
//     LocationCity,
//     MarkunreadMailbox,
// } from "@mui/icons-material";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { GetBilling } from "@/utils/types";
// import { ENUM_ENTITY } from "@/utils/enums";
// import { createCompanyBilling, updateCompanyBilling } from "@/services/company";
// import CountryName from "./CountryName";
// import { createBilling } from "@/services/billing";

// interface EditBillingModalProps {
//     open: boolean;
//     onClose: () => void;
//     onCreated?: (billing: { name: string; _id: string }) => void;
//     onUpdated?: () => Promise<void>;
//     entity_id: string;
//     entity_type: ENUM_ENTITY;
//     billing: GetBilling | null;
// }

// const BillingEditingModal: React.FC<EditBillingModalProps> = ({
//     open,
//     onClose,
//     onUpdated,
//     onCreated,
//     billing,
//     entity_id,
//     entity_type,
// }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const { user } = useSelector((state: RootState) => state.auth);
//     const dispatch = useDispatch<AppDispatch>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [_showValidation, setShowValidation] = useState(false);
//     const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//     const [focusedField, setFocusedField] = useState<string>('');

//     const [data, setData] = useState<Partial<GetBilling>>({
//         _id: '',
//         user_id: '',
//         // company_id: '',
//         is_deleted: false,
//         address_1: '',
//         address_2: '',
//         pinCode: '',
//         city: '',
//         state: '',
//         country: '',
//     });

//     // Validation function
//     const validateForm = (formData = data) => {
//         const errors: Record<string, string> = {};

//         if (!(formData?.address_1 ?? '').trim()) {
//             errors.address_1 = 'Street Address line 1 is required';
//         }
//         if (!(formData.state ?? '').trim()) {
//             errors.state = 'State is required';
//         }

//         if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
//             errors.pinCode = 'Pin Code number should be 6 digits long';
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleInputChange = (
//         field: keyof GetBilling,
//         value: string
//     ) => {
//         console.log(`Field changed: ${field}, Value: ${value}`);
//         setData(prev => {
//             const newData = { ...prev, [field]: value };
//             validateForm(newData);
//             return newData;
//         });
//     };


//     const resetForm = () => {
//         setData({
//             _id: '',
//             user_id: '',
//             // company_id: '',
//             is_deleted: false,
//             address_1: '',
//             address_2: '',
//             pinCode: '',
//             city: '',
//             state: '',
//             country: '',
//         });
//         setFormErrors({});
//         setShowValidation(false);
//     };

//     useEffect(() => {
//         if (open && billing) {
//             setData({
//                 _id: billing._id || '',
//                 // company_id: company?._id || '',
//                 state: billing?.state || '',
//                 address_1: billing.address_1 || '',
//                 user_id: user?._id || '',
//                 address_2: billing.address_2 || '',
//                 city: billing?.city || '',
//                 country: billing?.country || '',
//                 pinCode: billing?.pinCode || '',
//                 is_deleted: billing?.is_deleted || false,
//             });
//             setFormErrors({});
//         } else if (open && !billing) {
//             setData({
//                 _id: '',
//                 user_id: user?._id,
//                 // company_id: company?._id || '',
//                 is_deleted: false,
//                 address_1: '',
//                 address_2: '',
//                 pinCode: '',
//                 city: '',
//                 state: '',
//                 country: '',
//             });
//             resetForm();
//         }
//     }, [open, billing, user?._id]);

//     const handleSubmit = async () => {
//         setShowValidation(true);

//         if (!validateForm()) {
//             toast.error('Please fix the form errors before submitting');
//             return;
//         }

//         setIsLoading(true);
//         const sanitizedData: any = {
//             state: (data?.state ?? '').trim(),
//             address_1: (data?.address_1 ?? '').trim(),
//             user_id: user?._id,
//         };

//         if (data.address_2 && data.address_2 !== '') sanitizedData.address_2 = data.address_2.trim();
//         if (data.city && data.city !== '') sanitizedData.city = data.city.trim();
//         if (data.country && data.country !== '') sanitizedData.country = data.country.trim();
//         if (data.pinCode && data.pinCode !== '') sanitizedData.pinCode = data.pinCode.trim();

//         const formData = new FormData();
//         Object.entries(sanitizedData).forEach(([key, value]) => {
//             if (typeof value === 'boolean') {
//                 formData.append(key, value ? 'true' : 'false');
//             } else if (typeof value === 'string') {
//                 formData.append(key, value);
//             }
//         });
//         if (entity_type === ENUM_ENTITY.COMPANY) {
//             formData.append('company_id', entity_id);
//             if (billing === null) {
//                 await toast.promise(
//                     dispatch(createCompanyBilling({
//                         data: formData,
//                     }))
//                         .unwrap()
//                         .then(() => {
//                             setIsLoading(false);
//                             onClose();
//                             if (onUpdated) onUpdated();
//                         })
//                         .catch(() => {
//                             setIsLoading(false);
//                         }),
//                     {
//                         loading: <b>Creating your billing Address... ⏳</b>,
//                         success: <b>Billing Details successfully created! 🎉</b>,
//                         error: <b>Failed to create billing. 🚫</b>,
//                     }
//                 );
//             } else {
//                 await toast.promise(
//                     dispatch(updateCompanyBilling({
//                         data: formData,
//                         id: billing?._id ?? '',
//                     }))
//                         .unwrap()
//                         .then(() => {
//                             setIsLoading(false);
//                             onClose();
//                             if (onUpdated) onUpdated();
//                         })
//                         .catch(() => {
//                             setIsLoading(false);
//                         }),
//                     {
//                         loading: <b>Updating your billing... ⏳</b>,
//                         success: <b>Company Details successfully updated! 🎉</b>,
//                         error: <b>Failed to update billing. 🚫</b>,
//                     }
//                 );
//             }
//         }
//         if (entity_type === ENUM_ENTITY.CREDITOR) {
//             if (billing === null) {
//                 await toast.promise(
//                     dispatch(createBilling(formData))
//                         .unwrap()
//                         .then((res) => {
//                             setIsLoading(false);
//                             onClose();
//                             const nBill = {
//                                 name: `${res.address_1}, ${res.city}, ${res.state} - ${res.pinCode} (${res.country})`,
//                                 _id: res._id
//                             };
//                             if (onCreated) onCreated(nBill);
//                             if (onUpdated) onUpdated();
//                         })
//                         .catch(() => {
//                             setIsLoading(false);
//                         }),
//                     {
//                         loading: <b>Creating your billing Address... ⏳</b>,
//                         success: <b>Billing Details successfully created! 🎉</b>,
//                         error: <b>Failed to create billing. 🚫</b>,
//                     }
//                 );
//             } else {
//                 await toast.promise(
//                     dispatch(updateCompanyBilling({
//                         data: formData,
//                         id: billing?._id ?? '',
//                     }))
//                         .unwrap()
//                         .then(() => {
//                             setIsLoading(false);
//                             onClose();
//                             if (onUpdated) onUpdated();
//                         })
//                         .catch(() => {
//                             setIsLoading(false);
//                         }),
//                     {
//                         loading: <b>Updating your billing... ⏳</b>,
//                         success: <b>Company Details successfully updated! 🎉</b>,
//                         error: <b>Failed to update billing. 🚫</b>,
//                     }
//                 );
//             }
//         }

//     };

//     const isFormValid = (data.state ?? '').trim() && (data.address_1 ?? '').trim();


//     const requiredFields = ['address_1', 'state'];
//     const optionalFields = ['address_2', 'city', 'pinCode', 'country'];
//     const totalFields = requiredFields.length + optionalFields.length;

//     const filledFields = [
//         ...requiredFields.filter(field => !!data[field as keyof GetBilling]?.toString().trim()),
//         ...optionalFields.filter(field => !!data[field as keyof GetBilling]?.toString().trim())
//     ].length;

//     const completionPercentage = Math.round((filledFields / totalFields) * 100);

//     const formFields = [
//         {
//             key: 'address_1',
//             label: 'Street Address 1',
//             placeholder: 'Enter your street address',
//             icon: Home,
//             required: true,
//             description: 'Primary street address for billing'
//         },
//         {
//             key: 'address_2',
//             label: 'Street Address 2',
//             placeholder: 'Apartment, suite, unit, etc. (optional)',
//             icon: Business,
//             required: false,
//             description: 'Additional address information'
//         },
//         {
//             key: 'city',
//             label: 'City',
//             placeholder: 'Enter your city',
//             icon: LocationCity,
//             required: false,
//             description: 'City or town name'
//         },
//         {
//             key: 'state',
//             label: 'State/Province',
//             placeholder: 'Enter your state or province',
//             icon: LocationOn,
//             required: true,
//             description: 'State, province, or region'
//         },
//         {
//             key: 'pinCode',
//             label: 'Postal Code',
//             placeholder: 'Enter 6-digit postal code',
//             icon: MarkunreadMailbox,
//             required: false,
//             description: 'ZIP or postal code (6 digits)'
//         }
//     ];

//     return (
//         <Drawer
//             anchor="right"
//             PaperProps={{
//                 sx: {
//                     width: { xs: '100%', sm: 650, md: 800 },
//                     backgroundColor: theme.palette.background.default,
//                     backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
//                     overflow: 'hidden',
//                 }
//             }}
//             sx={{
//                 '& .MuiBackdrop-root': {
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                     backdropFilter: 'blur(12px)',
//                 }
//             }}
//             open={open}
//             onClose={onClose}
//         >
//             {/* Enhanced Header */}
//             <Slide direction="down" in={open} timeout={500}>
//                 <Box sx={{
//                     p: { xs: 2, sm: 3 },
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                     background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
//                     backdropFilter: 'blur(20px)',
//                     position: 'sticky',
//                     top: 0,
//                     zIndex: 1200,
//                     boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
//                 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Zoom in={open} timeout={600}>
//                             <Tooltip title="Close" arrow placement="bottom">
//                                 <IconButton
//                                     onClick={onClose}
//                                     sx={{
//                                         backgroundColor: alpha(theme.palette.background.paper, 0.9),
//                                         boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
//                                         border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//                                         '&:hover': {
//                                             backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                             transform: 'scale(1.1) rotate(90deg)',
//                                             boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
//                                         },
//                                         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//                                     }}
//                                 >
//                                     <CloseIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </Zoom>

//                         <Fade in={open} timeout={800}>
//                             <Box>
//                                 <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{
//                                     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                                     WebkitBackgroundClip: 'text',
//                                     WebkitTextFillColor: 'transparent',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: 1,
//                                 }}>
//                                     {billing === null ? <Add sx={{ color: theme.palette.primary.main }} /> : <Edit sx={{ color: theme.palette.primary.main }} />}
//                                     {billing === null ? 'Create Billing Address' : 'Edit Billing Address'}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                                     {billing === null ? "Set up your billing details" : "Update your billing information"}
//                                 </Typography>
//                             </Box>
//                         </Fade>
//                     </Box>

//                     <Fade in={open} timeout={1000}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             {/* Progress Indicator */}
//                             <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
//                                 <Typography variant="caption" color="text.secondary">
//                                     {completionPercentage}% Complete
//                                 </Typography>
//                                 <Box sx={{
//                                     width: 60,
//                                     height: 4,
//                                     backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                     borderRadius: 1,
//                                     overflow: 'hidden'
//                                 }}>
//                                     <Box sx={{
//                                         width: `${completionPercentage}%`,
//                                         height: '100%',
//                                         backgroundColor: theme.palette.primary.main,
//                                         borderRadius: 1,
//                                         transition: 'width 0.3s ease'
//                                     }} />
//                                 </Box>
//                             </Box>

//                             <Chip
//                                 icon={isFormValid ? <CheckCircle /> : <Warning />}
//                                 label={isFormValid ? "Ready to Save" : "Fill Required Fields"}
//                                 color={isFormValid ? "success" : "warning"}
//                                 variant="outlined"
//                                 sx={{
//                                     fontWeight: 600,
//                                     backgroundColor: alpha(isFormValid ? theme.palette.success.main : theme.palette.warning.main, 0.1),
//                                     borderColor: alpha(isFormValid ? theme.palette.success.main : theme.palette.warning.main, 0.3),
//                                     '& .MuiChip-icon': {
//                                         fontSize: '1rem'
//                                     },
//                                     transition: 'all 0.3s ease',
//                                     '&:hover': {
//                                         transform: 'scale(1.05)',
//                                     }
//                                 }}
//                             />
//                         </Box>
//                     </Fade>
//                 </Box>
//             </Slide>

//             {/* Enhanced Content */}
//             <Box sx={{
//                 flex: 1,
//                 overflow: 'auto',
//                 position: 'relative',
//                 '&::-webkit-scrollbar': {
//                     width: 8,
//                 },
//                 '&::-webkit-scrollbar-track': {
//                     backgroundColor: alpha(theme.palette.background.default, 0.1),
//                 },
//                 '&::-webkit-scrollbar-thumb': {
//                     backgroundColor: alpha(theme.palette.primary.main, 0.3),
//                     borderRadius: 4,
//                     '&:hover': {
//                         backgroundColor: alpha(theme.palette.primary.main, 0.5),
//                     }
//                 }
//             }}>
//                 <Box sx={{ p: { xs: 2, sm: 3 }, pb: 6 }}>
//                     {/* Header Card */}
//                     <Grow in timeout={400}>
//                         <Card sx={{
//                             mb: 3,
//                             background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
//                             border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//                             borderRadius: 1,
//                             overflow: 'hidden',
//                             position: 'relative',
//                             '&::before': {
//                                 content: '""',
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 height: 4,
//                                 background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                             }
//                         }}>
//                             <CardContent sx={{ p: 3 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                                     <Box sx={{
//                                         p: 1.5,
//                                         borderRadius: 1,
//                                         backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center'
//                                     }}>
//                                         <LocationOn sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
//                                     </Box>
//                                     <Box>
//                                         <Typography variant="h6" fontWeight={600} color="primary">
//                                             Billing Address Information
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             This address will be used for all billing and invoicing purposes
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grow>

//                     {/* Main Form */}
//                     <Grow in timeout={600}>
//                         <Paper
//                             elevation={0}
//                             sx={{
//                                 p: { xs: 3, sm: 4 },
//                                 borderRadius: 1,
//                                 background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
//                                 border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                                 position: 'relative',
//                                 overflow: 'hidden',
//                                 backdropFilter: 'blur(20px)',
//                                 boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.08)}`,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     transform: 'translateY(-2px)',
//                                     boxShadow: `0 25px 70px ${alpha(theme.palette.primary.main, 0.12)}`
//                                 }
//                             }}
//                         >
//                             {/* Form Fields */}
//                             <Stack spacing={4}>
//                                 {formFields.map((field, index) => (
//                                     <Slide key={field.key} direction="up" in timeout={800 + index * 100}>
//                                         <Box>
//                                             <TextField
//                                                 fullWidth
//                                                 label={field.label}
//                                                 placeholder={field.placeholder}
//                                                 value={data[field.key as keyof GetBilling] || ''}
//                                                 onChange={(e) => handleInputChange(field.key as keyof GetBilling, e.target.value)}
//                                                 error={!!formErrors[field.key]}
//                                                 helperText={formErrors[field.key] || field.description}
//                                                 required={field.required}
//                                                 onFocus={() => setFocusedField(field.key)}
//                                                 onBlur={() => setFocusedField('')}
//                                                 InputProps={{
//                                                     startAdornment: (
//                                                         <InputAdornment position="start">
//                                                             <Box sx={{
//                                                                 p: 0.5,
//                                                                 borderRadius: 1,
//                                                                 backgroundColor: focusedField === field.key
//                                                                     ? alpha(theme.palette.primary.main, 0.1)
//                                                                     : 'transparent',
//                                                                 transition: 'all 0.3s ease',
//                                                                 display: 'flex',
//                                                                 alignItems: 'center'
//                                                             }}>
//                                                                 <field.icon
//                                                                     color={formErrors[field.key] ? 'error' :
//                                                                         focusedField === field.key ? 'primary' : 'action'}
//                                                                     sx={{ fontSize: 20 }}
//                                                                 />
//                                                             </Box>
//                                                         </InputAdornment>
//                                                     ),
//                                                     endAdornment: field.required && (
//                                                         <InputAdornment position="end">
//                                                             <Chip
//                                                                 label="Required"
//                                                                 size="small"
//                                                                 color="primary"
//                                                                 variant="outlined"
//                                                                 sx={{
//                                                                     fontSize: '0.7rem',
//                                                                     height: 20,
//                                                                     opacity: focusedField === field.key ? 1 : 0.6,
//                                                                     transition: 'opacity 0.3s ease'
//                                                                 }}
//                                                             />
//                                                         </InputAdornment>
//                                                     )
//                                                 }}
//                                                 sx={{
//                                                     '& .MuiOutlinedInput-root': {
//                                                         borderRadius: 1,
//                                                         backgroundColor: focusedField === field.key
//                                                             ? alpha(theme.palette.primary.main, 0.02)
//                                                             : alpha(theme.palette.background.paper, 0.5),
//                                                         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                                         '&:hover': {
//                                                             transform: 'translateY(-1px)',
//                                                             boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
//                                                         },
//                                                         '&.Mui-focused': {
//                                                             transform: 'translateY(-2px)',
//                                                             boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
//                                                         }
//                                                     },
//                                                     '& .MuiFormHelperText-root': {
//                                                         marginLeft: 0,
//                                                         marginTop: 1,
//                                                         fontSize: '0.75rem',
//                                                         color: formErrors[field.key]
//                                                             ? theme.palette.error.main
//                                                             : alpha(theme.palette.text.secondary, 0.7)
//                                                     }
//                                                 }}
//                                             />
//                                         </Box>
//                                     </Slide>
//                                 ))}

//                                 {/* Enhanced Country Select */}
//                                 <CountryName
//                                     handleInputChange={handleInputChange as (field: string, value: string) => void}
//                                     value={data?.country || ''}
//                                     focusedField={focusedField}
//                                     setFocusedField={setFocusedField}
//                                     formErrors={formErrors}
//                                     isHelperText={true}
//                                 />
//                                 {/* <Slide direction="up" in timeout={1300}>
//                                     <FormControl fullWidth error={!!formErrors.country}>
//                                         <InputLabel id="country-select-label" sx={{
//                                             color: focusedField === 'country' ? theme.palette.primary.main : undefined,
//                                             '&.Mui-focused': {
//                                                 color: theme.palette.primary.main
//                                             }
//                                         }}>
//                                             Country
//                                         </InputLabel>
//                                         <Select
//                                             labelId="country-select-label"
//                                             value={data.country || ''}
//                                             label="Country"
//                                             onChange={(e) => handleInputChange('country', e.target.value)}
//                                             onFocus={() => setFocusedField('country')}
//                                             onBlur={() => setFocusedField('')}
//                                             startAdornment={
//                                                 <InputAdornment position="start">
//                                                     <Box sx={{
//                                                         p: 0.5,
//                                                         borderRadius: 1,
//                                                         backgroundColor: focusedField === 'country'
//                                                             ? alpha(theme.palette.primary.main, 0.1)
//                                                             : 'transparent',
//                                                         transition: 'all 0.3s ease',
//                                                         display: 'flex',
//                                                         alignItems: 'center'
//                                                     }}>
//                                                         <Public color={focusedField === 'country' ? 'primary' : 'action'} sx={{ fontSize: 20 }} />
//                                                     </Box>
//                                                 </InputAdornment>
//                                             }
//                                             renderValue={(selected) => {
//                                                 const country = CountryCodes.find(c => c.name === selected);
//                                                 return country ? (
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
//                                                         <Avatar
//                                                             src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
//                                                             alt={country.code}
//                                                             sx={{
//                                                                 width: 24,
//                                                                 height: 24,
//                                                                 boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
//                                                             }}
//                                                             imgProps={{
//                                                                 onError: (e) => {
//                                                                     const target = e.target as HTMLImageElement;
//                                                                     target.onerror = null;
//                                                                     target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
//                                                                 }
//                                                             }}
//                                                         />
//                                                         <span>{country.name}</span>
//                                                     </Box>
//                                                 ) : (
//                                                     <Box sx={{ ml: 1 }}>{selected}</Box>
//                                                 );
//                                             }}
//                                             sx={{
//                                                 '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 1,
//                                                     backgroundColor: focusedField === 'country'
//                                                         ? alpha(theme.palette.primary.main, 0.02)
//                                                         : alpha(theme.palette.background.paper, 0.5),
//                                                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                                     '&:hover': {
//                                                         transform: 'translateY(-1px)',
//                                                         boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         transform: 'translateY(-2px)',
//                                                         boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
//                                                     }
//                                                 }
//                                             }}
//                                             MenuProps={{
//                                                 PaperProps: {
//                                                     sx: {
//                                                         maxHeight: 300,
//                                                         borderRadius: 1,
//                                                         boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
//                                                         backdropFilter: 'blur(20px)',
//                                                         border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//                                                         '& .MuiMenuItem-root': {
//                                                             borderRadius: 1,
//                                                             margin: '2px 8px',
//                                                             transition: 'all 0.2s ease',
//                                                             '&:hover': {
//                                                                 backgroundColor: alpha(theme.palette.primary.main, 0.08),
//                                                                 transform: 'translateX(4px)',
//                                                             }
//                                                         }
//                                                     }
//                                                 }
//                                             }}
//                                         >
//                                             {CountryCodes.map((country) => (
//                                                 <MenuItem key={country.code} value={country.name}>
//                                                     <ListItemIcon>
//                                                         <Avatar
//                                                             src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
//                                                             alt={country.code}
//                                                             sx={{
//                                                                 width: 24,
//                                                                 height: 24,
//                                                                 boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
//                                                             }}
//                                                             imgProps={{
//                                                                 onError: (e) => {
//                                                                     const target = e.target as HTMLImageElement;
//                                                                     target.onerror = null;
//                                                                     target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
//                                                                 }
//                                                             }}
//                                                         />
//                                                     </ListItemIcon>
//                                                     <ListItemText
//                                                         primary={country.name}
//                                                         sx={{
//                                                             '& .MuiListItemText-primary': {
//                                                                 fontWeight: 500
//                                                             }
//                                                         }}
//                                                     />
//                                                     <KeyboardArrowRight sx={{
//                                                         opacity: 0.5,
//                                                         transition: 'opacity 0.2s ease',
//                                                         '.MuiMenuItem-root:hover &': {
//                                                             opacity: 1
//                                                         }
//                                                     }} />
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                         <FormHelperText sx={{
//                                             marginLeft: 0,
//                                             marginTop: 1,
//                                             fontSize: '0.75rem',
//                                             color: formErrors.country
//                                                 ? theme.palette.error.main
//                                                 : alpha(theme.palette.text.secondary, 0.7)
//                                         }}>
//                                             {formErrors.country || 'Select your country for billing purposes'}
//                                         </FormHelperText>
//                                     </FormControl>
//                                 </Slide> */}
//                             </Stack>

//                             {/* Enhanced Action Buttons */}
//                             <Fade in timeout={1500}>
//                                 <Box sx={{
//                                     display: 'flex',
//                                     justifyContent: 'flex-end',
//                                     gap: 2,
//                                     mt: 5,
//                                     pt: 3,
//                                     borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//                                 }}>
//                                     <Button
//                                         variant="outlined"
//                                         color="secondary"
//                                         onClick={onClose}
//                                         startIcon={<Close />}
//                                         sx={{
//                                             textTransform: 'none',
//                                             fontWeight: 600,
//                                             borderRadius: 1,
//                                             px: 3,
//                                             py: 1.5,
//                                             borderColor: alpha(theme.palette.secondary.main, 0.3),
//                                             backgroundColor: alpha(theme.palette.background.paper, 0.8),
//                                             backdropFilter: 'blur(10px)',
//                                             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                             '&:hover': {
//                                                 backgroundColor: alpha(theme.palette.secondary.main, 0.08),
//                                                 borderColor: theme.palette.secondary.main,
//                                                 transform: 'translateY(-2px)',
//                                                 boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.2)}`,
//                                             }
//                                         }}
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={handleSubmit}
//                                         disabled={Object.keys(formErrors).length > 0 || isLoading}
//                                         startIcon={isLoading ?
//                                             <CircularProgress size={20} color="inherit" /> :
//                                             <Save />
//                                         }
//                                         sx={{
//                                             textTransform: 'none',
//                                             fontWeight: 600,
//                                             borderRadius: 1,
//                                             px: 4,
//                                             py: 1.5,
//                                             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                                             boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
//                                             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                             '&:hover': {
//                                                 background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
//                                                 transform: 'translateY(-3px)',
//                                                 boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
//                                             },
//                                             '&:disabled': {
//                                                 background: alpha(theme.palette.action.disabled, 0.12),
//                                                 color: theme.palette.action.disabled,
//                                                 boxShadow: 'none',
//                                                 transform: 'none',
//                                             }
//                                         }}
//                                     >
//                                         {isLoading ? 'Saving...' :
//                                             billing === null ? "Create Billing Address" : 'Update Address'}
//                                     </Button>
//                                 </Box>
//                             </Fade>
//                         </Paper>
//                     </Grow>

//                     {/* Help Section */}
//                     <Grow in timeout={1000}>
//                         <Card sx={{
//                             mt: 3,
//                             background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.03)} 100%)`,
//                             border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
//                             borderRadius: 1,
//                         }}>
//                             <CardContent sx={{ p: 2 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//                                     <Box sx={{
//                                         p: 1,
//                                         borderRadius: 1,
//                                         backgroundColor: alpha(theme.palette.info.main, 0.1),
//                                     }}>
//                                         <Warning sx={{ color: theme.palette.info.main, fontSize: 20 }} />
//                                     </Box>
//                                     <Box sx={{ flex: 1 }}>
//                                         <Typography variant="body2" fontWeight={600} color="info.main" gutterBottom>
//                                             Important Information
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
//                                             This billing address will be used for all invoices and tax calculations.
//                                             Please ensure the information is accurate and matches your business registration details.
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grow>
//                 </Box>
//             </Box>
//         </Drawer>
//     );
// }

// export default BillingEditingModal;
