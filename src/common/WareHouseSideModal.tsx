// import { useEffect, useMemo, useState } from 'react';
// import {
//     Box,
//     Button,
//     InputAdornment,
//     TextField,
//     Typography,
//     FormControl,
//     Drawer,
//     IconButton,
//     Autocomplete,
//     useTheme,
// } from '@mui/material';

// // Icons
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import CloseIcon from '@mui/icons-material/Close';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import { OrderCreate, OrderStatus, StockOutState, InventoryItem } from '@/utils/types';
// import { sellProduct } from '@/services/products';
// import { AppDispatch, RootState } from '@/store/store';
// import { useDispatch, useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { createOrder, createOrderDetails, getStockistShops } from '@/services/order';

// interface SideModalProps {
//     drawer: {
//         isOpen: boolean;
//         type: 'stockIn' | 'stockOut' | null;
//         product: InventoryItem | null;
//     };
//     setDrawer: React.Dispatch<React.SetStateAction<{
//         isOpen: boolean;
//         type: 'stockIn' | 'stockOut' | null;
//         product: InventoryItem | null;
//     }>>;
// }

// const SideModal = (props: SideModalProps) => {
//     const navigate = useNavigate();
//     const theme = useTheme();
//     const { setDrawer, drawer } = props;
//     const dispatch = useDispatch<AppDispatch>();
//     const { stockistShops, } = useSelector((state: RootState) => state.order);
//     const [formData, setFormData] = useState({
//         stockist_id: "",
//         order_date: new Date().toISOString().split("T")[0],
//         total_amount: 0,
//     });

//     const [stockOutData, setStockOutData] = useState<StockOutState>({
//         quantity: 0,
//         product_id: '',
//         unit_price: 0,
//     });

//     const handleChange = (field: keyof StockOutState, value: string) => {
//         setStockOutData({
//             ...stockOutData,
//             [field]: value
//         });
//     };

//     const selectedStockist = useMemo(() => {
//         if (!formData?.stockist_id || !stockistShops?.length) return null;
//         const foundStockist = stockistShops.find(item => item?._id === formData.stockist_id);
//         return foundStockist || null;
//     }, [stockistShops, formData.stockist_id]);

//     const handleRemoveQuantity = async () => {
//         try {
//             const updatedStockOutData: StockOutState = {
//                 ...stockOutData,
//                 product_id: drawer.product?.product_id || '',
//             };

//             toast.promise(
//                 dispatch(sellProduct({ data: [updatedStockOutData] })).unwrap()
//                     .then(() => {
//                         navigate(`/timeline`);
//                     }),
//                 {
//                     loading: "Removing product quantity ...",
//                     success: <b>Product Quantity Removed!</b>,
//                     error: <b>Could not Remove.</b>,
//                 },
//             );
//         } catch (error) {
//             console.error("Error removing quantity:", error);
//             toast.error("Failed to remove quantity");

//         }
//     };

//     const handleAddQuantity = async () => {
//         try {
//             const newOrder: OrderCreate = {
//                 stockist_id: formData.stockist_id,
//                 order_date: formData.order_date,
//                 total_amount: formData.total_amount
//             };

//             const updatedStockOutData: StockOutState = {
//                 ...stockOutData,
//                 product_id: drawer.product?.product_id || '',
//             };
//             const result = await dispatch(createOrder({
//                 data: newOrder,
//                 status: OrderStatus.PENDING
//             })).unwrap();

//             if (result.id) {
//                 const data = {
//                     "order_id": result.id ?? "",
//                     "product_details": [updatedStockOutData],
//                 };

//                 // updatedStockOutData.order_id = result?.id;
//                 dispatch(createOrderDetails({ data })).then(() => {
//                     toast.success("Order created successfully!");
//                     navigate(`/timeline`);
//                 });
//             }

//             toast.promise(
//                 dispatch(createOrder({
//                     data: newOrder,
//                     status: OrderStatus.PENDING
//                 })).unwrap().then((result) => {

//                     if (result.id) {
//                         const data = {
//                             "order_id": result.id ?? "",
//                             "product_details": [updatedStockOutData],
//                         };
//                         dispatch(createOrderDetails({ data })).then(() => {
//                             toast.success("Order created successfully!");
//                             navigate(`/timeline`);
//                         });
//                     }
//                 }),
//                 {
//                     loading: "Removing product quantity ...",
//                     success: <b>Product Quantity Removed!</b>,
//                     error: <b>Could not Remove.</b>,
//                 },
//             );
//         } catch (error) {
//             console.error("Error removing quantity:", error);
//             toast.error("Failed to remove quantity");

//         }
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 await dispatch(getStockistShops()).unwrap();
//             } catch (err) {
//                 console.error('Error fetching stockists:', err);
//             }
//         };
//         if (drawer.type === "stockIn") {
//             fetchData();
//         }
//     }, [dispatch, drawer.type]);

//     return (
//         <Drawer
//             anchor="right"
//             open={drawer.isOpen && drawer.type !== null}
//             onClose={() => setDrawer({
//                 isOpen: false,
//                 type: null,
//                 product: null,
//             })}
//             PaperProps={{
//                 sx: {
//                     width: { xs: '100%', sm: 600 },
//                     p: 0,
//                     backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : 'rgb(48, 47, 47)',
//                     borderLeft: '2px solid #e0e0e0',
//                 }
//             }}
//             {...(drawer.isOpen && drawer.type !== null ? {} : { inert: '' })}
//         >
//             <Box sx={{
//                 p: 2,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 borderBottom: '1px solid #e0e0e0',
//                 backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'rgb(0, 0, 0)',

//             }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, }}>
//                     <IconButton
//                         sx={{
//                             borderWidth: 2,
//                             borderColor: theme.palette.mode === 'light' ? 'rgb(48, 47, 47)' : '#f5f5f5',
//                             '&:hover': {
//                                 borderColor: theme.palette.mode === 'light' ? 'rgb(48, 47, 47)' : '#e0e0e0',
//                             },
//                         }}
//                         onClick={() => setDrawer({
//                             isOpen: false,
//                             type: null,
//                             product: null,
//                         })} >
//                         <CloseIcon
//                         />
//                     </IconButton>
//                     <Typography variant="h6" component="div">
//                         {drawer.product?.productDetails?.product_name}
//                     </Typography>
//                 </Box>
//                 <Button
//                     variant="contained"
//                     color={drawer?.type === "stockOut" ? "error" : "success"}
//                     startIcon={drawer?.type === "stockOut" ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
//                     onClick={() => {
//                         setDrawer({
//                             isOpen: false,
//                             type: null,
//                             product: null,
//                         });
//                         if (drawer?.type === "stockOut") { handleRemoveQuantity() } else { handleAddQuantity() };
//                     }}
//                 >
//                     {drawer?.type === "stockOut" ? "Remove quantity" : "Add quantity"}
//                 </Button>
//             </Box>

//             <Box sx={{ p: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                     <Typography variant="h6" component="div">
//                         Quantity information
//                     </Typography>
//                 </Box>

//                 <Box sx={{ mb: 4, backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'rgb(0, 0, 0)', borderRadius: '8px', p: 2 }}>
//                     <FormControl fullWidth sx={{ mb: 3 }}>
//                         <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                             <span style={{ color: '#f44336' }}>*</span>Quantity
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             size="small"
//                             type="number"
//                             value={stockOutData.quantity}
//                             onChange={(e) => handleChange('quantity', e.target.value)}
//                             InputProps={{
//                                 inputProps: { min: 0 }
//                             }}
//                         />
//                     </FormControl>

//                     <FormControl fullWidth sx={{ mb: 3 }}>
//                         <Typography variant="subtitle2" gutterBottom>
//                             Record Date
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             size="small"
//                             type="text"
//                             disabled
//                             placeholder="YYYY-MM-DD"
//                             value={new Date().toISOString().split('T')[0]}
//                             // onChange={(e) => handleChange('recordDate', e.target.value)}
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <CalendarTodayIcon fontSize="small" />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </FormControl>
//                 </Box>

//                 <Box sx={{ mb: 4, backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'rgb(0, 0, 0)', borderRadius: '8px', p: 2 }}>
//                     <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                         Price details
//                         {/* <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
//                             OPTIONAL
//                         </Typography> */}
//                     </Typography>

//                     <Box sx={{ display: 'flex', gap: 2 }}>
//                         <FormControl fullWidth sx={{ mb: 3 }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                                 {drawer?.type === "stockOut" ? " Selling Price" : "Purchasing Price"}
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 size="small"
//                                 type="number"
//                                 value={stockOutData.unit_price}
//                                 onChange={(e) => handleChange('unit_price', e.target.value)}
//                                 InputProps={{
//                                     inputProps: { min: 0 }
//                                 }}
//                             />
//                         </FormControl>

//                         <FormControl fullWidth sx={{ mb: 3 }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                                 {drawer?.type === "stockOut" ? "  Stock Out Value" : " Stock In Value"}
//                             </Typography>
//                             <TextField
//                                 fullWidth
//                                 size="small"
//                                 type="number"
//                                 value={stockOutData.unit_price * stockOutData.quantity}
//                                 // onChange={(e) => handleChange('stockOutValue', e.target.value)}
//                                 InputProps={{
//                                     inputProps: { min: 0 }
//                                 }}
//                             />
//                         </FormControl>
//                     </Box>
//                 </Box>

//                 {drawer?.type === 'stockIn' && (<Box sx={{ mb: 4, backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : 'rgb(0, 0, 0)', borderRadius: '8px', p: 2 }}>
//                     <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                         Stockist details
//                     </Typography>

//                     <Box sx={{ display: 'flex', gap: 2 }}>
//                         <FormControl fullWidth sx={{ mb: 3 }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                                 Stockist Name
//                             </Typography>
//                             <Autocomplete
//                                 fullWidth
//                                 size="small"
//                                 options={stockistShops || []}
//                                 getOptionLabel={(option) => option?.company_name || ''}
//                                 isOptionEqualToValue={(option, value) => option?._id === value?._id}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Type something for suggestions"
//                                         size="small"
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 borderRadius: 1.5,
//                                                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                     borderColor: 'primary.main',
//                                                 },
//                                                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                     borderWidth: '1px',
//                                                 }
//                                             }
//                                         }}
//                                     />
//                                 )}
//                                 value={selectedStockist}
//                                 onChange={(_, newValue) => {
//                                     setFormData(prevData => ({
//                                         ...prevData,
//                                         stockist_id: newValue?._id || '',
//                                         total_amount: stockOutData.unit_price * stockOutData.quantity,
//                                     }));
//                                 }}
//                                 filterOptions={(options, state) => {
//                                     return options.filter(option =>
//                                         option?.company_name?.toLowerCase().includes(state.inputValue.toLowerCase())
//                                     );
//                                 }}
//                                 popupIcon={null}
//                                 disablePortal
//                                 sx={{
//                                     '& .MuiAutocomplete-endAdornment': {
//                                         display: 'none'
//                                     }
//                                 }}
//                                 slotProps={{
//                                     paper: {
//                                         sx: {
//                                             backgroundColor: '#fff',
//                                             border: '1px solid #ddd',
//                                             borderRadius: '8px',
//                                             boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//                                         }
//                                     }
//                                 }}
//                             />
//                         </FormControl>
//                     </Box>
//                 </Box>)}

//                 <Box sx={{ mt: 4, }}>
//                     <Button
//                         variant="contained"
//                         color={drawer?.type === "stockOut" ? "error" : "success"}
//                         fullWidth
//                         startIcon={drawer?.type === "stockOut" ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
//                         onClick={() => {
//                             setDrawer({
//                                 isOpen: false,
//                                 type: null,
//                                 product: null,
//                             });
//                             if (drawer?.type === "stockOut") { handleRemoveQuantity() } else { handleAddQuantity() };
//                         }}
//                     >
//                         {drawer?.type === "stockOut" ? "Remove quantity" : "Add quantity"}
//                     </Button>
//                 </Box>
//             </Box>
//         </Drawer>
//     );
// };

// export default SideModal;