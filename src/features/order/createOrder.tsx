// import { useState, useEffect, useMemo } from 'react';
// import {
//     Box,
//     Button,
//     Container,
//     Grid,
//     MenuItem,
//     TextField,
//     Typography,
//     CircularProgress,
//     Paper,
//     Divider,
//     Alert,
//     Fade,
//     Stack,
//     useTheme,
// } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { createOrder, getStockistShops } from '@/services/order';
// import toast from 'react-hot-toast';
// import { OrderCreate, OrderStatus } from '@/utils/types';
// import { useNavigate } from 'react-router-dom';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import EventIcon from '@mui/icons-material/Event';
// import StoreIcon from '@mui/icons-material/Store';

// const CreateOrder = () => {
//     // Hooks
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const theme = useTheme();

//     // Redux state
//     const { user } = useSelector((state: RootState) => state.auth);
//     const { stockistShops, loading: storeLoading } = useSelector((state: RootState) => state.order);

//     // Local state
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

//     const [data, setData] = useState({
//         stockist_id: "",
//         order_date: new Date().toISOString().split("T")[0],
//         total_amount: 0,
//     });
//     const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.PENDING);

//     // Format user and stockist data for display
//     const currentShop = useMemo(() => {
//         return {
//             id: user?.UserData?._id || '',
//             name: user?.UserData?.shop_name || 'Your Shop'
//         };
//     }, [user]);

//     // Fetch data on component mount
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 await dispatch(getStockistShops()).unwrap();
//             } catch (err) {
//                 setError('Failed to load stockist data. Please try again later.');
//                 console.error('Error fetching stockists:', err);
//             }
//         };

//         fetchData();
//     }, [dispatch]);

//     // Form handlers
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setData(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setOrderStatus(e.target.value as OrderStatus);
//     };

//     const handleDateChange = (date: Date | null) => {
//         if (date) {
//             const formattedDate = date.toISOString().split("T")[0];
//             setData(prev => ({
//                 ...prev,
//                 order_date: formattedDate,
//             }));
//         }
//     };

//     const validateForm = (): boolean => {
//         return Boolean(data.stockist_id && data.order_date);
//     };

//     const handleSubmitOrder = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmitAttempted(true);

//         if (!validateForm()) {
//             toast.error('Please fill in all required fields');
//             return;
//         }

//         setLoading(true);

//         const newOrder: OrderCreate = {
//             stockist_id: data.stockist_id,
//             order_date: data.order_date,
//             total_amount: data.total_amount
//         };

//         try {
//             const result = await dispatch(createOrder({
//                 data: newOrder,
//                 status: orderStatus
//             })).unwrap();

//             toast.success('Order created successfully');
//             navigate(`/orders/${result.id}/product`);
//         } catch (err) {
//             toast.error('Failed to create order');
//             console.error('Error creating order:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const isFormValid = useMemo(() => Boolean(data.stockist_id && data.order_date), [data.stockist_id, data.order_date]);

//     return (
//         <Container maxWidth="lg">
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: { xs: 2, sm: 4 },
//                     my: 4,
//                     borderRadius: 1,
//                     background: theme.palette.background.paper,
//                 }}
//             >
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <ShoppingCartIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
//                     <Typography variant="h4" component="h1" fontWeight="500">
//                         Create Order
//                     </Typography>
//                 </Box>

//                 <Divider sx={{ mb: 4 }} />

//                 {error && (
//                     <Fade in={Boolean(error)}>
//                         <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
//                     </Fade>
//                 )}

//                 <Box
//                     component="form"
//                     onSubmit={handleSubmitOrder}
//                     sx={{ width: '100%' }}
//                 >
//                     <Stack spacing={4}>
//                         <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
//                             <StoreIcon sx={{ mr: 1 }} /> Shop Information
//                         </Typography>

//                         <Grid container spacing={3}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     select
//                                     onChange={handleInputChange}
//                                     name="stockist_id"
//                                     id="stockist_id"
//                                     label="Select Stockist"
//                                     value={data.stockist_id}
//                                     error={submitAttempted && !data.stockist_id}
//                                     helperText={submitAttempted && !data.stockist_id ? "Stockist is required" : ""}
//                                     disabled={storeLoading}
//                                     InputProps={{
//                                         startAdornment: storeLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
//                                     }}
//                                 >
//                                     {stockistShops?.length === 0 && (
//                                         <MenuItem disabled value="">
//                                             No stockists available
//                                         </MenuItem>
//                                     )}
//                                     {stockistShops?.map((stockist) => (
//                                         <MenuItem key={stockist?._id} value={stockist?._id}>
//                                             {stockist?.company_name}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>

//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     disabled
//                                     label="Your Shop"
//                                     value={currentShop.name}
//                                     InputProps={{
//                                         readOnly: true,
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>

//                         <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//                             <EventIcon sx={{ mr: 1 }} /> Order Details
//                         </Typography>

//                         <Grid container spacing={3}>
//                             <Grid item xs={12} md={6}>
//                                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                     <DatePicker
//                                         label="Order Date"
//                                         value={data.order_date ? new Date(data.order_date) : new Date()}
//                                         onChange={handleDateChange}
//                                         slotProps={{
//                                             textField: {
//                                                 required: true,
//                                                 fullWidth: true,
//                                                 error: submitAttempted && !data.order_date,
//                                                 helperText: submitAttempted && !data.order_date
//                                                     ? "Date is required"
//                                                     : "Date when order is placed",
//                                             },
//                                         }}
//                                     />
//                                 </LocalizationProvider>
//                             </Grid>

//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     select
//                                     onChange={handleStatusChange}
//                                     name="status"
//                                     id="status"
//                                     label="Order Status"
//                                     value={orderStatus}
//                                 >
//                                     <MenuItem value={OrderStatus.PENDING}>{OrderStatus.PENDING}</MenuItem>
//                                     <MenuItem value={OrderStatus.SHIPPED}>{OrderStatus.SHIPPED}</MenuItem>
//                                     <MenuItem value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</MenuItem>
//                                 </TextField>
//                             </Grid>
//                         </Grid>

//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//                             <Button
//                                 variant="outlined"
//                                 sx={{ mr: 2 }}
//                                 onClick={() => navigate(-1)}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 size="large"
//                                 disabled={loading || (submitAttempted && !isFormValid)}
//                                 sx={{
//                                     py: 1.2,
//                                     px: 4,
//                                     fontWeight: 600,
//                                 }}
//                                 startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
//                             >
//                                 {loading ? "Processing..." : "Create Order"}
//                             </Button>
//                         </Box>
//                     </Stack>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default CreateOrder;
