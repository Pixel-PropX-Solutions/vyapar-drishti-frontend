// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     Box,
//     TextField,
//     Button,
//     Typography,
//     IconButton,
//     Drawer,
//     useTheme,
//     Tooltip,
//     FormControl,
//     Chip,
//     Alert,
//     Avatar,
//     Autocomplete,
//     Fade,
//     Zoom,
//     Slide,
//     Paper
// } from "@mui/material";
// import {
//     Close as CloseIcon,
//     Delete,
//     PhotoCamera,
//     Timeline,
//     Person,
//     Email,
//     Phone,
//     Business,
//     LocationOn,
//     CreditCard,
//     CheckCircle,
//     CloudUpload,
//     Save,
//     Label,
//     AddCircleOutline,
//     InfoOutlined
// } from "@mui/icons-material";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { GetUserLedgers } from "@/utils/types";
// import CustomerGroupEditingModal from "@/common/CustomerGroupEditingModal";
// import { viewAllAccountingGroups } from "@/services/accountingGroup";
// import { createCustomer, updateCustomer } from "@/services/customers";
// import countries from "@/internals/data/CountriesStates.json";

// interface EditUserModalProps {
//     open: boolean;
//     onClose: () => void;
//     onUpdated?: () => Promise<void>;
//     onCreated?: () => Promise<void>;
//     cred: GetUserLedgers | null;
// }

// interface CustomerFormData {
//     company_id: string;
//     parent: string;
//     parent_id: string;
//     mailing_name: string;
//     mailing_pincode: string;
//     mailing_country?: string;
//     mailing_state: string;
//     mailing_address?: string;
//     alias?: string;
//     name: string;
//     email?: string;
//     image?: string | File | null;
//     code: string;
//     number: string;
//     bank_name?: string;
//     account_number?: string;
//     bank_ifsc?: string;
//     bank_branch?: string;
//     account_holder?: string;
//     gstin?: string;
// }

// interface ValidationErrors {
//     [key: string]: string;
// }

// const EditCustomerModal: React.FC<EditUserModalProps> = ({
//     open,
//     onClose,
//     onUpdated,
//     onCreated,
//     cred,
// }) => {
//     const theme = useTheme();
//     const dispatch = useDispatch<AppDispatch>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
//     const [isFormValid, setIsFormValid] = useState(false);
//     const customerImageRef = useRef<HTMLInputElement | null>(null);
//     const [isDragActive, setIsDragActive] = useState(false);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//     const { user, current_company_id } = useSelector((state: RootState) => state.auth);
//     const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
//     const currentCompanyDetails = user?.company?.find((c :any) => c._id === currentCompanyId);
//     const { accountingGroups } = useSelector((state: RootState) => state.accountingGroup);
//     const [openGroupModal, setOpenGroupModal] = useState(false);
//     const [selectedTypeOption, setSelectedTypeOption] = useState<{
//         label: string;
//         value: string;
//         user_id: string;
//         parent: string;
//         id: string;
//     } | null>(null);
//     const [data, setData] = useState<CustomerFormData>({
//         name: '',
//         email: '',
//         code: '',
//         number: '',
//         image: '',
//         mailing_name: '',
//         mailing_address: '',
//         mailing_country: '',
//         mailing_state: '',
//         mailing_pincode: '',
//         company_id: '',
//         parent: '',
//         parent_id: '',
//         bank_name: '',
//         account_number: '',
//         bank_ifsc: '',
//         bank_branch: '',
//         account_holder: '',
//         gstin: '',
//     });



//     const validateForm = useCallback((): boolean => {
//         const errors: ValidationErrors = {};
//         Object.keys(data).forEach(key => {
//             const field = key as keyof CustomerFormData;
//             const error = validateField(field, String(data[field] || ''));
//             if (error) errors[field] = error;
//         });

//         setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     }, [data]);

//     const handleInputChange = (
//         field: keyof CustomerFormData,
//         value: string
//     ) => {
//         setData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         if (validationErrors[field]) {
//             setValidationErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         }

//         const error = validateField(field, value);
//         if (error) {
//             setValidationErrors(prev => ({
//                 ...prev,
//                 [field]: error
//             }));
//         }
//     };

//     const handleImageChange = useCallback((file: File) => {
//         if (!file) return;

//         const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
//         if (!validTypes.includes(file.type)) {
//             toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             toast.error('Image size should be less than 5MB.');
//             return;
//         }

//         setData(prev => ({
//             ...prev,
//             image: file
//         }));

//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const result = e.target?.result as string;
//             setImagePreview(result);
//         };
//         reader.readAsDataURL(file);
//     }, []);

//     const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragActive(false);

//         const file = e.dataTransfer.files?.[0];
//         if (file) {
//             handleImageChange(file);
//         }
//     }, [handleImageChange]);

//     const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragActive(true);
//     }, []);

//     const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragActive(false);
//     }, []);

//     const handleBoxClick = () => {
//         customerImageRef.current?.click();
//     };

//     const removeImage = useCallback((e: React.MouseEvent) => {
//         e.stopPropagation();
//         setImagePreview(null);
//         setData(prev => ({
//             ...prev,
//             image: ''
//         }));
//         if (customerImageRef.current) {
//             customerImageRef.current.value = '';
//         }
//     }, []);

//     const resetForm = () => {
//         setData({
//             name: '',
//             email: '',
//             code: '',
//             number: '',
//             image: '',
//             mailing_name: '',
//             mailing_address: '',
//             mailing_country: '',
//             mailing_state: '',
//             mailing_pincode: '',
//             company_id: '',
//             parent: '',
//             parent_id: '',
//         });
//         setImagePreview(null);
//         setValidationErrors({});
//         if (customerImageRef.current) {
//             customerImageRef.current.value = '';
//         }
//     };

//     const getVisibleFields = useCallback(() => {
//         const type = (selectedTypeOption?.user_id === '' || selectedTypeOption?.user_id === null)
//             ? selectedTypeOption?.value?.toLowerCase()
//             : selectedTypeOption?.parent?.toLowerCase() || '';
//         if (type === 'debtors' || type === 'creditors') {
//             return {
//                 showAll: true,
//                 showBasicDetails: true,
//                 showProfileImage: true,
//                 showMailingDetails: true,
//                 showBankDetails: true,
//                 isBankOptional: true,
//                 isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? true : false,
//                 isMailingAddressOptional: false,
//                 showGSTIN: true,
//                 requiredFields: [
//                     'name',
//                     'mailing_state',
//                     'parent',
//                     'mailing_country',
//                     ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin'] : []),
//                 ],
//             };
//         }
//         if (type === 'bank accounts') {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: true,
//                 showBankDetails: true,
//                 isBankOptional: false,
//                 isGSTINOptional: false,
//                 isMailingAddressOptional: true,
//                 showGSTIN: false,
//                 requiredFields: ['name', 'parent'],
//             };
//         }
//         if (type === 'capital account') {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: true,
//                 showBankDetails: true,
//                 isBankOptional: true,
//                 isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
//                 isMailingAddressOptional: true,
//                 showGSTIN: true,
//                 requiredFields: ['name', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin'] : []),],
//             };
//         }
//         if (
//             type === 'purchase account' ||
//             type === 'sales account' ||
//             type === 'stock-in-hand' ||
//             type === 'suspense account'
//         ) {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: false,
//                 showBankDetails: true,
//                 isBankOptional: false,
//                 isGSTINOptional: false,
//                 isMailingAddressOptional: false,
//                 showGSTIN: false,
//                 requiredFields: ['name', 'parent'],
//             };
//         }
//         if (
//             type === 'direct expense' ||
//             type === 'direct income' ||
//             type === 'indirect expenses' ||
//             type === 'indirect incomes' ||
//             type === 'duties & taxes' ||
//             type === 'misc. expenses'
//         ) {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: false,
//                 showBankDetails: false,
//                 isBankOptional: true,
//                 isGSTINOptional: false,
//                 isMailingAddressOptional: true,
//                 showGSTIN: false,
//                 requiredFields: ['name', 'parent'],
//             };
//         }
//         if (
//             type === 'current assets' ||
//             type === 'current liabilities' ||
//             type === 'fixed assets' ||
//             type === 'loans (liability)' ||
//             type === 'investments' ||
//             type === 'loans & advances' ||
//             type === 'secured loans' ||
//             type === 'unsecured loans' ||
//             type === 'deposits assets'
//         ) {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: true,
//                 showBankDetails: true,
//                 showGSTIN: true,
//                 isBankOptional: true,
//                 isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
//                 isMailingAddressOptional: true,
//                 requiredFields: ['name', 'parent', 'mailing_state', 'mailing_country', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin'] : []),],
//             };
//         } if (
//             type === 'cash-in-hand'
//         ) {
//             return {
//                 showAll: false,
//                 showBasicDetails: true,
//                 showProfileImage: false,
//                 showMailingDetails: false,
//                 showBankDetails: true,
//                 isBankOptional: true,
//                 isGSTINOptional: false,
//                 isMailingAddressOptional: false,
//                 showGSTIN: false,
//                 requiredFields: ['name', 'parent'],
//             };
//         }
//         return {
//             showAll: true,
//             showBasicDetails: true,
//             showProfileImage: true,
//             showMailingDetails: true,
//             showBankDetails: true,
//             isBankOptional: true,
//             isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
//             isMailingAddressOptional: true,
//             showGSTIN: true,
//             requiredFields: ['name', 'mailing_state', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin'] : []),],
//         };
//     }, [currentCompanyDetails?.company_settings?.features?.enable_gst, selectedTypeOption?.parent, selectedTypeOption?.user_id, selectedTypeOption?.value]);

//     const { showAll, showBankDetails, showBasicDetails, showGSTIN, showMailingDetails, showProfileImage, isBankOptional, isGSTINOptional, isMailingAddressOptional, requiredFields } = getVisibleFields();

//     const validateField = (field: keyof CustomerFormData, value: string): string => {
//         if (!showAll && !['name', 'parent'].includes(field)) return '';
//         if (!value && requiredFields.includes(field)) return `${field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")} is required`;
//         if (isMailingAddressOptional && field === 'mailing_address' && !value.trim()) return '';
//         if (field === 'mailing_pincode' && value && !/^\d{1,6}$/.test(value)) return 'Invalid pincode format';
//         if (field === 'code' && value && !/^\+\d{1,4}$/.test(value)) return 'Invalid phone code format';
//         if (field === 'number' && value && !/^\d{10}$/.test(value)) return 'Invalid phone number format';
//         if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
//         if (field === 'name' && value.trim().length < 2) return 'Name must be at least 2 characters';
//         if (field === 'gstin' && value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9][Z][0-9A-Z]$/.test(value)) return 'Invalid GSTIN format';
//         if (field === 'account_number' && value && !/^\d{9,18}$/.test(value)) return 'Invalid bank account number format';
//         if (field === 'bank_ifsc' && value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return 'Invalid IFSC code format';
//         return '';
//     };


//     useEffect(() => {
//         if (open && cred) {
//             setData({
//                 name: cred.ledger_name || '',
//                 mailing_name: cred.mailing_name || '',
//                 mailing_address: cred.mailing_address || '',
//                 mailing_country: cred.mailing_country || '',
//                 mailing_state: cred.mailing_state || '',
//                 mailing_pincode: cred.mailing_pincode || '',
//                 parent: cred.parent || '',
//                 parent_id: cred.parent_id || '',
//                 company_id: cred.company_id || '',
//                 email: cred.email || '',
//                 code: cred.phone?.code || '',
//                 number: cred.phone?.number || '',
//                 image: typeof cred.image === 'string' ? cred.image : '',
//                 bank_name: cred?.bank_name || '',
//                 account_number: cred?.account_number || '',
//                 bank_ifsc: cred?.bank_ifsc || '',
//                 bank_branch: cred?.bank_branch || '',
//                 account_holder: cred?.account_holder || '',
//                 gstin: cred.gstin || '',
//             });
//             setSelectedTypeOption({
//                 label: cred.parent || 'Select Group',
//                 value: cred.parent || '',
//                 user_id: cred.user_id || '',
//                 parent: cred.parent || '',
//                 id: cred._id || '',
//             });
//             setImagePreview(
//                 typeof cred?.image === "string" ? cred.image : null
//             );
//         } else if (open && !cred) {
//             resetForm();
//         }
//         dispatch(viewAllAccountingGroups(currentCompanyId || ''));
//     }, [open, cred, dispatch, currentCompanyId]);

//     useEffect(() => {
//         setIsFormValid(validateForm());
//     }, [data, validateForm]);

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             toast.error('Please fix the validation errors before submitting.');
//             return;
//         }

//         setIsLoading(true);
//         const sanitizedData: Record<string, string | File | undefined> = {
//             name: data.name?.trim(),
//             user_id: user?._id,
//             company_id: currentCompanyId,
//         };

//         if (data.email?.trim())
//             sanitizedData.email = data.email.trim();
//         if (data.parent?.trim()) sanitizedData.parent = data.parent.trim();
//         if (data.parent_id?.trim()) sanitizedData.parent_id = data.parent_id.trim();
//         if (data.mailing_pincode?.trim()) sanitizedData.mailing_pincode = data.mailing_pincode.trim();
//         if (data.code?.trim()) sanitizedData.code = data.code.trim();
//         if (data.number?.trim()) sanitizedData.number = data.number.trim();
//         if (data.mailing_name?.trim()) sanitizedData.mailing_name = data.mailing_name.trim();
//         if (data.mailing_address?.trim()) sanitizedData.mailing_address = data.mailing_address.trim();
//         if (data.mailing_country?.trim()) sanitizedData.mailing_country = data.mailing_country.trim();
//         if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
//         if (data.mailing_state?.trim()) sanitizedData.mailing_state = data.mailing_state.trim();
//         if (data.bank_name?.trim()) sanitizedData.bank_name = data.bank_name.trim();
//         if (data.account_number?.trim()) sanitizedData.account_number = data.account_number.trim();
//         if (data.bank_ifsc?.trim()) sanitizedData.bank_ifsc = data.bank_ifsc.trim();
//         if (data.bank_branch?.trim()) sanitizedData.bank_branch = data.bank_branch.trim();
//         if (data.account_holder?.trim()) sanitizedData.account_holder = data.account_holder.trim();
//         if (data.gstin?.trim()) sanitizedData.gstin = data.gstin.trim();

//         const formData = new FormData();
//         Object.entries(sanitizedData).forEach(([key, value]) => {
//             if (typeof value === 'boolean') {
//                 formData.append(key, value ? 'true' : 'false');
//             } else if (value !== undefined && value !== null) {
//                 if (typeof value === 'string' || value instanceof Blob) {
//                     formData.append(key, value);
//                 }
//             }
//         });

//         try {
//             await toast.promise(
//                 cred === null
//                     ? dispatch(createCustomer(formData)).unwrap()
//                     : dispatch(
//                         updateCustomer({ data: formData, id: cred._id ?? "" })
//                     ).unwrap(),
//                 {
//                     loading: (
//                         <b>{cred === null ? "Creating" : "Updating"} customer... ⏳</b>
//                     ),
//                     success: (
//                         <b>
//                             Group {cred === null ? "created" : "updated"} successfully! 🎉
//                         </b>
//                     ),
//                     error: (
//                         <b>Failed to {cred === null ? "create" : "update"} customer. 🚫</b>
//                     ),
//                 }
//             );
//             // onClose();
//             // if (onCreated) await onCreated();
//             // if (onUpdated) await onUpdated();
//         } catch {
//             // Error handled by toast
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Drawer
//             anchor="right"
//             PaperProps={{
//                 sx: {
//                     width: { xs: '100%', sm: 600, md: 750 },
//                     backgroundColor: theme.palette.background.default,
//                     backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
//                 }
//             }}
//             sx={{
//                 '& .MuiBackdrop-root': {
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                     backdropFilter: 'blur(8px)',
//                 }
//             }}
//             open={open}
//             onClose={onClose}
//         >
//             {/* Header with Progress */}
//             <Box sx={{
//                 p: 3,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 2,
//                 borderBottom: `1px solid ${theme.palette.divider}`,
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}10 100%)`,
//                 backdropFilter: 'blur(10px)',
//             }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Tooltip title="Close" TransitionComponent={Zoom}>
//                             <IconButton
//                                 onClick={onClose}
//                                 sx={{
//                                     backgroundColor: theme.palette.background.paper,
//                                     '&:hover': {
//                                         backgroundColor: theme.palette.action.hover,
//                                         transform: 'scale(1.1)'
//                                     },
//                                     transition: 'all 0.2s ease',
//                                     boxShadow: theme.shadows[2]
//                                 }}
//                             >
//                                 <CloseIcon />
//                             </IconButton>
//                         </Tooltip>
//                         <Box>
//                             <Typography variant="h5" fontWeight={600}>
//                                 {cred ? `Edit Customer` : 'New Customer'}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 {cred ? `Editing ${cred.ledger_name}` : 'Create a new customer account'}
//                             </Typography>
//                         </Box>
//                     </Box>

//                     <Button
//                         variant="contained"
//                         startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
//                         onClick={handleSubmit}
//                         disabled={isLoading || !isFormValid}
//                         sx={{
//                             textTransform: 'none',
//                             px: 3,
//                             py: 1.5,
//                             fontSize: '1rem',
//                             fontWeight: 600,
//                             borderRadius: 1,
//                             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                             boxShadow: theme.shadows[4],
//                             '&:hover': {
//                                 transform: 'translateY(-2px)',
//                                 boxShadow: theme.shadows[8],
//                             },
//                             '&:disabled': {
//                                 background: theme.palette.action.disabledBackground,
//                                 color: theme.palette.action.disabled,
//                             },
//                             transition: 'all 0.3s ease'
//                         }}
//                     >
//                         {isLoading ? 'Updating...' : 'Save Changes'}
//                     </Button>
//                 </Box>

//                 {/* Success Alert */}
//                 <Slide direction="down" in={showSuccessAlert} mountOnEnter unmountOnExit>
//                     <Alert
//                         severity="success"
//                         icon={<CheckCircle fontSize="inherit" />}
//                         onClose={() => setShowSuccessAlert(false)}
//                         sx={{
//                             borderRadius: 1,
//                             mt: 1,
//                             '& .MuiAlert-icon': {
//                                 fontSize: 24,
//                                 alignItems: 'center'
//                             }
//                         }}
//                     >
//                         Customer details updated successfully!
//                     </Alert>
//                 </Slide>
//             </Box>

//             {/* Form Content */}
//             <Box
//                 sx={{
//                     flex: 1,
//                     overflow: 'auto',
//                     position: 'relative',
//                     '&::-webkit-scrollbar': {
//                         width: 8,
//                     },
//                     '&::-webkit-scrollbar-track': {
//                         backgroundColor: theme.palette.background.default,
//                     },
//                     '&::-webkit-scrollbar-thumb': {
//                         backgroundColor: theme.palette.divider,
//                         borderRadius: 4,
//                         '&:hover': {
//                             backgroundColor: theme.palette.action.hover,
//                         }
//                     }
//                 }}
//             >
//                 <Box sx={{ p: 3 }}>
//                     {/* Accounting Section */}
//                     <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <CreditCard color="primary" />
//                                 Accounting Details
//                             </Typography>

//                         </Box>

//                         <Box sx={{ mt: 2 }}>
//                             <FormControl fullWidth sx={{ mb: 2 }}>
//                                 <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Business fontSize="small" color="primary" />
//                                     Customer Type
//                                     <Chip label="Required" size="small" color="primary" variant="outlined" />
//                                 </Typography>
//                                 <Autocomplete
//                                     fullWidth
//                                     size="small"
//                                     options={[
//                                         ...(accountingGroups?.map(cat => ({
//                                             label: `${cat?.name} (${cat.parent})`,
//                                             value: cat.name,
//                                             user_id: cat.user_id,
//                                             parent: cat.parent,
//                                             id: cat._id,
//                                         })) ?? []),
//                                         { label: 'Add new customer type', value: '__add_new__', user_id: '', parent: '__add_new__', id: '' }
//                                     ]}
//                                     getOptionLabel={(option) =>
//                                         typeof option === 'string' ? option : option.label || ''
//                                     }
//                                     freeSolo
//                                     renderOption={(props, option) => {
//                                         const { key, ...rest } = props;
//                                         return (
//                                             <li
//                                                 key={key}
//                                                 {...rest}
//                                                 style={{
//                                                     fontWeight:
//                                                         option.value === '__add_new__'
//                                                             ? 600
//                                                             : 400,
//                                                     color:
//                                                         option.value === '__add_new__'
//                                                             ? theme.palette.primary.main
//                                                             : 'inherit',
//                                                     ...(props.style || {}),
//                                                 }}
//                                             >
//                                                 {option.value === '__add_new__' ? (
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                         <AddCircleOutline fontSize="small" />
//                                                         {option.label}
//                                                     </Box>
//                                                 ) : (
//                                                     option.label
//                                                 )}
//                                             </li>
//                                         );
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             placeholder="Select customer type"
//                                             size="small"
//                                             error={!!validationErrors.parent}
//                                             helperText={validationErrors.parent || "Category for accounting purposes"}
//                                         />
//                                     )}
//                                     value={selectedTypeOption}
//                                     onChange={(_, newValue) => {
//                                         if (
//                                             newValue &&
//                                             typeof newValue === 'object' &&
//                                             'value' in newValue &&
//                                             newValue.value === '__add_new__'
//                                         ) {
//                                             setOpenGroupModal(true);
//                                         } else {
//                                             setSelectedTypeOption(newValue && typeof newValue === 'object' && 'value' in newValue
//                                                 ? { label: newValue.label, value: newValue.value, user_id: newValue.user_id, parent: newValue.parent, id: newValue.id }
//                                                 : typeof newValue === 'string'
//                                                     ? { label: newValue, value: newValue, user_id: '', parent: '', id: '' }
//                                                     : null);
//                                             handleInputChange(
//                                                 'parent',
//                                                 newValue && typeof newValue === 'object' && 'value' in newValue
//                                                     ? String(newValue.value)
//                                                     : typeof newValue === 'string'
//                                                         ? newValue
//                                                         : ''
//                                             );
//                                             handleInputChange(
//                                                 'parent_id',
//                                                 newValue && typeof newValue === 'object' && 'id' in newValue ? newValue.id || '' : ''
//                                             );
//                                         }
//                                     }}
//                                     sx={{
//                                         '& .MuiAutocomplete-endAdornment': { display: 'none' },
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: 1,
//                                             '&:hover': {
//                                                 '& > fieldset': {
//                                                     borderColor: theme.palette.primary.main,
//                                                 }
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </FormControl>

//                             <Box sx={{
//                                 backgroundColor: theme.palette.action.hover,
//                                 p: 2,
//                                 borderRadius: 1,
//                                 display: 'flex',
//                                 alignItems: 'flex-start',
//                                 gap: 1
//                             }}>
//                                 <InfoOutlined color="info" fontSize="small" />
//                                 <Typography variant="body2" color="text.secondary">
//                                     Customer types help categorize your customers for better accounting and reporting.
//                                 </Typography>
//                             </Box>
//                         </Box>
//                     </Paper>

//                     {/* Profile Section */}
//                     <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 2,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Person color="primary" />
//                                 Profile Information
//                             </Typography>
//                         </Box>

//                         <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
//                             {/* Image Upload Section */}
//                             {showProfileImage &&
//                                 <Box sx={{ width: '50%', position: 'relative' }} >
//                                     <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <PhotoCamera fontSize="small" color="primary" />
//                                         Profile Image
//                                         <Chip label="Optional" size="small" color="default" variant="outlined" />
//                                     </Typography>

//                                     <input
//                                         type="file"
//                                         accept="image/png, image/jpeg, image/jpg, image/webp"
//                                         style={{ display: 'none' }}
//                                         ref={customerImageRef}
//                                         onChange={e => {
//                                             const file = e.target.files?.[0];
//                                             if (file) handleImageChange(file);
//                                         }}
//                                     />

//                                     <Box
//                                         onClick={handleBoxClick}
//                                         onDrop={handleDrop}
//                                         onDragOver={e => e.preventDefault()}
//                                         onDragEnter={handleDragEnter}
//                                         onDragLeave={handleDragLeave}
//                                         sx={{
//                                             border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
//                                             borderRadius: 1,
//                                             p: 3,
//                                             position: 'relative',
//                                             textAlign: 'center',
//                                             cursor: 'pointer',
//                                             transition: 'all 0.3s ease',
//                                             backgroundColor: isDragActive ? theme.palette.primary.main + '10' : theme.palette.background.default,
//                                             minHeight: 150,
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             '&:hover': {
//                                                 borderColor: theme.palette.primary.main,
//                                                 backgroundColor: theme.palette.primary.main + '05',
//                                             },
//                                         }}
//                                     >
//                                         {imagePreview ? (
//                                             <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//                                                 <Avatar
//                                                     src={imagePreview}
//                                                     alt="Profile Preview"
//                                                     sx={{
//                                                         width: 100,
//                                                         height: 100,
//                                                         border: `3px solid ${theme.palette.primary.main}`,
//                                                         boxShadow: theme.shadows[2],
//                                                         transition: 'all 0.3s ease',
//                                                         objectFit: 'contain',
//                                                     }}
//                                                 />
//                                                 <Tooltip title="Remove image" TransitionComponent={Zoom}>
//                                                     <IconButton
//                                                         onClick={removeImage}
//                                                         sx={{
//                                                             position: 'absolute',
//                                                             top: 8,
//                                                             right: 8,
//                                                             backgroundColor: theme.palette.error.main,
//                                                             color: 'white',
//                                                             '&:hover': {
//                                                                 backgroundColor: theme.palette.error.dark,
//                                                                 transform: 'scale(1.1)'
//                                                             },
//                                                             width: 28,
//                                                             height: 28,
//                                                             transition: 'all 0.2s ease'
//                                                         }}
//                                                     >
//                                                         <Delete fontSize="small" />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                                 <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
//                                                     Click to change image
//                                                 </Typography>
//                                             </Box>
//                                         ) : (
//                                             <Fade in={true} timeout={500}>
//                                                 <Box>
//                                                     <CloudUpload
//                                                         sx={{
//                                                             fontSize: 48,
//                                                             color: theme.palette.primary.main,
//                                                             mb: 1
//                                                         }}
//                                                     />
//                                                     <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
//                                                         Upload Profile Image
//                                                     </Typography>
//                                                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                                                         Drag & drop or click to browse
//                                                     </Typography>
//                                                     <Typography variant="caption" color="text.secondary">
//                                                         PNG, JPEG, JPG, WebP • Max 5MB
//                                                     </Typography>
//                                                 </Box>
//                                             </Fade>
//                                         )}
//                                     </Box>

//                                 </Box>
//                             }

//                             <Box sx={{
//                                 mt: 3,
//                                 width: showProfileImage ? '50%' : '100%',
//                             }}>
//                                 {showBasicDetails && (<FormControl fullWidth sx={{ mb: 1 }}>
//                                     <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Person fontSize="small" color="primary" />
//                                         Full Name
//                                         <Chip label={requiredFields.includes('name') ? "Required" : 'Optional'} size="small" color={requiredFields.includes('name') ? "primary" : "default"} variant="outlined" />
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         size="small"
//                                         placeholder="John Doe"
//                                         value={data.name || ''}
//                                         required={requiredFields.includes('name')}
//                                         onChange={(e) => handleInputChange('name', e.target.value)}
//                                         error={!!validationErrors.name}
//                                         helperText={validationErrors.name || "Legal name of the customer"}
//                                         InputProps={{
//                                             sx: {
//                                                 borderRadius: 1,
//                                                 '&:hover': {
//                                                     '& > fieldset': {
//                                                         borderColor: theme.palette.primary.main,
//                                                     }
//                                                 },
//                                             }
//                                         }}
//                                     />
//                                 </FormControl>)}

//                                 {showMailingDetails && <FormControl fullWidth sx={{ mb: 1 }}>
//                                     <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Email fontSize="small" color="primary" />
//                                         Email
//                                         <Chip label={requiredFields.includes('email') ? "Required" : 'Optional'} size="small" color={requiredFields.includes('email') ? "primary" : "default"} variant="outlined" />
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         size="small"
//                                         required={requiredFields.includes('email')}
//                                         type="email"
//                                         placeholder="john@example.com"
//                                         value={data.email || ''}
//                                         onChange={(e) => handleInputChange('email', e.target.value)}
//                                         error={!!validationErrors.email}
//                                         helperText={validationErrors.email || "Primary contact email"}
//                                         InputProps={{
//                                             sx: {
//                                                 borderRadius: 1,
//                                             }
//                                         }}
//                                     />
//                                 </FormControl>}
//                             </Box>
//                         </Box>
//                     </Paper>

//                     {/* Contact Information Section */}
//                     {showMailingDetails && <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Phone color="primary" />
//                                 Contact Information
//                             </Typography>

//                         </Box>

//                         <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
//                             <FormControl fullWidth sx={{ mb: 2, width: '50%' }}>
//                                 <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Business fontSize="small" color="primary" />
//                                     Mailing Name
//                                     <Chip label={requiredFields.includes('name') ? "Required" : 'Optional'} size="small" color={requiredFields.includes('name') ? "primary" : "default"} variant="outlined" />
//                                 </Typography>
//                                 <TextField
//                                     fullWidth
//                                     size="small"
//                                     placeholder="Acme Inc."
//                                     value={data.mailing_name || ''}
//                                     onChange={(e) => handleInputChange('mailing_name', e.target.value)}
//                                     error={!!validationErrors.mailing_name}
//                                     helperText={validationErrors.mailing_name || "Customer's mailing name"}
//                                     InputProps={{
//                                         sx: {
//                                             borderRadius: 1,
//                                         }
//                                     }}
//                                 />
//                             </FormControl>

//                             <Box sx={{ mb: 2, widht: "50%" }}>
//                                 <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Phone fontSize="small" color="primary" />
//                                     Phone Number
//                                     <Chip label="Optional" size="small" color="default" variant="outlined" />
//                                 </Typography>
//                                 <Box sx={{ display: 'flex', gap: 2 }}>
//                                     <Box sx={{ width: '20%' }}>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="+91"
//                                             value={data.code}
//                                             onChange={(e) => handleInputChange('code', e.target.value)}
//                                             error={!!validationErrors.code}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </Box>
//                                     <Box sx={{ width: '80%' }}>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="1234567890"
//                                             value={data.number}
//                                             onChange={(e) => handleInputChange('number', e.target.value)}
//                                             error={!!validationErrors.number}
//                                             helperText={validationErrors.number || "10-digit phone number"}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </Box>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     </Paper>}

//                     {/* Address Information Section */}
//                     {showMailingDetails && <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <LocationOn color="primary" />
//                                 Address Information
//                             </Typography>

//                         </Box>

//                         <Box sx={{ mt: 2 }}>
//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                 <FormControl fullWidth sx={{ mb: 2, width: '50%' }}>
//                                     <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <CreditCard fontSize="small" color="primary" />
//                                         Mailing Address
//                                         <Chip label="Optional" size="small" color="default" variant="outlined" />
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         size="small"
//                                         placeholder="123 Main St, Apt 4B"
//                                         value={data.mailing_address || ''}
//                                         onChange={(e) => handleInputChange('mailing_address', e.target.value)}
//                                         error={!!validationErrors.mailing_address}
//                                         helperText={validationErrors.mailing_address || "Street address for correspondence"}
//                                         InputProps={{
//                                             sx: {
//                                                 borderRadius: 1,
//                                             }
//                                         }}
//                                         multiline
//                                         rows={3}
//                                     />
//                                 </FormControl>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Label fontSize="small" color="primary" />
//                                             Postal Code
//                                             <Chip label="Optional" size="small" color="default" variant="outlined" />
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="90210"
//                                             value={data.mailing_pincode || ''}
//                                             onChange={(e) => handleInputChange('mailing_pincode', e.target.value)}
//                                             error={!!validationErrors.mailing_pincode}
//                                             helperText={validationErrors.mailing_pincode || "6-digit postal code"}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>
//                             </Box>


//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Label fontSize="small" color="primary" />
//                                             Mailing Country
//                                             <Chip label={requiredFields.includes('mailing_country') ? "Required" : 'Optional'} size="small" color={requiredFields.includes('mailing_country') ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <Autocomplete
//                                             fullWidth
//                                             size="small"
//                                             options={[
//                                                 ...(countries?.map(con => ({
//                                                     label: con.name,
//                                                 })) ?? []),
//                                             ]}
//                                             getOptionLabel={(option) =>
//                                                 typeof option === 'string' ? option : option.label || ''
//                                             }
//                                             freeSolo
//                                             renderOption={(props, option) => {
//                                                 const { key, ...rest } = props;
//                                                 return (
//                                                     <li
//                                                         key={key}
//                                                         {...rest}
//                                                         style={{
//                                                             fontWeight: 400,
//                                                             color: 'inherit',
//                                                             ...(props.style || {}),
//                                                         }}
//                                                     >
//                                                         {option.label}
//                                                     </li>
//                                                 );
//                                             }}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     placeholder="Select mailing country"
//                                                     size="small"
//                                                     error={!!validationErrors.mailing_country}
//                                                     helperText={validationErrors.mailing_country || "Country for mailing address"}
//                                                 />
//                                             )}
//                                             value={data.mailing_country || ''}
//                                             onChange={(_, newValue) => {
//                                                 handleInputChange(
//                                                     'mailing_country',
//                                                     typeof newValue === 'string'
//                                                         ? newValue
//                                                         : (typeof newValue === 'object' && newValue !== null && 'label' in newValue)
//                                                             ? newValue.label
//                                                             : ''
//                                                 );
//                                             }}
//                                             sx={{
//                                                 '& .MuiAutocomplete-endAdornment': { display: 'none' },
//                                                 '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 1,
//                                                     '&:hover': {
//                                                         '& > fieldset': {
//                                                             borderColor: theme.palette.primary.main,
//                                                         }
//                                                     }
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <LocationOn fontSize="small" color="primary" />
//                                             Mailing State
//                                             <Chip label={requiredFields.includes('mailing_state') ? "Required" : 'Optional'} size="small" color={requiredFields.includes('mailing_state') ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <Autocomplete
//                                             fullWidth
//                                             size="small"
//                                             options={
//                                                 countries.filter(con => con.name === data.mailing_country)[0]?.states.length < 1
//                                                     ? ['No States']
//                                                     : countries.filter(con => con.name === data.mailing_country)[0]?.states
//                                             }
//                                             freeSolo
//                                             renderOption={(props, option) => {
//                                                 const { key, ...rest } = props;
//                                                 return (
//                                                     <li
//                                                         key={key}
//                                                         {...rest}
//                                                         style={{
//                                                             fontWeight: 400,
//                                                             color: 'inherit',
//                                                             ...(props.style || {}),
//                                                         }}
//                                                     >
//                                                         {option}
//                                                     </li>
//                                                 );
//                                             }}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     placeholder="Select mailing state"
//                                                     size="small"
//                                                     error={!!validationErrors.mailing_state}
//                                                     helperText={validationErrors.mailing_state || "State for mailing address"}
//                                                 />
//                                             )}
//                                             value={data.mailing_state || ''}
//                                             onChange={(_, newValue) => {
//                                                 handleInputChange(
//                                                     'mailing_state',
//                                                     countries.filter(con => con.name === data.mailing_country)[0]?.states.length < 1 ? '' : newValue || ''
//                                                 );
//                                             }}
//                                             sx={{
//                                                 '& .MuiAutocomplete-endAdornment': { display: 'none' },
//                                                 '& .MuiOutlinedInput-root': {
//                                                     borderRadius: 1,
//                                                     '&:hover': {
//                                                         '& > fieldset': {
//                                                             borderColor: theme.palette.primary.main,
//                                                         }
//                                                     }
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>

//                             </Box>
//                         </Box>
//                     </Paper>}

//                     {/* Bank Details Section */}
//                     {showBankDetails && <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <LocationOn color="primary" />
//                                 Bank Details
//                             </Typography>

//                         </Box>

//                         <Box sx={{ mt: 2 }}>
//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                 <FormControl fullWidth sx={{ mb: 2, width: '50%' }}>
//                                     <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <Label fontSize="small" color="primary" />
//                                         Account Holder Name
//                                         <Chip label={isBankOptional ? "Required" : 'Optional'} size="small" color={isBankOptional ? "primary" : "default"} variant="outlined" />
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         size="small"
//                                         placeholder="John Doe"
//                                         required={isBankOptional}
//                                         value={data.account_holder || ''}
//                                         onChange={(e) => handleInputChange('account_holder', e.target.value)}
//                                         error={!!validationErrors.bank_account_holder}
//                                         helperText={validationErrors.bank_account_holder || "Name on the bank account"}
//                                         InputProps={{
//                                             sx: {
//                                                 borderRadius: 1,
//                                             }
//                                         }}
//                                     />
//                                 </FormControl>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Label fontSize="small" color="primary" />
//                                             Account Number
//                                             <Chip label={isBankOptional ? "Required" : 'Optional'} size="small" color={isBankOptional ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="123456789012"
//                                             required={isBankOptional}
//                                             value={data.account_number || ''}
//                                             onChange={(e) => handleInputChange('account_number', e.target.value)}
//                                             error={!!validationErrors.account_number}
//                                             helperText={validationErrors.account_number || "12-digit account number"}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>
//                             </Box>

//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                 <FormControl fullWidth>
//                                     <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                         <LocationOn fontSize="small" color="primary" />
//                                         Bank Name
//                                         <Chip label={isBankOptional ? "Required" : 'Optional'} size="small" color={isBankOptional ? "primary" : "default"} variant="outlined" />
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         size="small"
//                                         placeholder="e.g. State Bank of India"
//                                         required={isBankOptional}
//                                         value={data.bank_name || ''}
//                                         onChange={(e) => handleInputChange('bank_name', e.target.value)}
//                                         error={!!validationErrors.bank_name}
//                                         helperText={validationErrors.bank_name || "Name of the bank"}
//                                         InputProps={{
//                                             sx: {
//                                                 borderRadius: 1,
//                                             }
//                                         }}
//                                     />
//                                 </FormControl>
//                             </Box>

//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <LocationOn fontSize="small" color="primary" />
//                                             IFSC Code
//                                             <Chip label={isBankOptional ? "Required" : 'Optional'} size="small" color={isBankOptional ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="e.g. SBIN0001234"
//                                             value={data.bank_ifsc || ''}
//                                             required={isBankOptional}
//                                             onChange={(e) => handleInputChange('bank_ifsc', e.target.value)}
//                                             error={!!validationErrors.bank_ifsc}
//                                             helperText={validationErrors.bank_ifsc}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>
//                                 <Box sx={{ width: '50%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Label fontSize="small" color="primary" />
//                                             Branch Name
//                                             <Chip label={isBankOptional ? "Required" : 'Optional'} size="small" color={isBankOptional ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="Main Branch, Downtown"
//                                             value={data.bank_branch || ''}
//                                             required={isBankOptional}
//                                             onChange={(e) => handleInputChange('bank_branch', e.target.value)}
//                                             error={!!validationErrors.bank_branch}
//                                             helperText={validationErrors.bank_branch || "Name of the bank branch"}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     </Paper>}

//                     {/* Tax Info Section */}
//                     {showGSTIN && <Paper
//                         elevation={0}
//                         sx={{
//                             p: 2,
//                             mb: 3,
//                             borderRadius: 2,
//                             border: `1px solid ${theme.palette.divider}`,
//                             backgroundColor: theme.palette.background.paper
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <LocationOn color="primary" />
//                                 Tax Information
//                             </Typography>

//                         </Box>

//                         <Box sx={{ mt: 2 }}>
//                             <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

//                                 {showGSTIN && <Box sx={{ width: '100%' }}>
//                                     <FormControl fullWidth>
//                                         <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Label fontSize="small" color="primary" />
//                                             GSTIN Number
//                                             <Chip label={!isGSTINOptional ? "Required" : 'Optional'} size="small" color={!isGSTINOptional ? "primary" : "default"} variant="outlined" />
//                                         </Typography>
//                                         <TextField
//                                             fullWidth
//                                             size="small"
//                                             placeholder="27XXXXXXXXXXXX"
//                                             value={data.gstin || ''}
//                                             required={!isGSTINOptional}
//                                             onChange={(e) => handleInputChange('gstin', e.target.value)}
//                                             error={!!validationErrors.gstin}
//                                             helperText={validationErrors.gstin || "15-digit GSTIN number"}
//                                             InputProps={{
//                                                 sx: {
//                                                     borderRadius: 1,
//                                                 }
//                                             }}
//                                         />
//                                     </FormControl>
//                                 </Box>}
//                             </Box>
//                         </Box>
//                     </Paper>}



//                     {/* Customer Group Editing Modal */}
//                     <CustomerGroupEditingModal
//                         open={openGroupModal}
//                         onClose={() => {
//                             setOpenGroupModal(false);
//                         }}
//                         group={null}
//                         onCreated={async (newGroup) => {
//                             dispatch(viewAllAccountingGroups(currentCompany?._id ?? ""));
//                             setSelectedTypeOption({
//                                 label: newGroup.name,
//                                 value: newGroup.name,
//                                 user_id: newGroup.user_id,
//                                 parent: newGroup.parent,
//                                 id: newGroup._id
//                             });
//                             setOpenGroupModal(false);
//                             setSelectedTypeOption({ label: newGroup.name, value: newGroup.name, user_id: newGroup.user_id, parent: newGroup.parent, id: newGroup._id });
//                             setData(prev => ({ ...prev, _cgroup: newGroup._id }));
//                             setData(prev => ({ ...prev, group: newGroup.name }));
//                             setOpenGroupModal(false);
//                         }}
//                     />
//                 </Box>
//             </Box>

//             {/* Footer with Action Buttons */}
//             <Box sx={{
//                 p: 2,
//                 borderTop: `1px solid ${theme.palette.divider}`,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 backgroundColor: theme.palette.background.paper,
//             }}>
//                 <Button
//                     variant="outlined"
//                     color="inherit"
//                     onClick={onClose}
//                     sx={{
//                         textTransform: 'none',
//                         px: 3,
//                         py: 1,
//                         fontSize: '0.875rem',
//                         fontWeight: 600,
//                         borderRadius: 1,
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                             backgroundColor: theme.palette.action.hover,
//                             transform: 'translateY(-1px)',
//                         }
//                     }}
//                 >
//                     Cancel
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
//                     onClick={handleSubmit}
//                     disabled={isLoading || !isFormValid}
//                     sx={{
//                         textTransform: 'none',
//                         px: 3,
//                         py: 1,
//                         fontSize: '0.875rem',
//                         fontWeight: 600,
//                         borderRadius: 1,
//                         background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                             background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
//                             transform: 'translateY(-1px)',
//                         },
//                         '&.Mui-disabled': {
//                             backgroundColor: theme.palette.action.disabledBackground,
//                             color: theme.palette.action.disabled,
//                         }
//                     }}
//                 >
//                     {isLoading ? 'Saving...' : 'Save Customer'}
//                 </Button>
//             </Box>
//         </Drawer>
//     );
// }

// export default EditCustomerModal;
