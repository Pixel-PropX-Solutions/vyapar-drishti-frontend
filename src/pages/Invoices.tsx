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
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  RefreshOutlined,
  PeopleAlt,
  Today,
} from "@mui/icons-material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SortOrder, GetAllVouchars, InvoicesSortField } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { deleteTAXInvoice, deleteInvoice, printTAXInvoices, printInvoices, viewAllInvoices } from "@/services/invoice";
import { InvoicerRow } from "@/components/Invoice/InvoiceRow";
import InvoicePrint from "@/components/Invoice/InvoicePrint";
import { getAllInvoiceGroups } from "@/services/invoice";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InvoicesRowSkeleton } from "@/common/skeletons/InvoicesRowSkeleton";
import { ActionButton } from "@/common/buttons/ActionButton1";
import { setInvoicesFilters, setInvoiceTypeId } from "@/store/reducers/invoiceReducer";
import toast from "react-hot-toast";
import { BottomPagination } from "@/common/modals/BottomPagination";
import { formatLocalDate } from "@/utils/functions";


const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [htmlFromAPI, setHtmlFromAPI] = useState<Array<{ html: string, page_number: number }>>([]);
  const [html, setHtml] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [fullHtml, setFullHtml] = useState<string>('');
  const [downloadHtml, setDownloadHtml] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const { invoices, loading, pageMeta, invoiceGroups } = useSelector((state: RootState) => state.invoice);
  const { user, current_company_id } = useSelector((state: RootState) => state.auth);
  const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
  const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
  const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
  const { searchQuery, filterState, page, rowsPerPage, startDate, endDate, type, sortField, sortOrder } = useSelector((state: RootState) => state.invoice.invoicesFilters);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const fetchInvoices = useCallback(async () => {
    dispatch(
      viewAllInvoices({
        searchQuery: debouncedQuery,
        company_id: currentCompanyId || "",
        type: type,
        start_date: formatLocalDate(new Date(startDate)),
        end_date: formatLocalDate(new Date(endDate)),
        pageNumber: page,
        limit: rowsPerPage,
        sortField: sortField,
        sortOrder: sortOrder,
      })
    )
  }, [dispatch, debouncedQuery, currentCompanyId, type, startDate, endDate, page, rowsPerPage, sortField, sortOrder]);

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
  const handleResetFilters = useCallback(() => {
    dispatch(setInvoicesFilters({
      searchQuery: "",
      filterState: "All-States",
      type: "Invoices",
      page: 1,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date().toISOString(),
      rowsPerPage: 10,
      sortField: "created_at" as InvoicesSortField,
      sortOrder: "asc" as SortOrder,
    }));
  }, []);

  // managing searchQuery, filterState, page, rowsPerPage
  const handleStateChange = (field: string, value: any) => {
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
    if (tax_enable) {
      dispatch(deleteTAXInvoice({ vouchar_id: inv._id, company_id: currentCompanyId })).unwrap().then(() => {
        fetchInvoices();
        toast.success("Invoice deleted successfully!");
      }).catch((error) => {
        toast.error(error || 'An unexpected error occurred. Please try again later.');
      })
    } else {
      dispatch(deleteInvoice({ vouchar_id: inv._id, company_id: currentCompanyId })).unwrap().then(() => {
        toast.success("Invoice deleted successfully!");
        fetchInvoices();
      }).catch((error) => {
        toast.error(error || 'An unexpected error occurred. Please try again later.');
      })
    }
  };

  const handlePrintInvoice = (invoice: GetAllVouchars) => {
    if (invoice.voucher_type === 'Sales' || invoice.voucher_type === 'Purchase') {
      if (tax_enable) {
        dispatch(printTAXInvoices({
          vouchar_id: invoice._id,
          company_id: currentCompanyId || "",
        })).then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            const payload = response.payload as { paginated_data: Array<{ html: string, page_number: number }>, complete_data: string, download_data: string };
            toast.success("Invoice data fetched successfully! 🎉");
            const paginated_html = payload.paginated_data;
            const fullHtml = payload.complete_data;
            const download_html = payload.download_data;

            setHtmlFromAPI(paginated_html);
            setDownloadHtml(download_html);
            setInvoiceId(invoice.voucher_number);
            setCustomerName(invoice?.party_name)
            setFullHtml(fullHtml);
            setHtml(true);
          } else {
            console.error("Failed to print TAX invoice:", response.payload);
          }
        }
        ).catch((error) => {
          toast.error(error || "An unexpected error occurred. Please try again later.");
        }
        );
      } else {
        dispatch(printInvoices({
          vouchar_id: invoice._id,
          company_id: currentCompanyId || "",
        })).then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            const payload = response.payload as { paginated_data: Array<{ html: string, page_number: number }>, complete_data: string, download_data: string };
            toast.success("Invoice data fetched successfully! 🎉");
            const paginated_html = payload.paginated_data;
            const fullHtml = payload.complete_data;
            const download_html = payload.download_data;

            setHtmlFromAPI(paginated_html);
            setDownloadHtml(download_html);
            setInvoiceId(invoice.voucher_number);
            setCustomerName(invoice?.party_name)
            setFullHtml(fullHtml);
            setHtml(true);
          } else {
            console.error("Failed to print invoice:", response.payload);
          }
        }
        ).catch((error) => {
          toast.error(error || "An unexpected error occurred. Please try again later.");
        }
        );
      }

    }
  };

  const filteredInvoices = invoices?.filter((inv) => inv.voucher_type === 'Sales' || inv.voucher_type === 'Purchase');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, width: "100%", position: 'relative' }}>
        {/* Page Title */}
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
              <Grid item sx={{ width: "50%" }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                >
                  Invoices Directory
                </Typography>
                <Typography variant="body2" color="text.secondary" >
                  {pageMeta.total} Invoices available in your database after applying
                  filters
                </Typography>
              </Grid>

              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <ActionButton
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    color="success"
                    onClick={() => {
                      if (!currentCompanyDetails?._id) {
                        toast.error('Please create a company first.');
                        return;
                      }
                      dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Sales'))?._id || ''));
                      navigate('/invoices/create/sales')
                    }}
                    sx={{
                      background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                      '&:hover': {
                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                        background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                      },
                    }}
                  >
                    Add Sales
                  </ActionButton>

                  <ActionButton
                    variant="contained"
                    startIcon={<RemoveCircleOutlineIcon />}
                    color="error"
                    onClick={() => {
                      if (!currentCompanyDetails?._id) {
                        toast.error('Please create a company first.');
                        return;
                      }
                      dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Purchase'))?._id || ''));
                      navigate('/invoices/create/purchase');
                    }}
                    sx={{
                      background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
                      '&:hover': {
                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                        background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                      },
                    }}
                  >
                    Add Purchase
                  </ActionButton>
                </Box>
              </Grid>
            </Paper>
          </CardContent>
        </Card>

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
            onChange={(newValue) => handleStateChange("startDate", newValue)}
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
            onChange={(newValue) => handleStateChange("endDate", newValue)}
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
                <TableCell sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Sr. No.
                  </Typography>
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
                        Customer Information
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
                  <Tooltip title="Sort by State" arrow sx={{ mx: 'auto' }}>
                    <TableSortLabel
                      active={sortField === "voucher_number"}
                      direction={sortField === "voucher_number" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("voucher_number")}
                      sx={{ mx: 'auto' }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem', mx: 'auto' }}>
                        Invoice No.
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell align="center" sx={{ px: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                    Debit
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
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
              ) : filteredInvoices?.length > 0 ? (
                filteredInvoices.map((inv, index) => (
                  <InvoicerRow
                    key={inv._id}
                    inv={inv}
                    index={index + 1 + (page - 1) * rowsPerPage}
                    onView={() => handleViewInvoice(inv)}
                    onEdit={() => {
                      navigate(`/invoices/update/${inv.voucher_type.toLowerCase()}/${inv._id}`);
                    }}
                    onDelete={() => handleDeleteInvoice(inv)}
                    onPrint={() => handlePrintInvoice(inv)}

                  />))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <PeopleAlt sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                        No invoices created today
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter criteria, or create your first invoice for today
                      </Typography>
                      <Grid
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <ActionButton
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            color="success"
                            onClick={() => {
                              if (!currentCompanyDetails?._id) {
                                toast.error('Please create a company first.');
                                return;
                              }
                              dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Sales'))?._id || ''));
                              navigate('/invoices/create/sales')
                            }}
                            sx={{
                              background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                              color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                              border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                              '&:hover': {
                                color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                              },
                            }}
                          >
                            Add Sales
                          </ActionButton>

                          <ActionButton
                            variant="contained"
                            startIcon={<RemoveCircleOutlineIcon />}
                            color="error"
                            onClick={() => {
                              if (!currentCompanyDetails?._id) {
                                toast.error('Please create a company first.');
                                return;
                              }
                              dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Purchase'))?._id || ''));
                              navigate('/invoices/create/purchase');
                            }}
                            sx={{
                              background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                              color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                              border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
                              '&:hover': {
                                color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                              },
                            }}
                          >
                            Add Purchase
                          </ActionButton>
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
          item="invoices"
          page={page}
          metaPage={pageMeta.page}
          rowsPerPage={rowsPerPage}
          onChange={handleChangePage}
        />

        {html && <InvoicePrint invoiceHtml={htmlFromAPI} downloadHtml={downloadHtml} customerName={customerName} fullHtml={fullHtml} open={html} onClose={() => setHtml(false)} invoiceNumber={invoiceId} />}
      </Box >
    </LocalizationProvider>

  );
};

export default Invoices;