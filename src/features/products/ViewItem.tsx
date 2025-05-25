import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  useTheme,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  LinearProgress,
  Badge,
  Container,
  Breadcrumbs,
  Link,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, viewProduct } from "@/services/products";
import { GetProduct } from "@/utils/types";
import toast from "react-hot-toast";
import UpdateProduct from "./UpdateProduct";
import ProductsSideModal from "./ProductsSideModal";

interface HistoryEntry {
  date: string;
  action: string;
  details: string;
  user: string;
  type: "stock" | "price" | "info" | "create";
}

export default function ViewItem() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openEditProductModal, setOpenEditProductModal] =
    useState<boolean>(false);
  const { product } = useSelector((state: RootState) => state.product);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<GetProduct | null>(
    null
  );

  const [data, setData] = useState<GetProduct>({
    _id: "",
    product_name: "",
    selling_price: 0,
    user_id: "",
    is_deleted: false,
    unit: "",
    hsn_code: "",
    purchase_price: 0,
    barcode: "",
    category: "",
    image: "",
    description: "",
    opening_quantity: 0,
    opening_purchase_price: 0,
    opening_stock_value: 0,
    low_stock_alert: 0,
    show_active_stock: true,
    created_at: "",
    updated_at: "",
  });

  // Enhanced history data with types
  const historyData: HistoryEntry[] = [
    {
      date: "2025-02-20",
      action: "Stock Update",
      details: "Added 50 units to inventory",
      user: "John Doe",
      type: "stock",
    },
    {
      date: "2025-02-15",
      action: "Price Change",
      details: "Price updated from ₹65 to ₹70",
      user: "Sarah Smith",
      type: "price",
    },
    {
      date: "2025-02-01",
      action: "Description Update",
      details: "Updated product description",
      user: "Mike Johnson",
      type: "info",
    },
    {
      date: "2025-01-10",
      action: "Initial Stock",
      details: "Added 150 units to inventory",
      user: "John Doe",
      type: "create",
    },
  ];

  // Calculate stock status
  const getStockStatus = () => {
    const quantity = data.opening_quantity || 1;
    const alertLevel = data.low_stock_alert || 1;

    if (quantity === 0)
      return {
        status: "Out of Stock",
        color: "error",
        severity: "error" as const,
      };
    if (quantity <= alertLevel)
      return {
        status: "Low Stock",
        color: "warning",
        severity: "warning" as const,
      };
    return {
      status: "In Stock",
      color: "success",
      severity: "success" as const,
    };
  };

  const stockStatus = getStockStatus();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      dispatch(viewProduct(id ?? ""))
        .unwrap()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    };
    fetchProduct();
  }, [id, dispatch, refreshKey]);

  useEffect(() => {
    if (product) {
      setData(product);
    }
  }, [product]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setDrawer(true);
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(data._id);
    setShowCopySnackbar(true);
  };

  const confirmDelete = () => {
    toast.promise(
      dispatch(deleteProduct(data._id)).then(() => {
        setOpenDeleteDialog(false);
        navigate("/products");
      }),
      {
        loading: "Deleting product...",
        success: <b>Product deleted successfully!</b>,
        error: <b>Failed to delete product. Please try again.</b>,
      }
    );
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "stock":
        return <InventoryIcon />;
      case "price":
        return <CurrencyExchangeIcon />;
      case "info":
        return <InfoIcon />;
      case "create":
        return <MedicationIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ borderRadius: 2, mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: 2, mb: 3 }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Stock Alert */}
      {stockStatus.severity !== "success" && (
        <Fade in={true} timeout={400}>
          <Alert
            severity={stockStatus.severity}
            icon={<WarningIcon />}
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button size="small" onClick={handleEdit}>
                Update Stock
              </Button>
            }
          >
            <Typography variant="body2">
              <strong>{stockStatus.status}:</strong> Only{" "}
              {data.opening_quantity} units remaining
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Enhanced Product Header */}
      <Fade in={true} timeout={500}>
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Avatar
                  src={data?.image}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "primary.main",
                    mr: 2,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  {data?.image ?? (
                    <MedicationIcon sx={{ fontSize: 40, color: "white" }} />
                  )}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {data.product_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<CategoryIcon />}
                      label={data.category || "Uncategorized"}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<InventoryIcon />}
                      label={data.unit}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={stockStatus.status}
                      color={stockStatus.color as any}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Share Product">
                  <IconButton onClick={handleShare} color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                >
                  <IconButton onClick={handleBookmark} color="primary">
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Price Display */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                bgcolor: "background.default",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selling Price
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "success.main",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CurrencyRupeeIcon /> {data.selling_price}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Purchase Price
                </Typography>
                <Typography variant="h6" color="text.primary">
                  ₹{data.purchase_price}
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  minHeight: 48,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              <Tab
                label="Product Details"
                icon={<InfoIcon />}
                iconPosition="start"
              />
              <Tab
                label="Activity History"
                icon={<HistoryIcon />}
                iconPosition="start"
              />
              <Tab
                label="Analytics"
                icon={<BarChartIcon />}
                iconPosition="start"
              />
            </Tabs>
          </CardContent>
        </Card>
      </Fade>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Product Image & Actions */}
        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={700}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: theme.shadows[12],
                  transform: "translateY(-4px)",
                },
              }}
            >
              {/* Product Image Section */}
              <Box
                sx={{
                  height: 280,
                  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderRadius: "12px 12px 0 0",
                  overflow: "hidden",
                  minHeight: 200,
                  maxHeight: 250,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    zIndex: 1,
                  }}
                >
                  {!data?.image ? (
                    <MedicationIcon
                      sx={{
                        fontSize: 100,
                        color: "primary.main",
                        opacity: 0.8,
                        transition: "all 0.5s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        maxHeight: 250,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={data?.image}
                        alt={data.product_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px 12px 0 0",
                        }}
                      />
                    </Box>
                  )}

                </Box>
                {/* Floating Stock Badge */}
                <Badge
                  badgeContent={`${data.opening_quantity} units`}
                  color={stockStatus.color as any}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 20,
                    zIndex: 2,
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      px: 2,
                      py: 2,
                      borderRadius: "10px",
                      boxShadow: theme.shadows[2],
                    },
                  }}
                />
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Quick Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <TrendingUpIcon color="success" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="success.main">
                        ₹{" "}
                        {(
                          ((data.selling_price - (data?.purchase_price ?? 0)) /
                            (data?.purchase_price ?? 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Profit Margin
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <ShoppingCartIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary.main">
                        ₹ {data.opening_stock_value ?? 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Stock Value
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: theme.shadows[4],
                        "&:hover": {
                          boxShadow: theme.shadows[8],
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Edit Product
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Fade>
        </Grid>

        {/* Right Column - Tab Content */}
        <Grid item xs={12} md={7}>
          {/* Product Details Tab */}
          {activeTab === 0 && (
            <Fade in={true} timeout={900}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ display: "flex", alignItems: "center", mb: 3 }}
                  >
                    <DescriptionIcon sx={{ mr: 1 }} /> Product Information
                  </Typography>

                  {/* Expandable Sections */}
                  <Stack spacing={2}>
                    {/* Basic Information */}
                    <Paper
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() => toggleSection("basic")}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Basic Information
                        </Typography>
                        {expandedSection === "basic" ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </Box>
                      <Collapse in={expandedSection === "basic"}>
                        <Box sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Category
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.category || "Not specified"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Unit
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.unit || "Not specified"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                HSN Code
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.hsn_code || "Not specified"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Barcode
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.barcode || "Not specified"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Paper>

                    {/* Pricing & Stock */}
                    <Paper
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() => toggleSection("pricing")}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Pricing & Inventory
                        </Typography>
                        {expandedSection === "pricing" ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </Box>
                      <Collapse in={expandedSection === "pricing"}>
                        <Box sx={{ p: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Purchase Price
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={700}
                                color="text.primary"
                              >
                                ₹{data.purchase_price}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Selling Price
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={700}
                                color="success.main"
                              >
                                ₹{data.selling_price}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Current Stock
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.opening_quantity} units
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                  ((data?.opening_quantity ?? 1) /
                                    ((data?.low_stock_alert ?? 1) * 3)) *
                                  100,
                                  100
                                )}
                                color={stockStatus.color as any}
                                sx={{ mt: 1, borderRadius: 1 }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Low Stock Alert
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.low_stock_alert} units
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Paper>

                    {/* Description & Notes */}
                    <Paper
                      elevation={0}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() => toggleSection("description")}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Description & Details
                        </Typography>
                        {expandedSection === "description" ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </Box>
                      <Collapse in={expandedSection === "description"}>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {data.description || "No description available"}
                          </Typography>

                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Product ID
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: "background.default",
                                p: 1,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "monospace",
                                  flex: 1,
                                  mr: 1,
                                }}
                              >
                                {data._id}
                              </Typography>
                              <Tooltip title="Copy ID">
                                <IconButton size="small" onClick={handleCopyId}>
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* History Tab */}
          {activeTab === 1 && (
            <Fade in={true} timeout={900}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ display: "flex", alignItems: "center", mb: 3 }}
                  >
                    <TimelineIcon sx={{ mr: 1 }} /> Activity Timeline
                  </Typography>

                  <List sx={{ p: 0 }}>
                    {historyData.map((entry, index) => (
                      <Fade
                        in={true}
                        style={{ transitionDelay: `${index * 150}ms` }}
                        key={index}
                      >
                        <ListItem
                          sx={{
                            p: 0,
                            mb: 2,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateX(8px)",
                            },
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              width: "100%",
                              p: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 2,
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                bgcolor:
                                  entry.type === "stock"
                                    ? "success.main"
                                    : entry.type === "price"
                                      ? "warning.main"
                                      : entry.type === "info"
                                        ? "info.main"
                                        : "primary.main",
                              },
                              "&:hover": {
                                bgcolor: "background.default",
                                boxShadow: theme.shadows[4],
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor:
                                    entry.type === "stock"
                                      ? "success.main"
                                      : entry.type === "price"
                                        ? "warning.main"
                                        : entry.type === "info"
                                          ? "info.main"
                                          : "primary.main",
                                }}
                              >
                                {getHistoryIcon(entry.type)}
                              </Avatar>

                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    color="text.primary"
                                  >
                                    {entry.action}
                                  </Typography>
                                  <Chip
                                    label={formatDate(entry.date)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ ml: 1 }}
                                  />
                                </Box>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {entry.details}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {entry.user
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </Avatar>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    by {entry.user}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>

                  {historyData.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 6,
                        color: "text.secondary",
                      }}
                    >
                      <HistoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        No Activity Yet
                      </Typography>
                      <Typography variant="body2">
                        Product activities will appear here once actions are
                        performed.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Analytics Tab */}
          {activeTab === 2 && (
            <Fade in={true} timeout={900}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ display: "flex", alignItems: "center", mb: 3 }}
                  >
                    <BarChartIcon sx={{ mr: 1 }} /> Product Analytics
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Key Metrics */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Key Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              bgcolor: "success.light",
                              color: "success.contrastText",
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              ₹
                              {data.selling_price - (data?.purchase_price ?? 0)}
                            </Typography>
                            <Typography variant="caption">
                              Profit per Unit
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              {(
                                ((data.selling_price -
                                  (data?.purchase_price ?? 0)) /
                                  (data?.purchase_price ?? 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </Typography>
                            <Typography variant="caption">
                              Profit Margin
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              bgcolor: "warning.light",
                              color: "warning.contrastText",
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              {Math.ceil(
                                (data?.opening_quantity ?? 1) /
                                (data.low_stock_alert || 1)
                              )}
                            </Typography>
                            <Typography variant="caption">
                              Stock Turnover
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: "center",
                              bgcolor: "info.light",
                              color: "info.contrastText",
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              ₹{data.opening_stock_value}
                            </Typography>
                            <Typography variant="caption">
                              Total Stock Value
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Stock Status */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Stock Status
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="body1">
                            Current Stock Level
                          </Typography>
                          <Chip
                            label={stockStatus.status}
                            color={stockStatus.color as any}
                            variant="filled"
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            ((data?.opening_quantity ?? 1) /
                              ((data?.low_stock_alert ?? 1) * 3)) *
                            100,
                            100
                          )}
                          color={stockStatus.color as any}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            bgcolor: theme.palette.grey[200],
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            0 units
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {data.opening_quantity ?? 1} /{" "}
                            {(data.low_stock_alert ?? 1) * 3} units
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Performance Insights */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Performance Insights
                      </Typography>
                      <Stack spacing={2}>
                        <Alert
                          severity={
                            data.selling_price > (data.purchase_price ?? 0)
                              ? "success"
                              : "warning"
                          }
                          sx={{ borderRadius: 2 }}
                        >
                          <Typography variant="body2">
                            {data.selling_price > (data.purchase_price ?? 0)
                              ? `Strong profit margin of ${(
                                ((data.selling_price -
                                  (data.purchase_price ?? 0)) /
                                  (data.purchase_price ?? 1)) *
                                100
                              ).toFixed(1)}%`
                              : "Consider reviewing pricing strategy for better profitability"}
                          </Typography>
                        </Alert>

                        <Alert
                          severity={
                            (data.opening_quantity ?? 1) >
                              (data.low_stock_alert ?? 1)
                              ? "info"
                              : "warning"
                          }
                          sx={{ borderRadius: 2 }}
                        >
                          <Typography variant="body2">
                            {(data.opening_quantity ?? 1) >
                              (data.low_stock_alert ?? 1)
                              ? "Stock level is healthy"
                              : "Stock level is below alert threshold - consider restocking"}
                          </Typography>
                        </Alert>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Grid>
      </Grid>

      {/* Enhanced Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "error.main" }}>
              <DeleteIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Delete Product</Typography>
              <Typography variant="body2" color="text.secondary">
                {data.product_name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            This action cannot be undone. All product data will be permanently
            deleted.
          </Alert>

          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this product? This will remove:
          </Typography>

          <List dense sx={{ ml: 2 }}>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <MedicationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Product information and details" />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <InventoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Current stock and inventory data" />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Activity history and records" />
            </ListItem>
          </List>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, textTransform: "none" }}
            startIcon={<DeleteIcon />}
          >
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={showCopySnackbar}
        autoHideDuration={3000}
        onClose={() => setShowCopySnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowCopySnackbar(false)}
          severity="success"
          sx={{ borderRadius: 2 }}
        >
          Product ID copied to clipboard!
        </Alert>
      </Snackbar>

      <ProductsSideModal
        drawer={drawer}
        setDrawer={setDrawer}
        setRefreshKey={setRefreshKey}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Container>
  );
}