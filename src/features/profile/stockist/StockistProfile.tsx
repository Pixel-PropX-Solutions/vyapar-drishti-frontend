import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Store as StoreIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Name } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import StockistEdit from "./StockistEdit";
import { getStockistProfile } from "@/services/stockist";
import { useParams } from "react-router-dom";

const StockistProfile: React.FC = () => {
  // Helper functions

  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);
  const { stockist } = useSelector((state: RootState) => state.stockist);

  const dispatch = useDispatch<AppDispatch>();
  const { stockistId } = useParams();
  const theme = useTheme();
  const getFullName = (name: Name): string => {
    return `${name.first_name} ${
      name.middle_name ? name.middle_name + " " : ""
    }${name.last_name}`;
  };

  useEffect(() => {
    if (stockistId) {
      dispatch(getStockistProfile(stockistId));
    }
  }, [dispatch, stockistId]);

  if (!stockist) return <p>Stockist detail not found</p>;

  return (
    <Box
      sx={{
        px: 3,
        marginTop: "2rem",
        width: "100%",
      }}
    >
      {!openEditProfileModal ? (
        <>
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              padding: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6">Stockist Details</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => setOpenEditProfileModal(true)}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
              >
                Edit Details
              </Button>
            </Box>
          </Box>

          <Box sx={{ py: 3 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color={theme.palette.primary.main}
                    >
                      Personal Information
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {stockist.StockistData.name.first_name.charAt(0)}
                        {stockist.StockistData.name.last_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {getFullName(stockist.StockistData.name)}
                        </Typography>
                        <Chip
                          size="small"
                          label={stockist.role}
                          style={{
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ "& > div": { mb: 2 } }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          gutterBottom
                        >
                          Email Address
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <EmailIcon
                            fontSize="small"
                            sx={{ mr: 1, color: theme.palette.primary.main }}
                          />
                          {stockist.email}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          gutterBottom
                        >
                          Phone Number
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <PhoneIcon
                            fontSize="small"
                            sx={{ mr: 1, color: theme.palette.primary.main }}
                          />
                          {'stockist.StockistData.phone_number.country_code'}{" "}
                          {'stockist.StockistData.phone_number.phone_number'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Distribution information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color={theme.palette.primary.main}
                    >
                      Distribution information
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Company Name
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 500,
                        }}
                      >
                        <StoreIcon
                          fontSize="small"
                          sx={{ mr: 1, color: theme.palette.primary.main }}
                        />
                        {stockist.StockistData.company_name}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Complete Address
                      </Typography>
                      <Typography variant="body2" sx={{ display: "flex" }}>
                        <LocationIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            mt: 0.3,
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                          }}
                        />
                        <>
                          {stockist.StockistData.address.street_address}
                          {stockist.StockistData.address
                            .street_address_line_2 && (
                            <>
                              ,{" "}
                              {
                                stockist.StockistData.address
                                  .street_address_line_2
                              }
                            </>
                          )}
                          <br />
                          {stockist.StockistData.address.city},{" "}
                          {stockist.StockistData.address.state} -{" "}
                          {stockist.StockistData.address.zip_code}
                        </>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <StockistEdit
          stockist={stockist}
          onClose={() => setOpenEditProfileModal(false)}
        />
      )}
    </Box>
  );
};

export default StockistProfile;
