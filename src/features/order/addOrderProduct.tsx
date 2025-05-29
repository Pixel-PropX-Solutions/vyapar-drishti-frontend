// import { useState, useEffect, useMemo } from 'react';
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Chip,
//     Divider,
//     Grid,
//     MenuItem,
//     Paper,
//     TextField,
//     Typography,
//     Snackbar,
//     Alert,
//     IconButton,
//     Tooltip,
//     Skeleton,
//     CircularProgress
// } from '@mui/material';
// import { Add, Print, DeleteOutline } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
// import { viewProduct, viewProductsWithId } from '@/services/products';
// import { OrderStatus, Product, ProductForOrder } from '@/utils/types';
// import { createOrderDetails, updateOrder, viewOrderDetails } from '@/services/order';
// import { formatDatewithTime, getStatusColor, getStatusIcon } from '@/utils/functions';
// import { setProductDataNull } from '@/store/reducers/productReducer';

// const AddOrderProduct = () => {
//     // Hooks
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const { orderId } = useParams();

//     // Redux state
//     const { productsListing, productData, loading: productLoading } = useSelector((state: RootState) => state.product);
//     const { orderDetailsData, loading: orderLoading } = useSelector((state: RootState) => state.order);
//     const { user } = useSelector((state: RootState) => state.auth);

//     // Local state
//     const [selectedProducts, setSelectedProducts] = useState<ProductForOrder[]>([]);
//     const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
//     const [productQuantity, setProductQuantity] = useState<number>(1);
//     const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({
//         open: false,
//         message: '',
//         severity: 'info'
//     });
//     const [submitting, setSubmitting] = useState<boolean>(false);

//     // Loading state
//     const isLoading = productLoading || orderLoading;

//     // Fetch data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 if (orderId) {
//                     await Promise.all([
//                         dispatch(viewOrderDetails(orderId)),
//                         dispatch(viewProductsWithId('')),
//                         dispatch(setProductDataNull())
//                     ]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setSnackbar({
//                     open: true,
//                     message: 'Failed to load data. Please try again.',
//                     severity: 'error'
//                 });
//             }
//         };

//         fetchData();
//     }, [dispatch, orderId]);

//     useEffect(() => {
//         if (productData) {
//             setCurrentProduct(productData);
//         }
//     }, [productData]);

//     // Add product to order
//     const handleAddProduct = () => {
//         if (!currentProduct || productQuantity <= 0) {
//             setSnackbar({
//                 open: true,
//                 message: 'Please select a product and enter a valid quantity',
//                 severity: 'warning'
//             });
//             return;
//         }

//         const existingProductIndex = selectedProducts.findIndex(
//             p => p.product_id === currentProduct._id
//         );

//         if (existingProductIndex !== -1) {
//             // Update existing product
//             const updatedProducts = [...selectedProducts];
//             updatedProducts[existingProductIndex].quantity += productQuantity;
//             setSelectedProducts(updatedProducts);
//         } else {
//             // Add new product
//             setSelectedProducts([
//                 ...selectedProducts,
//                 {
//                     product_id: currentProduct._id,
//                     product_name: currentProduct.product_name,
//                     quantity: productQuantity,
//                     unit_price: currentProduct.price,
//                 }
//             ]);
//         }

//         setSnackbar({
//             open: true,
//             message: 'Product added to order',
//             severity: 'success'
//         });

//         // Reset form
//         setCurrentProduct(null);
//         setProductQuantity(1);
//     };

//     // Remove product from order
//     const handleRemoveProduct = (productId: string) => {
//         setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId));
//     };

//     // Submit order
//     const handleSubmitOrder = async () => {
//         setCurrentProduct(null);
//         setProductQuantity(1);

//         if (selectedProducts.length === 0) {
//             setSnackbar({
//                 open: true,
//                 message: 'Please add at least one product to the order',
//                 severity: 'warning'
//             });
//             return;
//         }

//         setSubmitting(true);
//         try {

//             const data = {
//                 "order_id": orderId ?? "",
//                 "product_details": selectedProducts?.length > 0 ? selectedProducts?.map(p => ({
//                     product_id: p.product_id,
//                     quantity: p.quantity,
//                     unit_price: p.unit_price
//                 })) : [{
//                     product_id: "string",
//                     quantity: 0,
//                     unit_price: 0
//                 }],
//             };

//             // Call your API to update order
//             dispatch(createOrderDetails({ data })).then(() => {
//                 const data = {
//                     "stockist_id": orderDetailsData?.order_details?.stockist_id ?? "",
//                     "order_date": orderDetailsData?.order_details?.order_date.split("T")[0] ?? "",
//                     "total_amount": newOrderTotal ?? 0,
//                 }
//                 dispatch(setProductDataNull());
//                 dispatch(updateOrder({
//                     data: data,
//                     order_id: orderId ?? "",
//                     status: orderDetailsData?.order_details?.status || OrderStatus.PENDING
//                 }));
//             });

//             setSnackbar({
//                 open: true,
//                 message: 'Order created successfully',
//                 severity: 'success'
//             });

//             // Navigate back to order details
//             navigate(`/orders/${orderId}`)


//         } catch (error) {
//             console.error('Error updating order:', error);
//             setSnackbar({
//                 open: true,
//                 message: 'Failed to update order. Please try again.',
//                 severity: 'error'
//             });
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle print order
//     // const handlePrintOrder = () => {
//     //     window.print();
//     // };

//     // Calculate total items
//     const totalItems = useMemo(() => {
//         if (!orderDetailsData?.orders) return 0;
//         return orderDetailsData.orders.reduce(
//             (sum, product) => sum + (product.product_details?.quantity || 0),
//             0
//         );
//     }, [orderDetailsData?.orders]);

//     // Calculate new total
//     const newOrderTotal = useMemo(() => {
//         const existingTotal = orderDetailsData?.order_details?.total_amount || 0;
//         const newProductsTotal = selectedProducts.reduce(
//             (sum, product) => sum + (product.quantity * product.unit_price),
//             0
//         );
//         return existingTotal + newProductsTotal;
//     }, [orderDetailsData?.order_details?.total_amount, selectedProducts]);

//     return (
//         <Box maxWidth="xl" sx={{ mt: 4, mx: 'auto', px: 2 }}>
//             <Grid container spacing={3}>
//                 {/* Order summary */}
//                 <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ mb: 3 }}>
//                         <CardContent>
//                             <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <Typography variant="h5" component="h1">
//                                     {isLoading ? (
//                                         <Skeleton width={200} />
//                                     ) : (
//                                         `Order #${orderDetailsData?.order_details?._id?.slice(-6)}`
//                                     )}
//                                 </Typography>
//                                 <Box>
//                                     <Tooltip title="Print Order">
//                                         <IconButton
//                                             // onClick={handlePrintOrder}
//                                             sx={{ ml: 1 }}>
//                                             <Print />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </Box>
//                             </Box>

//                             <Card variant="outlined" sx={{ mb: 3 }}>
//                                 <CardContent sx={{ p: 2 }}>
//                                     <Grid container spacing={2} alignItems="center">
//                                         <Grid item xs={12} sm={6}>
//                                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                 {isLoading ? (
//                                                     <Skeleton width={120} height={32} />
//                                                 ) : (
//                                                     <>
//                                                         {getStatusIcon(orderDetailsData?.order_details?.status || OrderStatus.PENDING)}
//                                                         <Chip
//                                                             label={orderDetailsData?.order_details?.status}
//                                                             color={getStatusColor(orderDetailsData?.order_details?.status || OrderStatus.PENDING)}
//                                                             size="small"
//                                                             sx={{ ml: 1 }}
//                                                         />
//                                                     </>
//                                                 )}
//                                             </Box>
//                                         </Grid>
//                                         <Grid item xs={12} sm={6}>
//                                             <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center' }}>
//                                                 <Typography variant="h6" component="div" sx={{ mr: 1 }}>
//                                                     {isLoading ? (
//                                                         <Skeleton width={80} />
//                                                     ) : (
//                                                         (orderDetailsData?.order_details?.total_amount || 0)
//                                                     )}
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     {isLoading ? (
//                                                         <Skeleton width={60} />
//                                                     ) : (
//                                                         `${totalItems} items`
//                                                     )}
//                                                 </Typography>
//                                             </Box>
//                                         </Grid>
//                                     </Grid>
//                                 </CardContent>
//                             </Card>

//                             <Grid container spacing={3}>
//                                 {/* Order information */}
//                                 <Grid item xs={12}>
//                                     <Card variant="outlined" sx={{ height: '100%' }}>
//                                         <CardContent>
//                                             <Typography variant="h6" gutterBottom>Order Information</Typography>
//                                             <Divider sx={{ mb: 2 }} />
//                                             {isLoading ? (
//                                                 <Box sx={{ '& > *': { mb: 2 } }}>
//                                                     <Skeleton height={30} />
//                                                     <Skeleton height={30} />
//                                                     <Skeleton height={30} />
//                                                 </Box>
//                                             ) : (
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <Typography variant="subtitle2">Order Date</Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {formatDatewithTime(orderDetailsData?.order_details?.order_date || "")}
//                                                         </Typography>
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <Typography variant="subtitle2">Created At</Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {formatDatewithTime(orderDetailsData?.order_details?.created_at || "")}
//                                                         </Typography>
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <Typography variant="subtitle2">Last Updated</Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {formatDatewithTime(orderDetailsData?.order_details?.updated_at || "")}
//                                                         </Typography>
//                                                     </Grid>
//                                                 </Grid>
//                                             )}
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>

//                                 {/* Parties Information */}
//                                 <Grid item xs={12}>
//                                     <Card variant="outlined" sx={{ height: '100%' }}>
//                                         <CardContent>
//                                             <Typography variant="h6" gutterBottom>Parties</Typography>
//                                             <Divider sx={{ mb: 2 }} />
//                                             {isLoading ? (
//                                                 <Box sx={{ '& > *': { mb: 2 } }}>
//                                                     <Skeleton height={30} />
//                                                     <Skeleton height={30} />
//                                                     <Skeleton height={30} />
//                                                 </Box>
//                                             ) : (
//                                                 <Grid container spacing={3}>
//                                                     <Grid item xs={12} sm={6}>
//                                                         <Typography variant="subtitle2">Stockist</Typography>
//                                                         <Typography variant="body1">
//                                                             {orderDetailsData?.stockist?.name?.first_name} {orderDetailsData?.stockist?.name?.last_name}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {orderDetailsData?.stockist?.address?.street_address}, {orderDetailsData?.stockist?.address?.city}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {orderDetailsData?.stockist?.phone_number?.country_code} {orderDetailsData?.stockist?.phone_number?.phone_number}
//                                                         </Typography>
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={6}>
//                                                         <Typography variant="subtitle2">Chemist</Typography>
//                                                         <Typography variant="body1">
//                                                             {user?.UserData?.name?.first_name} {user?.UserData?.name?.last_name}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {user?.UserData?.address?.street_address}, {user?.UserData?.address?.city}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             {user?.email}
//                                                         </Typography>
//                                                     </Grid>
//                                                 </Grid>
//                                             )}
//                                         </CardContent>
//                                     </Card>
//                                 </Grid>
//                             </Grid>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Add Product */}
//                 <Grid item xs={12} md={6}>
//                     <Card variant="outlined" sx={{ mb: 3 }}>
//                         <CardContent>
//                             <Typography variant="h5" component="h1" gutterBottom>
//                                 Add Products
//                             </Typography>

//                             <Box sx={{ mb: 3 }}>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} md={8}>
//                                         <TextField
//                                             required
//                                             fullWidth
//                                             select
//                                             onChange={(e) => {
//                                                 dispatch(viewProduct(e.target.value));
//                                                 setProductQuantity(1);
//                                             }}
//                                             name="product"
//                                             value={currentProduct?._id || ''}
//                                             label="Select Product"
//                                             variant="outlined"
//                                             disabled={productLoading}
//                                         >
//                                             {Array.isArray(productsListing) && productsListing.map((product) => (
//                                                 <MenuItem key={product?._id} value={product._id}>
//                                                     {product.product_name} ({product.measure_of_unit}) - {(product.price)}
//                                                 </MenuItem>
//                                             ))}
//                                         </TextField>
//                                     </Grid>
//                                     <Grid item xs={12} md={4}>
//                                         <TextField
//                                             fullWidth
//                                             label="Quantity"
//                                             type="number"
//                                             InputProps={{
//                                                 inputProps: { min: 1 },
//                                                 startAdornment: productLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
//                                             }}
//                                             value={productQuantity}
//                                             onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
//                                             disabled={!currentProduct || productLoading}
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </Box>

//                             {currentProduct && (
//                                 <Card variant="outlined" sx={{ mb: 3 }}>
//                                     <CardContent>
//                                         <Typography variant="h6" gutterBottom>Product Details</Typography>
//                                         <Divider sx={{ mb: 2 }} />
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={12} sm={6}>
//                                                 <Typography variant="subtitle2">Category</Typography>
//                                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                     {currentProduct.category}
//                                                 </Typography>

//                                                 <Typography variant="subtitle2">State</Typography>
//                                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                     {currentProduct.state}
//                                                 </Typography>

//                                                 <Typography variant="subtitle2">Unit</Typography>
//                                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                     {currentProduct.measure_of_unit}
//                                                 </Typography>
//                                             </Grid>
//                                             <Grid item xs={12} sm={6}>
//                                                 {currentProduct.no_of_tablets_per_pack && (
//                                                     <>
//                                                         <Typography variant="subtitle2">Units per pack</Typography>
//                                                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                             {currentProduct.no_of_tablets_per_pack}
//                                                         </Typography>
//                                                     </>
//                                                 )}

//                                                 <Typography variant="subtitle2">Storage Requirements</Typography>
//                                                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                                                     {currentProduct.storage_requirement}
//                                                 </Typography>

//                                                 <Typography variant="subtitle2">Price Information</Typography>
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     Unit Price: {(currentProduct.price)}
//                                                 </Typography>
//                                                 <Typography variant="body1" fontWeight="bold" color="primary">
//                                                     Total: {(currentProduct.price * productQuantity)}
//                                                 </Typography>
//                                             </Grid>
//                                         </Grid>
//                                     </CardContent>
//                                 </Card>
//                             )}

//                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//                                 <Button
//                                     onClick={() => {
//                                         setCurrentProduct(null);
//                                         setProductQuantity(1);
//                                     }}
//                                 // disabled={!currentProduct || productLoading}
//                                 >
//                                     Clear
//                                 </Button>
//                                 <Button
//                                     startIcon={<Add />}
//                                     onClick={handleAddProduct}
//                                     variant="contained"
//                                     color="primary"
//                                 // disabled={!currentProduct || productQuantity <= 0 || productLoading}
//                                 >
//                                     Add to Order
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>

//                     {/* Selected Products */}
//                     <Card variant="outlined">
//                         <CardContent>
//                             <Typography variant="h6" gutterBottom>Selected Products</Typography>
//                             <Divider sx={{ mb: 2 }} />

//                             {selectedProducts.length === 0 ? (
//                                 <Box sx={{ py: 3, textAlign: 'center' }}>
//                                     <Typography variant="body1" color="text.secondary">
//                                         No products added yet. Select products above to add them to this order.
//                                     </Typography>
//                                 </Box>
//                             ) : (
//                                 <>
//                                     <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden', }}>
//                                         <Box sx={{ p: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
//                                             <Grid container>
//                                                 <Grid item xs={5}>
//                                                     <Typography variant="subtitle2">Product</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={2} sx={{ textAlign: 'center' }}>
//                                                     <Typography variant="subtitle2">Quantity</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={3} sx={{ textAlign: 'right' }}>
//                                                     <Typography variant="subtitle2">Price</Typography>
//                                                 </Grid>
//                                                 <Grid item xs={2}></Grid>
//                                             </Grid>
//                                         </Box>

//                                         {selectedProducts.map((product) => (
//                                             <Box key={product.product_id} sx={{ p: 2, borderColor: 'divider' }}>
//                                                 <Grid container alignItems="center">
//                                                     <Grid item xs={5}>
//                                                         <Typography variant="body1">{product.product_name}</Typography>
//                                                     </Grid>
//                                                     <Grid item xs={2} sx={{ textAlign: 'center' }}>
//                                                         <Typography variant="body1">{product.quantity}</Typography>
//                                                     </Grid>
//                                                     <Grid item xs={3} sx={{ textAlign: 'right' }}>
//                                                         <Typography variant="body1">
//                                                             {(product.unit_price * product.quantity)}
//                                                         </Typography>
//                                                     </Grid>
//                                                     <Grid item xs={2} sx={{ textAlign: 'right' }}>
//                                                         <IconButton
//                                                             size="small"
//                                                             color="error"
//                                                             onClick={() => handleRemoveProduct(product.product_id)}
//                                                         >
//                                                             <DeleteOutline />
//                                                         </IconButton>
//                                                     </Grid>
//                                                 </Grid>
//                                             </Box>
//                                         ))}
//                                     </Paper>

//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                                         <Typography variant="subtitle1">
//                                             Total Items: {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}
//                                         </Typography>
//                                         <Typography variant="h6" color="primary">
//                                             SubTotal: {(selectedProducts.reduce((sum, p) => sum + (p.unit_price * p.quantity), 0))}
//                                         </Typography>
//                                     </Box>

//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Existing Order Total: {(orderDetailsData?.order_details?.total_amount || 0)}
//                                         </Typography>
//                                         <Typography variant="h6" color="primary.dark" fontWeight="bold">
//                                             New Order Total: {(newOrderTotal)}
//                                         </Typography>
//                                     </Box>
//                                 </>
//                             )}

//                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
//                                 <Button
//                                     onClick={() => navigate(`/orders/${orderId}`)}
//                                     variant="outlined"
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     onClick={handleSubmitOrder}
//                                     variant="contained"
//                                     color="primary"
//                                     // disabled={selectedProducts.length === 0 || submitting}
//                                     startIcon={submitting ? <CircularProgress size={20} /> : null}
//                                 >
//                                     {submitting ? 'Adding...' : 'Add Order Details'}
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={5000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert
//                     onClose={() => setSnackbar({ ...snackbar, open: false })}
//                     severity={snackbar.severity}
//                     variant="filled"
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default AddOrderProduct;