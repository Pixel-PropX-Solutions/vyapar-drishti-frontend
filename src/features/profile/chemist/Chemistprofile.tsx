import React, { useCallback, useEffect, useState } from "react";
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
  TableCell,
  TableHead,
  TableContainer,
  TableBody,
  TableRow,
  Table,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Store as StoreIcon,
  FileCopy as LicenceIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Name, OrderStatus } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ChemistEdit from "./ChemistEdit";
import { getChemistProfile } from "@/services/chemist";
import { useParams } from "react-router-dom";
import { viewOrders } from "@/services/order";
import { formatDate, getStatusColor } from "@/utils/functions";

const ChemistProfile: React.FC = () => {
  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);
  const { chemist } = useSelector((state: RootState) => state.chemist);
  const { orderData } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { chemistId } = useParams();
  // Helper functions
  const theme = useTheme();
  const getFullName = (name: Name): string => {
    return `${name.first_name} ${name.middle_name ? name.middle_name + " " : ""
      }${name.last_name}`;
  };

  useEffect(() => {
    if (chemistId) {
      dispatch(getChemistProfile(chemistId));
    }
  }, [dispatch, chemistId]);

  useEffect(() => {
    if (chemist) {
      dispatch(viewOrders(chemist?.ChemistData?._id))
    }
  }, [chemist, dispatch])

  // Handle pagination
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    console.log(event)
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  if (!chemist) {
    return <p>Chemist profile not found</p>;
  }

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
            <Typography variant="h5" fontWeight="bold">
              Chemist Details
            </Typography>
            {/* Edit Details Button */}
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

          <Box sx={{ py: 2 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
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
                        {chemist.ChemistData.name.first_name.charAt(0)}
                        {chemist.ChemistData.name.last_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {getFullName(chemist.ChemistData.name)}
                        </Typography>
                        <Chip
                          size="small"
                          label={chemist.role}
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
                          {chemist.email}
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
                          {'chemist.ChemistData.phone_number.country_code'}{" "}
                          {'chemist.ChemistData.phone_number.phone_number'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pharmacy Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color={theme.palette.primary.main}
                    >
                      Pharmacy Information
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Shop Name
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
                        {chemist.ChemistData.shop_name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        License Number
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <LicenceIcon
                          fontSize="small"
                          sx={{ mr: 1, color: theme.palette.primary.main }}
                        />
                        {chemist.ChemistData.licence_number}
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
                          {chemist.ChemistData.address.street_address}
                          {chemist.ChemistData.address
                            .street_address_line_2 && (
                              <>
                                ,{" "}
                                {
                                  chemist.ChemistData.address
                                    .street_address_line_2
                                }
                              </>
                            )}
                          <br />
                          {chemist.ChemistData.address.city},{" "}
                          {chemist.ChemistData.address.state} -{" "}
                          {chemist.ChemistData.address.zip_code}
                        </>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3, mt: 1 }} />

          <Box>
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
              <Typography variant="h5" fontWeight="bold">
                Chemists Orders Summary
              </Typography>
            </Box>

            {/* Orders Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3, mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '2px solid', borderColor: 'success.light', }}>
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="text.secondary">Total Orders  </Typography>
                      <Typography variant="h4">{orderData.length}</Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '2px solid', borderColor: 'warning.light', }}>
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="text.secondary">Pending Orders</Typography>
                      <Typography variant="h4">
                        {orderData.filter(order => order.status === OrderStatus.PENDING).length}
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ border: '2px solid', borderColor: 'info.light' }}>
                  <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="text.secondary">Shipped Orders</Typography>
                      <Typography variant="h4">
                        {orderData.filter(order => order.status === OrderStatus.SHIPPED).length}
                      </Typography>
                    </Grid>

                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Orders Table */}
            <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="orders table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr. No.</TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Stockist</TableCell>
                      <TableCell>Chemist</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total Amount(₹)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData.length > 0 ? (
                      orderData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((order, index) => (
                          <TableRow
                            key={order._id}
                            hover
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center" }}
                              >
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {order._id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {getFullName(order.Stockist.name)}
                            </TableCell>
                            <TableCell>
                              {chemist?.ChemistData ? getFullName(chemist?.ChemistData.name) : 'N/A'}
                            </TableCell>
                            <TableCell>{formatDate(order.order_date)}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                color={getStatusColor(order.status) as "warning" | "success" | "error" | "default"}
                                size="medium"
                                sx={{ fontWeight: 'medium' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="medium">
                                ₹ {order.total_amount.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Paper sx={{ p: 0, mt: 0, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {/* <Box sx={{
                                    bgcolor: 'primary.light',
                                    borderRadius: '50%',
                                    p: 2,
                                    mb: 2
                                  }}>
                                    <Add sx={{ fontSize: 40, color: 'primary.main' }} />
                                  </Box> */}
                              <Typography variant="h5" gutterBottom>
                                No Orders Yet
                              </Typography>
                              <Typography variant="body1" color="text.secondary" paragraph>
                                User haven't created any orders yet.
                              </Typography>
                            </Box>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={orderData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
                sx={{ borderTop: 1, borderColor: 'divider' }}
              />
            </Paper>
          </Box>
        </>
      ) : (
        <ChemistEdit
          chemist={chemist}
          onClose={() => setOpenEditProfileModal(false)}
        />
      )}
    </Box>
  );
};

export default ChemistProfile;
