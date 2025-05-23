import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  useMediaQuery,
  useTheme,
  Tooltip,
  alpha,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Avatar,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Fade,
  Zoom,
  Badge,
  Divider,
  Alert,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import RefreshIcon from "@mui/icons-material/Refresh";
import { viewAllProducts } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import toast from "react-hot-toast";
import { GetProduct, ProductSortField, SortOrder } from "@/utils/types";
import ProductsSideModal from "@/features/products/ProductsSideModal";

interface ProductRowProps {
  product: GetProduct;
  onDelete: (id: string) => void;
  onEdit: (product: GetProduct) => void;
  onView: (product: GetProduct) => void;
  index: number;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onDelete, onEdit, onView, index }) => {
  const theme = useTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const confirmDelete = () => {
    onDelete(product?._id ?? '');
    setOpenDeleteDialog(false);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const, icon: <TrendingDownIcon fontSize="small" /> };
    if (quantity < 10) return { label: 'Low Stock', color: 'warning' as const, icon: <TrendingDownIcon fontSize="small" /> };
    return { label: 'In Stock', color: 'success' as const, icon: <TrendingUpIcon fontSize="small" /> };
  };

  const stockStatus = getStockStatus(product?.opening_quantity || 0);
  const profit = (product.selling_price - (product.purchase_price || 0));
  const profitMargin = product.purchase_price ? ((profit / product.selling_price) * 100) : 0;

  return (
    <>
      <Fade in timeout={300 + index * 100}>
        <TableRow
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: isHovered ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            },
            borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
          }}
          onClick={() => onView(product)}
        >
          {/* Product Info */}
          <TableCell sx={{ pl: 3, pr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: getAvatarColor(product.product_name),
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${alpha(getAvatarColor(product.product_name), 0.3)}`,
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {getInitials(product.product_name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {product.product_name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<CategoryIcon />}
                    label={product.category || 'Uncategorized'}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: '20px',
                      borderRadius: '10px',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                    }}
                  />
                  {product.barcode && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      #{product.barcode}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </TableCell>

          {/* Quantity with Status */}
          <TableCell align="center" sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: theme.palette.text.primary,
                }}
              >
                {product.opening_quantity}
              </Typography>
              <Chip
                icon={stockStatus.icon}
                label={stockStatus.label}
                color={stockStatus.color}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: '22px',
                  fontWeight: 600,
                }}
              />
            </Box>
          </TableCell>

          {/* Selling Price */}
          <TableCell align="right" sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CurrencyRupeeIcon sx={{ fontSize: '1.1rem', mr: 0.5, color: theme.palette.success.main }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: theme.palette.success.main,
                  }}
                >
                  {product.selling_price.toFixed(2)}
                </Typography>
              </Box>
              {profitMargin > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: profitMargin > 20 ? theme.palette.success.main : theme.palette.warning.main,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {profitMargin.toFixed(1)}% margin
                </Typography>
              )}
            </Box>
          </TableCell>

          {/* Purchase Price */}
          <TableCell align="right" sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <CurrencyRupeeIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                }}
              >
                {(product?.purchase_price ?? 0).toFixed(2)}
              </Typography>
            </Box>
          </TableCell>

          {/* Actions */}
          <TableCell align="right" sx={{ pr: 3, pl: 1 }}>
            <Zoom in={isHovered} timeout={200}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                <Tooltip title="View Details" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(product);
                    }}
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.info.main, 0.2),
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit Product" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Product" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setOpenDeleteDialog(true);
                      e.stopPropagation();
                    }}
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Zoom>
          </TableCell>
        </TableRow>
      </Fade>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 24px 50px ${alpha(theme.palette.error.main, 0.2)}`,
          }
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: theme.palette.error.main,
            fontWeight: 600,
          }}
        >
          <DeleteIcon />
          Delete {product.product_name}?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The product will be permanently removed from your inventory.
          </Alert>
          <Typography>
            Are you sure you want to delete "<strong>{product.product_name}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
            startIcon={<DeleteIcon />}
          >
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const RowSkeleton: React.FC = () => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={140} height={28} />
          <Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1, mt: 0.5 }} />
        </Box>
      </Box>
    </TableCell>
    <TableCell align="center">
      <Skeleton variant="text" width={60} height={32} sx={{ mx: 'auto' }} />
      <Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 1, mx: 'auto', mt: 0.5 }} />
    </TableCell>
    <TableCell align="right">
      <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
    </TableCell>
    <TableCell align="right">
      <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
    </TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const ProductsListing: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { productsData, pageMeta } = useSelector((state: RootState) => state.product);
  // Mock data - replace with your actual data
  const [products, setProducts] = useState<GetProduct[]>([]);
  const [data, setData] = useState({
    searchTerm: '',
    categoryFilter: '',
    page: 1,
    rowsPerPage: 10,
    sortBy: "created_at" as ProductSortField,
    sortOrder: "asc" as SortOrder,
  });
  const { searchTerm, categoryFilter, page, rowsPerPage, sortBy, sortOrder } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);

  const [categories, setCategories] = useState<string[]>([]);
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => (p?.opening_quantity ?? 0) < 10).length;
  const outOfStockCount = products.filter(p => p.opening_quantity === 0).length;

  const handlePageChange = (_: unknown, value: number) => {
    setData((prevState) => ({
      ...prevState,
      page: value,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
    toast.success('Product deleted successfully')
  };

  const handleEdit = (product: GetProduct) => {
    console.log("Edit product:", product);
    toast.success('Edit functionality would open here')
  };

  const handleView = (product: GetProduct) => {
    console.log("View product:", product);
    toast.success(`Viewing details for ${product.product_name}`)
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProducts();
  };

  const fetchProducts = useCallback(async () => {
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
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, sortBy, dispatch]);


  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, sortBy, dispatch, fetchProducts]);

  useEffect(() => {
    if (productsData && pageMeta) {
      setProducts(productsData);
      setCategories(pageMeta.unique);
    }
  }, [productsData, pageMeta]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '2px',
            height: '2px',
            background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
          }
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InventoryIcon sx={{ fontSize: '2rem', mr: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                Product Inventory
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                      {totalProducts}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                      Total Products
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: alpha('#ff9800', 0.2), backdropFilter: 'blur(10px)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                      {lowStockCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                      Low Stock
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: alpha('#f44336', 0.2), backdropFilter: 'blur(10px)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                      {outOfStockCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                      Out of Stock
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  }
                }}
              >
                Items ({products.length})
              </Button>
              <Button
                variant="text"
                sx={{
                  textTransform: 'none',
                  color: alpha('#fff', 0.8),
                  '&:hover': { color: 'white' }
                }}
              >
                Categories
              </Button>
              <Button
                variant="text"
                sx={{
                  textTransform: 'none',
                  color: alpha('#fff', 0.8),
                  '&:hover': { color: 'white' }
                }}
              >
                Deleted
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setDrawer(true)}
              startIcon={<AddCircleIcon />}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                textTransform: 'none',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: `0 8px 25px ${alpha('#000', 0.15)}`,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.95),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Search and Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products, category, description, barcode..."
              value={searchTerm}
              onChange={(e) => setData((prevState) => ({
                ...prevState,
                searchTerm: e.target.value,
              }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Category"
              value={categoryFilter}
              onChange={(e) => setData((prevState) => ({
                ...prevState,
                categoryFilter: e.target.value,
              }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category || 'All Categories'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setData((prevState) => ({
                ...prevState,
                sortBy: e.target.value as ProductSortField,
              }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <MenuItem value="created_at">Date Created</MenuItem>
              <MenuItem value="product_name">Name</MenuItem>
              <MenuItem value="selling_price">Price</MenuItem>
              <MenuItem value="opening_quantity">Quantity</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              size="small"
              label="Per Page"
              value={rowsPerPage.toString()}
              onChange={(e) => setData((prevState) => ({
                ...prevState,
                rowsPerPage: Number(e.target.value),
                page: 1
              }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              {[10, 25, 50].map((option) => (
                <MenuItem key={option} value={option.toString()}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={1}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data" arrow>
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
          // overflow: 'hidden',
        }}
      >
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: alpha(theme.palette.grey[50], 0.8),
                width: '100%',
                '& .MuiTableCell-head': {
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }
              }}
            >
              <TableCell sx={{ pl: 3, pr: 1 }}>
                <Tooltip title="Sort by Product Name" arrow>
                  <TableSortLabel
                    active={sortBy === "product_name"}
                    direction={sortBy === "product_name" ? sortOrder : "asc"}
                    onClick={() => {
                      setData((prevState) => ({
                        ...prevState,
                        sortBy: "product_name",
                        sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                      }));
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                      Product Information
                    </Typography>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ px: 1 }}>
                <Tooltip title="Sort by Item Quantity" arrow>
                  <TableSortLabel
                    active={sortBy === "opening_quantity"}
                    direction={sortBy === "opening_quantity" ? sortOrder : "asc"}
                    onClick={() => {
                      setData((prevState) => ({
                        ...prevState,
                        sortBy: "opening_quantity",
                        sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                      }));
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <InventoryIcon fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Stock Status
                      </Typography>
                    </Box>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ px: 1 }}>
                <Tooltip title="Sort by Selling Price" arrow>
                  <TableSortLabel
                    active={sortBy === "selling_price"}
                    direction={sortBy === "selling_price" ? sortOrder : "asc"}
                    onClick={() => {
                      setData((prevState) => ({
                        ...prevState,
                        sortBy: "selling_price",
                        sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                      }));
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                      Selling Price
                    </Typography>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ px: 1 }}>
                <Tooltip title="Sort by Purchase Price" arrow>
                  <TableSortLabel
                    active={sortBy === "purchase_price"}
                    direction={sortBy === "purchase_price" ? sortOrder : "asc"}
                    onClick={() => {
                      setData((prevState) => ({
                        ...prevState,
                        sortBy: "purchase_price",
                        sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                      }));
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                      Purchase Price
                    </Typography>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ pr: 3, pl: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array(rowsPerPage)
                .fill(null)
                .map((_, index) => <RowSkeleton key={`skeleton-${index}`} />)
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onView={handleView}
                  index={index}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <InventoryIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                    <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filter criteria, or add your first product
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Add Your First Product
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Enhanced Pagination Section */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          mt: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Showing {Math.min((page - 1) * rowsPerPage + 1, products.length)} - {Math.min(page * rowsPerPage, products.length)} of {products.length} products
          </Typography>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={lowStockCount} color="warning" showZero={false}>
              <Chip
                icon={<TrendingDownIcon />}
                label="Low Stock Items"
                size="small"
                variant="outlined"
                color="warning"
              />
            </Badge>

            <Badge badgeContent={outOfStockCount} color="error" showZero={false}>
              <Chip
                icon={<TrendingDownIcon />}
                label="Out of Stock"
                size="small"
                variant="outlined"
                color="error"
              />
            </Badge>
          </Box>
        </Box>

        {products.length > rowsPerPage && (
          <Pagination
            count={Math.ceil(products.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                mx: { xs: 0.25, sm: 0.5 },
                borderRadius: 2,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                '&.Mui-selected': {
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              },
            }}
          />
        )}
      </Paper>
      <ProductsSideModal drawer={drawer} setDrawer={setDrawer} />
    </Box>
  );
};

export default ProductsListing;