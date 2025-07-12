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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCustomer } from "@/services/customers";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, getInitials } from "@/utils/functions";
import { ActionButton } from "@/common/ActionButton";
import { setEditingCustomer } from "@/store/reducers/customersReducer";

const CustomerProfile: React.FC = () => {
    const { customer } = useSelector((state: RootState) => state.customersLedger);
    console.log("Customer in CustomerProfile", customer);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const { customer_id } = useParams();
    const theme = useTheme();

    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer(customer_id));
        }
    }, [dispatch, customer_id]);

    // useEffect(() => {
    //     if (chemist) {
    //         dispatch(viewOrders(chemist?.ChemistData?._id))
    //     }
    // }, [chemist, dispatch])

    // Handle pagination
    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    if (!customer) {
        return <p>Customer Profile not found</p>;
    }

    return (
        <Box
            sx={{
                px: 3,
                marginTop: "2rem",
                width: "100%",
            }}
        >
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
                <Box sx={{ display: "flex", alignItems: "center", }}>
                    <Avatar
                        sx={{
                            mr: 2,
                            width: 64,
                            height: 64,
                            // bgcolor: theme.palette.primary.main,
                        }}
                    >
                        {getInitials(customer.ledger_name)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {customer.ledger_name}
                        </Typography>
                        <Chip
                            size="small"
                            label={customer.parent}
                            style={{
                                color: theme.palette.primary.main,
                            }}
                        />
                    </Box>
                </Box>
                {/* Edit Details Button */}
                <ActionButton
                    variant="contained"
                    startIcon={<EditIcon />}
                    color="success"
                    onClick={() => {
                        dispatch(setEditingCustomer(customer));
                        navigate(`/customers/edit/${customer.parent.toLowerCase()}`);
                    }}
                    sx={{
                        background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                        '&:hover': {
                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                            background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                        },
                    }}
                >
                    Edit {customer.ledger_name}
                </ActionButton>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box>
                {/* Customer Summary Cards */}
                <Grid container sx={{ mb: 3, mt: 1, justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={2.5}>
                        <Card sx={{ border: '2px solid', borderColor: 'success.light', }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Total Bills  </Typography>
                                    <Typography variant="h4">{'orderData'.length}</Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={2.5}>
                        <Card sx={{ border: '2px solid', borderColor: 'warning.light', }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Total Amount</Typography>
                                    <Typography variant="h4">{'orderData'.length}</Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={2.5}>
                        <Card sx={{ border: '2px solid', borderColor: 'warning.light', }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Remaining Amount</Typography>
                                    <Typography variant="h4">{'orderData'.length}</Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={2.5}>
                        <Card sx={{ border: '2px solid', borderColor: 'info.light' }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Colleted Amount</Typography>
                                    <Typography variant="h4">{'orderData'.length}</Typography>
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
                                    <TableCell align="right">Total Amount(&#8377;)</TableCell>
                                </TableRow>
                            </TableHead>
                            {/*  <TableBody>
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
                                                        &#8377; {order.total_amount.toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                                            <Paper sx={{ p: 0, mt: 0, textAlign: 'center' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                     <Box sx={{
                                    bgcolor: 'primary.light',
                                    borderRadius: '50%',
                                    p: 2,
                                    mb: 2
                                  }}>
                                    <Add sx={{ fontSize: 40, color: 'primary.main' }} />
                                  </Box> 
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
                            </TableBody> */}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={4}
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
        </Box>
    );
};

export default CustomerProfile;
