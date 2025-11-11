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
    // Grid,
    Checkbox,
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    RefreshOutlined,
    PeopleAlt,
    Today,
} from "@mui/icons-material";
import { SortOrder, GetAllVouchars, InvoicesSortField } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { deleteInvoice, getTaxInvoicesPDF, getInvoicesPDF, getPaymentPdf, getRecieptPdf, viewAllInvoicesParentType } from "@/services/invoice";
import { InvoicerRow } from "@/components/Invoice/InvoiceRow";
import { getAllInvoiceGroups } from "@/services/invoice";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InvoicesRowSkeleton } from "@/common/skeletons/InvoicesRowSkeleton";
import { setInvoicesFilters } from "@/store/reducers/invoiceReducer";
import toast from "react-hot-toast";
import { BottomPagination } from "@/common/modals/BottomPagination";
import { formatLocalDate } from "@/utils/functions";
import usePDFHandler from "@/common/hooks/usePDFHandler";
import PageHeader from "@/common/Headers/PageHeader";
import { CategoriesModal } from "@/common/modals/SideModal";
import { createCustomer, deleteCustomer, updateCustomerDetails, viewAllCustomerWithType } from "@/services/customers";

interface Category {
    _id: string,
    ledger_name: string,
    parent: string,
    total_amount: number,
}

const Expenses: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [direct, setDirect] = useState<Category[]>();
    const [directModal, setDirectModal] = useState<boolean>(false);
    const [indirect, setIndirect] = useState<Category[]>();
    const [indirectModal, setIndirectModal] = useState<boolean>(false);
    const { expenses, loading, expensePageMeta } = useSelector((state: RootState) => state.invoice);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
    const { searchQuery, filterState, page, rowsPerPage, startDate, endDate, type, sortField, sortOrder } = useSelector((state: RootState) => state.invoice.invoicesFilters);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    const fetchInvoices = useCallback(async () => {
        dispatch(
            viewAllInvoicesParentType({
                searchQuery: debouncedQuery,
                company_id: currentCompanyId || "",
                type: 'Expenses',
                start_date: formatLocalDate(startDate),
                end_date: formatLocalDate(endDate),
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortField,
                sortOrder: sortOrder,
            })
        )
    }, [dispatch, debouncedQuery, currentCompanyId, startDate, endDate, page, rowsPerPage, sortField, sortOrder]);


    const { init, setLoading, PDFViewModal } = usePDFHandler();


    async function handleInvoice(invoice: GetAllVouchars, callback: () => void) {

        try {
            setLoading(true);
            const res = await dispatch(
                (invoice.voucher_type === 'Payment' ? getPaymentPdf :
                    invoice.voucher_type === 'Receipt' ? getRecieptPdf :
                        tax_enable ? getTaxInvoicesPDF : getInvoicesPDF)({
                            vouchar_id: invoice._id,
                            company_id: current_company_id || '',
                        }));

            if (res.meta.requestStatus === 'fulfilled') {
                const { pdfUrl } = res.payload as { pdfUrl: string };

                // ✅ Rebuild File from URL when needed
                const blob = await fetch(pdfUrl).then((r) => r.blob());
                const file1 = new File([blob], `${invoice._id}.pdf`, {
                    type: "application/pdf",
                });

                init({ file: file1, entityNumber: invoice.voucher_number, title: invoice.party_name, fileName: `${invoice.voucher_number}-vyapar-drishti` }, callback);
            } else {
                console.error('Failed to print invoice:', res.payload);
                return;
            }

        } catch (e) {
            console.error('Error printing invoice:', e);
        } finally {
            setLoading(false);
        }
    }

    // Fetch Invoices
    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchInvoices();
    }, [debouncedQuery, page, rowsPerPage, sortField, filterState, sortOrder, dispatch, currentCompanyId, fetchInvoices]);

    useEffect(() => {
        dispatch(getAllInvoiceGroups(currentCompanyId || ""));
    }, [currentCompanyId, dispatch]);

    // Handle sorting change
    const handleSortRequest = (field: InvoicesSortField) => {
        const isAsc = sortField === field && sortOrder === "asc";
        dispatch(setInvoicesFilters({
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field
        }));
    };

    // Handle pagination change
    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        dispatch(setInvoicesFilters({
            page: newPage
        }))
    };

    // Reset filters
    const handleResetFilters = () => {
        dispatch(setInvoicesFilters({
            searchQuery: "",
            filterState: "All-States",
            type: "Invoices",
            page: 1,
            startDate: (new Date(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
            endDate: (new Date()).toISOString(),
            rowsPerPage: 10,
            sortField: "date" as InvoicesSortField,
            sortOrder: "desc" as SortOrder,
        }));
    };

    // managing searchQuery, filterState, page, rowsPerPage
    const handleStateChange = (field: string, value: string | number) => {
        dispatch(setInvoicesFilters({
            [field]: value
        }))
    }

    // Handle view invoice details
    const handleViewInvoice = (inv: GetAllVouchars) => {
        navigate(`/invoices/${inv._id}`);
    };

    // Handle Delete Invoice details
    const handleDeleteInvoice = (inv: GetAllVouchars) => {
        dispatch(deleteInvoice({ vouchar_id: inv._id, company_id: currentCompanyId })).unwrap().then(() => {
            toast.success("Invoice deleted successfully!");
            fetchInvoices();
        }).catch((error) => {
            toast.error(error || 'An unexpected error occurred. Please try again later.');
        })
    };

    const handleDeleteExpense = (data: Category) => {
        dispatch(deleteCustomer(data._id)).unwrap().then(() => {
            toast.success(`${data.ledger_name} deleted successfully.`);
            dispatch(viewAllCustomerWithType({ company_id: current_company_id ?? '', customerType: 'Indirect Expenses' })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    const data = res.payload;
                    setIndirect(
                        data.map((d: any) => ({
                            _id: d._id,
                            ledger_name: d.ledger_name,
                            parent: d.parent,
                            total_amount: d.total_amount,
                        }))
                    );
                }
            }).catch((error) => {
                console.log("Error", error);
            });
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred while deleting the customer.");
            console.error("Failed to delete customer:", error);
        });
    };

    const handleCreateExpense = (data: Category) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as any);
        });
        formData.append('user_id', user._id);
        formData.append('name', data.ledger_name);
        formData.append('parent', direct ? 'Direct Expenses' : 'Indirect Expenses');
        formData.append('parent_id', direct ? '979e7155-7bbc-4d98-8b00-8794279f4186' : '8d4ed7ad-c461-414d-ab3b-95b9d0b9ff91');
        formData.append('company_id', current_company_id ?? '');

        dispatch(createCustomer(formData)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                toast.success(`${data.ledger_name} created successfully.`);
                dispatch(viewAllCustomerWithType({ company_id: current_company_id ?? '', customerType: direct ? 'Direct Expenses' : 'Indirect Expenses' })).then((res) => {
                    if (res.meta.requestStatus === 'fulfilled') {
                        const data = res.payload;
                        if (direct) {
                            setDirect(
                                data.map((d: any) => ({
                                    _id: d._id,
                                    ledger_name: d.ledger_name,
                                    parent: d.parent,
                                    total_amount: d.total_amount,
                                }))
                            );
                        } else {
                            setIndirect(
                                data.map((d: any) => ({
                                    _id: d._id,
                                    ledger_name: d.ledger_name,
                                    parent: d.parent,
                                    total_amount: d.total_amount,
                                }))
                            );
                        }
                    }
                }).catch((error) => {
                    toast.error(error || `An unexpected error occurred while creating the ${data.ledger_name}.`);
                    console.log("Error", error);
                })
            }
        });
    };

    const handleEditExpense = (data: Category) => {

        dispatch(updateCustomerDetails(
            {
                ledger_details: {
                    ledger_name: data.ledger_name,
                }, id: data._id,
            })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success(`${data.ledger_name} updated successfully.`);
                    dispatch(viewAllCustomerWithType({ company_id: current_company_id ?? '', customerType: direct ? 'Direct Expenses' : 'Indirect Expenses' })).then((res) => {
                        if (res.meta.requestStatus === 'fulfilled') {
                            const data = res.payload;
                            if (direct) {
                                setDirect(
                                    data.map((d: any) => ({
                                        _id: d._id,
                                        ledger_name: d.ledger_name,
                                        parent: d.parent,
                                        total_amount: d.total_amount,
                                    }))
                                );
                            } else {
                                setIndirect(
                                    data.map((d: any) => ({
                                        _id: d._id,
                                        ledger_name: d.ledger_name,
                                        parent: d.parent,
                                        total_amount: d.total_amount,
                                    }))
                                );
                            }
                        }
                    }).catch((error) => {
                        toast.error(error || `An unexpected error occurred while updating the ${data.ledger_name}.`);
                        console.log("Error", error);
                    })
                }
            });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3, width: "100%", position: 'relative' }}>
                {/* Page Title */}
                <PageHeader
                    title="Expenses Directory"
                    subtitle={`${expensePageMeta.total} Expense entries available in your database after applying filters`}
                    children={<>
                        <Button
                            variant="outlined"
                            color="primary"
                            size='medium'
                            onClick={() => {
                                dispatch(viewAllCustomerWithType({ company_id: current_company_id ?? '', customerType: 'Indirect Expenses' })).then((res) => {
                                    if (res.meta.requestStatus === 'fulfilled') {
                                        const data = res.payload;
                                        setIndirect(
                                            data.map((d: any) => ({
                                                _id: d._id,
                                                ledger_name: d.ledger_name,
                                                parent: d.parent,
                                                total_amount: d.total_amount,
                                            }))
                                        );
                                        setIndirectModal(true);
                                    }
                                }).catch((error) => {
                                    console.log("Error", error);
                                })
                            }}
                            sx={{ fontWeight: 'bold', py: 1.5 }}
                        >
                            Indirect Expenses
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            size='medium'
                            onClick={() => {
                                dispatch(viewAllCustomerWithType({ company_id: current_company_id ?? '', customerType: 'Direct Expenses' })).then((res) => {
                                    if (res.meta.requestStatus === 'fulfilled') {
                                        const data = res.payload;
                                        setDirect(
                                            data.map((d: any) => ({
                                                _id: d._id,
                                                ledger_name: d.ledger_name,
                                                parent: d.parent,
                                                total_amount: d.total_amount,
                                            }))
                                        );
                                        setDirectModal(true);
                                    }
                                }).catch((error) => {
                                    console.log("Error", error);
                                })
                            }}
                            sx={{ fontWeight: 'bold', py: 1.5 }}
                        >
                            Direct Expenses
                        </Button>
                    </>}
                />

                {/* Search and Filter Controls */}
                <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
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
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <DatePicker
                        label="Start Date"
                        value={new Date(startDate)}
                        format="dd/MM/yyyy"
                        views={["year", "month", "day"]}
                        onChange={(newValue) => handleStateChange("startDate", newValue?.toISOString() ?? '')}
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
                        onChange={(newValue) => handleStateChange("endDate", newValue?.toISOString() ?? '')}
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
                                        <FilterIcon />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem selected value="Invoices">
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value={'Sales'}>
                                Sales
                            </MenuItem>
                            <MenuItem value={'Purchase'}>
                                Purchase
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
                            {[10, 20, 50, 100, 200].map((option) => (
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

                {/* Invoices Table */}
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
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < expenses.length}
                                        checked={expenses.length > 0 && selectedIds.length === expenses.length}
                                        onChange={(_, checked) => {
                                            if (checked) {
                                                setSelectedIds(expenses.map((inv) => inv._id));
                                            } else {
                                                setSelectedIds([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by State" arrow>
                                        <TableSortLabel
                                            active={sortField === "date"}
                                            direction={sortField === "date" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("date")}
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
                                            active={sortField === "party_name"}
                                            direction={sortField === "party_name" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("party_name")}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                Expense Information
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Invoice Type" arrow>
                                        <TableSortLabel
                                            active={sortField === "voucher_type"}
                                            direction={sortField === "voucher_type" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("voucher_type")}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                Invoice Type
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>

                                <TableCell align="left" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Expense Number" arrow sx={{ mx: 'auto' }}>
                                        <TableSortLabel
                                            active={sortField === "voucher_number"}
                                            direction={sortField === "voucher_number" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("voucher_number")}
                                            sx={{ mx: 'auto' }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem', mx: 'auto' }}>
                                                Expense No.
                                            </Typography>
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


                                <TableCell align="center" >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <InvoicesRowSkeleton key={`skeleton-${index}`} />)
                            ) : expenses?.length > 0 ? (
                                expenses.map((inv, index) => (
                                    <InvoicerRow
                                        key={inv._id}
                                        inv={inv}
                                        selected={selectedIds.includes(inv._id)}
                                        onSelect={(checked: boolean) => {
                                            setSelectedIds((prev) =>
                                                checked ? [...prev, inv._id] : prev.filter((id) => id !== inv._id)
                                            );
                                        }}
                                        index={index + 1 + (page - 1) * rowsPerPage}
                                        onView={() => handleViewInvoice(inv)}
                                        onEdit={() => {
                                            navigate(`/invoices/update/${inv.voucher_type.toLowerCase()}/${inv._id}`);
                                        }}
                                        onDelete={() => handleDeleteInvoice(inv)}
                                        onPrint={() => { handleInvoice(inv, () => { setVisible(true); }) }}

                                    />))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <PeopleAlt sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                No expenses created today
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Try adjusting your search or filter criteria, or create your first expense for today
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}

                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <InvoicesRowSkeleton key={`skeleton1-${index}`} />)
                            ) : expenses?.length > 0 && (
                                <>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                            bgcolor: alpha(theme.palette.grey[50], 0.8),
                                        },
                                    }}>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                        <TableCell colSpan={1} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                        <TableCell colSpan={1} sx={{ textAlign: "left", }}>
                                            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, textDecoration: 'underline' }}>
                                                Total
                                            </Typography>
                                        </TableCell>
                                        <TableCell colSpan={3} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            {expensePageMeta.total_expense !== 0 && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.success.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.success.main, }}>
                                                    {Math.abs(expensePageMeta.total_expense)}
                                                </Typography>
                                            </Box>}
                                        </TableCell>
                                        <TableCell align="right" colSpan={1} >
                                            {/* {expensePageMeta.total_expense !== 0 && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mr: 0.5,
                                                        color: theme.palette.error.main,
                                                    }}
                                                >
                                                    &#8377;
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.error.main, }}>
                                                    {Math.abs(expensePageMeta.total_expense)}
                                                </Typography>
                                            </Box>} */}
                                        </TableCell>
                                        <TableCell colSpan={1} sx={{ textAlign: "center", }}>
                                        </TableCell>
                                    </TableRow>

                                </>
                            )}

                        </TableBody>
                    </Table>

                </TableContainer>

                {/* Pagination Controls */}
                <BottomPagination
                    total={expensePageMeta.total}
                    item="expenses"
                    page={page}
                    metaPage={expensePageMeta.page}
                    rowsPerPage={rowsPerPage}
                    onChange={handleChangePage}
                />

                {visible && <PDFViewModal visible={visible} setVisible={setVisible} />}
                {indirectModal && <CategoriesModal<Category>
                    open={indirectModal}
                    search="Search using name"
                    buttonText="Create New"
                    title='Indirect Expenses'
                    onClose={() => setIndirectModal(false)}
                    onAddCategory={(data) => {
                        console.log('Add category:', data);
                        handleCreateExpense(data);
                    }}
                    onEditCategory={(data) => {
                        console.log('Edit category:', data);
                        handleEditExpense(data);
                    }}
                    onDeleteCategory={(data) => {
                        console.log('Delete category:', data);
                        handleDeleteExpense(data);
                    }}
                    categories={indirect}
                />}
                {direct && <CategoriesModal<Category>
                    open={directModal}
                    search="Search using name"
                    buttonText="Create New"
                    title='Direct Expenses'
                    onClose={() => setDirectModal(false)}
                    onAddCategory={(data) => {
                        console.log('Add category:', data);
                        handleCreateExpense(data);
                    }}
                    onEditCategory={(data) => {
                        console.log('Edit category:', data);
                        handleEditExpense(data);
                    }}
                    onDeleteCategory={(data) => {
                        console.log('Delete category:', data);
                        handleDeleteExpense(data);
                    }}
                    categories={direct}
                />}
            </Box >
        </LocalizationProvider>

    );
};

export default Expenses;