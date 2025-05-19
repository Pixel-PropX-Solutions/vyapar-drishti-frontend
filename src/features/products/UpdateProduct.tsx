import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  Grid,
  Paper,
  Divider,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CategoryIcon from "@mui/icons-material/Category";
import { updateProduct, viewProduct } from "@/services/products";
import { SingleProduct } from "@/utils/types";
interface UpdateProductProps {
  onClose?: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
  onClose,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productData, loading } = useSelector(
    (state: RootState) => state.product
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [data, setData] = useState<SingleProduct>({
    product_name: "",
    no_of_tablets_per_pack: 0,
    state: "",
    expiry_date: "",
    measure_of_unit: "",
    category: "",
    price: 0,
    storage_requirement: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for this field when user changes it
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setData((prev) => ({
        ...prev,
        expiry_date: formattedDate,
      }));

      // Clear error for this field
      if (formErrors.expiry_date) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.expiry_date;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!data.product_name.trim()) {
      errors.product_name = "Product name is required";
    }

    if (data.no_of_tablets_per_pack <= 0) {
      errors.no_of_tablets_per_pack =
        "Number of tablets must be greater than 0";
    }

    if (!data.state) {
      errors.state = "State is required";
    }

    if (!data.expiry_date) {
      errors.expiry_date = "Expiry date is required";
    } else {
      const expiryDate = new Date(data.expiry_date);
      const currentDate = new Date();
      if (expiryDate <= currentDate) {
        errors.expiry_date = "Expiry date must be in the future";
      }
    }

    if (!data.measure_of_unit.trim()) {
      errors.measure_of_unit = "Measure of unit is required";
    }

    if (!data.category.trim()) {
      errors.category = "Category is required";
    }

    if (data.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (id) dispatch(viewProduct(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (productData) {
      setData({
        product_name: productData.product_name || "",
        no_of_tablets_per_pack: productData.no_of_tablets_per_pack || 0,
        state: productData.state || "",
        expiry_date: productData.expiry_date || "",
        measure_of_unit: productData.measure_of_unit || "",
        category: productData.category || "",
        price: productData.price || 0,
        storage_requirement: productData.storage_requirement || "",
        description: productData.description || "",
      });
    }
  }, [productData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    toast.promise(
      dispatch(updateProduct({ data, id: id ?? "" }))
        .unwrap()
        .then(() => {
          navigate(`/products`);
        }),
      {
        loading: "Updating product...",
        success: <b>Product successfully updated!</b>,
        error: <b>Failed to update product. Please try again.</b>,
      }
    );
  };

  const handleCancel = () => {
    // setErrors({});
    onClose?.();
  };

  if (loading && !productData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // height: "500px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, px: 3 }}>
      <Paper elevation={3} sx={{ px: 3, py: 3, mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography component="h1" variant="h5" fontWeight="bold">
            Update Product
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Chip label="Basic Information" color="primary" sx={{ mb: 0 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Product Name"
                name="product_name"
                value={data.product_name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                error={!!formErrors.product_name}
                helperText={formErrors.product_name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="No. of Tablets per Pack"
                name="no_of_tablets_per_pack"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={data.no_of_tablets_per_pack}
                onChange={handleInputChange}
                error={!!formErrors.no_of_tablets_per_pack}
                helperText={formErrors.no_of_tablets_per_pack}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                variant="outlined"
                label="State"
                name="state"
                value={data.state}
                onChange={handleInputChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
              >
                <MenuItem value="">Select state</MenuItem>
                <MenuItem value="Liquid">Liquid</MenuItem>
                <MenuItem value="Solid">Solid</MenuItem>
                <MenuItem value="Semi-Solid">Semi-Solid</MenuItem>
                <MenuItem value="Semi-Liquid">Semi-Liquid</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Measure of Unit"
                name="measure_of_unit"
                value={data.measure_of_unit}
                onChange={handleInputChange}
                placeholder="e.g., mg, ml, tablets"
                error={!!formErrors.measure_of_unit}
                helperText={formErrors.measure_of_unit}
              />
            </Grid>

            <Grid item xs={12}>
              <Chip
                label="Additional Details"
                color="primary"
                sx={{ mb: 0, mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry Date"
                  value={data.expiry_date ? new Date(data.expiry_date) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: !!formErrors.expiry_date,
                      helperText: formErrors.expiry_date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Category"
                name="category"
                value={data.category}
                onChange={handleInputChange}
                error={!!formErrors.category}
                helperText={formErrors.category}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Price"
                name="price"
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                value={data.price}
                onChange={handleInputChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Chip
                label="Storage & Description"
                color="primary"
                sx={{ mb: 0, mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Storage Requirement"
                name="storage_requirement"
                value={data.storage_requirement}
                onChange={handleInputChange}
                placeholder="e.g., Store in a cool, dry place"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Description"
                name="description"
                value={data.description}
                onChange={handleInputChange}
                placeholder="Product description"
                multiline
                rows={2}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => {handleCancel(); }}
                sx={{ width: "150px" }}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                sx={{ width: "200px" }}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}


export default UpdateProduct;