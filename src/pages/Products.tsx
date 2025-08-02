import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
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
import { CategorySortField, GetCategory, GetInventoryGroups, GetStockItem, GroupSortField, ProductSortField, ProductUpdate, SortOrder, UpdateCategory, UpdateInventoryGroup } from "@/utils/types";
import ProductsSideModal from "@/features/products/ProductsSideModal";
import { deleteCategory, viewAllCategory } from "@/services/category";
import TabPanel from "@/features/upload-documents/components/TabPanel";
import { ProductRow } from "@/features/products/ProductRow";
import CategoryCreateModal from "@/features/category/CategoryCreateModal";
import { ProductRowSkeleton } from "@/common/skeletons/ProductRowSkeleton";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/features/category/CategoryCard";
import CategoryCardSkeleton from "@/common/skeletons/CategoryCardSkeleton";
import CreateInventoryGroupModal from "@/features/Group/CreateInventoryGroupModal";
import { deleteInventoryGroup, viewAllInventoryGroup } from "@/services/inventoryGroup";
import { InventoryGroupCard } from "@/features/Group/InventoryGroupCard";
import { BottomPagination } from "@/common/modals/BottomPagination";

const ProductsListing: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { stockItems, stockItemsMeta } = useSelector((state: RootState) => state.product);
  const { categories, pageMeta: categoryPageMeta } = useSelector((state: RootState) => state.category);
  const { inventoryGroups, inventoryGroupPageMeta } = useSelector((state: RootState) => state.inventoryGroup);
  const [products, setProducts] = useState<GetStockItem[]>([]);

  const [data, setData] = useState({
    searchTerm: '',
    categoryFilter: 'All',
    groupFilter: 'All',
    page: 1,
    rowsPerPage: 10,
    // is_deleted: false,
    sortBy: "created_at" as ProductSortField,
    sortOrder: "asc" as SortOrder,

    // Category Filters
    searchQuery: '',
    pageNumber: 1,
    limit: 10,
    sortField: 'created_at' as CategorySortField,
    categorySortOrder: 'asc' as SortOrder,

    // Group Filters
    searchGroupQuery: '',
    pageGroupNumber: 1,
    limitGroup: 10,
    sortGroupField: 'created_at' as GroupSortField,
    groupSortOrder: 'asc' as SortOrder,
    groupParent: 'All',
  });

  const { searchTerm, categoryFilter, groupFilter, page, rowsPerPage, sortBy, sortOrder, groupParent, categorySortOrder, sortField, limit, pageNumber, searchQuery, searchGroupQuery, pageGroupNumber, limitGroup, sortGroupField, groupSortOrder } = data;
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [drawer, setDrawer] = useState<boolean>(false);
  const { user, current_company_id } = useSelector((state: RootState) => state.auth);
  const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
  const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
  console.log("Current Company Details", currentCompanyDetails)
  const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
  const [selectedProduct, setSelectedProduct] = useState<ProductUpdate | null>(null);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | null>(null);
  const [openGroupModal, setOpenGroupModal] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<UpdateInventoryGroup | null>(null);
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
      deleteProduct({ id: productId, company_id: currentCompanyDetails?._id || '' })
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
    await dispatch(viewProduct({ product_id: product._id, company_id: currentCompanyDetails?._id || '' }))
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
      groupFilter: 'All',
      page: 1,
      rowsPerPage: 10,
      sortBy: "created_at" as ProductSortField,
      sortOrder: "asc" as SortOrder,

      // Category Filters
      searchQuery: '',
      pageNumber: 1,
      limit: 10,
      sortField: 'created_at' as CategorySortField,
      categorySortOrder: 'asc' as SortOrder,

      // Group Filters
      searchGroupQuery: '',
      pageGroupNumber: 1,
      limitGroup: 10,
      sortGroupField: 'created_at' as GroupSortField,
      groupSortOrder: 'asc' as SortOrder,
      groupParent: 'All',

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
    } else if (newValue === 2) {
      handleResetFilters();
      fetchGroup();
    }

    setSelectedTab(newValue);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllStockItems({
        company_id: currentCompanyDetails?._id || '',
        searchQuery: searchTerm,
        category: categoryFilter,
        group: groupFilter,
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
  }, [dispatch, currentCompanyDetails?._id, searchTerm, categoryFilter, groupFilter, page, rowsPerPage, sortBy, sortOrder]);


  const fetchCategory = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllCategory({
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        limit: limit,
        sortField: sortField,
        sortOrder: categorySortOrder,
        company_id: currentCompanyDetails?._id || '',
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [categorySortOrder, currentCompanyDetails?._id, dispatch, limit, pageNumber, searchQuery, sortField]);


  const fetchGroup = useCallback(async () => {
    setLoading(true);
    dispatch(
      viewAllInventoryGroup({
        searchQuery: searchGroupQuery,
        pageNumber: pageGroupNumber,
        limit: limitGroup,
        sortField: sortGroupField,
        sortOrder: groupSortOrder,
        company_id: currentCompanyDetails?._id || '',
        parent: groupParent,
      })
    )
      .unwrap()
      .then(() => {
        setLoading(false);
      });
  }, [dispatch, searchGroupQuery, pageGroupNumber, limitGroup, sortGroupField, groupSortOrder, currentCompanyDetails?._id, groupParent]);


  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, rowsPerPage, sortOrder, categoryFilter, sortBy, refreshKey, dispatch, fetchProducts, currentCompanyDetails?._id]);


  useEffect(() => {
    if (stockItems && stockItemsMeta) {
      setProducts(stockItems);
    }
  }, [stockItems, stockItemsMeta]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', width: '100%' }}>
      {/* Header Section */}
      <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                  {selectedTab === 0 && 'Products'}
                  {selectedTab === 1 && 'Categories'}
                  {selectedTab === 2 && 'Groups'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTab === 0
                    ? 'Manage your product inventory, add new items, and track stock levels.'
                    : selectedTab === 1
                      ? 'Organize your products into categories for better management and navigation.'
                      : 'Group your products for better organization and reporting.'}
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
                <Tab label="Groups" />
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon fontSize="large" />}
                onClick={() => {
                  if (!currentCompanyDetails?._id) {
                    toast.error('Please create a company first.');
                    return;
                  }
                  if (selectedTab === 1) {
                    setOpenCategoryModal(true);
                    setSelectedCategory(null);
                  } else if (selectedTab === 2) {
                    setOpenGroupModal(true);
                    setSelectedGroup(null);
                  } else {
                    setDrawer(true);
                    setSelectedProduct(null);
                  }
                }}
                sx={{
                  width: "max-content",
                }}
              >
                {selectedTab === 0 && ('Add New Items')}
                {selectedTab === 1 && ('Add New Category')}
                {selectedTab === 2 && ('Add New Group')}
              </Button>
            </Grid>
          </Grid>


        </CardContent>
      </Card>

      {/* Enhanced Search and Filters */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={selectedTab === 0 ? 5 : 9}>
          <TextField
            fullWidth
            size="small"
            placeholder={selectedTab === 0 ? "Search item name, category, description, barcode..." : selectedTab === 1 ? "Search category name, description ..." : "Search group name, description ..."}
            value={selectedTab === 0 ? searchTerm : selectedTab === 1 ? searchQuery : searchGroupQuery}
            onChange={(e) => {
              if (selectedTab === 0) {
                setData((prevState) => ({
                  ...prevState,
                  searchTerm: e.target.value,
                }));
              }
              else if (selectedTab === 1) {
                setData((prevState) => ({
                  ...prevState,
                  searchQuery: e.target.value,
                }));
              }
              else {
                setData((prevState) => ({
                  ...prevState,
                  searchGroupQuery: e.target.value,
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

        {selectedTab === 0 && <Grid item xs={12} sm={2}>
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
            {stockItemsMeta.unique_categories?.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>}

        {selectedTab === 0 && <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Group"
            value={groupFilter}
            onChange={(e) => setData((prevState) => ({
              ...prevState,
              groupFilter: e.target.value,
            }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          >
            <MenuItem value={'All'}>
              All Groups
            </MenuItem>
            {stockItemsMeta.unique_groups?.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
        </Grid>}

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
                {/* <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Item Quantity" arrow>
                    <TableSortLabel
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Unit
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell> */}
                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Low Stock ALert
                  </Typography>
                </TableCell>
                {gst_enable && <TableCell align="center" sx={{ px: 1 }}>
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
                </TableCell>}
                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Opening Stock
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Closing Stock
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
                          if (!currentCompanyDetails?._id) {
                            toast.error('Please create a company first.');
                            return;
                          }
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
                        fetchCategory();
                        setLoading(false);
                        toast.success('Category deleted successfully')
                      }).catch((error) => {
                        fetchCategory();
                        setLoading(false);
                        toast.error(error || "An unexpected error occurred. Please try again later.");
                      });
                  }}
                  onEdit={(category: GetCategory) => {
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
                      if (!currentCompanyDetails?._id) {
                        toast.error('Please create a company first.');
                        return;
                      }
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

      <TabPanel value={selectedTab} index={2}>
        {/* Enhanced Groups Cards */}
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
            ) : inventoryGroups?.length > 0 ? (inventoryGroups.map((group) => (
              <Grid item xs={12} sm={6} md={3} key={group._id}>
                <InventoryGroupCard
                  group={group}
                  onDelete={(group_id: string) => {
                    dispatch(
                      deleteInventoryGroup(group_id)
                    )
                      .unwrap()
                      .then(() => {
                        fetchGroup();
                        setLoading(false);
                        toast.success('Group deleted successfully')
                      }).catch((error) => {
                        fetchGroup();
                        setLoading(false);
                        toast.error(error || "An unexpected error occurred. Please try again later.");
                      });
                  }}
                  onEdit={(group: GetInventoryGroups) => {
                    setOpenGroupModal(true);
                    setSelectedGroup(group);
                  }}
                  onView={(group: GetInventoryGroups) => {
                    setOpenGroupModal(true);
                    setSelectedGroup(group);
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
                    No groups found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filter criteria, or add your first group
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (!currentCompanyDetails?._id) {
                        toast.error('Please create a company first.');
                        return;
                      }
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
                    Add Your First Group
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </TabPanel>

      {/* Pagination Controls */}
      {selectedTab === 0 && <BottomPagination
        total={stockItemsMeta.total}
        item="products"
        page={page}
        metaPage={stockItemsMeta.page}
        rowsPerPage={rowsPerPage}
        onChange={handlePageChange}
      />}
      {selectedTab === 1 && <BottomPagination
        total={categoryPageMeta.total}
        item="categories"
        page={page}
        metaPage={categoryPageMeta.page}
        rowsPerPage={rowsPerPage}
        onChange={handlePageChange}
      />}
      {selectedTab === 2 && <BottomPagination
        total={inventoryGroupPageMeta.total}
        item="groups"
        page={page}
        metaPage={inventoryGroupPageMeta.page}
        rowsPerPage={rowsPerPage}
        onChange={handlePageChange}
      />}

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

      <CreateInventoryGroupModal
        open={openGroupModal}
        inventoryGroup={selectedGroup}
        onClose={() => setOpenGroupModal(false)}
        onCreated={async (newGroup) => { console.log("Group created:", newGroup); await fetchProducts(); }}
      />
    </Box >
  );
};

export default ProductsListing;