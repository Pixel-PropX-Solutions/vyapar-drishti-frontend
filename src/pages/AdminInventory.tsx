// import {
//   Card,
//   Chip,
//   Grid,
//   Stack,
//   useTheme,
//   IconButton,
//   Tooltip,
//   Box,
//   Typography,
//   Divider,
//   alpha,
//   CardContent,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import WarningAmberIcon from "@mui/icons-material/WarningAmber";
// import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { SparkLineChart } from "@mui/x-charts";
// import { areaElementClasses } from "@mui/x-charts/LineChart";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { viewInventrory } from "@/services/inventory";
// import { Inventory } from "@/utils/types";
// import { formatDate } from "@/utils/functions";
// import { GridRenderCellParams } from '@mui/x-data-grid';


// export default function AdminInventory() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const { inventoryData } = useSelector((state: RootState) => state.inventory);
//   const { user } = useSelector((state: RootState) => state.auth);

//   const daysInWeek = getDaysInMonth(4, 2024);
//   const [data, setData] = useState<Inventory[]>([]);
//   const [activeFilter, setActiveFilter] = useState("All");
//   // const [searchValue, setSearchValue] = useState("");

//   // Count metrics
//   const totalProducts = data.length;
//   const lowStockCount = data.filter((item) => item.quantity <= 10).length;
//   const outOfStockCount = data.filter((item) => item.quantity < 1).length;
//   const totalValue = (data ?? []).reduce(
//     (sum, item) =>
//       sum + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 0),
//     0
//   );

//   // Filter functionality
//   const filteredData = data.filter((item) => {
//     // const matchesSearch =
//     //   !searchValue ||
//     //   item?.product?.product_name
//     //     .toLowerCase()
//     //     .includes(searchValue.toLowerCase());

//     // // Then apply category filter
//     // if (!matchesSearch) return false;

//     if (activeFilter === "Low Stock")
//       return Number(item?.quantity) >= 1 && Number(item?.quantity) <= 10;
//     if (activeFilter === "Out of Stock") return Number(item?.quantity) < 1;
//     if (activeFilter === "Expiring Soon") {
//       const expiryDate = new Date(item.product.expiry_date);
//       const threeMonthsFromNow = new Date();
//       threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
//       return expiryDate < threeMonthsFromNow;
//     }
//     return true;
//   });

//   function AreaGradient({ color, id }: { color: string; id: string }) {
//     return (
//       <defs>
//         <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
//           <stop offset="0%" stopColor={color} stopOpacity={0.3} />
//           <stop offset="100%" stopColor={color} stopOpacity={0} />
//         </linearGradient>
//       </defs>
//     );
//   }

//   const trendColors = {
//     up: theme.palette.success.main,
//     down: theme.palette.error.main,
//     neutral: theme.palette.grey[400],
//   };

//   function getDaysInMonth(month:number, year:number) {
//     const date = new Date(year, month, 0);
//     const monthName = date.toLocaleDateString("en-US", {
//       month: "short",
//     });
//     const daysInMonth = date.getDate();
//     const days = [];
//     let i = 1;
//     while (days.length < daysInMonth) {
//       days.push(`${monthName} ${i}`);
//       i += 1;
//     }
//     return days;
//   }


//   const inventoryRows = filteredData?.map((item) => ({
//     id: item?.product_id,
//     name: item?.product?.product_name,
//     buying_price: item?.product?.price,
//     quantity: item?.quantity,
//     last_restock_date: formatDate(item?.last_restock_date),
//     expiry_date: formatDate(item?.product?.expiry_date),
//     availability: item?.quantity,
//   }));

//   // Enhanced columns with visual indicators
//   const inventoryColumns = [
//     {
//       field: "name",
//       headerName: "Product Name",
//       width: 300,
//       renderCell: (params:GridRenderCellParams) => (
//         <Stack direction="row" spacing={1} alignItems="center">
//           <LocalPharmacyIcon fontSize="small" color={"primary"} />
//           <Typography variant="body2">{params.value}</Typography>
//         </Stack>
//       ),
//     },
//     {
//       field: "buying_price",
//       headerName: "Price (&#8377;)",
//       width: 100,
//       renderCell: (params:GridRenderCellParams) => (
//         <Typography variant="body2" align="right">&#8377;{params.value}</Typography>
//       ),
//     },
//     {
//       field: "quantity",
//       headerName: "Quantity",
//       width: 120,
//       renderCell: (params:GridRenderCellParams) => {
//         const belowThreshold = params.row.quantity <= params.row.threshold;
//         return (
//           <Typography
//             variant="body2"
//             sx={{
//               color: belowThreshold ? theme.palette.error.light : "inherit",
//               fontWeight: belowThreshold ? "bold" : "normal",
//             }}
//           >
//             {params.value} units
//           </Typography>
//         );
//       },
//     },
//     {
//       field: "last_restock_date",
//       headerName: "Restock Date",
//       width: 150,
//       renderCell: (params:GridRenderCellParams) => {
//         return (
//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: "normal",
//             }}
//           >
//             {params.value}
//           </Typography>
//         );
//       },
//     },
//     {
//       field: "expiry_date",
//       headerName: "Expiry Date",
//       width: 150,
//       renderCell: (params:GridRenderCellParams) => {
//         const expiryDate = new Date(params.value);
//         const threeMonthsFromNow = new Date();
//         threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
//         const isExpiringSoon = expiryDate < threeMonthsFromNow;

//         return (
//           <Typography
//             variant="body2"
//             sx={{
//               color: isExpiringSoon ? theme.palette.warning.main : "inherit",
//               fontWeight: isExpiringSoon ? "bold" : "normal",
//             }}
//           >
//             {params.value}
//             {isExpiringSoon && (
//               <Tooltip title="Expiring soon">
//                 <WarningAmberIcon
//                   fontSize="small"
//                   color="warning"
//                   sx={{ ml: 1, verticalAlign: "middle" }}
//                 />
//               </Tooltip>
//             )}
//           </Typography>
//         );
//       },
//     },
//     {
//       field: "availability",
//       headerName: "Status",
//       width: 150,
//       renderCell: (params:GridRenderCellParams) => {
//         return (
//           <Chip
//             size="small"
//             sx={{
//               border: "2px solid",
//               p: 1,
//               py: 2,
//               mb: 4,

//               bgcolor:
//                 params.value > 10
//                   ? alpha(theme.palette.success.main, 0.4)
//                   : params.value <= 10 && params.value >= 1
//                     ? alpha(theme.palette.warning.main, 0.4)
//                     : params.value < 1
//                       ? alpha(theme.palette.error.main, 0.4)
//                       : alpha(theme.palette.info.main, 0.4),
//               borderColor:
//                 params.value > 10
//                   ? theme.palette.success.main
//                   : params.value <= 10 && params.value >= 1
//                     ? theme.palette.warning.main
//                     : params.value < 1
//                       ? theme.palette.error.main
//                       : theme.palette.info.main,
//             }}
//             label={
//               params.value <= 10 && params.value >= 1
//                 ? "Low Stock"
//                 : params.value < 1
//                   ? "Out of Stock"
//                   : "In Stock"
//             }
//           />
//         );
//       },
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 120,
//       renderCell: (params:GridRenderCellParams) => (
//         <Stack direction="row" spacing={1} alignItems="center" justifyContent={"center"}>
//           <Tooltip title="View Details">
//             <IconButton
//               size="small"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigate(`/products/${params.id}`);
//               }}
//             >
//               <InventoryIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//           {
//             user?.user_type === 'Chemist' && (
//               <Tooltip title="Order More">
//                 <IconButton
//                   size="small"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/orders/create`);
//                   }}
//                 >
//                   <AddCircleIcon fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             )
//           }
//         </Stack>
//       ),
//     },
//   ];

//   useEffect(() => {
//     dispatch(viewInventrory({ chemistId: user?.user_type === 'Chemist' ? user?._id ?? "" : "", productId: "" })).then(() => { });
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (inventoryData) {
//       setData(inventoryData);
//     }
//   }, [inventoryData]);

//   // Get trend for metrics (usually from backend data)
//   const totalTrend = "up";
//   const valueTrend = "up";
//   const lowStockTrend = "down";

//   return (
//     <Box sx={{ width: "100%", p: 3, }}>
//       {/* Title and Search Bar */}
//       <Card sx={{ mb: 3, p: 2, }}>
//         <CardContent>
//           <Grid item xs={12} md={12}>
//             <Typography variant="h5" component="h1" fontWeight="bold">
//               Inventory Management
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Manage your pharmacy stock, orders, and inventory levels
//             </Typography>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Metric Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} lg={3}>
//           <Card elevation={2} sx={{ p: 2, height: "100%" }}>
//             <Stack spacing={2}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     Total Products
//                   </Typography>
//                   <Typography variant="h4" component="p" fontWeight="bold">
//                     {totalProducts}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     p: 1,
//                     borderRadius: "50%",
//                     bgcolor: theme.palette.primary.light,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <InventoryIcon
//                     fontSize="medium"
//                     sx={{ color: theme.palette.primary.dark }}
//                   />
//                 </Box>
//               </Stack>

//               <Box>
//                 <Stack direction="row" alignItems="center" spacing={0.5}>
//                   {totalTrend === "up" ? (
//                     <TrendingUpIcon fontSize="small" color="success" />
//                   ) : (
//                     <TrendingDownIcon fontSize="small" color="error" />
//                   )}
//                   <Typography
//                     variant="body2"
//                     color={totalTrend === "up" ? "success.main" : "error.main"}
//                   >
//                     +12% past week
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Box sx={{ width: "100%", height: 50 }}>
//                 <SparkLineChart
//                   colors={[trendColors[totalTrend]]}
//                   data={[
//                     500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510,
//                     530, 620, 510, 530, 520, 410, 530, 520, 610, 530, 520, 610,
//                     530, 420, 510, 430, 520, 510,
//                   ]}
//                   area
//                   showHighlight
//                   showTooltip
//                   xAxis={{
//                     scaleType: "band",
//                     data: daysInWeek,
//                   }}
//                   sx={{
//                     [`& .${areaElementClasses.root}`]: {
//                       fill: `url(#area-gradient-1)`,
//                     },
//                   }}
//                 >
//                   <AreaGradient
//                     color={trendColors[totalTrend]}
//                     id="area-gradient-1"
//                   />
//                 </SparkLineChart>
//               </Box>
//               <Divider />

//               <Stack spacing={1}>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     fontStyle: "italic",
//                     cursor: "pointer",
//                     ":hover": {
//                       fontWeight: "bold",
//                     },
//                   }}
//                   onClick={() => setActiveFilter("All")}
//                 >
//                   View All Items
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} lg={3}>
//           <Card elevation={2} sx={{ p: 2, height: "100%" }}>
//             <Stack spacing={2}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     Inventory Value
//                   </Typography>
//                   <Typography variant="h4" component="p" fontWeight="bold">
//                     &#8377;{totalValue.toLocaleString()}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     p: 1,
//                     borderRadius: "50%",
//                     bgcolor: theme.palette.success.light,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography variant="h6" sx={{ color: theme.palette.success.dark }}>
//                     &#8377;
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Box>
//                 <Stack direction="row" alignItems="center" spacing={0.5}>
//                   {valueTrend === "up" ? (
//                     <TrendingUpIcon fontSize="small" color="success" />
//                   ) : (
//                     <TrendingDownIcon fontSize="small" color="error" />
//                   )}
//                   <Typography
//                     variant="body2"
//                     color={valueTrend === "up" ? "success.main" : "error.main"}
//                   >
//                     +5.2% past week
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Box sx={{ width: "100%", height: 50 }}>
//                 <SparkLineChart
//                   colors={[trendColors[valueTrend]]}
//                   data={[
//                     200, 240, 220, 260, 240, 280, 300, 240, 280, 240, 300, 340,
//                     320, 360, 340, 380, 360, 400, 380, 420, 400, 440, 420, 460,
//                     440, 480, 460, 500, 480, 520,
//                   ]}
//                   area
//                   showHighlight
//                   showTooltip
//                   xAxis={{
//                     scaleType: "band",
//                     data: daysInWeek,
//                   }}
//                   sx={{
//                     [`& .${areaElementClasses.root}`]: {
//                       fill: `url(#area-gradient-2)`,
//                     },
//                   }}
//                 >
//                   <AreaGradient
//                     color={trendColors[valueTrend]}
//                     id="area-gradient-2"
//                   />
//                 </SparkLineChart>
//               </Box>
//             </Stack>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} lg={3}>
//           <Card
//             elevation={2}
//             sx={{
//               p: 2,
//               height: "100%",
//               borderLeft: `4px solid ${theme.palette.warning.main}`,
//             }}
//           >
//             <Stack spacing={2}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     Low Stock Items
//                   </Typography>
//                   <Typography variant="h4" component="p" fontWeight="bold">
//                     {lowStockCount}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     p: 1,
//                     borderRadius: "50%",
//                     bgcolor: theme.palette.warning.light,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <WarningAmberIcon
//                     fontSize="medium"
//                     sx={{ color: theme.palette.warning.dark }}
//                   />
//                 </Box>
//               </Stack>

//               <Box>
//                 <Stack direction="row" alignItems="center" spacing={0.5}>
//                   {lowStockTrend === "down" ? (
//                     <TrendingDownIcon fontSize="small" color="error" />
//                   ) : (
//                     <TrendingUpIcon fontSize="small" color="success" />
//                   )}
//                   <Typography
//                     variant="body2"
//                     color={
//                       lowStockTrend === "down" ? "error.main" : "success.main"
//                     }
//                   >
//                     -3% past week
//                   </Typography>
//                 </Stack>
//               </Box>

//               <Box sx={{ width: "100%", height: 50 }}>
//                 <SparkLineChart
//                   colors={[trendColors.down]}
//                   data={[
//                     8, 7, 9, 8, 7, 8, 6, 7, 5, 6, 7, 8, 7, 6, 7, 5, 6, 4, 5, 6,
//                     5, 4, 3, 4, 3, 2, 3, 4, 3, 2,
//                   ]}
//                   area
//                   showHighlight
//                   showTooltip
//                   xAxis={{
//                     scaleType: "band",
//                     data: daysInWeek,
//                   }}
//                   sx={{
//                     [`& .${areaElementClasses.root}`]: {
//                       fill: `url(#area-gradient-3)`,
//                     },
//                   }}
//                 >
//                   <AreaGradient color={trendColors.down} id="area-gradient-3" />
//                 </SparkLineChart>
//               </Box>
//               <Divider />

//               <Stack spacing={1}>
//                 {data.filter(
//                   (item) => item.quantity <= 10 && item?.quantity >= 1
//                 )?.length >= 1 && (
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontStyle: "italic",
//                         cursor: "pointer",
//                         ":hover": {
//                           fontWeight: "bold",
//                         },
//                       }}
//                       onClick={() => setActiveFilter("Low Stock")}
//                     >
//                       View All Low Stock Items
//                     </Typography>
//                   )}
//                 {lowStockCount === 0 && (
//                   <Typography variant="body2" sx={{ fontStyle: "italic" }}>
//                     No Low stock items
//                   </Typography>
//                 )}
//               </Stack>
//             </Stack>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} lg={3}>
//           <Card
//             elevation={2}
//             sx={{
//               p: 2,
//               height: "100%",
//               borderLeft: `4px solid ${theme.palette.error.main}`,
//             }}
//           >
//             <Stack spacing={2}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     Out of Stock Items
//                   </Typography>
//                   <Typography variant="h4" component="p" fontWeight="bold">
//                     {outOfStockCount}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     p: 1,
//                     borderRadius: "50%",
//                     bgcolor: theme.palette.error.light,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <InventoryIcon
//                     fontSize="medium"
//                     sx={{ color: theme.palette.error.dark }}
//                   />
//                 </Box>
//               </Stack>

//               <Divider />

//               <Stack spacing={1}>
//                 {data
//                   .filter((item) => item.quantity < 1)
//                   .slice(0, 2)
//                   .map((item) => (
//                     <Box key={item._id}>
//                       <Typography variant="body2" fontWeight="medium">
//                         {item?.product?.product_name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {formatDate(item?.last_restock_date)}
//                       </Typography>
//                     </Box>
//                   ))}
//                 {data.filter((item) => item.quantity < 1)?.length > 2 && (
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       fontStyle: "italic",
//                       cursor: "pointer",
//                       ":hover": {
//                         fontWeight: "bold",
//                       },
//                     }}
//                     onClick={() => setActiveFilter("Out of Stock")}
//                   >
//                     View All Out of Stock Items
//                   </Typography>
//                 )}
//                 {outOfStockCount === 0 && (
//                   <Typography variant="body2" sx={{ fontStyle: "italic" }}>
//                     No items out of stock
//                   </Typography>
//                 )}
//               </Stack>
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Products Data Grid */}
//       <Card elevation={3}>
//         <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           <Typography variant="h6">
//             Products ({data.length} of {totalProducts})
//           </Typography>
//         </Box>

//         <DataGrid
//           checkboxSelection
//           sx={{
//             border: "none",
//             "& .MuiDataGrid-cell": {
//               fontSize: "0.9rem",
//               py: 1,
//             },
//             "& .MuiDataGrid-columnHeaderTitle": {
//               fontSize: "0.95rem",
//               fontWeight: "bold",
//             },

//             // Highlight rows based on status
//             "& .row-low-stock": {
//               backgroundColor: alpha(theme.palette.warning.light, 0.4),
//               "&:hover": {
//                 backgroundColor: alpha(theme.palette.warning.light, 0.5),
//               },
//             },
//             "& .row-out-of-stock": {
//               backgroundColor: alpha(theme.palette.error.light, 0.4),
//               "&:hover": {
//                 backgroundColor: alpha(theme.palette.error.light, 0.5),
//               },
//             },
//           }}
//           onRowClick={(params) => navigate(`/products/${params.id}`)}
//           disableRowSelectionOnClick
//           rows={inventoryRows}
//           columns={inventoryColumns}
//           getRowClassName={(params) => {
//             if (params.row.availability < 1) return "row-out-of-stock";
//             if (params.row.availability <= 10 && params.row.availability > 1)
//               return "row-low-stock";
//             return "";
//           }}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 10 } },
//           }}
//           pageSizeOptions={[5, 10, 20, 50]}
//           density="standard"
//           autoHeight
//           rowHeight={60}
//         />
//       </Card>
//     </Box>
//   );
// }

// // import {
// //   Card,
// //   Chip,
// //   FormControl,
// //   Grid,
// //   InputAdornment,
// //   OutlinedInput,
// //   Stack,
// //   useTheme,
// // } from "@mui/material";
// // import Box from "@mui/material/Box";
// // import Typography from "@mui/material/Typography";
// // import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
// // import MenuButton from "@/components/MenuButton";
// // import AddCircleIcon from "@mui/icons-material/AddCircle";
// // import { useNavigate } from "react-router-dom";
// // import { useEffect } from "react";
// // import { inventoryProductColumn } from "@/utils/functions";
// // import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
// // import { SparkLineChart } from "@mui/x-charts";
// // import { areaElementClasses } from "@mui/x-charts/LineChart";

// // const inventryData = [
// //   {
// //     _id: "b7f3a1d5-41c0-4a69-9a4e-2d6d328a90b1",
// //     name: "Ibuprofen",
// //     buying_price: "15",
// //     quantity: 100,
// //     threshold: 30,
// //     expiry_date: "12 December 2026",
// //     availability: "In Stock",
// //   },
// //   {
// //     _id: "f2d1c8a4-92e7-4c43-9e2d-3d59b4fbb78e",
// //     name: "Amoxicillin",
// //     buying_price: "25",
// //     quantity: 20,
// //     threshold: 15,
// //     expiry_date: "05 March 2025",
// //     availability: "Low Stock",
// //   },
// //   {
// //     _id: "8e97d2fc-3f6b-48cd-8347-12c3d6fa5db2",
// //     name: "Cetirizine",
// //     buying_price: "12",
// //     quantity: 75,
// //     threshold: 25,
// //     expiry_date: "18 July 2026",
// //     availability: "In Stock",
// //   },
// //   {
// //     _id: "3a94d0ea-1e56-469c-90b7-c7c4c36e4fbb",
// //     name: "Metformin",
// //     buying_price: "30",
// //     quantity: 10,
// //     threshold: 10,
// //     expiry_date: "22 November 2024",
// //     availability: "Out of Stock",
// //   },
// //   {
// //     _id: "57c8a1e4-6c3b-4f02-9c9d-5e3a9e7b5f0c",
// //     name: "Aspirin",
// //     buying_price: "18",
// //     quantity: 200,
// //     threshold: 50,
// //     expiry_date: "30 September 2027",
// //     availability: "In Stock",
// //   },
// //   {
// //     _id: "a3d5e8f2-62c9-4f85-b021-d16b3f80e97b",
// //     name: "Dolo 650",
// //     buying_price: "8",
// //     quantity: 35,
// //     threshold: 20,
// //     expiry_date: "15 January 2025",
// //     availability: "Low Stock",
// //   },
// //   {
// //     _id: "c4f8d9b7-2e3a-45d6-87f4-6a2f24f8e5cb",
// //     name: "Azithromycin",
// //     buying_price: "40",
// //     quantity: 60,
// //     threshold: 25,
// //     expiry_date: "10 June 2025",
// //     availability: "In Stock",
// //   },
// //   {
// //     _id: "e0a6b4f9-8c34-4298-8495-57fd24b5df64",
// //     name: "Omeprazole",
// //     buying_price: "22",
// //     quantity: 90,
// //     threshold: 30,
// //     expiry_date: "08 August 2026",
// //     availability: "In Stock",
// //   },
// // ];

// // // type TrendType = "up" | "down" | "neutral";

// // export default function Inventory() {
// //   const navigate = useNavigate();
// //   const theme = useTheme();
// //   const daysInWeek = getDaysInMonth(4, 2024);

// //   function AreaGradient({ color, id }: { color: string; id: string }) {
// //     return (
// //       <defs>
// //         <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
// //           <stop offset="0%" stopColor={color} stopOpacity={0.3} />
// //           <stop offset="100%" stopColor={color} stopOpacity={0} />
// //         </linearGradient>
// //       </defs>
// //     );
// //   }

// //   const trendColors = {
// //     up:
// //       theme.palette.mode === "light"
// //         ? theme.palette.success.main
// //         : theme.palette.success.dark,
// //     down:
// //       theme.palette.mode === "light"
// //         ? theme.palette.error.main
// //         : theme.palette.error.dark,
// //     neutral:
// //       theme.palette.mode === "light"
// //         ? theme.palette.grey[400]
// //         : theme.palette.grey[700],
// //   };

// //   function getDaysInMonth(month: number, year: number) {
// //     const date = new Date(year, month, 0);
// //     const monthName = date.toLocaleDateString("en-US", {
// //       month: "short",
// //     });
// //     const daysInMonth = date.getDate();
// //     const days = [];
// //     let i = 1;
// //     while (days.length < daysInMonth) {
// //       days.push(`${monthName} ${i}`);
// //       i += 1;
// //     }
// //     return days;
// //   }

// //   const inventoryRow: GridRowsProp = (inventryData || []).map((product) => ({
// //     id: product._id,
// //     name: product.name,
// //     buying_price: product.buying_price,
// //     quantity: product.quantity,
// //     threshold: product.threshold,
// //     expiry_date: product.expiry_date,
// //     availability: product.availability,
// //   }));

// //   useEffect(() => {
// //     // dispatch(viewAllStockist());
// //   }, []);

// //   const trend = "up"; // Example assignment; ensure this is set correctly in your code
// //   const chartColor = trendColors[trend];

// //   return (
// //     <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
// //       {/* cards */}

// //       <Grid
// //         container
// //         sx={{
// //           margin: "10px auto 0px auto",
// //           display: "flex",
// //           width: "100%",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Grid
// //           item
// //           sx={{
// //             width: "max-content",
// //           }}
// //         >
// //           <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
// //             Inventory Overview
// //           </Typography>
// //         </Grid>
// //       </Grid>

// //       <Grid
// //         container
// //         sx={{
// //           margin: "0 auto 30px auto",
// //           display: "flex",
// //           width: "100%",
// //           columnGap: "20px",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Grid item xs={12} sm={6} lg={3}>
// //           <Card sx={{ background: "white" }}>
// //             <Typography component="h2" variant="subtitle2" gutterBottom>
// //               Total Products
// //             </Typography>
// //             <Stack sx={{ justifyContent: "space-between" }}>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography variant="h4" component="p">
// //                   686
// //                 </Typography>
// //                 <Chip size="small" color={"success"} label={"&#8377;250000"} />
// //               </Stack>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Last 7 days
// //                 </Typography>

// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Revenue
// //                 </Typography>
// //               </Stack>
// //             </Stack>

// //             <Box sx={{ width: "100%", height: 50 }}>
// //               <SparkLineChart
// //                 colors={[chartColor]}
// //                 data={[
// //                   500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510,
// //                   530, 620, 510, 530, 520, 410, 530, 520, 610, 530, 520, 610,
// //                   530, 420, 510, 430, 520, 510,
// //                 ]}
// //                 area
// //                 showHighlight
// //                 showTooltip
// //                 xAxis={{
// //                   scaleType: "band",
// //                   data: daysInWeek,
// //                 }}
// //                 sx={{
// //                   [`& .${areaElementClasses.root}`]: {
// //                     fill: `url(#area-gradient-${68})`,
// //                   },
// //                 }}
// //               >
// //                 <AreaGradient color={chartColor} id={`area-gradient-${68}`} />
// //               </SparkLineChart>
// //             </Box>
// //           </Card>
// //         </Grid>

// //         <Grid item xs={12} sm={6} lg={3}>
// //           <Card sx={{ background: "white" }}>
// //             <Typography component="h2" variant="subtitle2" gutterBottom>
// //               Total Products
// //             </Typography>
// //             <Stack sx={{ justifyContent: "space-between" }}>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography variant="h4" component="p">
// //                   686
// //                 </Typography>
// //                 <Chip size="small" color={"success"} label={"&#8377;250000"} />
// //               </Stack>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Last 7 days
// //                 </Typography>

// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Revenue
// //                 </Typography>
// //               </Stack>
// //             </Stack>

// //             <Box sx={{ width: "100%", height: 50 }}>
// //               <SparkLineChart
// //                 colors={[chartColor]}
// //                 data={[
// //                   200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340,
// //                   320, 360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460,
// //                   440, 480, 460, 600, 880, 920,
// //                 ]}
// //                 area
// //                 showHighlight
// //                 showTooltip
// //                 xAxis={{
// //                   scaleType: "band",
// //                   data: daysInWeek,
// //                 }}
// //                 sx={{
// //                   [`& .${areaElementClasses.root}`]: {
// //                     fill: `url(#area-gradient-${868})`,
// //                   },
// //                 }}
// //               >
// //                 <AreaGradient color={chartColor} id={`area-gradient-${868}`} />
// //               </SparkLineChart>
// //             </Box>
// //           </Card>
// //         </Grid>

// //         <Grid item xs={12} sm={6} lg={3}>
// //           <Card sx={{ background: "white" }}>
// //             <Typography component="h2" variant="subtitle2" gutterBottom>
// //               Total Products
// //             </Typography>
// //             <Stack sx={{ justifyContent: "space-between" }}>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography variant="h4" component="p">
// //                   686
// //                 </Typography>
// //                 <Chip size="small" color={"success"} label={"&#8377;250000"} />
// //               </Stack>
// //               <Stack
// //                 direction="row"
// //                 sx={{ justifyContent: "space-between", alignItems: "center" }}
// //               >
// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Last 7 days
// //                 </Typography>

// //                 <Typography
// //                   variant="caption"
// //                   sx={{ color: "text.secondary" }}
// //                   gutterBottom
// //                 >
// //                   Revenue
// //                 </Typography>
// //               </Stack>
// //             </Stack>

// //             <Box sx={{ width: "100%", height: 50 }}>
// //               <SparkLineChart
// //                 colors={[chartColor]}
// //                 data={[
// //                   1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920,
// //                   820, 840, 600, 820, 780, 800, 760, 380, 740, 660, 620, 840,
// //                   500, 520, 480, 400, 360, 300, 220,
// //                 ]}
// //                 area
// //                 showHighlight
// //                 showTooltip
// //                 xAxis={{
// //                   scaleType: "band",
// //                   data: daysInWeek,
// //                 }}
// //                 sx={{
// //                   [`& .${areaElementClasses.root}`]: {
// //                     fill: `url(#area-gradient-${868})`,
// //                   },
// //                 }}
// //               >
// //                 <AreaGradient color={chartColor} id={`area-gradient-${868}`} />
// //               </SparkLineChart>
// //             </Box>
// //           </Card>
// //         </Grid>
// //       </Grid>

// //       <Grid
// //         container
// //         sx={{
// //           margin: "10px auto 0px auto",
// //           display: "flex",
// //           width: "100%",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           border: "1px solid rgba(194, 201, 214, .4)",
// //           borderBottom: "none",
// //           borderRadius: 1,
// //           borderBottomLeftRadius: 0,
// //           borderBottomRightRadius: 0,
// //           padding: "15px",
// //         }}
// //       >
// //         <Grid
// //           item
// //           sx={{
// //             width: "max-content",
// //             margin: 0,
// //           }}
// //         >
// //           <Typography variant="body1" sx={{ margin: 0 }}>
// //             Products
// //           </Typography>
// //         </Grid>
// //         <Grid
// //           item
// //           sx={{
// //             width: "30%",
// //             display: "flex",
// //             marginRight: 0,
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //           }}
// //         >
// //           <MenuButton
// //             onClick={() => {
// //               navigate("/add/product");
// //             }}
// //             size="small"
// //             sx={{
// //               width: "max-content",
// //               gap: "10px",
// //               margin: "auto 10px",
// //               padding: "0 10px",
// //             }}
// //             aria-label="Add Stockist"
// //             aria-controls={"color-scheme-menu"}
// //           >
// //             <AddCircleIcon fontSize="large" />
// //             <Typography
// //               variant="body1"
// //               sx={{ margin: 0, whiteSpace: "nowrap" }}
// //             >
// //               Add Products
// //             </Typography>
// //           </MenuButton>
// //           <FormControl sx={{ width: "max-content" }} variant="outlined">
// //             <OutlinedInput
// //               size="small"
// //               id="search"
// //               placeholder="Search…"
// //               sx={{ flexGrow: 1 }}
// //               startAdornment={
// //                 <InputAdornment position="start" sx={{ color: "text.primary" }}>
// //                   <SearchRoundedIcon fontSize="small" />
// //                 </InputAdornment>
// //               }
// //               inputProps={{
// //                 "aria-label": "search",
// //               }}
// //             />
// //           </FormControl>
// //         </Grid>
// //       </Grid>
// //       <Grid container spacing={0} columns={0}>
// //         <DataGrid
// //           checkboxSelection
// //           // onRowClick={(event) => {
// //           //   navigate(`/stockists/profile/${event.id}`);
// //           // }}
// //           sx={{
// //             border: "1px solid rgba(194, 201, 214, .4)",
// //             // borderBottom: "none",
// //             borderRadius: 1,
// //             borderTopLeftRadius: 0,
// //             borderTopWidth: "2px",
// //             borderTopRightRadius: 0,
// //             '& .MuiDataGrid-cell': {
// //               fontSize: '0.9rem',
// //             },
// //             '& .MuiDataGrid-columnHeaderTitle': {
// //               fontSize: '1rem',
// //             },
// //           }}
// //           disableRowSelectionOnClick
// //           editMode="row"
// //           rows={inventoryRow}
// //           columns={inventoryProductColumn}
// //           getRowClassName={(params) =>
// //             params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
// //           }
// //           initialState={{
// //             pagination: { paginationModel: { pageSize: 10 } },
// //           }}
// //           pageSizeOptions={[10, 20, 50]}
// //           density="compact"
// //           slotProps={{
// //             filterPanel: {
// //               filterFormProps: {
// //                 logicOperatorInputProps: {
// //                   variant: "outlined",
// //                   size: "small",
// //                 },
// //                 columnInputProps: {
// //                   variant: "outlined",
// //                   size: "small",
// //                   sx: { mt: "auto" },
// //                 },
// //                 operatorInputProps: {
// //                   variant: "outlined",
// //                   size: "small",
// //                   sx: { mt: "auto" },
// //                 },
// //                 valueInputProps: {
// //                   InputComponentProps: {
// //                     variant: "outlined",
// //                     size: "small",
// //                   },
// //                 },
// //               },
// //             },
// //           }}
// //           rowHeight={90}
// //         />
// //       </Grid>
// //     </Box>
// //   );
// // }
