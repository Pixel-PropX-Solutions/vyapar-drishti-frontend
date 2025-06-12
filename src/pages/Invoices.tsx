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
  Pagination,
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
  AddCircle as AddCircleIcon,
  RefreshOutlined,
  // ArrowUpwardOutlined,
  // ArrowDownwardOutlined,
  // MoreHoriz,
  PeopleAlt,
<<<<<<< HEAD
=======
  Contacts,
  LocationOn,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
  Today,
} from "@mui/icons-material";
// import {
//   // alpha,
//   // useColorScheme,
// } from "@mui/material/styles";
<<<<<<< HEAD
import { CustomerSortField, SortOrder, GetAllVouchars } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
// import { viewAllCustomers } from "@/services/customersledger";
// import EditCustomerModal from "@/features/profile/customers/EditCustomerModal";
import { CustomerRowSkeleton } from "@/common/CustomerRowSkeleton";
// import { CustomerRow } from "@/features/profile/customers/CustomerRow";
// import { getAllGroups } from "@/services/group";
import { printInvoices, printPaymentInvoices, printRecieptInvoices, viewAllInvoices } from "@/services/invoice";
import { InvoicerRow } from "@/components/Invoice/InvoiceRow";
import InvoicePrint from "@/components/Invoice/InvoicePrint";
import InvoiceTypeModal from "@/components/Invoice/InvoiceTypeModal";
import { getAllInvoiceGroups } from "@/services/accountingGroup";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const Invoices: React.FC = () => {
  // const { mode } = useColorScheme();
  // const [isCustomerEditing, setIsCustomerEditing] = useState(false);
  const [_invoice, setInvoice] = useState<GetAllVouchars | null>(null);
  const [promptModal, setPromptModal] = useState(false);
  const [htmlFromAPI, setHtmlFromAPI] = useState<string>('');
  const [html, setHtml] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const { invoiceGroupList } = useSelector((state: RootState) => state.accountingGroup);
  const { invoices, loading, pageMeta } = useSelector((state: RootState) => state.invoice);
  // const { accountingGroups } = useSelector((state: RootState) => state.accountingGroup);
=======
import { CreditorSortField, SortOrder, GetUserLedgers } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { viewAllCreditors } from "@/services/creditorsledger";
import EditCreditorModal from "@/features/profile/creditors/EditCreditorModal";
import { CustomerRowSkeleton } from "@/common/CustomerRowSkeleton";
import { CustomerRow } from "@/features/profile/creditors/CustomerRow";
import { getAllGroups } from "@/services/group";

const Invoices: React.FC = () => {
  // const { mode } = useColorScheme();
  const [isCreditorEditing, setIsCreditorEditing] = useState(false);
  const [cred, setCred] = useState<GetUserLedgers | null>(null);
  const { creditors, pageMeta, loading } = useSelector((state: RootState) => state.creditorsLedger);
  const { groups } = useSelector((state: RootState) => state.group);
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
  const { currentCompany } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState({
    searchQuery: "",
    filterState: "All-States",
    is_deleted: false,
    type: "All",
    page: 1,
<<<<<<< HEAD
    startDate: new Date(),
    endDate: new Date(),
    rowsPerPage: 10,
    sortField: "created_at" as CustomerSortField,
    sortOrder: "asc" as SortOrder,
  });

  const { searchQuery, filterState, page, is_deleted, rowsPerPage, startDate, endDate, type, sortField, sortOrder } = state;

  const fetchIvoices = useCallback(async () => {
    dispatch(
      viewAllInvoices({
        searchQuery: searchQuery,
        company_id: currentCompany?._id || "",
        type: type,
        start_date: startDate.getFullYear().toString() + '-' + (startDate.getMonth() + 1).toString().padStart(2, '0') + '-' + startDate.getDate().toString().padStart(2, '0'),
        end_date: endDate.getFullYear().toString() + '-' + (endDate.getMonth() + 1).toString().padStart(2, '0') + '-' + endDate.getDate().toString().padStart(2, '0'),
=======
    rowsPerPage: 10,
    sortField: "created_at" as CreditorSortField,
    sortOrder: "asc" as SortOrder,
  });

  const { searchQuery, filterState, page, is_deleted, rowsPerPage, type, sortField, sortOrder } = state;

  const fetchCreditors = useCallback(async () => {
    dispatch(
      viewAllCreditors({
        searchQuery: searchQuery,
        filterState: filterState,
        company_id: "",
        type: type,
        is_deleted: is_deleted,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
        pageNumber: page,
        limit: rowsPerPage,
        sortField: sortField,
        sortOrder: sortOrder,
      })
    )
<<<<<<< HEAD
  }, [dispatch, searchQuery, currentCompany?._id, type, startDate, endDate, page, rowsPerPage, sortField, sortOrder]);

  // Fetch stockists data from API
  useEffect(() => {
    fetchIvoices();
    dispatch(getAllInvoiceGroups(currentCompany?._id || ""));
  }, [searchQuery, page, rowsPerPage, is_deleted, sortField, filterState, sortOrder, dispatch, fetchIvoices, currentCompany?._id]);

  // useEffect(() => {
  //   dispatch(getAllGroups(currentCompany?._id || ""));
  // }, [currentCompany?._id, dispatch])


  // Handle sorting change
  const handleSortRequest = (field: CustomerSortField) => {
=======
  }, [dispatch, searchQuery, filterState, type, is_deleted, page, rowsPerPage, sortField, sortOrder]);

  // Fetch stockists data from API
  useEffect(() => {
    fetchCreditors();
  }, [searchQuery, page, rowsPerPage, is_deleted, sortField, filterState, sortOrder, dispatch, fetchCreditors]);

  useEffect(() => {
    dispatch(getAllGroups(currentCompany?._id || ""));
  }, [currentCompany?._id, dispatch])


  // Handle sorting change
  const handleSortRequest = (field: CreditorSortField) => {
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
    const isAsc = sortField === field && sortOrder === "asc";
    setState((prevState) => ({
      ...prevState,
      sortOrder: isAsc ? "desc" : "asc",
      sortField: field
    }))
  };

  // Handle pagination change
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    console.log(event);

    setState((prevState) => ({
      ...prevState,
      page: newPage
    }))
    // setPage(newPage);
  };

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setState({
      searchQuery: "",
      filterState: "All-States",
      is_deleted: false,
      type: "All",
      page: 1,
<<<<<<< HEAD
      startDate: new Date(),
      endDate: new Date(),
      rowsPerPage: 10,
      sortField: "created_at" as CustomerSortField,
=======
      rowsPerPage: 10,
      sortField: "created_at" as CreditorSortField,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
      sortOrder: "asc" as SortOrder,
    });
  }, []);


  // managing searchQuery, filterState, page, rowsPerPage
  const handleStateChange = (field: string, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value
    }))
  }

  // Handle view stockist details
<<<<<<< HEAD
  const handleViewInvoice = (invoice: GetAllVouchars) => {
    // navigate(`/customers/${customer._id}`)
    console.log("View Invoice", invoice);
  };

  const handlePrintInvoice = (invoice: GetAllVouchars) => {
    console.log("Print Invoice", invoice);
    if (invoice.voucher_type === 'Sales' || invoice.voucher_type === 'Purchase') {
      dispatch(printInvoices({
        vouchar_id: invoice._id,
        company_id: currentCompany?._id || "",
      })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          console.log("Print Invoice Response:", response.payload);
          const payload = response.payload as { invoceHtml: string };
          setHtmlFromAPI(payload.invoceHtml);
          setInvoiceId(invoice.voucher_number);
          setHtml(true);
        } else {
          console.error("Failed to print invoice:", response.payload);
        }
      }
      ).catch((error) => {
        console.error("Error printing invoice:", error);
      }
      );
    } else if (invoice.voucher_type === 'Receipt') {
      dispatch(printRecieptInvoices({
        vouchar_id: invoice._id,
        company_id: currentCompany?._id || "",
      })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          console.log("Print Invoice Response:", response.payload);
          const payload = response.payload as { invoceHtml: string };
          setHtmlFromAPI(payload.invoceHtml);
          setInvoiceId(invoice.voucher_number);
          setHtml(true);
        } else {
          console.error("Failed to print invoice:", response.payload);
        }
      }
      ).catch((error) => {
        console.error("Error printing invoice:", error);
      }
      );
    } else if (invoice.voucher_type === 'Payment') {
      dispatch(printPaymentInvoices({
        vouchar_id: invoice._id,
        company_id: currentCompany?._id || "",
      })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          console.log("Print Invoice Response:", response.payload);
          const payload = response.payload as { invoceHtml: string };
          setHtmlFromAPI(payload.invoceHtml);
          setInvoiceId(invoice.voucher_number);
          setHtml(true);
        } else {
          console.error("Failed to print invoice:", response.payload);
        }
      }
      ).catch((error) => {
        console.error("Error printing invoice:", error);
      }
      );
    }



  };

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
                <Grid item xs={12} sm={6} md={12}>


                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon fontSize="large" />}
                    onClick={() => {
                      setPromptModal(true);
                      // navigate('/invoices/create');
                    }}
                    sx={{
                      width: "max-content",
                    }}
                  >
                    Add Invoices
                  </Button>


                </Grid>
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
            value={startDate}
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
            value={endDate}
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
              <MenuItem selected value="All">
                <em>All</em>
              </MenuItem>
              {invoiceGroupList?.map((group) => (
                <MenuItem key={group?._id} value={group?.name}>
                  {group?.name}
                </MenuItem>
              ))}
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
                  }
                }}>
                <TableCell sx={{ pl: 3, pr: 1 }}>
                  <Tooltip title="Sort by Name">
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("name")}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Sr. No.
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
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
                <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Name">
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("name")}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Customer Information
                      </Typography>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by Item Quantity" arrow>
                    <TableSortLabel
                    // active={sortField === "name"}
                    // direction={sortField === "name" ? sortOrder : "asc"}
                    // onClick={() => handleSortRequest("name")}
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

                <TableCell align="center" sx={{ px: 1 }}>
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

                <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by State" arrow>
                    <TableSortLabel
                      active={sortField === "state"}
                      direction={sortField === "state" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("state")}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {/* <LocationOn fontSize="small" /> */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Debit
                        </Typography>
                      </Box>
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ px: 1 }}>
                  <Tooltip title="Sort by State" arrow>
                    <TableSortLabel
                      active={sortField === "state"}
                      direction={sortField === "state" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("state")}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {/* <LocationOn fontSize="small" /> */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Credit
                        </Typography>
                      </Box>
                    </TableSortLabel>
                  </Tooltip>
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
                  .map((_, index) => <CustomerRowSkeleton key={`skeleton-${index}`} />)
              ) : invoices?.length > 0 ? (
                invoices.map((inv, index) => (
                  <InvoicerRow
                    key={inv._id}
                    inv={inv}
                    index={index + 1 + (page - 1) * rowsPerPage}
                    onView={() => handleViewInvoice(inv)}
                    onEdit={() => {
                      setInvoice(inv);
                      // setIsCustomerEditing(true);
                    }}
                    onDelete={async () => {
                      // await deleteCustomer(cred._id);
                      // fetchCustomers();
                    }}
                    onPrint={() => handlePrintInvoice(inv)}

                  />))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <PeopleAlt sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                        No invoices found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filter criteria, or create your first invoice
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          navigate('/invoices/create');
                        }}
                        startIcon={<AddCircleIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Create Your First Invoice
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>

        </TableContainer>

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 2
          }}
        >
          <Typography variant="body2" sx={{ mr: 2 }}>
            {`Showing ${(pageMeta.page - 1) * rowsPerPage + 1}-${Math.min(
              pageMeta.page * rowsPerPage,
              pageMeta.total
            )} of ${pageMeta.total} customers`}
          </Typography>

          {pageMeta.total > 1 && <Pagination
            count={Math.ceil(pageMeta.total / rowsPerPage)}
            page={pageMeta.page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
          />}
        </Box>
        <InvoiceTypeModal
          open={promptModal}
          onClose={() => setPromptModal(false)}
          onSubmit={(voucharTypeValue) => {
            console.log("Vouchar Type Value:", voucharTypeValue);
            if (voucharTypeValue === 'Sales') {
              navigate('/invoices/create/' + voucharTypeValue.toLowerCase());
            }
            if (voucharTypeValue === 'Purchase') {
              navigate('/invoices/create/' + voucharTypeValue.toLowerCase());
            }
            if (voucharTypeValue === 'Purchase') {
              navigate('/invoices/create/' + voucharTypeValue.toLowerCase());
            }
            if (voucharTypeValue === 'Payment') {
              navigate('/invoices/payment');
            }
            if (voucharTypeValue === 'Receipt') {
              navigate('/invoices/payment');
            }

            setPromptModal(false);
          }}
        />
        {html && <InvoicePrint invoiceHtml={htmlFromAPI} open={html} onClose={() => setHtml(false)} invoiceNumber={invoiceId} />}
      </Box >
    </LocalizationProvider>

=======
  const handleViewCreditor = (creditor: GetUserLedgers) => {
    // navigate(`/creditors/${creditor._id}`)
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
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
              <Grid item xs={12} sm={6} md={12}>


                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon fontSize="large" />}
                  onClick={() => {
                    setCred(null);
                    setIsCreditorEditing(true);
                  }}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Add Invoices
                </Button>


              </Grid>
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
            label="Filter by customer Types"
            placeholder="Filter by customer Types"
            onChange={(e) => handleStateChange("type", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem selected value="All">
              <em>All</em>
            </MenuItem>
            {groups?.map((group) => (
              <MenuItem key={group?._id} value={group?.name}>
                {group?.name}
              </MenuItem>
            ))}
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
          borderRadius: 3,
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
                }
              }}>
              {/* <TableCell size="small">
                Sr. No.
              </TableCell> */}
              <TableCell sx={{ pl: 3, pr: 1 }}>
                <Tooltip title="Sort by Name">
                  <TableSortLabel
                    active={sortField === "name"}
                    direction={sortField === "name" ? sortOrder : "asc"}
                    onClick={() => handleSortRequest("name")}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                      Customer Information
                    </Typography>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              {/* <TableCell>
                  <Tooltip title="Sort by Company Name">
                    <TableSortLabel
                      active={sortField === "company_name"}
                      direction={sortField === "company_name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("company_name")}
                    >
                      Company Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell> */}
              <TableCell align="center" sx={{ px: 1 }}>
                <Tooltip title="Sort by Item Quantity" arrow>
                  <TableSortLabel
                  // active={sortField === "name"}
                  // direction={sortField === "name" ? sortOrder : "asc"}
                  // onClick={() => handleSortRequest("name")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Contacts fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Contact Information
                      </Typography>
                    </Box>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>

              <TableCell align="center" sx={{ px: 1 }}>
                <Tooltip title="Sort by State" arrow>
                  <TableSortLabel
                    active={sortField === "state"}
                    direction={sortField === "state" ? sortOrder : "asc"}
                    onClick={() => handleSortRequest("state")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        State
                      </Typography>
                    </Box>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>

              <TableCell align="center" sx={{ px: 1 }}>
                <Tooltip title="Sort by State" arrow>
                  <TableSortLabel
                    active={sortField === "state"}
                    direction={sortField === "state" ? sortOrder : "asc"}
                    onClick={() => handleSortRequest("state")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {/* <LocationOn fontSize="small" /> */}
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Customer Type
                      </Typography>
                    </Box>
                  </TableSortLabel>
                </Tooltip>
              </TableCell>

              <TableCell align="center" sx={{ px: 1 }}>
                <Tooltip title="Sort by State" arrow>
                  <TableSortLabel
                    active={sortField === "state"}
                    direction={sortField === "state" ? sortOrder : "asc"}
                    onClick={() => handleSortRequest("state")}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Today fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Created on
                      </Typography>
                    </Box>
                  </TableSortLabel>
                </Tooltip>
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
                .map((_, index) => <CustomerRowSkeleton key={`skeleton-${index}`} />)
            ) : creditors?.length > 0 ? (
              creditors.map((cred, index) => {
                if (!cred.name) {
                  return null;
                }
                return (
                  <CustomerRow
                    key={cred._id}
                    cus={cred}
                    index={index + 1 + (page - 1) * rowsPerPage}
                    onView={() => handleViewCreditor(cred)}
                    onEdit={() => {
                      setCred(cred);
                      setIsCreditorEditing(true);
                    }}
                    onDelete={async () => {
                      // await deleteCreditor(cred._id);
                      fetchCreditors();
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
                      No customers found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filter criteria, or add your first customer
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        // setDrawer(true);
                        // setSelectedProduct(null);
                      }}
                      startIcon={<AddCircleIcon />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Add Your First Customer
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>

      </TableContainer>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ mr: 2 }}>
          {`Showing ${(pageMeta.page - 1) * rowsPerPage + 1}-${Math.min(
            pageMeta.page * rowsPerPage,
            pageMeta.total
          )} of ${pageMeta.total} creditors`}
        </Typography>

        {pageMeta.total > 1 && <Pagination
          count={Math.ceil(pageMeta.total / rowsPerPage)}
          page={pageMeta.page}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
        />}
      </Box>
      <EditCreditorModal
        open={isCreditorEditing}
        onClose={() => {
          setIsCreditorEditing(false);
        }}
        cred={cred}
        onUpdated={async () => {
          fetchCreditors();
        }} />
    </Box >
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
  );
};

export default Invoices;