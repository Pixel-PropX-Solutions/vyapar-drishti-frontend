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
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, getProduct, viewProduct } from "@/services/products";
import { GetItem, ProductUpdate } from "@/utils/types";
import toast from "react-hot-toast";
import { formatDate, getAvatarColor, getInitials } from "@/utils/functions";
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

  const { item } = useSelector((state: RootState) => state.product);

  const { currentCompany } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [drawer, setDrawer] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductUpdate | null>(
    null
  );

  const [data, setData] = useState<GetItem>({
    company_id: "",
    unit_id: "",
    alias_name: "",
    category: "",
    category_id: "",
    group: "",
    group_id: "",
    image: "",
    description: "",
    gst_nature_of_goods: "",
    gst_hsn_code: "",
    gst_taxability: "",
    low_stock_alert: 0,
    created_at: "",
    updated_at: "",
    current_stock: 0,
    avg_purchase_rate: 0,
    purchase_qty: 0,
    purchase_value: 0,
    sales_qty: 0,
    sales_value: 0,
    _id: "",
    stock_item_name: "",
    user_id: "",
    unit: "",
    opening_balance: 0,
    opening_rate: 0,
    opening_value: 0,
  });

  // Enhanced history data with types
  const historyData: HistoryEntry[] = [
    // {
    //   date: "2025-02-20",
    //   action: "Stock Update",
    //   details: "Added 50 units to inventory",
    //   user: "John Doe",
    //   type: "stock",
    // },
  ];

  // Calculate stock status
  const getStockStatus = () => {
    const quantity = data.current_stock ?? 0;
    const alertLevel = data.low_stock_alert || 3;

    if (quantity < 1)
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
      dispatch(getProduct({ product_id: id ?? '', company_id: currentCompany?._id ?? '' }))
        .unwrap()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error || "An unexpected error occurred. Please try again later.")
          setIsLoading(false);
        });
    };
    fetchProduct();
  }, [id, dispatch, refreshKey, currentCompany?._id]);

  useEffect(() => {
    if (item) {
      setData(item);
    }
  }, [item]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setDrawer(true);
    // setSelectedProduct(item);
    // setOpenEditProductModal(true);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
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
    dispatch(deleteProduct({ id: data._id, company_id: data.company_id })).unwrap().then(() => {
      toast.success('Product deleted successfully.')
      setOpenDeleteDialog(false);
      navigate("/products");
    }).catch((error) => {
      toast.error(error || "An unexpected error occurred. Please try again later.");
    });
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
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: 1, mb: 3 }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={500}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={500}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
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
              {data.current_stock} units remaining
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
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
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
                  src={typeof data?.image === "string" && data.image ? data.image : undefined}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: getAvatarColor(data.stock_item_name),
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(data.stock_item_name), 0.3)}`,
                    mr: 2,
                  }}
                >
                  {(getInitials(data.stock_item_name))}
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
                    {data.stock_item_name}
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
                      sx={{ px: 1 }}
                    />
                    <Chip
                      icon={<InventoryIcon />}
                      label={data.unit}
                      variant="outlined"
                      size="small"
                      sx={{ px: 1 }}
                    />
                    <Chip
                      label={stockStatus.status}
                      color={stockStatus.color as any}
                      size="small"
                      sx={{ fontWeight: 600, px: 1 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ textAlign: "center", border: `1px solid ${theme.palette.divider}`, px: 2, py:1, borderRadius: 1, backgroundColor: theme.palette.primary.light }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selling Price
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "success.main",
                    }}
                  >{data.sales_qty > 0 ? <>
                    &#8377; {data.sales_value}
                  </> : 'No Sale Yet'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", border: `1px solid ${theme.palette.divider}`, px: 2, py:1, borderRadius: 1, backgroundColor: theme.palette.secondary.light }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Purchase Price
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {data.purchase_qty > 0 ? <>
                      &#8377; {data.purchase_value}
                    </> : "No Purchase Yet"}
                  </Typography>
                </Box>
                <Tooltip title="Share Product">
                  <IconButton onClick={handleShare} color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
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
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
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
                    <Avatar
                      src={typeof data?.image === "string" && data.image ? data.image : undefined}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: getAvatarColor(data.stock_item_name),
                        fontSize: '2rem',
                        fontWeight: 700,
                        boxShadow: `0 4px 12px ${alpha(getAvatarColor(data.stock_item_name), 0.3)}`,
                        mr: 2,
                      }}
                    >
                      {(getInitials(data.stock_item_name))}
                    </Avatar>
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
                        src={typeof data?.image === "string" ? data.image : undefined}
                        alt={data.stock_item_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "12px 12px 0 0",
                        }}
                      />
                    </Box>
                  )}

                </Box>
                {/* Floating Stock Badge */}
                <Badge
                  badgeContent={`${data.current_stock} units`}
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
                        borderRadius: 1,
                      }}
                    >
                      <TrendingUpIcon color="success" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="success.main">
                        {data.sales_qty > 0 ? <>
                          &#8377;{" "}
                          {(
                            ((data.sales_value ?? 0 - (data?.purchase_value ?? 0)) /
                              (data?.purchase_value ?? 1)) *
                            100
                          ).toFixed(2)}
                          %
                        </> : "No Sale yet"}

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
                        borderRadius: 1,
                      }}
                    >
                      <ShoppingCartIcon color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary.main">
                        {data.purchase_qty > 0
                          ? <> &#8377; {((data.current_stock ?? 0) * (data.avg_purchase_rate ?? 1)).toFixed(2)}</>
                          : "No Purchase Yet"
                        }

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
                      onClick={async () => {
                        setDrawer(true);
                        await dispatch(viewProduct({ product_id: data._id, company_id: currentCompany?._id || '' }))
                          .unwrap().then((res) => {
                            setSelectedProduct(res.product);
                            toast.success("Product details fetched successfully!");
                            setDrawer(true);
                          }).catch((error) => {
                            setDrawer(false);
                            setSelectedProduct(null);
                            console.error("Error fetching product details:", error);
                            toast.error(error || "Failed to fetch product details");
                          });
                      }}
                      sx={{
                        borderRadius: 1,
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
                        borderRadius: 1,
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
                  borderRadius: 1,
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
                        borderRadius: 1,
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
                                {data.gst_hsn_code || "Not specified"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Taxability
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {data.gst_taxability || "Not specified"}
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
                        borderRadius: 1,
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
                              >{data.purchase_qty > 0
                                ? <>&#8377; {data.purchase_value}</>
                                : 'No Purchase Yet'}
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
                              >{data.purchase_qty > 0
                                ? <> &#8377; {data.sales_value}</>
                                : 'No Sale Yet'}
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
                                {data.current_stock} units
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                  ((data?.current_stock ?? 1) /
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
                                {data.low_stock_alert ?? 5} units
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
                        borderRadius: 1,
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
                  borderRadius: 1,
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
                            borderRadius: 1,
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
                              borderRadius: 1,
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
                        Comming in future updates
                      </Typography>
                      {/* <Typography variant="body2">
                        Product activities will appear here once actions are
                        performed.
                      </Typography> */}
                    </Box>
                  )}
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
            borderRadius: 1,
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
                {data.stock_item_name}
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
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 1, textTransform: "none" }}
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
        product={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Container>
  );
}