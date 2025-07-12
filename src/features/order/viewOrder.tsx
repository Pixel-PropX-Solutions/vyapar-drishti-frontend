// import { useState, useEffect, useMemo } from 'react';
// import {
//     Box,
//     Button,
//     Grid,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     Chip,
//     Container,
//     Skeleton,
//     Divider,
//     Alert,
//     Snackbar,
//     Card,
//     CardContent,
//     IconButton,
//     Tooltip,
//     useTheme,
//     useMediaQuery
// } from '@mui/material';
// import { Add, Print, LocalShipping, Cancel } from '@mui/icons-material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { updateOrder, viewOrderDetails } from '@/services/order';
// import { OrderStatus } from '@/utils/types';
// import { formatDate, getStatusColor, getStatusIcon } from '@/utils/functions';
// import { setOrderStatus } from '@/store/reducers/orderReducer';

// const ViewOrder = () => {
//     // Theme and responsive hooks
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     // State management
//     const { orderId } = useParams();
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const { orderDetailsData, loading: reduxLoading } = useSelector((state: RootState) => state.order);
//     const { user } = useSelector((state: RootState) => state.auth);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({
//         open: false,
//         message: '',
//         severity: 'info'
//     });

//     // Fetch data with error handling and loading state
//     useEffect(() => {
//         const fetchData = async () => {
//             if (!orderId) return;

//             try {
//                 await dispatch(viewOrderDetails(orderId));
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setSnackbar({
//                     open: true,
//                     message: 'Failed to load order details. Please try again.',
//                     severity: 'error'
//                 });
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [orderId, dispatch]);

//     // Memoized calculations for better performance
//     // const totalAmount = useMemo(() => {
//     //     if (!orderDetailsData?.orders) return 0;
//     //     return orderDetailsData.orders.reduce(
//     //         (sum, product) => sum + (product.product_details?.unit_price || 0) * (product.product_details?.quantity || 0),
//     //         0
//     //     );
//     // }, [orderDetailsData?.orders]);

//     const totalItems = useMemo(() => {
//         if (!orderDetailsData?.orders) return 0;
//         return orderDetailsData.orders.reduce(
//             (sum, product) => sum + (product.product_details?.quantity || 0),
//             0
//         );
//     }, [orderDetailsData?.orders]);

//     // Update order status
//     const handleUpdateStatus = async (newStatus: OrderStatus) => {
//         if (!orderId) return;

//         try {

//             const data = {
//                 stockist_id: orderDetailsData?.order_details?.stockist_id ?? '',
//                 order_date: orderDetailsData?.order_details?.order_date.split("T")[0] ?? '',
//                 total_amount: orderDetailsData?.order_details?.total_amount ?? 0,
//             }
//             await dispatch(updateOrder({
//                 data: data,
//                 status: newStatus,
//                 order_id: orderId
//             }));

//             dispatch(setOrderStatus({
//                 orderId: orderId,
//                 status: newStatus
//             }));

//             setSnackbar({
//                 open: true,
//                 message: `Order status updated to ${newStatus}`,
//                 severity: 'success'
//             });
//         } catch (error) {
//             console.error('Error updating status:', error);
//             setSnackbar({
//                 open: true,
//                 message: 'Failed to update order status',
//                 severity: 'error'
//             });
//         }
//     };

//     // Handle print order
//     // const handlePrintOrder = () => {
//     //     window.print();
//     // };

//     // Close snackbar
//     const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//     };

//     // Combined loading state
//     const isLoading = loading || reduxLoading;

//     return (
//         <Container maxWidth="xl" sx={{ pb: 4 }}>
//             {/* Header with navigation */}
//             <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {/* <IconButton onClick={() => navigate('/orders')} sx={{ mr: 1 }}>
//                         <ArrowBack />
//                     </IconButton> */}
//                     <Typography variant="h5" component="h1">
//                         {isLoading ? (
//                             <Skeleton width={200} />
//                         ) : (
//                             `Order #${orderDetailsData?.order_details?._id}`
//                         )}
//                     </Typography>
//                 </Box>
//                 <Box>
//                     <Tooltip title="Print Order">
//                         <IconButton
//                             // onClick={handlePrintOrder} 
//                             sx={{ ml: 1 }}>
//                             <Print />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>

//             {/* Order status card */}
//             <Card variant="outlined" sx={{ mb: 3 }}>
//                 <CardContent sx={{ p: 2 }}>
//                     <Grid container spacing={2} alignItems="center">
//                         <Grid item xs={12} sm={6}>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 {isLoading ? (
//                                     <Skeleton width={120} height={32} />
//                                 ) : (
//                                     <>
//                                         {getStatusIcon(orderDetailsData?.order_details?.status || OrderStatus.PENDING)}
//                                         <Chip
//                                             label={orderDetailsData?.order_details?.status}
//                                             color={getStatusColor(orderDetailsData?.order_details?.status || OrderStatus.PENDING)}
//                                             size="small"
//                                             sx={{ ml: 1 }}
//                                         />
//                                     </>
//                                 )}
//                             </Box>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center' }}>
//                                 <Typography variant="h6" component="div" sx={{ mr: 1 }}>
//                                     {isLoading ? (
//                                         <Skeleton width={80} />
//                                     ) : (
//                                         (`&#8377; ${orderDetailsData?.order_details?.total_amount || 0}`)
//                                     )}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                     {isLoading ? (
//                                         <Skeleton width={60} />
//                                     ) : (
//                                         `${totalItems} items`
//                                     )}
//                                 </Typography>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </Card>

//             {/* Order information */}
//             <Grid container spacing={3}>
//                 {/* Order details */}
//                 <Grid item xs={12} md={4}>
//                     <Card variant="outlined" sx={{ height: '100%' }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>Order Information</Typography>
//                             <Divider sx={{ mb: 2 }} />

//                             {isLoading ? (
//                                 <Box sx={{ '& > *': { mb: 2 } }}>
//                                     <Skeleton height={30} />
//                                     <Skeleton height={30} />
//                                     <Skeleton height={30} />
//                                     <Skeleton height={30} />
//                                 </Box>
//                             ) : (
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12}>
//                                         <Typography variant="subtitle2">Order Date</Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {formatDate(orderDetailsData?.order_details?.order_date || "")}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={6}>
//                                         <Typography variant="subtitle2">Created At</Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {formatDate(orderDetailsData?.order_details?.created_at || "")}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={6}>
//                                         <Typography variant="subtitle2">Last Updated</Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {formatDate(orderDetailsData?.order_details?.updated_at || "")}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Stockist & Chemist Information */}
//                 <Grid item xs={12} md={8}>
//                     <Card variant="outlined" sx={{ height: '100%' }}>
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>Parties</Typography>
//                             <Divider sx={{ mb: 2 }} />

//                             {isLoading ? (
//                                 <Box sx={{ '& > *': { mb: 2 } }}>
//                                     <Skeleton height={30} />
//                                     <Skeleton height={30} />
//                                     <Skeleton height={30} />
//                                 </Box>
//                             ) : (
//                                 <Grid container spacing={3}>
//                                     <Grid item xs={12} sm={6}>
//                                         <Typography variant="subtitle2">Stockist</Typography>
//                                         <Typography variant="body1">
//                                             {orderDetailsData?.stockist?.name?.first_name} {orderDetailsData?.stockist?.name?.last_name}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {orderDetailsData?.stockist?.address?.street_address}, {orderDetailsData?.stockist?.address?.city}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {orderDetailsData?.stockist?.phone_number?.country_code}, {orderDetailsData?.stockist?.phone_number?.phone_number}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6}>
//                                         <Typography variant="subtitle2">Chemist</Typography>
//                                         <Typography variant="body1">
//                                             {user?.UserData?.name?.first_name} {user?.UserData?.name?.last_name}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {user?.UserData?.address?.street_address}, {user?.UserData?.address?.city}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {user?.email}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Products listing */}
//                 <Grid item xs={12}>
//                     <Card variant="outlined">
//                         <CardContent>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                                 <Typography variant="h6">Products</Typography>
//                                 {orderDetailsData?.order_details?.status === OrderStatus.PENDING && (
//                                     <Button
//                                         variant="outlined"
//                                         startIcon={<Add />}
//                                         onClick={() => navigate(`/orders/${orderId}/product`)}
//                                         size={isMobile ? "small" : "medium"}
//                                     >
//                                         Add Product
//                                     </Button>
//                                 )}
//                             </Box>
//                             <Divider sx={{ mb: 2 }} />

//                             {isLoading ? (
//                                 <Box sx={{ '& > *': { mb: 2 } }}>
//                                     <Skeleton height={40} />
//                                     <Skeleton height={40} />
//                                     <Skeleton height={40} />
//                                 </Box>
//                             ) : (
//                                 <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
//                                     <Table stickyHeader size={isMobile ? "small" : "medium"}>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell>Product</TableCell>
//                                                 <TableCell>Category</TableCell>
//                                                 {!isMobile && (
//                                                     <>
//                                                         <TableCell>State</TableCell>
//                                                         <TableCell>Measure</TableCell>
//                                                         <TableCell align="right">Tablets/Pack</TableCell>
//                                                     </>
//                                                 )}
//                                                 <TableCell align="right">Unit Price(&#8377;)</TableCell>
//                                                 <TableCell align="right">Quantity</TableCell>
//                                                 <TableCell align="right">Total(&#8377;)</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {orderDetailsData?.orders?.map((product, index) => (
//                                                 <TableRow
//                                                     key={`${product?.product_details?.product_id || 'unknown'}-${index}`}
//                                                     hover
//                                                 >
//                                                     <TableCell>{product?.ProductDetails?.product_name}</TableCell>
//                                                     <TableCell>{product?.ProductDetails?.category}</TableCell>
//                                                     {!isMobile && (
//                                                         <>
//                                                             <TableCell>{product?.ProductDetails?.state}</TableCell>
//                                                             <TableCell>{product?.ProductDetails?.measure_of_unit}</TableCell>
//                                                             <TableCell align="right">{product?.ProductDetails?.no_of_tablets_per_pack}</TableCell>
//                                                         </>
//                                                     )}
//                                                     <TableCell align="right">{'&#8377; ' + product?.product_details?.unit_price || 0}</TableCell>
//                                                     <TableCell align="right">{product?.product_details?.quantity}</TableCell>
//                                                     <TableCell align="right">{'&#8377; ' + ((product?.product_details?.unit_price || 0) * (product?.product_details?.quantity || 0))}</TableCell>
//                                                 </TableRow>
//                                             ))}
//                                             <TableRow>
//                                                 <TableCell colSpan={isMobile ? 5 : 7} align="right" sx={{ fontWeight: 'bold' }}>
//                                                     Total:
//                                                 </TableCell>
//                                                 <TableCell align="right" sx={{ fontWeight: 'bold' }}>
//                                                     {'&#8377; ' + (orderDetailsData?.order_details?.total_amount || 0)}
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Status update buttons */}
//                 {orderDetailsData?.order_details?.status === OrderStatus.PENDING && (
//                     <Grid item xs={12}>
//                         <Card variant="outlined">
//                             <CardContent>
//                                 <Typography variant="h6" gutterBottom>Update Status</Typography>
//                                 <Divider sx={{ mb: 2 }} />
//                                 <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         startIcon={<LocalShipping />}
//                                         onClick={() => handleUpdateStatus(OrderStatus.SHIPPED)}
//                                         fullWidth={isMobile}
//                                         disabled={isLoading}
//                                     >
//                                         Mark as Shipped
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         color="error"
//                                         startIcon={<Cancel />}
//                                         onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
//                                         fullWidth={isMobile}
//                                         disabled={isLoading}
//                                     >
//                                         Mark as Cancelled
//                                     </Button>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 )}


//             </Grid>

//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Container>
//     );
// };

// export default ViewOrder;