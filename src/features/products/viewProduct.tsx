import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, viewProduct } from "@/services/products";
import { Product } from "@/utils/types";
import toast from "react-hot-toast";
import UpdateProduct from "./UpdateProduct";

interface HistoryEntry {
  date: string;
  action: string;
  details: string;
  user: string;
}

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [openEditProductModal, setOpenEditProductModal] =
    useState<boolean>(false);
  const { productData } = useSelector((state: RootState) => state.product);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Placeholder data - in a real app, fetch this from your API based on id
  const [data, setData] = useState<Product>({
    _id: "",
    product_name: "",
    category: "",
    state: "",
    measure_of_unit: "",
    no_of_tablets_per_pack: 0,
    price: 0,
    storage_requirement: "",
    description: "",
    expiry_date: "",
  });

  // Sample history data
  const historyData: HistoryEntry[] = [
    {
      date: "2025-02-20",
      action: "Stock Update",
      details: "Added 50 units to inventory",
      user: "John Doe",
    },
    {
      date: "2025-02-15",
      action: "Price Change",
      details: "Price updated from ₹65 to ₹70",
      user: "Sarah Smith",
    },
    {
      date: "2025-02-01",
      action: "Description Update",
      details: "Updated product description",
      user: "Mike Johnson",
    },
    {
      date: "2025-01-10",
      action: "Initial Stock",
      details: "Added 150 units to inventory",
      user: "John Doe",
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      dispatch(viewProduct(id ?? ""))
        .unwrap()
        .then(() => {
          setIsLoading(false);
        });
    };
    fetchProduct();
  }, [id, dispatch]);

  useEffect(() => {
    if (productData) {
      setData(productData);
    }
  }, [productData]);

  // Format the expiry date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTooltipMessage = () => {
    const expiryDate = new Date(data.expiry_date);
    const currentDate = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    const sixMonthsAfterExpiry = new Date(expiryDate);
    sixMonthsAfterExpiry.setMonth(sixMonthsAfterExpiry.getMonth() + 6);

    if (expiryDate <= currentDate) {
      if (currentDate <= sixMonthsAfterExpiry) {
        return "Request Refund";
      } else {
        return null;
      }
    } else if (expiryDate <= threeMonthsFromNow) {
      return "Expiring soon";
    }
    return null;
  };

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDateString: string): number => {
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDaysUntilExpiredReturns = (
    expiryDateString: string
  ): number => {
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const diffTime =
      today.getTime() - expiryDate.setMonth(expiryDate.getMonth() - 6);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = calculateDaysUntilExpiry(data.expiry_date);
  const daysUntilExpiredReturn = calculateDaysUntilExpiredReturns(
    data.expiry_date
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setOpenEditProductModal(true);
    // navigate(`/products/update/${id}`);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
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
        error: <b>Failed to deleted product. Please try again.</b>,
      }
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", md: "1200px" },
          margin: "0 auto",
          p: 3,
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={100}
          sx={{ borderRadius: 2, mb: 3 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: 2, mb: 3 }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1200px" },
        margin: "0 auto",
        p: 3,
      }}
    >
      {!openEditProductModal ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">Product Details</Typography>
          </Box>

          {/* Product Header */}
          <Fade in={true} timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid rgba(194, 201, 214, .4)",
                borderRadius: 2,
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MedicationIcon
                    sx={{ fontSize: 36, color: "primary.main", mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{ fontWeight: 600 }}
                    >
                      {data.product_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      ID: {data._id}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Chip
                    icon={<CategoryIcon />}
                    label={data.category}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, px: 1, py: 2 }}
                  />
                  <Chip
                    icon={<InventoryIcon />}
                    label={data.state}
                    variant="outlined"
                    sx={{ mr: 1, px: 1, py: 2 }}
                  />
                  {getTooltipMessage() && (
                    <Chip
                      icon={
                        getTooltipMessage() === "Expiring soon" ? (
                          <WarningIcon />
                        ) : getTooltipMessage() === "Request Refund" ? (
                          <CurrencyExchangeIcon />
                        ) : (
                          <InfoIcon />
                        )
                      }
                      label={
                        getTooltipMessage() === "Expiring soon"
                          ? `Expires in ${daysUntilExpiry} days`
                          : getTooltipMessage() === "Request Refund"
                            ? `${daysUntilExpiredReturn} Days remaining for process refund.`
                            : ``
                      }
                      color={
                        getTooltipMessage() === "Expiring soon"
                          ? "warning"
                          : getTooltipMessage() === "Request Refund"
                            ? "success"
                            : "info"
                      }
                      variant="filled"
                      sx={{ px: 1, py: 2, mr: 1 }}
                    />
                  )}
                </Box>
              </Box>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  },
                }}
              >
                <Tab
                  label="Details"
                  icon={<InfoIcon />}
                  iconPosition="start"
                  sx={{
                    fontWeight: 500,
                    transition: "all 0.2s",
                    "&.Mui-selected": {
                      fontWeight: 600,
                    },
                  }}
                />
                <Tab
                  label="History"
                  icon={<HistoryIcon />}
                  iconPosition="start"
                  sx={{
                    fontWeight: 500,
                    transition: "all 0.2s",
                    "&.Mui-selected": {
                      fontWeight: 600,
                    },
                  }}
                />
              </Tabs>
            </Paper>
          </Fade>

          {/* Product Content */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={5}>
              <Fade in={true} timeout={700}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid rgba(194, 201, 214, .4)",
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f5f5f5",
                      height: 250,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <MedicationIcon
                      sx={{
                        fontSize: 80,
                        color: "primary.main",
                        opacity: 0.7,
                        transition: "transform 0.5s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />

                    <Chip
                      label={`₹ ${data.price}`}
                      color="primary"
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        px: 2,
                        py: 2.5,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Alert
                        severity={
                          daysUntilExpiry < 30
                            ? "error"
                            : daysUntilExpiry < 90
                              ? "warning"
                              : "info"
                        }
                        color={
                          daysUntilExpiry < 30
                            ? "error"
                            : daysUntilExpiry < 90
                              ? "warning"
                              : "info"
                        }
                        icon={<AccessTimeIcon />}
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        Expires on {formatDate(data.expiry_date)}{" "}
                        {getTooltipMessage() &&
                          daysUntilExpiry > 0 &&
                          `(${daysUntilExpiry} Days)`}
                      </Alert>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 4,
                            width: "100%",
                            mt: { xs: 1, sm: 0 },
                          }}
                        >
                          <Tooltip title="Edit Product">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={handleEdit}
                              sx={{
                                border: "1px solid",
                                width: "100%",
                                borderColor: "primary.main",
                                borderRadius: 2,
                                py: 1.2,
                                transition: "all 0.2s",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <Button
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={handleDelete}
                              sx={{
                                border: "1px solid",
                                width: "100%",
                                borderColor: "error.main",
                                borderRadius: 2,
                                py: 1.2,
                                transition: "all 0.2s",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={7}>
              {activeTab === 0 && (
                <Fade in={true} timeout={900}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      border: "1px solid rgba(194, 201, 214, .4)",
                      borderRadius: 2,
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <DescriptionIcon sx={{ mr: 1 }} /> Product Details
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Category
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {data.category}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            State
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {data.state}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Unit
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {data.measure_of_unit}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Tablets per Pack
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {data.no_of_tablets_per_pack}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Price
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 1,
                              fontWeight: 700,
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CurrencyRupeeIcon sx={{ fontSize: "1rem" }} />{" "}
                            {data.price}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            height: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Storage
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            {data.storage_requirement}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Description
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {data.description}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Product ID
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 1,
                              fontFamily: "monospace",
                              bgcolor: theme.palette.mode === 'light' ? "#f0f0f0" : "#2c2c2c",
                              p: 1,
                              borderRadius: 1,
                              position: "relative",
                            }}
                          >
                            {data._id}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Fade>
              )}

              {activeTab === 1 && (
                <Fade in={true} timeout={900}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "400px",
                      overflowY: "scroll",
                      border: "1px solid rgba(194, 201, 214, .4)",
                      borderRadius: 2,
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      },
                      // Hide scrollbar for Chrome, Safari and Opera
                      "&::-webkit-scrollbar": {
                        display: "none"
                      },
                      // Hide scrollbar for IE, Edge and Firefox
                      msOverflowStyle: "none",  // IE and Edge
                      scrollbarWidth: "none",   // Firefox
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <HistoryIcon sx={{ mr: 1 }} /> Product History
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {historyData.map((entry, index) => (
                      <Fade
                        in={true}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        key={index}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            border: "1px solid rgba(0,0,0,0.05)",
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateX(4px)",
                              bgcolor: "background.paper",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                            <Typography
                              variant="subtitle2"
                              color="primary.main"
                              gutterBottom
                            >
                              {entry.action}
                            </Typography>
                            <Typography variant="body2">{entry.details}</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: { xs: "flex-start", sm: "flex-end" },
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              gutterBottom
                            >
                              {entry.date}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              By: {entry.user}
                            </Typography>
                          </Box>
                        </Paper>
                      </Fade>
                    ))}
                  </Paper>
                </Fade>
              )}
            </Grid>
          </Grid>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            aria-labelledby="delete-dialog-title"
          >
            <DialogTitle id="delete-dialog-title">
              Delete {data.product_name}?
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this product? This action cannot be
                undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog></>
      ) : (
        <UpdateProduct
          onClose={() => setOpenEditProductModal(false)}
        />
      )
      }
    </Box>
  );
}
