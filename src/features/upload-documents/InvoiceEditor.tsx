// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Container,
//   Paper,
//   Tabs,
//   Tab,
//   Grid,
//   Button,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   TextField,
//   Chip,
//   Divider,
//   FormControlLabel,
//   Radio,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import TabPanel from "./components/TabPanel";
// import InvoiceHeader from "./components/InvoiceHeader";
// import InvoiceSummaryCard from "./components/InvoiceSummaryCard";
// import ItemsTable from "./components/ItemsTable";
// import { InvoiceData, InvoiceDataToSent } from "@/utils/types";
// import PaymentSummary from "./components/PaymentSummary";
// import { AnimatedTableRow } from "./components/AnimatedTableRow";
// import { StyledCard } from "./components/StyledCard";
// import { Assignment, Business, Calculate, Inventory, Layers } from "@mui/icons-material";
// import { viewProductsWithId } from "@/services/products";
// import toast from "react-hot-toast";
// import { viewAllStockist } from "@/services/stockist";
// import userApi from "@/api/api";
// import { useNavigate } from "react-router-dom";

// const InvoiceEditor: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { invoiceData } = useSelector((state: RootState) => state.invoice);
//   const { productsListing } = useSelector((state: RootState) => state.product);
//   const { user } = useSelector((state: RootState) => state.auth);
//   const [invoice, setInvoice] = useState<InvoiceData>({} as InvoiceData);
//   const [data, setData] = useState<InvoiceDataToSent>({} as InvoiceDataToSent);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [tabValue, setTabValue] = useState<number>(0);

//   useEffect(() => {
//     if (invoiceData) {
//       setInvoice(invoiceData);

//       const updatedData: InvoiceDataToSent = {
//         ...data,
//         invoice_no: invoiceData.invoice_no,
//         chemist_id: user?._id || "",
//         date: (() => {
//           if (!invoiceData.date) return "";
//           // Convert from dd-mm-yyyy to yyyy-mm-dd
//           const parts = invoiceData.date.split(/[-/]/);
//           if (parts.length === 3) {
//             return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
//           }
//           return invoiceData.date; // Return original if parsing fails
//         })(),
//         items: invoiceData.items.map((item) => {
//           const matchedProduct = productsListing?.find(
//             product => product?.product_name?.toLowerCase() === item.product_name?.toLowerCase()
//           ) || productsListing?.find(
//             product => product?.product_name?.toLowerCase()?.includes((item?.product_name || '').toLowerCase())
//           );

//           return {
//             product_id: matchedProduct?._id || "",
//             quantity: item?.quantity || '',
//             rate: item?.rate || '',
//             product_name: item?.product_name || '',
//             pack: item?.pack || '',
//             expiry: item?.expiry || '',
//           };
//         }),
//         total: (invoiceData?.totals?.grand_total || "").toString(),
//       };

//       if (invoiceData?.stockist?.name) {
//         dispatch(viewAllStockist({
//           searchQuery: invoiceData?.stockist?.name,
//           filterState: "All-States",
//           pageNumber: 1,
//           limit: 1,
//           sortField: 'createdAt',
//           sortOrder: 'desc',
//         })).then((res: any) => {
//           if (res?.payload?.stockistsData && res.payload.stockistsData.length > 0) {
//             setData({
//               ...updatedData,
//               stockist_id: res.payload.stockistsData[0]?.StockistData
//                 ?._id || "",
//             });
//           } else {
//             setData(updatedData);
//           }
//         });
//       } else {
//         setData(updatedData);
//       }
//     }
//   }, [dispatch, invoiceData, productsListing, user]);

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

//   const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setError(null);

//     try {

//       const response = await userApi.post(
//         `extraction/extraction/save/database`, data,
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.data.success === true) {
//         setError("");
//         setTimeout(() => {
//           navigate("/orders");
//         }, 2000);
//       }
//     } catch (error) {
//       setError(error as string || "Failed to save invoice data");
//       setLoading(false);

//     }
//   };

//   const handleChange = (name: string, value: any) => {
//     if (!name) return;
//     const parts = name.split(".");
//     if (parts[0] === "items" && parts.length >= 3) {
//       const index = parseInt(parts[1]);
//       const key = parts[2];

//       setInvoice((prev) => {
//         const updatedItems = [...prev.items];
//         const updatedItem = { ...updatedItems[index], [key]: value };
//         updatedItems[index] = updatedItem;

//         return { ...prev, items: updatedItems };
//       });

//       setInvoice((prev) => {
//         const updatedItems = [...prev.items];
//         const updatedItem = { ...updatedItems[index], [key]: value };
//         updatedItems[index] = updatedItem;

//         return { ...prev, items: updatedItems };
//       });

//       setData((prev) => {
//         const updatedItems = [...prev.items];

//         if (key === "product_name") {
//           // Find matching product in productsListing
//           const matchedProduct = productsListing?.find(
//             product => product?.product_name?.toLowerCase() === value?.toLowerCase()
//           ) || productsListing?.find(
//             product => product?.product_name?.toLowerCase()?.includes((value || '').toLowerCase())
//           );

//           // Update both product_name and product_id
//           const updatedItem = {
//             ...updatedItems[index],
//             [key]: value,
//             product_id: matchedProduct?._id || ""
//           };
//           updatedItems[index] = updatedItem;
//         } else {
//           // For other keys, just update that specific key
//           const updatedItem = { ...updatedItems[index], [key]: value };
//           updatedItems[index] = updatedItem;
//         }

//         return { ...prev, items: updatedItems };
//       });

//       return;
//     }

//     if (parts.length > 1) {
//       const [parent, child, subChild] = parts;

//       if (subChild) {
//         setInvoice((prev) => ({
//           ...prev,
//           [parent]: {
//             ...(prev[parent as keyof InvoiceData] as Record<string, any>),
//             [child]: {
//               ...(prev[parent as keyof InvoiceData] as Record<string, any>)[child],
//               [subChild]: value,
//             },
//           },
//         }));
//       } else {
//         setInvoice((prev) => ({
//           ...prev,
//           [parent]: {
//             ...(prev[parent as keyof InvoiceData] as Record<string, any>),
//             [child]: value,
//           },
//         }));
//       }
//       return;
//     }

//     // Handle root-level keys (e.g., invoice_no, date)
//     setInvoice((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="80vh"
//       >
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   if (error && !invoice) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="80vh"
//       >
//         <Alert severity="error" variant="filled">
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   if (!invoice) {
//     return null;
//   }

//   return (
//     <Box sx={{ p: 3, width: "100%" }}>
//       <InvoiceHeader
//         editMode={editMode}
//         setEditMode={setEditMode}
//         handleSave={handleSave}
//       />

//       <Container disableGutters maxWidth={false} sx={{ width: "100%" }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 0,
//             borderRadius: 1,
//             overflow: "hidden",
//             boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//           }}
//         >
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{ px: 2, borderBottom: 1, mt: 1, borderColor: "divider" }}
//           >
//             <Tab label="Overview" icon={<Layers />} iconPosition="start" />
//             <Tab label="Business Details" icon={<Business />} iconPosition="start" />
//             <Tab label="Items" icon={<Inventory />} iconPosition="start" />
//           </Tabs>

//           <TabPanel value={tabValue} index={0}>
//             <Box p={3}>
//               <Grid container spacing={3}>
//                 <InvoiceSummaryCard
//                   title="Stockist"
//                   icon="LocalShippingIcon"
//                   details={invoice?.stockist}
//                 />
//                 <InvoiceSummaryCard
//                   title="Chemist"
//                   icon="StorefrontIcon"
//                   details={invoice?.chemist}
//                 />
//                 <PaymentSummary totals={invoice?.totals} />

//                 <Grid item xs={12}>
//                   <StyledCard>
//                     <CardContent>
//                       <Box
//                         display="flex"
//                         justifyContent="space-between"
//                         alignItems="center"
//                         mb={2}
//                       >
//                         <Typography variant="h6" color="primary">
//                           Items ({invoice?.items?.length})
//                         </Typography>
//                         <Button
//                           variant="outlined"
//                           onClick={() => setTabValue(2)}
//                           endIcon={<InventoryIcon />}
//                           size="small"
//                         >
//                           View All Items
//                         </Button>
//                       </Box>
//                       <TableContainer sx={{ maxHeight: 300 }}>
//                         <Table size="small" stickyHeader>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>Product</TableCell>
//                               <TableCell>Batch</TableCell>
//                               <TableCell>HSN</TableCell>
//                               <TableCell>Expiry</TableCell>
//                               <TableCell align="right">Qty</TableCell>
//                               <TableCell align="right">MRP</TableCell>
//                               <TableCell align="right">Rate</TableCell>
//                               <TableCell align="right">Amount</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {invoice?.items?.map((item, index) => (
//                               <AnimatedTableRow key={index}>
//                                 <TableCell>{item?.product_name}</TableCell>
//                                 <TableCell>{item?.batch}</TableCell>
//                                 <TableCell>{item?.HSN}</TableCell>
//                                 <TableCell>{item?.expiry}</TableCell>
//                                 <TableCell align="right">
//                                   {item?.quantity}
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   &#8377;{parseFloat(item?.MRP || "0").toFixed(2)}
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   &#8377;{parseFloat(item?.rate || "0").toFixed(2)}
//                                 </TableCell>
//                                 <TableCell align="right">
//                                   &#8377;{parseFloat(item?.amount || "0").toFixed(2)}
//                                 </TableCell>
//                               </AnimatedTableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </CardContent>
//                   </StyledCard>
//                 </Grid>
//               </Grid>
//             </Box>
//           </TabPanel>

//           <TabPanel value={tabValue} index={1}>
//             <Box p={3}>
//               <Grid container spacing={3}>
//                 {/* Stokist Details */}
//                 <Grid item xs={12} md={6}>
//                   <StyledCard>
//                     <CardContent>
//                       <Box display="flex" alignItems="center" mb={2}>
//                         <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="h6">Stokist Details</Typography>
//                       </Box>
//                       <TextField
//                         label="Name"
//                         fullWidth
//                         value={invoice?.stockist?.name || ""}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="stockist.name"
//                         disabled={!editMode} // Ensure this is correctly bound to editMode
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <TextField
//                         label="Street Address 1"
//                         fullWidth
//                         value={invoice?.stockist?.address?.street_address_1 || ""}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="stockist.address.street_address_1"
//                         disabled={!editMode} // Ensure this is correctly bound to editMode
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <TextField
//                         label="Street Address 2"
//                         fullWidth
//                         value={invoice.stockist?.address?.street_address_2 || ""}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="stockist.address.street_address_2"
//                         disabled={!editMode}
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="City"
//                             fullWidth
//                             value={invoice?.stockist?.address?.city || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.address.city"
//                             disabled={!editMode} // Ensure this is correctly bound to editMode
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="State"
//                             fullWidth
//                             value={invoice?.stockist?.address?.state || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.address.state"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="Zip Code"
//                             fullWidth
//                             value={invoice?.stockist?.address?.zip_code || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.address.zip_code"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="Phone"
//                             fullWidth
//                             value={invoice?.stockist?.phone}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.phone"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="TIN"
//                             fullWidth
//                             value={invoice?.stockist?.TIN}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.TIN"
//                             disabled={!editMode} // Ensure this is correctly bound to editMode
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="DL No"
//                             fullWidth
//                             value={invoice?.stockist?.DL_No}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="stockist.DL_NO"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </StyledCard>
//                 </Grid>

//                 {/* Chemist Details */}
//                 <Grid item xs={12} md={6}>
//                   <StyledCard>
//                     <CardContent>
//                       <Box display="flex" alignItems="center" mb={2}>
//                         <StorefrontIcon color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="h6">Chemist Details</Typography>
//                       </Box>
//                       <TextField
//                         label="Name"
//                         fullWidth
//                         value={invoice?.chemist?.name}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="chemist.name"
//                         disabled={!editMode}
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <TextField
//                         label="Street Address 1"
//                         fullWidth
//                         value={invoice?.chemist?.address?.street_address_1 || ""}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="chemmit.address.street_address_1"
//                         disabled={!editMode}
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <TextField
//                         label="Street Address 2"
//                         fullWidth
//                         value={invoice?.chemist?.address?.street_address_2 || ""}
//                         onChange={(e) => handleChange(e.target.name, e.target.value)}
//                         name="chemist.address.street_address_2"
//                         disabled={!editMode}
//                         margin="normal"
//                         size="small"
//                         InputProps={{
//                           sx: { borderRadius: 2 },
//                         }}
//                       />
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="City"
//                             fullWidth
//                             value={invoice?.chemist?.address?.city || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="chemist.address.city"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="State"
//                             fullWidth
//                             value={invoice?.chemist?.address?.state || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="chemist.address.state"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="Zip Code"
//                             fullWidth
//                             value={invoice?.chemist?.address?.zip_code || ""}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="chemist.address.zip_code"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="TIN"
//                             fullWidth
//                             value={invoice?.chemist?.TIN}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="chemist.TIN"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                           <TextField
//                             label="DL No"
//                             fullWidth
//                             value={invoice?.chemist?.DL_No}
//                             onChange={(e) => handleChange(e.target.name, e.target.value)}
//                             name="chemist.DL_NO"
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               sx: { borderRadius: 2 },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </StyledCard>
//                 </Grid>
//               </Grid>
//             </Box>
//           </TabPanel>

//           <TabPanel value={tabValue} index={2}>
//             <ItemsTable
//               items={invoice?.items}
//               dataItems={data?.items}
//               editMode={editMode}
//               handleFieldChange={handleChange}
//             />
//             <Box p={3}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <StyledCard>
//                     <CardContent>
//                       <Box display="flex" alignItems="center" mb={2}>
//                         <Calculate color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="h6">
//                           Invoice Calculations
//                         </Typography>
//                       </Box>
//                       <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                           <TextField
//                             label="Subtotal"
//                             type="number"
//                             fullWidth
//                             value={invoice?.totals?.subtotal}
//                             onChange={(e) =>
//                               handleChange(
//                                 `totals.subtotal`,
//                                 parseFloat(e.target.value)
//                               )
//                             }
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               startAdornment: "&#8377;",
//                               sx: {
//                                 borderRadius: 1,
//                                 "& .MuiInputBase-input": {
//                                   pl: .5,
//                                 }
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             label="Discount"
//                             type="number"
//                             fullWidth
//                             value={invoice?.totals?.discount}
//                             onChange={(e) => {
//                               const discount = parseFloat(e.target.value);
//                               handleChange(
//                                 `totals.discount`,
//                                 discount
//                               );
//                               // Recalculate grand total
//                               const subtotal = invoice?.totals?.subtotal ?? 0;
//                               const taxTotal = invoice?.totals?.TAX_total ?? 0;
//                               const newGrandTotal =
//                                 subtotal - discount + taxTotal;
//                               handleChange(
//                                 'totals.grand_total',
//                                 newGrandTotal
//                               );
//                             }}
//                             disabled={!editMode}
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               startAdornment: "&#8377;",
//                               sx: {
//                                 borderRadius: 1,
//                                 "& .MuiInputBase-input": {
//                                   pl: .5,
//                                 }
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             label="TAX Total"
//                             // type="number"
//                             fullWidth
//                             value={invoice?.totals?.TAX_total}
//                             disabled={!editMode}
//                             onChange={(e) =>
//                               handleChange(
//                                 `totals.TAX_total`,
//                                 e.target.value
//                               )
//                             }
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               startAdornment: "&#8377;",
//                               sx: {
//                                 borderRadius: 1,
//                                 "& .MuiInputBase-input": {
//                                   pl: .5,
//                                 }
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={6}>
//                           <TextField
//                             label="Grand Total"
//                             type="number"
//                             fullWidth
//                             value={invoice?.totals?.grand_total}
//                             disabled={!editMode}
//                             onChange={(e) =>
//                               handleChange(
//                                 `totals.grand_total`,
//                                 e.target.value
//                               )
//                             }
//                             margin="normal"
//                             size="small"
//                             InputProps={{
//                               startAdornment: "&#8377;",
//                               sx: {
//                                 borderRadius: 1,
//                                 "& .MuiInputBase-input": {
//                                   pl: .5,
//                                 }
//                               },
//                             }}
//                           />
//                         </Grid>
//                         <Grid item xs={12}>
//                           <TextField
//                             label="Outstanding Amount"
//                             type="number"
//                             fullWidth
//                             value={invoice?.totals?.outstanding_amount}
//                             onChange={(e) =>
//                               handleChange(
//                                 `totals.outstanding_amount`,
//                                 parseFloat(e.target.value)
//                               )
//                             }
//                             disabled={!editMode} // Ensure this is correctly bound to editMode
//                             margin="normal"
//                             size="small"
//                             error={
//                               (invoice?.totals?.outstanding_amount || 0) > 0
//                             }
//                             helperText={
//                               (invoice?.totals?.outstanding_amount || 0) > 0
//                                 ? "Payment pending"
//                                 : ""
//                             }
//                             InputProps={{
//                               startAdornment: "&#8377;",
//                               sx: {
//                                 borderRadius: 1,
//                                 "& .MuiInputBase-input": {
//                                   pl: .5,
//                                 }
//                               },
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </StyledCard>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <StyledCard sx={{ height: "100%" }}>
//                     <CardContent>
//                       <Box display="flex" alignItems="center" mb={2}>
//                         <Assignment color="primary" sx={{ mr: 1 }} />
//                         <Typography variant="h6">Payment Summary</Typography>
//                       </Box>

//                       <Box
//                         sx={{
//                           p: 2,
//                           borderRadius: 1,
//                           bgcolor: "background.paper",
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <Box
//                           display="flex"
//                           justifyContent="space-between"
//                           mb={1}
//                         >
//                           <Typography variant="body1" color="text.secondary">
//                             Sub-Total:
//                           </Typography>
//                           <Typography variant="body1" fontWeight="500">
//                             {(invoice?.totals?.subtotal ?? 0).toFixed(2)} &#8377;
//                           </Typography>
//                         </Box>
//                         <Box
//                           display="flex"
//                           justifyContent="space-between"
//                           mb={1}
//                         >
//                           <Typography variant="body1" color="text.secondary">
//                             Discount:
//                           </Typography>
//                           <Typography
//                             variant="body1"
//                             fontWeight="500"
//                             color="error"
//                           >
//                             - {(invoice?.totals?.discount ?? 0).toFixed(2)} &#8377;
//                           </Typography>
//                         </Box>
//                         <Box
//                           display="flex"
//                           justifyContent="space-between"
//                           mb={1}
//                         >
//                           <Typography variant="body1" color="text.secondary">
//                             TAX Total:
//                           </Typography>
//                           <Typography
//                             variant="body1"
//                             fontWeight="500"
//                             color="#2e7d32"
//                           >
//                             {`+ ${(Number(invoice?.totals?.TAX_total || 0)).toFixed(2)} &#8377;`}
//                           </Typography>
//                         </Box>

//                         <Divider sx={{ my: 2 }} />
//                         <Box
//                           display="flex"
//                           justifyContent="space-between"
//                           mb={1}
//                         >
//                           <Typography variant="h6">Grand Total:</Typography>
//                           <Typography variant="h6" color="primary">
//                             {Number(invoice?.totals?.grand_total ?? 0).toFixed(2)} &#8377;
//                           </Typography>
//                         </Box>

//                         {(invoice?.totals?.outstanding_amount || 0) > 0 && (
//                           <>
//                             <Divider sx={{ my: 2 }} />
//                             <Box
//                               display="flex"
//                               justifyContent="space-between"
//                               mb={1}
//                             >
//                               <Typography
//                                 variant="body1"
//                                 color="text.secondary"
//                               >
//                                 Paid Amount:
//                               </Typography>
//                               <Typography variant="body1" fontWeight="500">
//                                 {(
//                                   (invoice?.totals?.grand_total || 0) -
//                                   (invoice?.totals?.outstanding_amount || 0)
//                                 ).toFixed(2)} &#8377;
//                               </Typography>
//                             </Box>
//                             <Box
//                               display="flex"
//                               justifyContent="space-between"
//                               mb={1}
//                             >
//                               <Typography variant="body1" color="error">
//                                 Outstanding Amount:
//                               </Typography>
//                               <Typography
//                                 variant="body1"
//                                 fontWeight="500"
//                                 color="error"
//                               >
//                                 {(
//                                   invoice?.totals?.outstanding_amount || 0
//                                 ).toFixed(2)} &#8377;
//                               </Typography>
//                             </Box>
//                           </>
//                         )}
//                       </Box>

//                       <Box
//                         mt={3}
//                         p={2}
//                         borderRadius={2}
//                         bgcolor={editMode ? "action.hover" : "background.paper"}
//                       >
//                         <Typography
//                           variant="subtitle2"
//                           color="text.secondary"
//                           gutterBottom
//                         >
//                           Payment Status:
//                         </Typography>

//                         {editMode ? (
//                           <>
//                             <Box mt={1} mb={2}>
//                               <FormControlLabel
//                                 control={
//                                   <Radio
//                                     checked={
//                                       invoice?.totals?.outstanding_amount === 0
//                                     }
//                                     onChange={() => {
//                                       handleChange(
//                                         "totals.outstanding_amount",
//                                         0
//                                       );

//                                     }}
//                                     color="success"
//                                   />
//                                 }
//                                 label={
//                                   <Typography variant="body2" fontWeight={500}>
//                                     FULLY PAID
//                                   </Typography>
//                                 }
//                               />
//                               <FormControlLabel
//                                 control={
//                                   <Radio
//                                     checked={
//                                       (invoice?.totals?.outstanding_amount ||
//                                         0) > 0
//                                     }
//                                     onChange={() => {
//                                       // If currently fully paid, set some default outstanding amount
//                                       if (
//                                         (invoice?.totals?.outstanding_amount ||
//                                           0) === 0
//                                       ) {
//                                         const defaultOutstanding =
//                                           (invoice?.totals?.grand_total || 0) *
//                                           0.5; // 50% as default
//                                         handleChange(
//                                           "totals.outstanding_amount",
//                                           defaultOutstanding
//                                         );
//                                       }
//                                     }}
//                                     color="warning"
//                                   />
//                                 }
//                                 label={
//                                   <Typography variant="body2" fontWeight={500}>
//                                     PARTIALLY PAID
//                                   </Typography>
//                                 }
//                               />
//                             </Box>

//                             {(invoice?.totals?.outstanding_amount ?? 0) > 0 && (
//                               <TextField
//                                 label="Outstanding Amount"
//                                 type="number"
//                                 size="small"
//                                 fullWidth
//                                 value={invoice?.totals?.outstanding_amount ?? 0}
//                                 onChange={(e) =>
//                                   handleChange(
//                                     "totals.outstanding_amount",
//                                     parseFloat(e.target.value) || 0
//                                   )
//                                 }
//                                 margin="dense"
//                                 InputProps={{
//                                   startAdornment: "&#8377;",
//                                   sx: { borderRadius: 2 },
//                                 }}
//                                 helperText="Enter the amount still pending"
//                               />
//                             )}
//                           </>
//                         ) : (
//                           <Box display="flex" alignItems="center" mt={1}>
//                             <Chip
//                               label={
//                                 (invoice?.totals?.outstanding_amount || 0) > 0
//                                   ? "PARTIALLY PAID"
//                                   : "FULLY PAID"
//                               }
//                               color={
//                                 (invoice?.totals?.outstanding_amount || 0) > 0
//                                   ? "warning"
//                                   : "success"
//                               }
//                               sx={{
//                                 borderRadius: 1,
//                                 fontWeight: "bold",
//                               }}
//                             />
//                             {(invoice?.totals?.outstanding_amount || 0) > 0 && (
//                               <Typography
//                                 variant="body2"
//                                 color="text.secondary"
//                                 ml={2}
//                               >
//                                 Outstanding: &#8377;
//                                 {(
//                                   invoice?.totals?.outstanding_amount || 0
//                                 ).toFixed(2)}
//                               </Typography>
//                             )}
//                           </Box>
//                         )}
//                       </Box>
//                     </CardContent>
//                   </StyledCard>
//                 </Grid>
//               </Grid>
//             </Box>
//           </TabPanel>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default InvoiceEditor;
