import React, { useState, useEffect, useCallback } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Tooltip,
    TableSortLabel,
    FormControl,
    MenuItem,
    alpha,
    useTheme,
    Button,
    Grid,
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    RefreshOutlined,
    PeopleAlt,
    Today,
    AddCircleOutline,
} from "@mui/icons-material";
import { CustomerSortField, SortOrder, GetUserLedgers } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { deleteCustomer, viewAllCustomer, viewAllCustomerWithTypes } from "@/services/customers";
import { CustomerRowSkeleton } from "@/common/skeletons/CustomerRowSkeleton";
import { viewAllAccountingGroups } from "@/services/accountingGroup";
import { setCustomerTypeId, setEditingCustomer } from "@/store/reducers/customersReducer";
import toast from "react-hot-toast";
import { BottomPagination } from "@/common/modals/BottomPagination";
import { getAllInvoiceGroups } from "@/services/invoice";
import ActionButtonSuccess from "@/common/buttons/ActionButtonSuccess";
import ActionButtonCancel from "@/common/buttons/ActionButtonCancel";
import { AccountsRow } from "@/components/Accounts/AccountsRow";
import PageHeader from "@/common/Headers/PageHeader";

const Accounts: React.FC = () => {
    const { customers, pageMeta, loading } = useSelector((state: RootState) => state.customersLedger);
    const { accountingGroups } = useSelector((state: RootState) => state.accountingGroup);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [state, setState] = useState({
        searchQuery: "",
        filterState: "All-States",
        is_deleted: false,
        type: "Accounts",
        page: 1,
        rowsPerPage: 10,
        sortField: "created_at" as CustomerSortField,
        sortOrder: "asc" as SortOrder,
    });

    const { searchQuery, filterState, page, is_deleted, rowsPerPage, type, sortField, sortOrder } = state;

    const fetchCustomers = useCallback(async () => {
        dispatch(
            viewAllCustomer({
                searchQuery: searchQuery,
                filterState: filterState,
                company_id: currentCompanyId || "",
                type: type,
                is_deleted: is_deleted,
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortField,
                sortOrder: sortOrder,
            })
        )
    }, [dispatch, searchQuery, filterState, type, currentCompanyId, is_deleted, page, rowsPerPage, sortField, sortOrder]);

    useEffect(() => {
        fetchCustomers();
        dispatch(getAllInvoiceGroups(currentCompanyId || ""));
        dispatch(viewAllCustomerWithTypes({ company_id: currentCompanyId, customerTypes: ["Bank Accounts", "Cash-in-Hand"] }))
    }, []);


    // Debounce logic: delay setting the debouncedQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // wait 500ms after last keystroke

        return () => {
            clearTimeout(handler); // cancel timeout if query changes before 500ms
        };
    }, [searchQuery]);

    // Fetch stockists data from API
    useEffect(() => {
        fetchCustomers();
    }, [debouncedQuery, page, rowsPerPage, is_deleted, sortField, filterState, sortOrder, dispatch, fetchCustomers]);

    useEffect(() => {
        dispatch(viewAllAccountingGroups(currentCompanyId || ""));
    }, [currentCompanyId, dispatch])


    // Handle sorting change
    const handleSortRequest = (field: CustomerSortField) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setState((prevState) => ({
            ...prevState,
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field
        }))
    };

    // Handle pagination change
    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        setState((prevState) => ({
            ...prevState,
            page: newPage
        }))
    };

    // Reset filters
    const handleResetFilters = useCallback(() => {
        setState({
            searchQuery: "",
            filterState: "All-States",
            is_deleted: false,
            type: "Accounts",
            page: 1,
            rowsPerPage: 10,
            sortField: "created_at" as CustomerSortField,
            sortOrder: "asc" as SortOrder,
        });
    }, []);


    // managing searchQuery, filterState, page, rowsPerPage
    const handleStateChange = (field: string, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    }

    // Handle view stockist details
    const handleViewCustomer = (cus: GetUserLedgers) => {
        navigate(`/accounts/${cus._id}`)
    };

    const filteredCustomers = customers;

    return (
        <Box sx={{ p: 3, width: "100%" }}>
            {/* Page Title */}
            <PageHeader
                title="Accounts Directory"
                subtitle="Manage your accounts, view their details, and perform actions like adding, editing, or deleting accounts."
            />

            {/* Search and Filter Controls */}
            <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
                <TextField
                    sx={{ flexGrow: 1, minWidth: "250px" }}
                    variant="outlined"
                    size="small"
                    placeholder="Search by name, city, or email..."
                    value={searchQuery}
                    onChange={(e) => handleStateChange("searchQuery", e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl sx={{ minWidth: "150px" }}>
                    <TextField
                        select
                        size="small"
                        value={filterState}
                        label="Filter by State"
                        placeholder="Filter by State"
                        onChange={(e) => handleStateChange("filterState", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterIcon />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem selected value="All-States">
                            <em>All States</em>
                        </MenuItem>
                        {pageMeta.unique?.map((state) => (
                            <MenuItem key={state} value={state}>
                                {state}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>

                <FormControl sx={{ minWidth: "150px" }}>
                    <TextField
                        select
                        size="small"
                        value={type}
                        label="Filter by Type"
                        placeholder="Filter by Type"
                        onChange={(e) => handleStateChange("type", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterIcon />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem selected value="Customers">
                            <em>All Types</em>
                        </MenuItem>
                        <MenuItem value="Debtors">
                            Debtors
                        </MenuItem>
                        <MenuItem value="Creditors">
                            Creditors
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

            {/* Customers Table */}
            <TableContainer component={Paper}
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                    boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: alpha(theme.palette.grey[50], 0.8),
                                width: '100%',
                                "& .MuiTableCell-root": {
                                    padding: '8px 16px',
                                },
                                '& .MuiTableCell-head': {
                                    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                }
                            }}>

                            <TableCell align="left" sx={{ px: 1 }}>
                                <Tooltip title="Sort by Date" arrow>
                                    <TableSortLabel
                                        active={sortField === "created_at"}
                                        direction={sortField === "created_at" ? sortOrder : "asc"}
                                        onClick={() => handleSortRequest("created_at")}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                                            <Today fontSize="small" />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                Created on
                                            </Typography>
                                        </Box>
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>

                            <TableCell sx={{ pl: 3, pr: 1 }}>
                                <Tooltip title="Sort by Name">
                                    <TableSortLabel
                                        active={sortField === "name"}
                                        direction={sortField === "name" ? sortOrder : "asc"}
                                        onClick={() => handleSortRequest("name")}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                            Account Information
                                        </Typography>
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>

                            {/* Account Name */}
                            <TableCell align="center" sx={{ px: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                    Account Name
                                </Typography>
                            </TableCell>

                            {/* Account Number */}
                            <TableCell align="center" sx={{ px: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                    Account Number
                                </Typography>
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


                            <TableCell align="right" sx={{ pr: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array([1, 2, 3, 4, 5])
                                .map((_, index) => <CustomerRowSkeleton key={`skeleton-${index}`} />)
                        ) : filteredCustomers?.length > 0 ? (
                            filteredCustomers.map((cred, index) => {
                                return (
                                    <AccountsRow
                                        key={cred._id}
                                        cus={cred}
                                        index={index + 1 + (page - 1) * rowsPerPage}
                                        onView={() => handleViewCustomer(cred)}
                                        onEdit={() => {
                                            dispatch(setEditingCustomer(cred));
                                            navigate(`/accounts/edit/${cred.parent.toLowerCase()}`);
                                        }}
                                        onDelete={async () => {
                                            await dispatch(deleteCustomer(cred._id)).unwrap().then(() => {
                                                dispatch(setEditingCustomer(null));
                                                fetchCustomers();
                                                toast.success(`${cred.ledger_name} deleted successfully.`);
                                            }).catch((error) => {
                                                toast.error(error || "An unexpected error occurred while deleting the customer.");
                                                console.error("Failed to delete customer:", error);
                                            });
                                        }}

                                    />
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <PeopleAlt sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            No accounts found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try adjusting your search or filter criteria, or add your first account
                                        </Typography>
                                        <Grid
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                <ActionButtonSuccess
                                                    startIcon={<AddCircleOutline />}
                                                    onClick={() => {
                                                        if (!currentCompanyDetails?._id) {
                                                            toast.error('Please create a company first.');
                                                            return;
                                                        }
                                                        navigate('/customers/create/debtors');
                                                        dispatch(setCustomerTypeId(accountingGroups.find((group) => group.name.includes('Debtors'))?._id || ''))
                                                    }}
                                                    text='Add Debtors'
                                                />

                                                <ActionButtonCancel
                                                    startIcon={<AddCircleOutline />}
                                                    onClick={() => {
                                                        if (!currentCompanyDetails?._id) {
                                                            toast.error('Please create a company first.');
                                                            return;
                                                        }
                                                        navigate('/customers/create/creditors');
                                                        dispatch(setCustomerTypeId(accountingGroups.find((group) => group.name.includes('Creditors'))?._id || ''))
                                                    }}
                                                    text='Add Creditors'
                                                />

                                            </Box>
                                        </Grid>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>

            </TableContainer>

            {/* Pagination Controls */}
            <BottomPagination
                total={pageMeta.total}
                item="accounts"
                page={page}
                metaPage={pageMeta.page}
                rowsPerPage={rowsPerPage}
                onChange={handleChangePage}
            />
        </Box >
    );
};

export default Accounts;