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
  useMediaQuery,
  useTheme,
  Tooltip,
  alpha,
  Button,
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
  Badge,
  Divider,
  TableSortLabel,
  Tab,
  Tabs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import { deleteProduct, viewAllProducts } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import toast from "react-hot-toast";
import { CategorySortField, GetCategory, GetProduct, ProductSortField, SortOrder, UpdateCategory } from "@/utils/types";
import ProductsSideModal from "@/features/products/ProductsSideModal";
import { deleteCategory, viewAllCategories, viewAllCategory } from "@/services/category";
import TabPanel from "@/features/upload-documents/components/TabPanel";
import { ProductRow } from "@/features/products/ProductRow";
import { DeletedProductRow } from "@/features/products/DeletedProductRow";
import { CategoryRow } from "@/features/category/CategoryRow";
import CategoryCreateModal from "@/features/category/CategoryCreateModal";
import { CategoryRowSkeleton } from "@/features/category/CategoryRowSekeleton";
import { ProductRowSkeleton } from "@/common/ProductRowSkeleton";
import { DeletedProductRowSkeleton } from "@/common/DeletedProductRowSkeleton";
import { useNavigate } from "react-router-dom";

const ProductsListing: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { productsData, pageMeta } = useSelector((state: RootState) => state.product);
  const { categoryLists, categories } = useSelector((state: RootState) => state.category);
  const [categoriesData, setCategoriesData] = useState<GetCategory[]>([]);

  const [products, setProducts] = useState<GetProduct[]>([]);
  const [data, setData] = useState({
    searchTerm: '',
    categoryFilter: '',
    page: 1,
    rowsPerPage: 10,
    is_deleted: false,
    sortBy: "created_at" as ProductSortField,
    sortOrder: "asc" as SortOrder,

    // Category Filters
    searchQuery: '',
    pageNumber: 1,
    limit: 10,
    sortField: 'created_at' as CategorySortField,
    categorySortOrder: 'asc' as SortOrder,
  });
  const { searchTerm, categoryFilter, is_deleted, page, rowsPerPage, sortBy, sortOrder, categorySortOrder, sortField, limit, pageNumber, searchQuery } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<GetProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
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
    dispatch(
      deleteProduct(productId)
    )
      .unwrap()
      .then(() => {
        setRefreshKey((prev) => prev + 1);
        setLoading(false);
        toast.success('Product deleted successfully')
      });
  };

  const handleEdit = (product: GetProduct) => {
    setDrawer(true);
    setSelectedProduct(product);
  };

  const handleView = (product: GetProduct) => {
    navigate(`/products/${product._id}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setData((prevState) => ({ ...prevState, is_deleted: false }));
    } else if (newValue === 1) {
      fetchCategory();
    }
    else if (newValue === 2) {
      setData((prevState) => ({ ...prevState, is_deleted: true }));
    }
    setSelectedTab(newValue);
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
        is_deleted: is_deleted,
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, is_deleted, sortBy, dispatch]);


  const fetchCategory = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllCategory({
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        limit: limit,
        sortField: sortField,
        sortOrder: categorySortOrder,
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [categorySortOrder, dispatch, limit, pageNumber, refreshKey, searchQuery, sortField]);


  useEffect(() => {
    fetchProducts();
    dispatch(
      viewAllCategories()
    );
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, sortBy, refreshKey, dispatch, fetchProducts]);

  useEffect(() => {
    if (productsData && pageMeta) {
      setProducts(productsData);
    }
  }, [productsData, pageMeta]);

  useEffect(() => {
    if (categories && pageMeta) {
      setCategoriesData(categories);
    }
  }, [categories, pageMeta]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          px: 4,
          py: 2,
          mb: 2,
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
                  <CardContent sx={{ p: .5, '&:last-child': { pb: 1 } }}>
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
                  <CardContent sx={{ p: .5, '&:last-child': { pb: 1 } }}>
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
                  <CardContent sx={{ p: .5, '&:last-child': { pb: 1 } }}>
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

            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              sx={{ mb: 1 }}
              TabIndicatorProps={{
                sx: {
                  display: 'none',
                }
              }}
            >
              <Tab
                label={`Items (${products.length})`}
                sx={{
                  ...(selectedTab === 0 && {
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1,
                  }),
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              />
              <Tab
                label="Categories"
                sx={{
                  ...(selectedTab === 1 && {
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1,
                    mx: 1
                  }),
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1,
                  mx: 1
                }}
              />
              <Tab
                label="Deleted"
                sx={{
                  ...(selectedTab === 2 && {
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1,
                  }),
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              />
            </Tabs>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                if (selectedTab === 1) {
                  setOpenCategoryModal(true);
                  setSelectedCategory(null);
                } else {
                  setDrawer(true);
                  setSelectedProduct(null);
                }

              }}
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
              {selectedTab === 1 ? ('Add New Category') : ('Add New Items')}
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
              {categoryLists?.map((category) => (
                <MenuItem key={category?._id} value={category?._id}>
                  {category?.category_name}
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


      <TabPanel value={selectedTab} index={0}>
        {/* Enhanced Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 1)}`,
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
                          Opening Stock Status
                        </Typography>
                      </Box>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Bar-Code" arrow>
                    <TableSortLabel
                      active={sortBy === "barcode"}
                      direction={sortBy === "barcode" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortBy: "barcode",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Bar-Code
                      </Typography>
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
                <TableCell align="center" >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array([1, 2, 3, 4, 5])
                  .map((_, index) => <ProductRowSkeleton key={`skeleton-${index}`} />)
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
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
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
                        onClick={() => {
                          setDrawer(true);
                          setSelectedProduct(null);
                        }}
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
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 1)}`,
            boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
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
                  <Tooltip title="Sort by Category Name" arrow>
                    <TableSortLabel
                      active={sortField === "category_name"}
                      direction={sortField === "category_name" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortField: "category_name",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Category Information
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Create Date" arrow>
                    <TableSortLabel
                      active={sortField === "created_at"}
                      direction={sortField === "created_at" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortField: "created_at",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Created At
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Update Date" arrow>
                    <TableSortLabel
                      active={sortField === "updated_at"}
                      direction={sortField === "updated_at" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortField: "updated_at",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Last Updated
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array([1, 2, 3, 4, 5])
                  .map((_, index) => <CategoryRowSkeleton key={`skeleton-${index}`} />)
              ) : categoriesData?.length > 0 ? (
                categoriesData?.map((category, index) => (
                  <CategoryRow
                    key={category._id}
                    category={category}
                    onDelete={(category_id: string) => {
                      dispatch(
                        deleteCategory(category_id)
                      )
                        .unwrap()
                        .then(() => {
                          setRefreshKey((prev) => prev + 1);
                          setLoading(false);
                          toast.success('Product deleted successfully')
                        });
                    }}
                    onEdit={(category: GetCategory) => {
                      setOpenCategoryModal(true);
                      setSelectedCategory(category);
                    }}
                    onView={(category: GetCategory) => {
                      setOpenCategoryModal(true);
                      setSelectedCategory(category);
                    }}
                    index={index}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <InventoryIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                        No categories found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter criteria, or add your first category
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpenCategoryModal(true);
                          setSelectedCategory(null);
                        }}
                        startIcon={<AddCircleIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Add Your First Category
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 1)}`,
            boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
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
                <TableCell align="right" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Bar-Code" arrow>
                    <TableSortLabel
                      active={sortBy === "barcode"}
                      direction={sortBy === "barcode" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortBy: "barcode",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Bar-Code
                      </Typography>
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
                <TableCell align="center" >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array([1, 2, 3, 4, 5])
                  .map((_, index) => <DeletedProductRowSkeleton key={`skeleton-${index}`} />)
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <DeletedProductRow
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                    onView={handleView}
                    index={index}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <InventoryIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                        No products deleted
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter criteria, or deleting your first product
                      </Typography>
                      <Button
                        onClick={() => {
                          setSelectedTab(0);
                          setData((prevState) => ({
                            ...prevState,
                            is_deleted: false,
                          }));
                        }}
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Delete Your First Product
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>


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

          {selectedTab !== 1 ?
            (<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Showing {Math.min((page - 1) * rowsPerPage + 1, products.length)} - {Math.min(page * rowsPerPage, products.length)} of {products.length} products
            </Typography>) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing {Math.min((page - 1) * rowsPerPage + 1, categoriesData?.length)} - {Math.min(page * rowsPerPage, categoriesData?.length)} of {categoriesData?.length} categories
              </Typography>
            )
          }

          <Divider orientation="vertical" flexItem />

          {selectedTab === 0 && (<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          </Box>)}
        </Box>

        {products.length > rowsPerPage && selectedTab !== 1 && (
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
        {categoriesData?.length > rowsPerPage && selectedTab === 1 && (
          <Pagination
            count={Math.ceil(categoriesData?.length / rowsPerPage)}
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
      <ProductsSideModal drawer={drawer} setDrawer={setDrawer} setRefreshKey={setRefreshKey} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <CategoryCreateModal
        open={openCategoryModal}
        onClose={() => {
          setOpenCategoryModal(false);
          fetchCategory()
        }}
        onUpdated={() => fetchCategory()}
        category={selectedCategory}
        onCreated={function (category: { name: string; _id: string; }): void { console.log("category", category)}} />
    </Box>
  );
};

export default ProductsListing;