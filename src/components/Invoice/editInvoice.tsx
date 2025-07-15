// import React, { useEffect, useState } from 'react';
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Divider,
//   Paper,
//   IconButton,
//   // Chip,
//   Fade,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
//   Modal,
//   Autocomplete,
//   InputAdornment,
//   Alert,
//   Stepper,
//   Step,
//   StepLabel,
//   Container,
//   Backdrop,
//   CircularProgress,
//   Avatar,
//   useTheme,
//   alpha,
//   Collapse,
//   Stack
// } from "@mui/material";
// import {
//   Inventory,
//   Calculate,
//   Assignment,
//   Delete,
//   Add,
//   // Person,
//   Receipt,
//   DateRange,
//   CheckCircle,
//   Save,
//   AddCircleOutline,
//   BusinessCenter,
//   LocalOffer,
//   TrendingUp,
//   PeopleAlt,
//   Info
// } from "@mui/icons-material";
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { getAllInvoiceGroups } from '@/services/accountingGroup';
// import { viewAllCustomerWithType } from '@/services/customers';
// import { viewProductsWithId } from '@/services/products';
// import { createInvoice } from '@/services/invoice';
// import { useNavigate } from 'react-router-dom';

// // Interfaces
// interface InvoiceItems {
//   vouchar_id: string;
//   item: string;
//   item_id: string;
//   quantity: number;
//   rate: number;
//   amount: number;
// }

// interface InvoiceAccounting {
//   vouchar_id: string;
//   ledger: string;
//   ledger_id: string;
//   amount: number;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (vouchar_type: string) => void;
// }

// // Styled Components
// const StyledCard = ({ children, ...props }: any) => {
//   const theme = useTheme();
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: 1,
//         border: `1px solid ${alpha(theme.palette.primary.dark, 1)}`,
//         background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
//         backdropFilter: 'blur(10px)',
//         transition: 'all 0.3s ease-in-out',
//         // '&:hover': {
//         //   borderColor: alpha(theme.palette.primary.dark, 1),
//         // },
//         ...props.sx
//       }}
//       {...props}
//     >
//       {children}
//     </Card>
//   );
// };

// const AnimatedTableRow = ({ children, ...props }: any) => (
//   <TableRow
//     sx={{
//       transition: 'all 0.2s ease-in-out',
//       '&:hover': {
//         backgroundColor: alpha('#1976d2', 0.04),
//       },
//       ...props.sx
//     }}
//     {...props}
//   >
//     {children}
//   </TableRow>
// );

// const InvoiceTypeModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
//   const [voucharType, setVoucharType] = useState("");
//   const theme = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentCompany } = useSelector((state: RootState) => state.auth);
//   const { invoiceGroupList } = useSelector((state: RootState) => state.accountingGroup);

//   const handleSubmit = () => {
//     if (voucharType.trim()) {
//       onSubmit(voucharType);
//     }
//   };

//   const modalStyle = {
//     position: "absolute" as const,
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: { xs: '90%', sm: 500 },
//     maxHeight: '90vh',
//     bgcolor: "background.paper",
//     borderRadius: 4,
//     boxShadow: theme.shadows[24],
//     p: 0,
//     overflow: 'hidden'
//   };

//   useEffect(() => {
//     dispatch(getAllInvoiceGroups(currentCompany?._id || ''));
//   }, [dispatch, currentCompany?._id]);


//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{
//         timeout: 500,
//         sx: { backgroundColor: alpha('#000', 0.7) }
//       }}
//     >
//       <Fade in={open}>
//         <Box sx={modalStyle}>
//           {/* Header */}
//           <Box
//             sx={{
//               background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//               color: 'white',
//               p: 4,
//               textAlign: 'center'
//             }}
//           >
//             <Receipt sx={{ fontSize: 48, mb: 2 }} />
//             <Typography variant="h5" fontWeight="600">
//               Create New Invoice
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
//               Select the type of invoice you want to create
//             </Typography>
//           </Box>

//           {/* Content */}
//           <Box sx={{ p: 4 }}>
//             <Autocomplete
//               options={invoiceGroupList}
//               getOptionLabel={(option) => option.name}
//               value={invoiceGroupList.find(group => group._id === voucharType) || null}
//               onChange={(_, newValue) => setVoucharType(newValue?.name || "")}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Invoice Type"
//                   placeholder="Choose invoice type..."
//                   variant="outlined"
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <BusinessCenter color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               )}
//               sx={{
//                 '& .MuiAutocomplete-endAdornment': {
//                   display: 'none'
//                 }
//               }}
//               renderOption={(props, option) => (
//                 <Box component="li" {...props} sx={{ p: 2 }}>
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight="500">
//                       {option.name}
//                     </Typography>
//                   </Box>
//                 </Box>
//               )}
//             />

//             <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
//               <Button
//                 variant="outlined"
//                 onClick={onClose}
//                 fullWidth
//                 sx={{
//                   py: 1.5,
//                   borderRadius: 1,
//                   textTransform: 'none',
//                   fontSize: '1rem'
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 disabled={!voucharType}
//                 fullWidth
//                 sx={{
//                   py: 1.5,
//                   borderRadius: 1,
//                   textTransform: 'none',
//                   fontSize: '1rem',
//                   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
//                 }}
//                 startIcon={<CheckCircle />}
//               >
//                 Continue
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Fade>
//     </Modal>
//   );
// };

// // Main Component
// export default function EditInvoice() {
//   const [promptModal, setPromptModal] = useState(true);
//   const [voucharType, setVoucharType] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [parties, setParties] = useState<{ id: string; name: string; }[]>([]);
//   const [counterParties, setCounterParties] = useState<{ id: string; name: string; }[]>([]);
//   const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string }[]>([]);
//   const theme = useTheme();

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { currentCompany } = useSelector((state: RootState) => state.auth);

//   const [data, setData] = useState({
//     company_id: "",
//     date: new Date().toISOString().split('T')[0],
//     voucher_type: "",
//     voucher_number: "INV-" + Date.now().toString().slice(-6),
//     party_name: "",
//     party_id: "",
//     counter_party: "",
//     counter_id: "",
//     narration: "",
//     reference_number: "",
//     reference_date: "",
//     place_of_supply: "",
//     accounting: [] as InvoiceAccounting[],
//     items: [] as InvoiceItems[],
//   });

//   const steps = ['Invoice Details', 'Add Items', 'Review & Submit'];

//   const handleAddItem = () => {
//     const newItem: InvoiceItems = {
//       vouchar_id: '',
//       item: '',
//       item_id: '',
//       quantity: 1,
//       rate: 0.0,
//       amount: 0.0
//     };
//     setData(prev => ({
//       ...prev,
//       items: [...prev.items, newItem]
//     }));
//   };

//   const handleRemoveItem = (index: number) => {
//     setData(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index)
//     }));
//   };

//   const handleItemChange = (index: number, field: keyof InvoiceItems, value: any) => {
//     setData(prev => ({
//       ...prev,
//       items: prev.items.map((item, i) => {
//         if (i === index) {
//           const updatedItem = { ...item, [field]: value };
//           // Auto-calculate amount
//           if (field === 'quantity' || field === 'rate') {
//             updatedItem.amount = updatedItem.quantity * updatedItem.rate;
//           }
//           return updatedItem;
//         }
//         return item;
//       })
//     }));
//   };

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const calculateTotals = () => {
//     const subtotal = data.items.reduce((sum, item) => sum + (item.amount || 0), 0);
//     const grandTotal = subtotal; // Add tax calculations here if needed
//     return { subtotal, grandTotal };
//   };

//   const {  grandTotal } = calculateTotals();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const dataToSend = {
//       ...data,
//       company_id: currentCompany?._id || '',
//       items: data.items.map(item => ({
//         ...item,
//         vouchar_id: '',
//       })),
//       accounting: [
//         {
//           vouchar_id: '',
//           ledger: data.party_name,
//           ledger_id: data.party_id,
//           amount: voucharType === 'Sales' ? -grandTotal : grandTotal,
//         },
//         {
//           vouchar_id: '',
//           ledger: data.counter_party,
//           ledger_id: data.counter_id,
//           amount: voucharType === 'Sales' ? grandTotal : -grandTotal,
//         }
//       ],
//     }

//     dispatch(createInvoice(dataToSend)).then(() => {
//       setIsLoading(false);
//       navigate('/invoices', { replace: true });
//     })
//   };

//   const handleNext = () => {
//     setActiveStep((prevStep) => prevStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   useEffect(() => {
//     if (currentCompany) {
//       setData(prev => ({
//         ...prev,
//         company_id: currentCompany._id,
//       }));
//     }

//     dispatch(viewAllCustomerWithType({
//       company_id: currentCompany?._id || '',
//       customerType: voucharType === 'Sales' ? 'Debtors' : 'Customers',
//     })).then((response) => {
//       if (response.meta.requestStatus === 'fulfilled') {
//         const ledgersWithType = response.payload;
//         setParties(ledgersWithType.map((part: any) => ({ name: part.name, id: part._id })));
//       }
//     }
//     ).catch((error) => {
//       console.error('Error fetching customers:', error);
//     });

//     dispatch(viewAllCustomerWithType({
//       company_id: currentCompany?._id || '',
//       customerType: voucharType === 'Sales' ? 'Sales Account' : 'Purchase Account',
//     })).then((response) => {
//       if (response.meta.requestStatus === 'fulfilled') {
//         const ledgersWithType = response.payload;
//         setCounterParties(ledgersWithType.map((part: any) => ({ name: part.name, id: part._id })));
//       }
//     }
//     ).catch((error) => {
//       console.error('Error fetching customers:', error);
//     });

//     dispatch(viewProductsWithId(currentCompany?._id || '')).then((response) => {
//       if (response.meta.requestStatus === 'fulfilled') {
//         const products = response.payload;
//         setItemsList(
//           products.map((product: any) => ({
//             name: product.name,
//             id: product._id,
//             unit: product.unit,
//           }))
//         );
//       }
//       return response;
//     });
//   }, [dispatch, currentCompany?._id, voucharType, currentCompany]);


//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Header Section */}
//       <Box sx={{ mb: 4 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Avatar
//             sx={{
//               bgcolor: 'primary.main',
//               width: 56,
//               height: 56,
//               mr: 3
//             }}
//           >
//             <Receipt sx={{ fontSize: 32 }} />
//           </Avatar>
//           <Box>
//             <Typography variant="h4" fontWeight="700" color="primary.main">
//               Create Invoice
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary">
//               Generate professional invoices with ease
//             </Typography>
//           </Box>
//         </Box>

//         {/* Progress Stepper */}
//         <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel
//                 sx={{
//                   '& .MuiStepLabel-label': {
//                     fontSize: '1rem',
//                     fontWeight: 500
//                   }
//                 }}
//               >
//                 {label}
//               </StepLabel>
//             </Step>
//           ))}
//         </Stepper>
//       </Box>

//       {/* Main Form */}
//       <StyledCard>
//         <CardContent sx={{ p: 4 }}>
//           <Box component="form" onSubmit={handleSubmit}>

//             {/* Step 1: Invoice Details */}
//             <Collapse in={activeStep === 0}>
//               <Box p={2}>
//                 <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                   <DateRange sx={{ mr: 2, color: 'primary.main' }} />
//                   Invoice Information
//                 </Typography>

//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <StyledCard>
//                       <CardContent>
//                         <Box display="flex" alignItems="center" mb={3}>
//                           <Receipt color="primary" sx={{ mr: 1 }} />
//                           <Typography variant="h6">Invoice Details {voucharType}</Typography>
//                         </Box>

//                         <Stack spacing={2}>
//                           <TextField
//                             label="Invoice Number"
//                             fullWidth
//                             value={data.voucher_number}
//                             onChange={handleChange}
//                             name="voucher_number"
//                             variant="outlined"
//                             InputProps={{
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                   <LocalOffer color="action" />
//                                 </InputAdornment>
//                               ),
//                             }}
//                           />

//                           <TextField
//                             label="Invoice Date"
//                             type="date"
//                             fullWidth
//                             value={data.date}
//                             onChange={handleChange}
//                             name="date"
//                             variant="outlined"
//                             InputLabelProps={{ shrink: true }}
//                           />

//                         </Stack>
//                       </CardContent>
//                     </StyledCard>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <StyledCard>
//                       <CardContent>
//                         <Box display="flex" alignItems="center" mb={3}>
//                           <PeopleAlt color="primary" sx={{ mr: 1 }} />
//                           <Typography variant="h6">Party Information</Typography>
//                         </Box>

//                         <Stack spacing={2}>
//                           <Autocomplete
//                             options={parties}
//                             getOptionLabel={(option) => option.name}
//                             value={parties.find(p => p.id === data.party_id) || null}
//                             onChange={(_, newValue) =>
//                               setData(prev => ({
//                                 ...prev,
//                                 party_name: newValue ? newValue.name : '',
//                                 party_id: newValue ? newValue.id : ''
//                               }))
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Select Party"
//                                 placeholder="Start typing for party suggestions..."
//                                 variant="outlined"
//                                 fullWidth
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       <BusinessCenter color="primary" />
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                               />
//                             )}
//                             sx={{
//                               '& .MuiAutocomplete-endAdornment': {
//                                 display: 'none'
//                               }
//                             }}
//                           />
//                           <Autocomplete
//                             options={counterParties}
//                             getOptionLabel={(option) => option.name}
//                             value={counterParties.find(p => p.id === data.counter_id) || null}
//                             onChange={(_, newValue) =>
//                               setData(prev => ({
//                                 ...prev,
//                                 counter_party: newValue ? newValue.name : '',
//                                 counter_id: newValue ? newValue.id : ''
//                               }))
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Select Counter-Party"
//                                 placeholder="Start typing for counter-party suggestions..."
//                                 variant="outlined"
//                                 fullWidth
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <InputAdornment position="start">
//                                       <BusinessCenter color="primary" />
//                                     </InputAdornment>
//                                   ),
//                                 }}
//                                 sx={{
//                                   '& .MuiAutocomplete-endAdornment': {
//                                     display: 'none'
//                                   }
//                                 }}
//                               />
//                             )}
//                           />
//                         </Stack>
//                       </CardContent>
//                     </StyledCard>
//                   </Grid>
//                 </Grid>

//                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="contained"
//                     onClick={handleNext}
//                     disabled={!data.party_name || !data.voucher_number || !data.date || !data.counter_party}
//                     sx={{ px: 4, py: 1.5, borderRadius: 1 }}
//                     endIcon={<TrendingUp />}
//                   >
//                     Next: Add Items
//                   </Button>
//                 </Box>
//               </Box>
//             </Collapse>

//             {/* Step 2: Items */}
//             <Collapse in={activeStep === 1}>
//               <Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                   <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Inventory sx={{ mr: 2, color: 'primary.main' }} />
//                     Invoice Items
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<AddCircleOutline />}
//                     onClick={handleAddItem}
//                     sx={{ borderRadius: 1 }}
//                   >
//                     Add Item
//                   </Button>
//                 </Box>

//                 <TableContainer
//                   component={Paper}
//                   sx={{
//                     borderRadius: 1,
//                     overflow: "hidden",
//                     boxShadow: theme.shadows[4],
//                     border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
//                   }}
//                 >
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
//                         <TableCell width={'50%'} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Product Name</TableCell>
//                         <TableCell width={'12%'} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantity</TableCell>
//                         <TableCell width={'12%'} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rate (&#8377;)</TableCell>
//                         <TableCell width={'12%'} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount (&#8377;)</TableCell>
//                         <TableCell width={'12%'} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Action</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {data.items.map((item, index) => (
//                         <AnimatedTableRow key={index}>
//                           <TableCell>
//                             <Autocomplete
//                               options={itemsList}
//                               getOptionLabel={(option) =>
//                                 typeof option === 'string'
//                                   ? option
//                                   : option?.name || ''
//                               }
//                               value={
//                                 itemsList.find((p) => p.id === item.item_id) ||
//                                 (item.item ? { id: '', name: item.item, unit: '' } : null)
//                               }
//                               onChange={(_, newValue) => {
//                                 if (typeof newValue === 'string') {
//                                   handleItemChange(index, 'item', newValue);
//                                   handleItemChange(index, 'item_id', '');
//                                 } else if (newValue && typeof newValue === 'object') {
//                                   handleItemChange(index, 'item', newValue.name);
//                                   handleItemChange(index, 'item_id', newValue.id);
//                                 } else {
//                                   handleItemChange(index, 'item', '');
//                                   handleItemChange(index, 'item_id', '');
//                                 }
//                               }}
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   placeholder="Start typing for items suggestions..."
//                                   variant="outlined"
//                                   fullWidth
//                                   size="small"
//                                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, width: '100%' } }}
//                                 />
//                               )}
//                               sx={{
//                                 '& .MuiAutocomplete-endAdornment': {
//                                   display: 'none'
//                                 }
//                               }}
//                               isOptionEqualToValue={(option, value) => option.id === value.id}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               type="number"
//                               value={item.quantity}
//                               onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
//                               variant="outlined"
//                               size="small"
//                               fullWidth
//                               inputProps={{ min: 0, step: 0.01 }}
//                               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, maxWidth: 90 } }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               type="number"
//                               value={item.rate}
//                               onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
//                               variant="outlined"
//                               size="small"
//                               fullWidth
//                               inputProps={{ min: 0, step: 0.01 }}
//                               InputProps={{
//                                 startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
//                               }}
//                               sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, maxWidth: 90 } }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Box
//                               sx={{
//                                 py: 1,
//                                 bgcolor: alpha(theme.palette.success.main, 0.1),
//                                 borderRadius: 1,
//                                 border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
//                                 textAlign: 'center',
//                                 fontWeight: 'bold',
//                                 color: 'success.main',
//                                 maxWidth: 100
//                               }}
//                             >
//                               &#8377;{item.amount.toFixed(2)}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Tooltip title="Remove Item">
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleRemoveItem(index)}
//                                 sx={{
//                                   '&:hover': {
//                                     backgroundColor: alpha(theme.palette.error.main, 0.1)
//                                   }
//                                 }}
//                               >
//                                 <Delete />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </AnimatedTableRow>
//                       ))}

//                       {data.items.length === 0 && (
//                         <TableRow>
//                           <TableCell colSpan={5}>
//                             <Box py={1} textAlign="center">
//                               <Inventory sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
//                               <Typography variant="h6" color="text.secondary" gutterBottom>
//                                 No items added yet
//                               </Typography>
//                               <Typography variant="body2" color="text.secondary" mb={2}>
//                                 Click "Add Item" to start building your invoice
//                               </Typography>
//                               <Button
//                                 variant="contained"
//                                 startIcon={<Add />}
//                                 onClick={handleAddItem}
//                                 sx={{ borderRadius: 1 }}
//                               >
//                                 Add First Item
//                               </Button>
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//                   <TextField
//                     label="Remarks"
//                     fullWidth
//                     size='small'
//                     // sx={{ maxWidth: 400 }}
//                     value={data.narration}
//                     onChange={handleChange}
//                     name="narration"
//                     variant="outlined"
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Info color="action" />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Box>
//                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//                   <Button
//                     variant="outlined"
//                     onClick={handleBack}
//                     sx={{ px: 4, py: 1.5, borderRadius: 1 }}
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     variant="contained"
//                     onClick={handleNext}
//                     disabled={data.items.length === 0 || data.items.some(item => !item.item || item.quantity <= 0 || item.rate < 0)}
//                     sx={{ px: 4, py: 1.5, borderRadius: 1 }}
//                     endIcon={<Calculate />}
//                   >
//                     Review Invoice
//                   </Button>
//                 </Box>
//               </Box>
//             </Collapse>

//             {/* Step 3: Review */}
//             <Collapse in={activeStep === 2}>
//               <Box p={2}>
//                 <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                   <Assignment sx={{ mr: 2, color: 'primary.main' }} />
//                   Invoice Summary {voucharType}
//                 </Typography>

//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={8}>
//                     <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//                       <Typography variant="subtitle2">
//                         Review all details before submitting your invoice
//                       </Typography>
//                     </Alert>

//                     <StyledCard>
//                       <CardContent>
//                         <Typography variant="h6" gutterBottom>Invoice Details</Typography>
//                         <Divider sx={{ my: 2 }} />
//                         <Grid container spacing={2}>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" color="text.secondary">Party Name:</Typography>
//                             <Typography variant="body1" fontWeight="500">{data.party_name || 'Not specified'}</Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" color="text.secondary">Counter Party Name:</Typography>
//                             <Typography variant="body1" fontWeight="500">{data.counter_party || 'Not specified'}</Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" color="text.secondary">Invoice Number:</Typography>
//                             <Typography variant="body1" fontWeight="500">{data.voucher_number}</Typography>
//                           </Grid>
//                           <Grid item xs={6}>
//                             <Typography variant="body2" color="text.secondary">Date:</Typography>
//                             <Typography variant="body1" fontWeight="500">{data.date}</Typography>
//                           </Grid>
//                         </Grid>
//                       </CardContent>
//                     </StyledCard>
//                   </Grid>

//                   <Grid item xs={12} md={4}>
//                     <StyledCard>
//                       <CardContent>
//                         <Box display="flex" alignItems="center" mb={2}>
//                           <Calculate color="primary" sx={{ mr: 1 }} />
//                           <Typography variant="h6">Payment Summary</Typography>
//                         </Box>

//                         <Box
//                           sx={{
//                             p: 3,
//                             borderRadius: 1,
//                             bgcolor: alpha(theme.palette.primary.main, 0.05),
//                             border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
//                           }}
//                         >
//                           <Box display="flex" justifyContent="space-between" mb={2}>
//                             <Typography variant="body1" color="text.secondary">
//                               Items Count:
//                             </Typography>
//                             <Typography variant="body1" fontWeight="600">
//                               {data.items.length} items
//                             </Typography>
//                           </Box>
//                           <Divider sx={{ my: 2 }} />
//                           <Box display="flex" justifyContent="space-between">
//                             <Typography variant="h6" color="primary.main">
//                               Grand Total:
//                             </Typography>
//                             <Typography variant="h6" color="primary.main" fontWeight="700">
//                               &#8377;{grandTotal.toFixed(2)}
//                             </Typography>
//                           </Box>
//                           <Divider sx={{ my: 2 }} />
//                         </Box>

//                         <Box display="flex" justifyContent="flex-start" gap={1} mt={2}>
//                           <Typography variant="body1" color="text.secondary">
//                             Remarks:
//                           </Typography>
//                           <Typography variant="body1" fontWeight="600">
//                             {data.narration || 'No Remarks'}
//                           </Typography>
//                         </Box>

//                         {/* <Box mt={1}>
//                           <Chip
//                             label="Ready to Submit"
//                             color="success"
//                             icon={<CheckCircle />}
//                             sx={{ borderRadius: 1, fontWeight: 'bold' }}
//                           />
//                         </Box> */}
//                       </CardContent>
//                     </StyledCard>
//                   </Grid>
//                 </Grid>

//                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//                   <Button
//                     variant="outlined"
//                     onClick={handleBack}
//                     sx={{ px: 4, py: 1.5, borderRadius: 1 }}
//                   >
//                     Back to Items
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     disabled={isLoading}
//                     sx={{
//                       px: 4,
//                       py: 1.5,
//                       borderRadius: 1,
//                       // background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
//                     }}
//                     startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
//                   >
//                     {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
//                   </Button>
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>
//         </CardContent>
//       </StyledCard>

//       {/* Invoice Type Modal */}
//       <InvoiceTypeModal
//         open={promptModal}
//         onClose={() => setPromptModal(false)}
//         onSubmit={(voucharTypeValue) => {
//           setVoucharType(voucharTypeValue);

//           setData(prev => ({ ...prev, voucher_type: voucharTypeValue }));
//           setPromptModal(false);
//         }}
//       />
//     </Container>
//   );
// }