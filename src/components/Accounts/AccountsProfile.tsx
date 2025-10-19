import React, { useCallback, useEffect, useState } from "react";
import {
    Typography,
    Box,
    Grid,
    Avatar,
    Chip,
    useTheme,
    TableCell,
    TableHead,
    TableContainer,
    TableRow,
    Table,
    Paper,
    alpha,
    TableBody,
    TableSortLabel,
    Tooltip,
    Button,
    FormControl,
    InputAdornment,
    MenuItem,
    TextField,
    Card,
    CardContent,
    Checkbox,
} from "@mui/material";
import {
    ArrowBack,
    FilterListOutlined,
    PeopleAlt,
    RefreshOutlined,
    SearchOutlined,
    Today,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAccount, getCustomerInvoices } from "@/services/customers";
import { useNavigate, useParams } from "react-router-dom";
import { formatLocalDate, getInitials } from "@/utils/functions";
import { ActionButton } from "@/common/buttons/ActionButton";
import { setCustomersFilters } from "@/store/reducers/customersReducer";
import { SortOrder } from "@/utils/types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BottomPagination } from "@/common/modals/BottomPagination";
import { CustomerInvoicesRowSkeleton } from "@/common/skeletons/CustomerInvoicesRowSkeleton";
import { AccountsInvoiceRow } from "./AccountsInvoiceRow";

const AccountsProfile: React.FC = () => {
    const { account, loading, customerInvoices, customerInvoicesMeta } = useSelector((state: RootState) => state.customersLedger);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { account_id } = useParams();
    const theme = useTheme();
    const { searchQuery, page, rowsPerPage, startDate, endDate, type, sortField, sortOrder } = useSelector((state: RootState) => state.customersLedger.customersFilters);

    const [debouncedQuery, setDebouncedQuery] = useState("");

    const fetchCustomersInvoices = useCallback(async () => {
        dispatch(getCustomerInvoices({
            searchQuery: debouncedQuery,
            company_id: currentCompanyId || "",
            customer_id: account_id || "",
            pageNumber: page,
            type,
            limit: rowsPerPage,
            sortField,
            sortOrder,
            start_date: formatLocalDate(startDate),
            end_date: formatLocalDate(endDate),
        }));
    }, [currentCompanyId, account_id, dispatch, endDate, page, rowsPerPage, debouncedQuery, sortField, sortOrder, startDate, type]);

    useEffect(() => {
        if (account_id) {
            dispatch(getAccount({
                id: account_id, start_date: formatLocalDate(startDate),
                end_date: formatLocalDate(endDate),
            }));
        }
    }, [dispatch, account_id, startDate, endDate]);

    useEffect(() => {
        fetchCustomersInvoices();
    }, []);

    // Debounce logic: delay setting the debouncedQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Fetch customers when debouncedQuery or other filters change
    useEffect(() => {
        fetchCustomersInvoices();
    }, [currentCompanyId, account_id, dispatch, endDate, page, rowsPerPage, debouncedQuery, sortField, sortOrder, startDate, type, fetchCustomersInvoices]);

    // Handle sorting change
    const handleSortRequest = (field: string) => {
        const isAsc = sortField === field && sortOrder === "asc";
        dispatch(setCustomersFilters({
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field
        }))
    };

    // Handle pagination change
    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {

        dispatch(setCustomersFilters({
            page: newPage
        }))
    };


    // managing searchQuery, filterState, page, rowsPerPage
    const handleStateChange = (field: string, value: string | number) => {
        dispatch(setCustomersFilters({
            [field]: value
        }))
    };

    // Reset filters
    const handleResetFilters = useCallback(() => {
        dispatch(setCustomersFilters({
            searchQuery: "",
            type: "all",
            page: 1,
            startDate: (new Date(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
            endDate: (new Date()).toISOString(),
            rowsPerPage: 10,
            sortField: "created_at",
            sortOrder: "desc" as SortOrder,
        }));
    }, []);

    if (!account) {
        return <p>Customer Profile not found</p>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    px: 3,
                    marginTop: "2rem",
                    width: "100%",
                }}
            >
                {/* Component Title and Action Button */}
                <Card sx={{ mb: 3, p: 2, }}>
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
                            <Grid item sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <ActionButton
                                    icon={<ArrowBack fontSize="small" />}
                                    title="Back"
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                />
                                <Avatar
                                    sx={{
                                        mx: 2,
                                        width: 48,
                                        height: 48,
                                        // bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    {getInitials(account.ledger_name)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        {account.ledger_name}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={account.parent}
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* <Grid
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <ActionButtonSuccess
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        dispatch(setEditingCustomer(account));
                                        navigate(`/customers/edit/${account.parent.toLowerCase()}`);
                                    }}
                                    text={`Edit ${account.ledger_name}`}
                                />
                            </Grid> */}
                        </Paper>
                    </CardContent>
                </Card>

                {/* Search and Filter Controls */}
                <Box sx={{ display: "flex", my: 3, gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        sx={{ flexGrow: 1, minWidth: "250px" }}
                        variant="outlined"
                        size="small"
                        label='Search'
                        placeholder="Search by name, type..."
                        value={searchQuery}
                        onChange={(e) => handleStateChange("searchQuery", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <DatePicker
                        label="Start Date"
                        value={new Date(startDate)}
                        format="dd/MM/yyyy"
                        views={["year", "month", "day"]}
                        onChange={(newValue) => handleStateChange("startDate", newValue ? newValue.toISOString() : "")}
                        slotProps={{
                            textField: {

                                size: "small",
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        width: "150px",
                                        borderRadius: '8px'
                                    },
                                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                        border: 'none',
                                        boxShadow: 'none'
                                    }
                                }
                            },
                        }}
                    />
                    <DatePicker
                        label="End Date"
                        value={new Date(endDate)}
                        format="dd/MM/yyyy"
                        views={["year", "month", "day"]}
                        onChange={(newValue) => handleStateChange("endDate", newValue ? newValue.toISOString() : "")}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        width: "150px",
                                    },
                                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                        border: 'none',
                                        boxShadow: 'none'
                                    }
                                }
                            },
                        }}
                    />

                    <FormControl sx={{ minWidth: "150px" }}>
                        <TextField
                            select
                            size="small"
                            value={type}
                            label="Filter by invoice Types"
                            placeholder="Filter by invoice Types"
                            onChange={(e) => handleStateChange("type", e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem selected value="all">
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value={'Sales'}>
                                Sales
                            </MenuItem>
                            <MenuItem value={'Purchase'}>
                                Purchase
                            </MenuItem>
                            <MenuItem value={'Payment'}>
                                Payment
                            </MenuItem>
                            <MenuItem value={'Receipt'}>
                                Receipt
                            </MenuItem>
                        </TextField>
                    </FormControl>

                    <FormControl>
                        <TextField
                            select
                            size="small"
                            value={rowsPerPage.toString()}
                            label="Show"
                            onChange={(e) => {
                                handleStateChange("rowsPerPage", parseInt(e.target.value, 10));
                                handleStateChange("page", 1);
                            }}
                        >
                            {[10, 15, 20].map((option) => (
                                <MenuItem key={option} value={option.toString()}>
                                    {option} rows
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <Button
                        variant="outlined"
                        color="primary"
                        size='medium'
                        startIcon={<RefreshOutlined />}
                        onClick={handleResetFilters}
                        sx={{ fontWeight: 'bold', py: 1.5 }}
                    >
                        Reset Filters
                    </Button>
                </Box>

                {/* Customer Invoices Table */}
                <TableContainer component={Paper}
                    elevation={0}
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                        boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                        // overflow: 'hidden',
                    }}>
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[50], 0.8),
                                    width: '100%',
                                    '& .MuiTableCell-head': {
                                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    },
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}>
                                {/* Select Check Box */}
                                <TableCell align="left" sx={{ px: 1, }}>
                                    <Checkbox
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < customerInvoices.length}
                                        checked={customerInvoices.length > 0 && selectedIds.length === customerInvoices.length}
                                        onChange={(_, checked) => {
                                            if (checked) {
                                                setSelectedIds(customerInvoices.map((inv) => inv.vouchar_id));
                                            } else {
                                                setSelectedIds([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ pl: 3, pr: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                        Sr. No.
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by State" arrow>
                                        <TableSortLabel
                                            active={sortField === "state"}
                                            direction={sortField === "state" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("state")}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <Today fontSize="small" />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                    Invoice Date
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Name">
                                        <TableSortLabel
                                            active={sortField === "name"}
                                            direction={sortField === "name" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("name")}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                Particulars
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Item Quantity" arrow>
                                        <TableSortLabel
                                            active={sortField === "name"}
                                            direction={sortField === "name" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("name")}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                {/* <Contacts fontSize="small" /> */}
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                    Invoice Type
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Item Quantity" arrow>
                                        <TableSortLabel
                                            active={sortField === "name"}
                                            direction={sortField === "name" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("name")}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                {/* <Contacts fontSize="small" /> */}
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                    Payment Status
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by State" arrow>
                                        <TableSortLabel
                                            active={sortField === "state"}
                                            direction={sortField === "state" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("state")}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                {/* <LocationOn fontSize="small" /> */}
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                    Invoice No.
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="right" sx={{ px: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                        Debit
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ px: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                        Credit
                                    </Typography>
                                </TableCell>


                                {/* <TableCell align="center" >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                        Actions
                                    </Typography>
                                </TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <CustomerInvoicesRowSkeleton key={`skeleton-${index}`} />)
                            ) : customerInvoices?.length > 0 ? (
                                customerInvoices?.map((inv, index) => (
                                    <AccountsInvoiceRow
                                        key={`${inv.vouchar_id}-${index}`}
                                        inv={inv}
                                        selected={selectedIds.includes(inv.vouchar_id)}
                                        onSelect={(checked: boolean) => {
                                            setSelectedIds((prev) =>
                                                checked ? [...prev, inv.vouchar_id] : prev.filter((id) => id !== inv.vouchar_id)
                                            );
                                        }}
                                        index={index + 1 + (page - 1) * rowsPerPage}
                                        onView={() => {
                                            navigate(`/invoices/${inv.vouchar_id}`);
                                        }}
                                    // onEdit={() => {
                                    //     navigate(`/invoices/update/${inv.voucher_type.toLowerCase()}/${inv.vouchar_id}`);
                                    // }}
                                    // onDelete={() => {
                                    //     handleDeleteInvoice(inv.vouchar_id);
                                    // }}
                                    />))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <PeopleAlt sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                There are no invoices for this account in the current month.
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                You can create a new invoice from the invoices page.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <CustomerInvoicesRowSkeleton key={`skeleton1-${index}`} />)
                            ) : customerInvoices?.length > 0 && (
                                <>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                            bgcolor: alpha(theme.palette.grey[50], 0.8),
                                        },
                                    }}>
                                        <TableCell colSpan={9}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                        <TableCell colSpan={6} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                        <TableCell colSpan={1} sx={{ textAlign: "left", }}>
                                            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                                                Opening Balance
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {account.opening_balance > 0 && <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.success.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>}
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main, }}>
                                                    {account.opening_balance > 0 ? Math.abs(account.opening_balance) : ''}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {!(account.opening_balance > 0) && <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.error.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>}
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.error.main, }}>
                                                    {account.opening_balance > 0 ? '' : Math.abs(account.opening_balance)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                        <TableCell colSpan={6} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                        <TableCell colSpan={1} sx={{ textAlign: "left", }}>
                                            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
                                                Current Total
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.success.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main, }}>
                                                    {Math.abs(account.total_credit)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.error.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.error.main, }}>
                                                    {Math.abs(account.total_debit)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                        <TableCell colSpan={6} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                        <TableCell colSpan={1} sx={{ textAlign: "left", }}>
                                            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600, textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                                                Closing Balance
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {account.closing_balance > 0 && <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.success.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>}
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main, }}>
                                                    {account.closing_balance > 0 ? Math.abs(account.closing_balance) : ''}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {!(account.closing_balance > 0) && <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.error.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>}
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.error.main, }}>
                                                    {account.closing_balance > 0 ? '' : Math.abs(account.closing_balance)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <BottomPagination
                    total={customerInvoicesMeta?.total || 0}
                    item="invoices"
                    page={page}
                    metaPage={customerInvoicesMeta?.page || 1}
                    rowsPerPage={rowsPerPage}
                    onChange={handleChangePage}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default AccountsProfile;
