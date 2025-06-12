import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Divider,
  Paper,
  Stack,
  Pagination,
  Skeleton,
  useMediaQuery,
  useTheme,
  Tooltip,
  CircularProgress,
  alpha,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import InventoryIcon from "@mui/icons-material/Inventory";
import MedicationIcon from "@mui/icons-material/Medication";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SortIcon from "@mui/icons-material/Sort";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, viewAllProducts } from "@/services/products";
import { Product } from "@/utils/types";
import toast from "react-hot-toast";
import { ROLE_ENUM } from "@/utils/enums";

const ProductCard: React.FC<{
  product: Product;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}> = ({ product, setRefreshKey }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };
  const theme = useTheme();
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    toast.promise(
      dispatch(deleteProduct(product?._id)).then(() => {
        setOpenDeleteDialog(false);
        setRefreshKey((prevKey) => prevKey + 1);
        navigate("/products");
      }),
      {
        loading: "Deleting product...",
        success: <b>Product deleted successfully!</b>,
        error: <b>Failed to deleted product. Please try again.</b>,
      }
    );
  };
  // Check if product is expiring soon (within 3 months)
  // const getTooltipMessage = () => {
  //   const expiryDate = new Date(product?.expiry_date);
  //   const currentDate = new Date();
  //   const threeMonthsFromNow = new Date();
  //   threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  //   const sixMonthsAfterExpiry = new Date(expiryDate);
  //   sixMonthsAfterExpiry.setMonth(sixMonthsAfterExpiry.getMonth() + 6);

  //   if (expiryDate <= currentDate) {
  //     if (currentDate <= sixMonthsAfterExpiry) {
  //       return "Request Refund";
  //     } else {
  //       return "Not Refunded";
  //     }
  //   } else if (expiryDate <= threeMonthsFromNow) {
  //     return "Expiring soon";
  //   }
  //   return null;
  // };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* {getTooltipMessage() && (
        <Tooltip title={getTooltipMessage()}>
          <Chip
            label={getTooltipMessage()}
            size="small"
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              zIndex: 1,
              borderWidth: "2px",
              borderColor:
                getTooltipMessage() === "Expiring soon"
                  ? theme.palette.error.light
                  : getTooltipMessage() === "Request Refund"
                    ? theme.palette.success.main
                    : theme.palette.primary.main,
              background:
                getTooltipMessage() === "Expiring soon"
                  ? alpha(theme.palette.error.light, 0.2)
                  : getTooltipMessage() === "Request Refund"
                    ? theme.palette.success.light
                    : theme.palette.primary.light,
            }}
          />
        </Tooltip>
      )} */}

      {user?.role === ROLE_ENUM.ADMIN && (<Tooltip title="Add to Cart">
        <DeleteIcon
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          sx={{
            position: "absolute",
            bottom: -10,
            right: -10,
            zIndex: 1,
            cursor: "pointer",
            border: `2px solid ${theme.palette.error.light}`,
            fontSize: "2.5rem",
            color: alpha(theme.palette.text.primary, 0.4),
            background: alpha(theme.palette.error.light, 0.2),
            borderRadius: 1,
            p: 0.5,
            transition: "all 0.2s",
            "&:hover": {
              transform: "translateY(2px)",
              color: alpha(theme.palette.text.primary, 1),
              borderColor: theme.palette.error.main,
              background: alpha(theme.palette.error.light, 0.3),
            },
          }}
        />
      </Tooltip>)}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          noWrap
          title={product?.product_name}
        >
          {product?.product_name}
        </Typography>

        <Chip
          label={product?.category}
          size="small"
          sx={{ mb: 2, p: 1.5, background: theme.palette.primary.light }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "40px",
          }}
          title={product?.description}
        >
          {product?.description}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MedicationIcon
              sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
            />
            <Typography variant="body2" noWrap>
              {product?.state} • {product?.no_of_tablets_per_pack} Tablets (
              {product?.measure_of_unit})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CurrencyRupeeIcon
              sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
            />
            <Typography variant="body2" fontWeight="bold">
              {product?.price}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InventoryIcon
              sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
            />
            <Typography
              variant="body2"
              noWrap
              title={product?.storage_requirement}
            >
              {product?.storage_requirement}
            </Typography>
          </Box>

          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <CalendarTodayIcon
              sx={{
                mr: 1,
                color:
                  getTooltipMessage() === "Expiring soon"
                    ? theme.palette.error.main
                    : getTooltipMessage() === "Request Refund"
                      ? theme.palette.success.main
                      : theme.palette.info.dark,

                fontSize: "1.2rem",
              }}
            />
            <Typography
              variant="body2"
              color={
                getTooltipMessage() === "Expiring soon"
                  ? theme.palette.error.main
                  : getTooltipMessage() === "Request Refund"
                    ? theme.palette.success.main
                    : theme.palette.info.dark
              }
              sx={{
                borderBottom: "2px solid",
                borderBottomColor:
                  getTooltipMessage() === "Expiring soon"
                    ? theme.palette.error.main
                    : getTooltipMessage() === "Request Refund"
                      ? theme.palette.success.main
                      : theme.palette.info.dark,
              }}
            >
              {getTooltipMessage() === "Expiring soon"
                ? 'Expirying soon '
                : getTooltipMessage() === "Request Refund"
                  ? 'Already Expired '
                  : 'Expires '}: {formatDate(product?.expiry_date)}
            </Typography>
          </Box> */}
        </Stack>
      </CardContent>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete {product?.product_name}?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeleteDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete();
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// ProductRow component (list view)
// const ProductRow: React.FC<{
//   product: Product;
//   setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
// }> = ({ product, setRefreshKey }) => {
//   const theme = useTheme();
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   // const formatDate = (dateString: string) => {
//   //   const date = new Date(dateString);
//   //   return date.toLocaleDateString("en-US", {
//   //     year: "numeric",
//   //     month: "short",
//   //     day: "numeric",
//   //   });
//   // };

//   const handleDelete = () => {
//     setOpenDeleteDialog(true);
//   };

//   const confirmDelete = () => {
//     toast.promise(
//       dispatch(deleteProduct(product?._id)).then(() => {
//         setOpenDeleteDialog(false);
//         setRefreshKey((prevKey) => prevKey + 1);
//         navigate("/products");
//       }),
//       {
//         loading: "Deleting product...",
//         success: <b>Product deleted successfully!</b>,
//         error: <b>Failed to deleted product. Please try again.</b>,
//       }
//     );
//   };

//   // const getTooltipMessage = () => {
//   //   const expiryDate = new Date(product?.expiry_date);
//   //   const currentDate = new Date();
//   //   const threeMonthsFromNow = new Date();
//   //   threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
//   //   const sixMonthsAfterExpiry = new Date(expiryDate);
//   //   sixMonthsAfterExpiry.setMonth(sixMonthsAfterExpiry.getMonth() + 6);

//   //   if (expiryDate <= currentDate) {
//   //     if (currentDate <= sixMonthsAfterExpiry) {
//   //       return "Request Refund";
//   //     } else {
//   //       return "Not Refunded";
//   //     }
//   //   } else if (expiryDate <= threeMonthsFromNow) {
//   //     return "Expiring soon";
//   //   }
//   //   return null;
//   // };

//   return (
//     <Paper
//       onClick={() => {
//         navigate(`/products/${product?._id}`);
//       }}
//       sx={{
//         p: 2,
//         mb: 2,
//         display: "flex",
//         position: "relative",
//         flexDirection: { xs: "column", sm: "row" },
//         alignItems: { xs: "flex-start", sm: "center" },
//         border: `2px solid ${alpha(theme.palette.divider, 0.4)}`,
//         background: alpha(theme.palette.divider, 0.2),
//         gap: 2,
//         "&:hover": {
//           boxShadow: 3,
//           borderColor: alpha(theme.palette.divider, 0.6),
//           bgcolor: "rgba(0, 0, 0, 0.01)",
//         },
//       }}
//     >
//       <Tooltip title="Delete Product">
//         <DeleteIcon
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDelete();
//           }}
//           sx={{
//             position: "absolute",
//             bottom: -10,
//             right: 10,
//             zIndex: 1,
//             cursor: "pointer",
//             border: `2px solid ${theme.palette.error.light}`,
//             fontSize: "2rem",
//             color: alpha(theme.palette.text.primary, 0.4),
//             background: alpha(theme.palette.error.light, 0.2),
//             borderRadius: "10px",
//             p: 0.5,
//             transition: "all 0.2s",
//             "&:hover": {
//               transform: "translateY(2px)",
//               color: alpha(theme.palette.text.primary, 1),
//               borderColor: theme.palette.error.main,
//               background: alpha(theme.palette.error.light, 0.3),
//             },
//           }}
//         />
//       </Tooltip>
//       <Box sx={{ flex: 2 }}>
//         <Box
//           sx={{
//             display: "flex",

//             alignItems: "center",
//             gap: 1,
//             mb: 0.5,
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight="medium">
//             {product?.product_name}
//           </Typography>
//           {/* {getTooltipMessage() && (
//             <Chip
//               label="Expiring Soon"
//               size="small"
//               sx={{
//                 borderWidth: "2px",
//                 borderColor:
//                   getTooltipMessage() === "Expiring soon"
//                     ? theme.palette.error.light
//                     : getTooltipMessage() === "Request Refund"
//                       ? theme.palette.success.main
//                       : theme.palette.primary.main,
//                 background:
//                   getTooltipMessage() === "Expiring soon"
//                     ? alpha(theme.palette.error.light, 0.2)
//                     : getTooltipMessage() === "Request Refund"
//                       ? theme.palette.success.light
//                       : theme.palette.primary.light,
//               }}
//             />
//           )} */}
//         </Box>
//         <Chip
//           label={product?.category}
//           size="small"
//           sx={{ mb: 0.5, background: theme.palette.primary.light }}
//         />
//         <Typography variant="body2" color="text.secondary">
//           {product?.description}
//         </Typography>
//       </Box>

//       <Box sx={{ flex: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <MedicationIcon
//             sx={{ mr: 1, color: "text.secondary", fontSize: "0.9rem" }}
//           />
//           <Typography variant="body2">
//             {product?.state} • {product?.no_of_tablets_per_pack} tablets (
//             {product?.measure_of_unit})
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <InventoryIcon
//             sx={{ mr: 1, color: "text.secondary", fontSize: "0.9rem" }}
//           />
//           <Typography variant="body2">
//             {product?.storage_requirement}
//           </Typography>
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: { xs: "row", sm: "column" },
//           justifyContent: "space-between",
//           alignItems: { xs: "center", sm: "flex-end" },
//           alignSelf: { xs: "stretch", sm: "center" },
//           gap: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <CurrencyRupeeIcon sx={{ mr: 0.5, color: "text.secondary", fontSize: '1.5rem' }} />
//           <Typography variant="subtitle1" fontWeight="bold">
//             {product?.price}
//           </Typography>
//         </Box>
//         {/* <Box sx={{ display: "flex", alignItems: "center" }}>
//           <CalendarTodayIcon
//             sx={{
//               mr: 0.5,
//               color:
//                 getTooltipMessage() === "Expiring soon"
//                   ? theme.palette.error.light
//                   : getTooltipMessage() === "Request Refund"
//                     ? theme.palette.success.main
//                     : theme.palette.primary.main,
//             }}
//           />
//           <Typography
//             variant="body2"
//             sx={{
//               color:
//                 getTooltipMessage() === "Expiring soon"
//                   ? theme.palette.error.light
//                   : getTooltipMessage() === "Request Refund"
//                     ? theme.palette.success.main
//                     : theme.palette.primary.main,
//             }}
//           >
//             {formatDate(product?.expiry_date)}
//           </Typography>
//         </Box> */}
//       </Box>
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//         aria-labelledby="delete-dialog-title"
//       >
//         <DialogTitle id="delete-dialog-title">
//           Delete {product?.product_name}?
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this product? This action cannot be
//             undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenDeleteDialog(false);
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={(e) => {
//               e.stopPropagation();
//               confirmDelete();
//             }}
//             color="error"
//             variant="contained"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// Loading skeleton for card view
const CardSkeleton: React.FC = () => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="70%" height={32} />
      <Skeleton variant="rectangular" width={100} height={24} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />

      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={1.5}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

// // Loading skeleton for list view
// const RowSkeleton: React.FC = () => (
//   <Paper
//     sx={{
//       p: 2,
//       mb: 2,
//       display: "flex",
//       flexDirection: { xs: "column", sm: "row" },
//       gap: 2,
//     }}
//   >
//     <Box sx={{ flex: 2 }}>
//       <Skeleton variant="text" width="50%" height={32} />
//       <Skeleton
//         variant="rectangular"
//         width={100}
//         height={24}
//         sx={{ mb: 0.5 }}
//       />
//       <Skeleton variant="text" width="90%" />
//     </Box>

//     <Box sx={{ flex: 1.5 }}>
//       {[1, 2].map((item) => (
//         <Box key={item} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//           <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
//           <Skeleton variant="text" width="80%" />
//         </Box>
//       ))}
//     </Box>

//     <Box sx={{ flex: 1, alignSelf: "flex-end" }}>
//       <Skeleton variant="text" width={80} height={32} />
//       <Skeleton variant="text" width={120} />
//     </Box>
//   </Paper>
// );

const ProductsListing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { productsData, pageMeta } = useSelector(
    (state: RootState) => state.product
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for products data and loading
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // State for pagination, search, filter, and sort
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([""]);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      dispatch(
        viewAllProducts({
          searchQuery: searchTerm,
          category: categoryFilter,
          pageNumber: page,
          limit: rowsPerPage,
          sortField: sortBy,
          sortOrder: sortOrder,
        })
      )
        .unwrap()
        .then(() => {
          setLoading(false);
        });
    };

    fetchProducts();
  }, [
    page,
    searchTerm,
    rowsPerPage,
    sortOrder,
    debouncedSearchTerm,
    categoryFilter,
    sortBy,
    refreshKey,
    dispatch,
  ]);

  useEffect(() => {
    if (productsData && pageMeta) {
      setProducts(productsData);
      setTotalProducts(pageMeta.total);
      setCategories(pageMeta.unique);
    }
  }, [productsData, pageMeta]);

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalProducts / rowsPerPage);

  return (
    <Box
      sx={{ p: 3, width: "100%" }}
    >
      <Card sx={{ mb: 3, p: 2, }}>
        <CardContent>
          <Paper
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              background: 'transparent'
            }}
          >
            <Grid item sx={{ width: "50%" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
              >
                Products Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                {totalProducts} products available in your inventory after applying
                filters
              </Typography>
            </Grid>

            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Grid item xs={12} sm={6} md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon fontSize="large" />}
                  onClick={() => {
                    navigate("/add/product");
                  }}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Add Products
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>



      {/* Search and filters */}
      <Paper sx={{ mb: 3, width: "100%" }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  loading && debouncedSearchTerm ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Category"
              select
              size="small"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value as string);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="All-Categories">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Sort By"
              size='small'
              select
              value={`${sortBy}-${sortOrder}`}
              onChange={(event) => {
                setSortBy(event.target.value.split("-")[0]);
                setSortOrder(event.target.value.split("-")[1]);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="created_at-asc">Oldest Created</MenuItem>
              <MenuItem value="created_at-desc">Latest Created</MenuItem>
              <MenuItem value="price-asc">Price (Low to High)</MenuItem>
              <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              <MenuItem value="expiry-asc">Expiry Date (Soonest)</MenuItem>
              <MenuItem value="expiry-desc">Expiry Date (Latest)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              select
              value={rowsPerPage.toString()}
              label="Show"
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(1);
              }}
            >
              {[12, 16, 20].map((option) => (
                <MenuItem key={option} value={option.toString()}>
                  {option} Products
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* View Toggle and Results Counter */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {loading
            ? "Loading..."
            : `Showing ${(page - 1) * rowsPerPage + 1}-${Math.min(
              page * rowsPerPage,
              totalProducts
            )} of ${totalProducts} products`}
        </Typography>

         <IconButton
          onClick={toggleViewMode}
          color="primary"
          size="small"
          sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
        >
          {viewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
        </IconButton> 
      </Box> */}

      {/* Products */}
      <Grid container spacing={3}>
        {loading ? (
          // Show skeletons while loading
          Array(pageMeta?.limit)
            .fill(null)
            .map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`skeleton-${index}`}
              >
                <CardSkeleton />
              </Grid>
            ))
        ) : products?.length > 0 ? (
          // Show products grid
          products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={product._id}
              onClick={() => {
                navigate(`/products/${product?._id}`);
              }}
            >
              <ProductCard product={product} setRefreshKey={setRefreshKey} />
            </Grid>
          ))
        ) : (
          // No products found
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">No products found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* {viewMode === "grid" ? (
        <Grid container spacing={3}>
          {loading ? (
            Show skeletons while loading
            Array(pageSize)
              .fill(null)
              .map((_, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`skeleton-${index}`}
                >
                  <CardSkeleton />
                </Grid>
              ))
          ) : products?.length > 0 ? (
            // Show products grid
            products.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product._id}
                onClick={() => {
                  navigate(`/products/${product?._id}`);
                }}
              >
                <ProductCard product={product} setRefreshKey={setRefreshKey} />
              </Grid>
            ))
          ) : (
            // No products found
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">No products found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        // List view
        <Box>
          {loading ? (
            // Show skeletons while loading
            Array(rowsPerPage)
              .fill(null)
              .map((_, index) => <RowSkeleton key={`skeleton-${index}`} />)
          ) : products?.length > 0 ? (
            // Show products list
            products.map((product) => (
              <ProductRow
                key={product?._id}
                product={product}
                setRefreshKey={setRefreshKey}
              />
            ))
          ) : (
            // No products found
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">No products found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Paper>
          )}
        </Box>
      )} */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          my: 4,
          // mr: 0
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {`Showing ${(page - 1) * rowsPerPage + 1}-${Math.min(
            page * rowsPerPage,
            totalProducts
          )} of ${totalProducts} products`}
        </Typography>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                mx: { xs: 0.5, sm: 1 },
              },
            }}
          />
        )}
      </Box>

    </Box>
  );
};

export default ProductsListing;
