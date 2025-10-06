import React, { useEffect, useMemo, useState } from "react";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, getProduct, getProductTimeline, viewProduct } from "@/services/products";
import { ProductUpdate } from "@/utils/types";
import toast from "react-hot-toast";
import { formatDate, getAvatarColor, getInitials } from "@/utils/functions";
import ProductsSideModal from "./ProductsSideModal";
import { ActionButton } from "@/common/buttons/ActionButton";
import { ArrowBack } from "@mui/icons-material";

interface HistoryEntry {
  date: string;
  action: string;
  details: string;
  user: string;
  type: "Purchase" | "Sales";
}

export default function ViewItem() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { item, timeline } = useSelector((state: RootState) => state.product);
  const { currentCompany } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [drawer, setDrawer] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductUpdate | null>(
    null
  );

  const getStockStatus = () => {
    if (!item)
      return { status: "Loading...", color: "info", severity: "info" as const };
    const status = item?.stock_status ?? '';

    if (status == 'zero' || status === 'negative')
      return {
        status: "Out of Stock",
        color: "error",
        severity: "error" as const,
      };
    if (status === 'low')
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
      dispatch(getProductTimeline({ product_id: id ?? '', company_id: currentCompany?._id ?? '' }))
    };
    fetchProduct();
  }, [id, dispatch, refreshKey, currentCompany?._id]);


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const timelineData: HistoryEntry[] = useMemo(() => {
    return timeline?.timeline?.map((entry: any) => ({
      date: entry.date,
      action: entry.voucher_type,
      details: entry.voucher_type === 'Purchase'
        ? `Purchased ${entry.quantity} units at ₹${entry.rate} each` : `Sold ${entry.quantity} units at ₹${entry.rate} each`,
      user: entry.party_name,
      type: entry.voucher_type,
    }));
  }, [timeline]);

  const handleEdit = () => {
    setDrawer(true);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(item._id);
    toast.success("Product ID copied to clipboard");
  };

  const confirmDelete = () => {
    dispatch(deleteProduct({ id: item._id, company_id: item.company_id })).unwrap().then(() => {
      toast.success('Product deleted successfully.')
      setOpenDeleteDialog(false);
      navigate("/products");
    }).catch((error) => {
      toast.error(error || "An unexpected error occurred. Please try again later.");
    });
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "Purchase":
        return <InventoryIcon />;
      case "Sales":
        return <CurrencyExchangeIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const calculateProfitMargin = useMemo(() => {
    if (!item) return "0.00";
    const totalPurchaseQty = (item.purchase_qty || 0) + (item.opening_balance || 0);
    // Use opening_rate for opening_balance if opening_value is null
    const openingValue = (item.opening_balance || 0) * (item.opening_rate || 0);
    const totalPurchaseValueFixed = (item.purchase_value || 0) + openingValue;
    const avgPurchaseRate = totalPurchaseQty > 0
      ? totalPurchaseValueFixed / totalPurchaseQty
      : item.avg_purchase_rate || item.opening_rate || 0;

    // Margin profit calculation: ((avg_sale_rate - avgPurchaseRate) / avg_sale_rate) * 100
    const mp = item.sales_value
      ? 100 * ((item.avg_sale_rate
        - avgPurchaseRate) || 0) / (item.avg_sale_rate
          || 1)
      : 0;
    return mp.toFixed(2);
  }, [item]);


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
              {item.current_stock} units remaining
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Enhanced Product Header */}
      <Fade in={true} timeout={500}>
        {/* Header Section */}
        <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center" justifyContent='space-between'>
              <Grid item xs={12} md={8}>
                <Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <ActionButton
                      icon={<ArrowBack fontSize="small" />}
                      title="Back"
                      color="primary"
                      onClick={() => navigate(-1)}
                    />
                    <Box>
                      <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                        {item.stock_item_name}
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
                          label={item.category || "Uncategorized"}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ px: 1 }}
                        />
                        <Chip
                          icon={<InventoryIcon />}
                          label={item.unit}
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
                </Box>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="dashboard tabs"
                  sx={{ mt: 1 }}
                >
                  <Tab
                    label="Activity History"
                    icon={<HistoryIcon />}
                    iconPosition="start" />
                  <Tab
                    label="Product Details"
                    icon={<InfoIcon />}
                    iconPosition="start" />
                </Tabs>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{ textAlign: "center", border: `1px solid ${theme.palette.divider}`, px: 2, py: .5, borderRadius: 1, backgroundColor: theme.palette.primary.light }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Avg. Selling Rate
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: "success.main",
                    }}
                  >{item.sales_qty > 0 ? <>
                    &#8377; {item.avg_sale_rate}
                  </> : 'No Sale Yet'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center", border: `1px solid ${theme.palette.divider}`, px: 2, py: .5, borderRadius: 1, backgroundColor: theme.palette.secondary.light }}>
                  <Typography variant="body2" color="text.secondary" >
                    Avg. Purchase Rate
                  </Typography>
                  <Typography variant="body1"
                    sx={{
                      fontWeight: 700,
                    }}>
                    {item.purchase_qty > 0 ? <>
                      &#8377; {item.avg_purchase_rate}
                    </> : "Not Purchased"}
                  </Typography>
                </Box>
              </Box>
            </Grid>


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
                  {!item?.image ? (
                    <Avatar
                      src={typeof item?.image === "string" && item.image ? item.image : undefined}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: getAvatarColor(item.stock_item_name),
                        fontSize: '2rem',
                        fontWeight: 700,
                        boxShadow: `0 4px 12px ${alpha(getAvatarColor(item.stock_item_name), 0.3)}`,
                        mr: 2,
                      }}
                    >
                      {(getInitials(item.stock_item_name))}
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
                        src={typeof item?.image === "string" ? item.image : undefined}
                        alt={item.stock_item_name}
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
                  badgeContent={`${item.current_stock} units`}
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
                        {item.sales_qty > 0 ? <>
                          &#8377;{" "}
                          {calculateProfitMargin} %
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
                        {item.purchase_qty > 0
                          ? <> &#8377; {((item.current_stock ?? 0) * (item.avg_purchase_rate ?? 1)).toFixed(2)}</>
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
                        await dispatch(viewProduct({ product_id: item._id, company_id: currentCompany?._id || '' }))
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
          {/* History Tab */}
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
                    <TimelineIcon sx={{ mr: 1 }} /> Activity Timeline
                  </Typography>

                  <List sx={{ p: 0 }}>
                    {timelineData.map((entry, index) => (
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
                                  entry.type === "Purchase"
                                    ? "success.main"
                                    : "warning.main",
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
                                    entry.type === "Purchase"
                                      ? "success.light"
                                      : "warning.light",
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
                                    {getInitials(entry.user)}
                                  </Avatar>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {entry.type === 'Purchase' ? 'Purchased from' : 'Sold to'} {entry.user}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>

                  {timelineData.length === 0 && (
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

          {/* Product Details Tab */}
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
                                {item.category || "Not specified"}
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
                                {item.unit || "Not specified"}
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
                                {item.hsn_code || "Not specified"}
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
                                {item.taxability || "Not specified"}
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
                              >{item.purchase_qty > 0
                                ? <>&#8377; {item.purchase_value}</>
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
                              >{item.purchase_qty > 0
                                ? <> &#8377; {item.sales_value}</>
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
                                {item.current_stock} units
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                  ((item?.current_stock ?? 1) /
                                    ((item?.low_stock_alert ?? 0))) *
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
                                {item.low_stock_alert ?? 5} units
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
                            {item.description || "No description available"}
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
                                {item._id}
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
                {item.stock_item_name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            This action cannot be undone. All product item will be permanently
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
              <ListItemText primary="Current stock and inventory item" />
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