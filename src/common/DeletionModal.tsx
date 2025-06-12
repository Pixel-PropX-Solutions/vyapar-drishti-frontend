import {
  alpha,
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  CardContent,
  Paper,
  Theme,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteProduct, viewProduct } from "@/services/products";
import toast from "react-hot-toast";
import { setProductId } from "@/store/reducers/productReducer";
import {
  Close as CloseIcon,
  // Warehouse as WarehouseIcon,
  Description as DescriptionIcon,
  // WaterDrop as StateIcon,
  // Today as TodayIcon,
  CurrencyRupee as CurrencyIcon,
  ProductionQuantityLimits as QuantityIcon,
} from "@mui/icons-material";

const InfoRow: React.FC<{
  theme: Theme;
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ theme, icon, label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1,
      mb: 1,
      boxShadow:
        theme.palette.mode === "light"
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "0 4px 20px rgba(255,255,255,0.1)",
      backgroundColor: alpha(theme.palette.background.default, 0.6),
      "&:hover": {
        backgroundColor: alpha(theme.palette.background.default, 1),
        transform: "translateX(5px)",
        transition: "all 0.3s ease-in-out",
      },
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="start">
      <Box mr={2} color="primary.main">
        {icon}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <Typography
          variant="caption"
          align="left"
          color="textSecondary"
          fontWeight={500}
        >
          {label}
        </Typography>
        <Typography variant="body2" align="left" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default function DeletionModal({ id }: { id: string }) {
  const theme = useTheme();
  const { productData, productId } = useSelector(
    (state: RootState) => state.product
  );
  const { currentCompany } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      dispatch(viewProduct({ product_id: id, company_id: currentCompany?._id ?? '' }));
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [id, productId, dispatch, currentCompany?._id]);

  const handleDelete = () => {
    toast.promise(
      dispatch(deleteProduct({ id: id ?? "", company_id: currentCompany?._id ?? '' }))
        .unwrap()
        .then(() => {
          dispatch(setProductId({ productId: "" }));
          navigate(`/products`);
        }),
      {
        loading: "Deleting product data ...",
        success: <b>Product Deleted!</b>,
        error: <b>Could not Delete.</b>,
      }
    );
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: "0",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
        backgroundColor: "transparent",
        zIndex: 9999,
        overflow: "hidden",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          background: `transparent`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          zIndex: -1,
        },
      }}
    >
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        sx={{
          color: "#000",
          zIndex: 4,
          borderRadius: 1,
          maxWidth: "900px",
          height: "600px",
          overflowY: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          textAlign: "center",
          margin: "auto",
          border: `1px solid hsl(220, 20%, 80%)`,
          background: "hsl(0, 0%, 100%)",
          boxShadow:
            "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
          position: "relative",
        }}
      >
        <Card
          elevation={8}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, alpha(${theme.palette.background.default}, 0.6) 100%)`,
            borderRadius: 1,
            overflow: "hidden",
            width: "100%",
            margin: 0,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "100px",
              borderRadius: 1,
              backgroundColor: theme.palette.primary.main,
              backgroundImage: `linear-gradient(135deg,${theme.palette.info.dark} 0%, ${theme.palette.info.light} 100%)`,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40px",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translate(-50%, 0)",
              zIndex: "100",
            }}
          >
            <Typography variant="h4">Delete Product</Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 30,
              right: 30,
              zIndex: "100",
              cursor: "pointer",
            }}
            onClick={() => {
              dispatch(setProductId({ productId: "" }));
            }}
          >
            <CloseIcon
              sx={{
                fontSize: "1.5rem",
                transition: "all .2s ease-in-out",
                ":hover": {
                  transform: "scale(1.5)",
                },
              }}
            />
          </Box>

          <CardContent sx={{ mt: -10, position: "relative" }}>
            <Grid container spacing={4}>
              {/* Profile Section */}
              <Grid item xs={12} md={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.7
                    ),
                    borderRadius: 1,
                    p: 3,
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 4px 20px rgba(0,0,0,0.1)"
                        : "0 4px 20px rgba(255,255,255,0.1)",
                    height: "100%",
                  }}
                >
                  <Box position="relative">
                    <Avatar
                      src={"image"}
                      alt={productData?.product_name}
                      sx={{
                        width: 150,
                        height: 150,
                        border: "5px solid white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ mt: 2, fontWeight: 700 }}
                  >
                    {productData?.product_name}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Chip
                      label={productData?.category}
                      color="primary"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        py: 2,
                        px: 1,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Contact and Business Information */}
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.6
                    ),
                    borderRadius: 1,
                    p: 2,
                    boxShadow:
                      theme.palette.mode === "light"
                        ? "0 4px 20px rgba(0,0,0,0.1)"
                        : "0 4px 20px rgba(255,255,255,0.1)",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Product Information
                    </Typography>
                  </Box>

                  <InfoRow
                    theme={theme}
                    icon={<QuantityIcon />}
                    label="No of tablets per Pack"
                    value={
                      (productData?.opening_quantity ?? '').toString() || "N/A"
                    }
                  />
                  <InfoRow
                    theme={theme}
                    icon={<CurrencyIcon />}
                    label="Price"
                    value={productData?.selling_price.toString() || "N/A"}
                  />
                  {/* <InfoRow
                    theme={theme}
                    icon={<TodayIcon />}
                    label="Expiry Date"
                    value={productData?.expiry_date || "N/A"}
                  /> */}
                  {/* <InfoRow
                    theme={theme}
                    icon={<StateIcon />}
                    label="State of Product"
                    value={productData?.state || "N/A"}
                  /> */}

                  <InfoRow
                    theme={theme}
                    icon={<DescriptionIcon />}
                    label="Description"
                    value={productData?.description ?? ""}
                  />
                  {/* <InfoRow
                    theme={theme}
                    icon={<WarehouseIcon />}
                    label="Storage Requirement"
                    value={productData?.storage_requirement || "N/A"}
                  /> */}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              columnGap: "30px",
              width: "70%",
              margin: "auto",
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
              onClick={() => {
                handleDelete();
              }}
            >
              Delete
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
              onClick={() => {
                dispatch(setProductId({ productId: "" }));
              }}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
