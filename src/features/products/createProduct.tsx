import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  // MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  // Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AppDispatch } from "@/store/store";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import { createProduct } from "@/services/products";
import { SingleProduct } from "@/utils/types";

export default function CreateProduct() {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [productData, setProductData] = useState<SingleProduct>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setProductData((prev) => ({
        ...prev,
        expiry_date: formattedDate,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = Object.entries(productData).filter(
      ([key, value]) => !value && key !== "description"
    );

    if (requiredFields.length > 0) {
      toast.error(`Please fill all required fields`);
      return;
    }

    // toast.promise(
    //   dispatch(createProduct({ data: productData }))
    //     .unwrap()
    //     .then(() => {
    //       navigate(`/products`);
    //     }),
    //   {
    //     loading: "Creating product...",
    //     success: <b>Product successfully added!</b>,
    //     error: <b>Failed to create product. Please try again.</b>,
    //   }
    // );
  };

  const steps = [
    "Basic Details",
    "Product Specifications",
    "Additional Information",
  ];

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleBack = () => {
    navigate("/products");
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, pb: 2, backgroundColor: "#f8f9fa", mt: 2, width: "100%" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={handleBack}
          sx={{ mr: 1 }}
          aria-label="back to products"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography component="h1" variant="h5" fontWeight="500">
          Add New Product
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => handleStepChange(index)}
              sx={{ cursor: "pointer" }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card elevation={2} sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            // onSubmit={handleSubmit}
            sx={{
              width: "100%",
            }}
          >
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="500"
                    sx={{ mb: 2 }}
                  >
                    Basic Product Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Product Name"
                    name="product_name"
                    value={productData.product_name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    variant="outlined"
                    helperText="Enter the complete name of the product"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  {/*<TextField
                    required
                    fullWidth
                    select
                    onChange={handleInputChange}
                    name="category"
                    value={productData.category}
                    label="Category"
                    variant="outlined"
                    helperText="Select the product category"
                  >
                    <MenuItem value="Analgesics">Analgesics</MenuItem>
                    <MenuItem value="Antibiotics">Antibiotics</MenuItem>
                    <MenuItem value="Antiseptics">Antiseptics</MenuItem>
                    <MenuItem value="Vitamins">Vitamins</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </TextField>*/}
                  <TextField
                    required
                    fullWidth
                    label="Category"
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    placeholder="Enter Product Category"
                    variant="outlined"
                    helperText="Enter the product category"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  {/* <TextField
                    required
                    fullWidth
                    select
                    onChange={handleInputChange}
                    name="state"
                    value={productData.state}
                    label="Physical State"
                    variant="outlined"
                    helperText="Select the physical state of the product"
                  >
                    <MenuItem value="Liquid">Liquid</MenuItem>
                    <MenuItem value="Solid">Solid</MenuItem>
                    <MenuItem value="Semi-Solid">Semi-Solid</MenuItem>
                    <MenuItem value="Semi-Liquid">Semi-Liquid</MenuItem>
                  </TextField> */}
                  <TextField
                    required
                    fullWidth
                    label="Physical State"
                    name="state"
                    value={productData.state}
                    onChange={handleInputChange}
                    placeholder="Enter Physical State"
                    variant="outlined"
                    helperText="Enter the physical state of the product"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Price"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    helperText="Enter the price per unit"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="500"
                    sx={{ mb: 2 }}
                  >
                    Product Specifications
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  {/* <TextField
                    required
                    fullWidth
                    type="number"
                    label="Number of Tablets per Pack"
                    name="no_of_tablets_per_pack"
                    value={productData.no_of_tablets_per_pack}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Enter the number of tablets contained in a single pack">
                            <HelpOutlineIcon fontSize="small" />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  /> */}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Measure of Unit"
                    name="measure_of_unit"
                    value={productData.measure_of_unit}
                    onChange={handleInputChange}
                    placeholder="e.g., mg, ml, g, sft, etc."
                    variant="outlined"
                    helperText="Specify the unit of measurement (mg, ml, nos, pieces, etc.)"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Expiry Date"
                      value={
                        productData.expiry_date
                          ? new Date(productData.expiry_date)
                          : new Date()
                      }
                      onChange={handleDateChange}
                      views={["year", "month", "day"]}
                      slotProps={{
                        nextIconButton: { size: "small" },
                        previousIconButton: { size: "small" },
                        textField: {
                          // required: true,
                          fullWidth: true,
                          helperText: "Select the product expiry date",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    fullWidth
                    label="Storage Requirement"
                    name="storage_requirement"
                    value={productData.storage_requirement}
                    onChange={handleInputChange}
                    placeholder="e.g., Store in a cool, dry place"
                    variant="outlined"
                    helperText="Specify how the product should be stored"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="500"
                    sx={{ mb: 2 }}
                  >
                    Additional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Product Description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed product description, usage instructions, side effects, etc."
                    variant="outlined"
                    helperText="Provide comprehensive details about the product"
                  />
                </Grid>
              </Grid>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              {activeStep > 0 ? (
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Previous
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleBack}>
                  Cancel
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Add Product
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
}
