// import { useEffect, useMemo, useState } from 'react';
// import {
//   Box, Button, TextField, Typography, FormControl, Drawer, IconButton,
//   InputAdornment, Grid, Autocomplete, Paper,
//   useTheme
// } from '@mui/material';
// import { toast } from 'react-hot-toast';

// // Icons
// import CloseIcon from '@mui/icons-material/Close';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import PriceCheckIcon from '@mui/icons-material/PriceCheck';
// import { BillItem } from '@/utils/types';
// import { viewProductsWithId } from '@/services/products';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';

// interface AddItemModalProps {
//   open: boolean;
//   onClose: () => void;
//   onAddItem: (data: BillItem) => void;
// }

// const AddItemModal = (props: AddItemModalProps) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const theme = useTheme();
//   const { productsListing } = useSelector((state: RootState) => state.product);
//   const { open, onClose, onAddItem } = props;
//   const [formData, setFormData] = useState<BillItem>({
//     product_id: '',
//     quantity: 0,
//     product_name: '',
//     unit_price: 0,
//   });

//   const selectedProduct = useMemo(() => {
//     if (!formData?.product_id || !productsListing?.length) return null;
//     // Ensure we have a stable reference to the selected product
//     const foundProduct = productsListing.find(item => item?._id === formData.product_id);
//     return foundProduct || null;
//   }, [productsListing, formData.product_id]);

//   const handleChange = (field: keyof BillItem, value: string | number) => {
//     console.log("Field changed:", field, value);
//     setFormData({
//       ...formData,
//       [field]: value
//     });
//   };


//   const handleSubmit = () => {
//     // Validation
//     if (!formData.product_id || !formData.product_name) {
//       toast.error('Please select a product');
//       return;
//     }

//     if (formData.quantity <= 0) {
//       toast.error('Quantity must be greater than zero');
//       return;
//     }

//     if (formData.unit_price <= 0) {
//       toast.error('Price must be greater than zero');
//       return;
//     }

//     onAddItem(formData);

//     // Show success message
//     toast.success(`${formData.product_name} added successfully`);

//     // Reset form data after submission
//     setFormData({
//       product_id: '',
//       product_name: '',
//       quantity: 0,
//       unit_price: 0,
//     });
//     onClose();
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await dispatch(viewProductsWithId(''));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load products');
//       }
//     };

//     fetchData();
//   }, [dispatch]);

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: '100%',
//           maxWidth: 800,
//           p: 0,
//           overflowY: 'auto',
//           background: theme.palette.mode === 'light' ? '#f8fafc' : 'rgb(48, 47, 47)',
//           boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//           borderLeft: '2px solid #e0e0e0',
//         },
//       }}
//       {...(open ? {} : { inert: '' })}
//     >
//       <Box sx={{
//         p: 2,
//         display: 'flex',
//         justifyContent: 'space-between',
//         background: theme.palette.mode === 'light' ? '#ffffff' : 'rgb(0, 0, 0)',
//         alignItems: 'center',
//         borderBottom: '1px solid #e0e0e0',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <IconButton
//             onClick={onClose}
//             sx={{
//               borderWidth: 2,
//               borderColor: theme.palette.mode === 'light' ? 'rgb(48, 47, 47)' : '#f5f5f5',
//               '&:hover': {
//                 borderColor: theme.palette.mode === 'light' ? 'rgb(48, 47, 47)' : '#e0e0e0',
//                 transition: 'all 0.2s'
//               },
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Typography variant="h6" fontWeight="600">Add Item</Typography>
//         </Box>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<AddCircleOutlineIcon />}
//           onClick={handleSubmit}
//           sx={{
//             borderRadius: 1,
//             boxShadow: '0 2px 5px rgba(0,120,255,0.2)',
//             transition: 'all 0.2s',
//             '&:hover': {
//               transform: 'translateY(-2px)',
//               boxShadow: '0 4px 8px rgba(0,120,255,0.3)',
//             }
//           }}
//         >
//           Add Item
//         </Button>
//       </Box>

//       <Box sx={{ px: 3 }}>
//         <Box sx={{ p: 2 }}>
//           <Paper elevation={0} sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 1,
//             border: '1px solid #e0e0e0',
//             background: theme.palette.mode === 'light' ? 'linear-gradient(to right, #ffffff, #f9fbff)' : 'linear-gradient(to right, #1c1c1c, #2a2a2a)'
//           }}>
//             <Box sx={{
//               mb: 2,
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//             }}>
//               <PriceCheckIcon color="primary" />
//               <Typography variant="h6" fontWeight="600">Basic Details</Typography>
//             </Box>

//             <FormControl fullWidth sx={{ mb: 3 }}>
//               <Autocomplete
//                 fullWidth
//                 size="small"
//                 options={productsListing || []}
//                 getOptionLabel={(option) => option?.product_name || ''}
//                 isOptionEqualToValue={(option, value) => option?._id === value?._id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Type something for suggestions"
//                     size="small"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 1.5,
//                         '&:hover .MuiOutlinedInput-notchedOutline': {
//                           borderColor: 'primary.main',
//                         },
//                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                           borderWidth: '1px',
//                         }
//                       }
//                     }}
//                   />
//                 )}
//                 value={selectedProduct}
//                 onChange={(_, newValue) => {
//                   setFormData(prevData => ({
//                     ...prevData,
//                     product_id: newValue?._id || '',
//                     product_name: newValue?.product_name || '',
//                     unit_price: newValue?.price || prevData.unit_price
//                   }));
//                 }}
//                 filterOptions={(options, state) => {
//                   return options.filter(option =>
//                     option?.product_name?.toLowerCase().includes(state.inputValue.toLowerCase())
//                   );
//                 }}
//                 popupIcon={null}
//                 disablePortal
//                 sx={{
//                   '& .MuiAutocomplete-endAdornment': {
//                     display: 'none'
//                   }
//                 }}
//                 slotProps={{
//                   paper: {
//                     sx: {
//                       backgroundColor: '#fff',
//                       border: '1px solid #ddd',
//                       borderRadius: '8px',
//                       boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                     }
//                   }
//                 }}
//               />
//             </FormControl>

//             <FormControl fullWidth sx={{ mb: 1 }}>
//               <Typography variant="subtitle2" gutterBottom fontWeight="500">
//                 Opening Purchase Price (with tax)
//               </Typography>
//               <TextField
//                 fullWidth
//                 size="small"
//                 disabled
//                 value={selectedProduct?.price ? `₹${selectedProduct.price}` : '₹0.00'}
//                 InputProps={{
//                   sx: {
//                     borderRadius: 1.5,
//                   }
//                 }}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'primary.main',
//                     }
//                   }
//                 }}
//               />
//             </FormControl>
//           </Paper>

//           <Paper elevation={0} sx={{
//             p: 3,
//             mb: 2,
//             borderRadius: 1,
//             border: '1px solid #e0e0e0',
//             background: theme.palette.mode === 'light' ? 'linear-gradient(to right, #ffffff, #f9fbff)' : 'linear-gradient(to right, #1c1c1c, #2a2a2a)'
//           }}>
//             <Box sx={{
//               mb: 2,
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//             }}>
//               <InventoryIcon color="primary" />
//               <Typography variant="h6" fontWeight="600">Selling Stock</Typography>
//             </Box>

//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>

//                 <Typography variant="subtitle2" gutterBottom fontWeight="500">
//                   Selling Price
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Enter Selling Price"
//                   value={formData.unit_price}
//                   onChange={(e) => handleChange('unit_price', Number(e.target.value))}
//                   type="number"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">₹</InputAdornment>
//                     ),
//                     sx: {
//                       borderRadius: 1.5,
//                     }
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main',
//                       },
//                     }
//                   }}
//                 />
//                 <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
//                   Inclusive of Taxes
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2" gutterBottom fontWeight="500">
//                   Selling Quantity
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   type="number"
//                   value={formData.quantity === 0 ? '' : formData.quantity}
//                   onChange={(e) => handleChange('quantity', Number(e.target.value))}
//                   InputProps={{
//                     sx: {
//                       borderRadius: 1.5,
//                     }
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'primary.main',
//                       }
//                     }
//                   }}
//                 />
//                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
//                   *Quantity of the product available in your inventory
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <Typography variant="subtitle2" gutterBottom fontWeight="500">
//                   Opening Stock Value (with tax)
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   disabled
//                   value={
//                     formData.unit_price && formData.quantity
//                       ? `₹${(formData.unit_price * formData.quantity).toFixed(2)}`
//                       : '₹0.00'
//                   }
//                   InputProps={{
//                     sx: {
//                       borderRadius: 1.5,
//                       // backgroundColor: '#f5f7fa'
//                     }
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             startIcon={<AddCircleOutlineIcon />}
//             onClick={handleSubmit}
//             size="large"
//             sx={{
//               borderRadius: 1,
//               py: 1.5,
//               boxShadow: '0 4px 10px rgba(0,120,255,0.2)',
//               // background: 'linear-gradient(45deg, #1976d2, #2196f3)',
//               transition: 'all 0.3s',
//               '&:hover': {
//                 // background: 'linear-gradient(45deg, #1565c0, #1976d2)',
//                 boxShadow: '0 6px 15px rgba(0,120,255,0.3)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             Add Item
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default AddItemModal;
