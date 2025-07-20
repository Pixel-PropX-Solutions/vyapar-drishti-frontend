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
  useTheme,
  Tooltip,
  alpha,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tab,
  Tabs,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import { deleteProduct, viewAllStockItems, viewProduct } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import toast from "react-hot-toast";
import { CategorySortField, GetCategory, GetStockItem, ProductSortField, ProductUpdate, SortOrder, UpdateCategory } from "@/utils/types";
import ProductsSideModal from "@/features/products/ProductsSideModal";
import { deleteCategory, viewAllCategories, viewAllCategory } from "@/services/category";
import TabPanel from "@/features/upload-documents/components/TabPanel";
import { ProductRow } from "@/features/products/ProductRow";
import CategoryCreateModal from "@/features/category/CategoryCreateModal";
import { ProductRowSkeleton } from "@/common/skeletons/ProductRowSkeleton";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/features/category/CategoryCard";
import CategoryCardSkeleton from "@/common/skeletons/CategoryCardSkeleton";

const ProductsListing: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stockItems, pageMeta } = useSelector((state: RootState) => state.product);
  const { categoryLists, categories } = useSelector((state: RootState) => state.category);
  const [products, setProducts] = useState<GetStockItem[]>([]);

  const [data, setData] = useState({
    searchTerm: '',
    categoryFilter: 'All',
    page: 1,
    rowsPerPage: 10,
    // is_deleted: false,
    sortBy: "created_at" as ProductSortField,
    sortOrder: "asc" as SortOrder,

    // Category Filters
    searchQuery: '',
    pageNumber: 1,
    parent: 'All',
    limit: 10,
    sortField: 'created_at' as CategorySortField,
    categorySortOrder: 'asc' as SortOrder,
  });

  const { searchTerm, categoryFilter, page, rowsPerPage, sortBy, sortOrder, parent, categorySortOrder, sortField, limit, pageNumber, searchQuery } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [drawer, setDrawer] = useState<boolean>(false);
  const { currentCompany } = useSelector((state: RootState) => state.auth);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductUpdate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handlePageChange = (_: unknown, value: number) => {
    setData((prevState) => ({
      ...prevState,
      page: value,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (productId: string) => {
    setLoading(true)
    dispatch(
      deleteProduct({ id: productId, company_id: currentCompany?._id || '' })
    )
      .unwrap()
      .then(() => {
        setRefreshKey((prev) => prev + 1);
        setLoading(false);
        toast.success('Product deleted successfully')
      }).catch((error) => {
        setRefreshKey((prev) => prev + 1);
        setLoading(false);
        toast.error(error || "An unexpected error occurred. Please try again later.");
      });
  };

  const handleEdit = async (product: GetStockItem) => {
    setDrawer(true);
    await dispatch(viewProduct({ product_id: product._id, company_id: currentCompany?._id || '' }))
      .unwrap().then((res) => {
        setSelectedProduct(res.product);
      }
      ).catch((error) => {
        setSelectedProduct(null);
        toast.error(error || "An unexpected error occurred. Please try again later.");
      });
  };

  const handleView = (product: GetStockItem) => {
    navigate(`/products/${product._id}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setData({
      searchTerm: '',
      categoryFilter: 'All',
      page: 1,
      rowsPerPage: 10,
      sortBy: "created_at" as ProductSortField,
      sortOrder: "asc" as SortOrder,

      // Category Filters
      searchQuery: '',
      pageNumber: 1,
      parent: 'All',
      limit: 10,
      sortField: 'created_at' as CategorySortField,
      categorySortOrder: 'asc' as SortOrder,
    });
    setRefreshKey((prev) => prev + 1);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      handleResetFilters();
      fetchProducts();
    } else if (newValue === 1) {
      handleResetFilters();
      fetchCategory();
    }

    setSelectedTab(newValue);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllStockItems({
        company_id: currentCompany?._id || '',
        searchQuery: searchTerm,
        category: categoryFilter,
        pageNumber: page,
        limit: rowsPerPage,
        sortField: sortBy,
        sortOrder: sortOrder,
        // is_deleted: is_deleted,
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [dispatch, currentCompany?._id, searchTerm, categoryFilter, page, rowsPerPage, sortBy, sortOrder]);


  const fetchCategory = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllCategory({
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        limit: limit,
        sortField: sortField,
        sortOrder: categorySortOrder,
        company_id: currentCompany?._id || '',
        parent: parent,
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [categorySortOrder, currentCompany?._id, parent, dispatch, limit, pageNumber, searchQuery, sortField]);


  useEffect(() => {
    fetchProducts();
    dispatch(
      viewAllCategories(currentCompany?._id || '')
    );
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, sortBy, refreshKey, dispatch, fetchProducts, currentCompany?._id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory, categorySortOrder, currentCompany?._id, parent, limit, pageNumber, searchQuery, sortField]);

  useEffect(() => {
    if (stockItems && pageMeta) {
      setProducts(stockItems);
    }
  }, [stockItems, pageMeta]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', width: '100%' }}>
      {/* Header Section */}
      <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                  {selectedTab === 0 ? 'Products' : 'Categories'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTab === 0
                    ? 'Manage your product inventory, add new items, and track stock levels.'
                    : 'Organize your products into categories for better management and navigation.'}
                </Typography>
              </Box>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
                sx={{ mt: 1 }}
              >
                <Tab label="Products" />
                <Tab label="Categories" />
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon fontSize="large" />}
                onClick={() => {
                  if (selectedTab === 1) {
                    setOpenCategoryModal(true);
                    setSelectedCategory(null);
                  } else {
                    setDrawer(true);
                  }

                }}
                sx={{
                  width: "max-content",
                }}
              >
                {selectedTab === 1 ? ('Add New Category') : ('Add New Items')}
              </Button>
            </Grid>
          </Grid>


        </CardContent>
      </Card>

      {/* Enhanced Search and Filters */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            size="small"
            placeholder={selectedTab === 0 ? "Search item name, category, description, barcode..." : "Search category name, description ..."}
            value={selectedTab === 0 ? searchTerm : searchQuery}
            onChange={(e) => {
              if (selectedTab === 0) {
                setData((prevState) => ({
                  ...prevState,
                  searchTerm: e.target.value,
                }));
              }
              else {
                setData((prevState) => ({
                  ...prevState,
                  searchQuery: e.target.value,
                }));
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
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
                borderRadius: 1,
              },
            }}
          >
            <MenuItem value={'All'}>
              All Categories
            </MenuItem>
            {categoryLists?.map((category) => (
              <MenuItem key={category?._id} value={category?.category_name}>
                {category?.category_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={1}>
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
                borderRadius: 1,
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

        <Grid item xs={12} sm={2}>
          <Tooltip title="Refresh Data" arrow sx={{ display: 'flex', width: '100%' }}>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              Refresh Items
            </Button>
          </Tooltip>
        </Grid>
      </Grid>


      <TabPanel value={selectedTab} index={0}>
        {/* Enhanced Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 1,
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
                  },
                  "& .MuiTableCell-root": {
                    padding: '8px 16px',
                  },
                }}
              >
                <TableCell sx={{ pl: 3, pr: 1 }}>
                  <Tooltip title="Sort by Product Name" arrow>
                    <TableSortLabel
                      active={sortBy === "stock_item_name"}
                      direction={sortBy === "stock_item_name" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortBy: "stock_item_name",
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
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Unit
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Bar-Code" arrow>
                    <TableSortLabel
                      active={sortBy === "gst_hsn_code"}
                      direction={sortBy === "gst_hsn_code" ? sortOrder : "asc"}
                      onClick={() => {
                        setData((prevState) => ({
                          ...prevState,
                          sortBy: "gst_hsn_code",
                          sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                        }));
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        HSN/SAC Code
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Category
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Group
                  </Typography>
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
                        }}
                        startIcon={<AddCircleIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 1,
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

        {/* Enhanced Category Cards */}
        <Box
          sx={{
            width: '100%',
          }}>
          <Grid container spacing={2}>
            {loading ? (
              Array([1, 2, 3, 4, 5])
                .map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={`skeleton-${index}`}
                  >
                    <CategoryCardSkeleton />
                  </Grid>
                ))
            ) : categories?.length > 0 ? (categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category._id}>
                <CategoryCard
                  category={category}
                  onDelete={(category_id: string) => {
                    dispatch(
                      deleteCategory(category_id)
                    )
                      .unwrap()
                      .then(() => {
                        setRefreshKey((prev) => prev + 1);
                        setLoading(false);
                        toast.success('Category deleted successfully')
                      }).catch((error) => {
                        setRefreshKey((prev) => prev + 1);
                        setLoading(false);
                        toast.error(error || "An unexpected error occurred. Please try again later.");
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
                />
              </Grid>
            ))) : (
              <Grid item xs={12}>
                <Box sx={{
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                  boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  py: 4,
                }}>
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
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Add Your First Category
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </TabPanel>

      {/* Enhanced Pagination Section */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          mt: 1,
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
          {selectedTab !== 1 ?
            (<Typography variant="body2" sx={{ mr: 2 }}>
              Showing {Math.min((page - 1) * rowsPerPage + 1, products.length)} - {Math.min(page * rowsPerPage, products.length)} of {products.length} products
            </Typography>) : (
              <Typography variant="body2" sx={{ mr: 2 }}>
                Showing {Math.min((page - 1) * rowsPerPage + 1, categories?.length)} - {Math.min(page * rowsPerPage, categories?.length)} of {categories?.length} categories
              </Typography>
            )
          }
        </Box>

        {products.length > rowsPerPage && selectedTab !== 1 && (
          <Pagination
            count={Math.ceil(products.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={"medium"}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                mx: { xs: 0.25, sm: 0.5 },
                borderRadius: 1,
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
        {categories?.length > rowsPerPage && selectedTab === 1 && (
          <Pagination
            count={Math.ceil(categories?.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={"medium"}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                mx: { xs: 0.25, sm: 0.5 },
                borderRadius: 1,
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

      <ProductsSideModal drawer={drawer} setDrawer={setDrawer} setRefreshKey={setRefreshKey} product={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <CategoryCreateModal
        open={openCategoryModal}
        onClose={() => {
          setOpenCategoryModal(false);
          fetchCategory()
        }}
        onUpdated={() => fetchCategory()}
        category={selectedCategory}
        onCreated={function (category: { name: string; _id: string; }): void { console.log("Category created:", category); }} />
    </Box>
  );
};

export default ProductsListing;