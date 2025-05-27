import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
  useTheme
} from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from "@mui/icons-material/Delete";
import toast from 'react-hot-toast';
import { BillItem } from "@/utils/types";
import AddItemModal from "@/common/AddItemModal";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { sellProduct } from "@/services/products";

const ProductBilling: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [billItems, setBillItems] = useState<Array<BillItem>>([]);
  const [selectedProduct, setSelectedProduct] = useState<BillItem | null>(null);

  const handleAddToBill = (data: BillItem) => {
    if (!data) {
      toast.error("Please select a product");
      return;
    }

    if (data?.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const newBillItem: BillItem = {
      ...selectedProduct,
      product_name: data.product_name,
      quantity: data.quantity || 1,
      unit_price: data.unit_price || 0,
      product_id: data.product_id,
    };

    setBillItems([...billItems, newBillItem]);
    setSelectedProduct(null);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...billItems];
    newItems.splice(index, 1);
    setBillItems(newItems);
  };

  const handleSaveBill = async () => {
    if (billItems.length === 0) {
      toast.error("Please add at least one product to the bill");
      return;
    }

    try {
      const dataToSend = billItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));
      await dispatch(sellProduct({ data: dataToSend })).unwrap();
      toast.success("Invoice saved successfully");
      setBillItems([]);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    }
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return billItems.reduce((sum, item) => sum + Number(item?.quantity), 0);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Card sx={{ mb: 3, p: 2 }}>
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
                Sell Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add products to the invoice and save it for sales billing.
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
                  startIcon={<AddCircleOutlineIcon fontSize="large" />}
                  onClick={handleOpenModal}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Add New Product
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          background: theme.palette.mode === 'light' ?
            "linear-gradient(135deg, #ffffff 0%, #f9fdff 100%)" : "linear-gradient(135deg,rgb(30, 30, 30) 0%,rgb(40, 40, 40) 100%)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)"
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, bgcolor: theme.palette.mode === 'light' ? "#ffffff" : '#000000' }}>
            <Typography variant="h6" fontWeight="500">Invoice Details</Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 3 }}>
            {billItems.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 3,
                  bgcolor: theme.palette.mode === "light" ? "#f8fbff" : '#000000',
                  borderRadius: 2,
                  border: "1px dashed #ccc"
                }}
              >
                <AddShoppingCartIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No products added to this invoice yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: "auto" }}>
                  Search existing products to add to this list or add new product to get started!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpenModal}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Add New Product
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{
                    bgcolor: "transparent",
                    boxShadow: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden"
                  }}
                >
                  <Table>
                    <TableHead sx={{ bgcolor: "#f5f9ff" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", py: 2 }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 2 }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 2 }}>Unit Price</TableCell>
                        <TableCell sx={{ fontWeight: "bold", py: 2 }} align="right">Total</TableCell>
                        <TableCell sx={{ py: 2 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billItems.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "#fafcff" },
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "#f0f7ff" }
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight="medium">{item?.product_name}</Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              sx={{
                                width: 80,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 1.5
                                }
                              }}
                              onChange={(e) => {
                                const newItems = [...billItems];
                                newItems[index].quantity = parseInt(e.target.value) || 1;
                                setBillItems(newItems);
                              }}
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={item.unit_price || 0}
                              sx={{
                                width: 120,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 1.5
                                }
                              }}
                              InputProps={{
                                startAdornment: <Typography sx={{ mr: 0.5 }}>₹</Typography>
                              }}
                              onChange={(e) => {
                                const newItems = [...billItems];
                                newItems[index].unit_price = parseFloat(e.target.value) || 0;
                                setBillItems(newItems);
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              ₹{(item.unit_price * item?.quantity).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(index)}
                              sx={{
                                color: "#f44336",
                                "&:hover": { bgcolor: "#ffebee" }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    bgcolor: "#f8fbff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2
                  }}
                >
                  <Box>
                    <Chip
                      label={`Total Items: ${calculateTotalItems()}`}
                      sx={{ fontWeight: 500, bgcolor: "#e3f2fd", color: "#1976d2" }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Grand Total:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.dark">
                      ₹{calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSaveBill}
                    sx={{
                      px: 4,
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      }
                    }}
                  >
                    Sell Items
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <AddItemModal open={isModalOpen} onClose={handleCloseModal} onAddItem={handleAddToBill} />
    </Box>
  );
};

export default ProductBilling;