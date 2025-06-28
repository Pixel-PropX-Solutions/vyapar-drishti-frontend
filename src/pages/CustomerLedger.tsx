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
  Contacts,
  LocationOn,
  Today,
} from "@mui/icons-material";
// import {
//   // alpha,
//   // useColorScheme,
// } from "@mui/material/styles";
import { CustomerSortField, SortOrder, GetUserLedgers } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
// import { useNavigate } from "react-router-dom";
import { viewAllCustomer } from "@/services/customers";
import EditCustomerModal from "@/features/profile/customers/EditCustomerModal";
import { CustomerRowSkeleton } from "@/common/CustomerRowSkeleton";
import { CustomerRow } from "@/features/profile/customers/CustomerRow";
import { viewAllAccountingGroups } from "@/services/accountingGroup";

const CustomerLedger: React.FC = () => {
  // const { mode } = useColorScheme();
  const [isCustomerEditing, setIsCustomerEditing] = useState(false);
  const [cred, setCred] = useState<GetUserLedgers | null>(null);
  const { customers, pageMeta, loading } = useSelector((state: RootState) => state.customersLedger);
  const { accountingGroups } = useSelector((state: RootState) => state.accountingGroup);
  const { currentCompany } = useSelector((state: RootState) => state.auth);
  // const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState({
    searchQuery: "",
    filterState: "All-States",
    is_deleted: false,
    type: "All",
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
        company_id: "",
        type: type,
        is_deleted: is_deleted,
        pageNumber: page,
        limit: rowsPerPage,
        sortField: sortField,
        sortOrder: sortOrder,
      })
    )
  }, [dispatch, searchQuery, filterState, type, is_deleted, page, rowsPerPage, sortField, sortOrder]);

  // Fetch stockists data from API
  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, page, rowsPerPage, is_deleted, sortField, filterState, sortOrder, dispatch, fetchCustomers]);

  useEffect(() => {
    dispatch(viewAllAccountingGroups(currentCompany?._id || ""));
  }, [currentCompany?._id, dispatch])


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
    }))
  }

  // Handle view stockist details
  const handleViewCustomer = (_customer: GetUserLedgers) => {
    // navigate(`/customers/${customer._id}`)
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
                Customers Directory
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                {pageMeta.total} Customers available in your database after applying
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
                    setIsCustomerEditing(true);
                  }}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Add Customers
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
            {accountingGroups?.map((group) => (
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
                "& .MuiTableCell-root": {
                  padding: '8px 16px',
                },
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
            ) : customers?.length > 0 ? (
              customers.map((cred, index) => {
                if (!cred.ledger_name) {
                  return null;
                }
                // if (cred.parent !== 'Sundry Debtors' && cred.parent !== 'Sundry Creditors') {
                //   return null;
                // }
                return (
                  <CustomerRow
                    key={cred._id}
                    cus={cred}
                    index={index + 1 + (page - 1) * rowsPerPage}
                    onView={() => handleViewCustomer(cred)}
                    onEdit={() => {
                      setCred(cred);
                      setIsCustomerEditing(true);
                    }}
                    onDelete={async () => {
                      // await deleteCustomer(cred._id);
                      fetchCustomers();
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
                        borderRadius: 1,
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
          mt: 2,
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
      <EditCustomerModal
        open={isCustomerEditing}
        onClose={() => {
          setIsCustomerEditing(false);
        }}
        cred={cred}
        onUpdated={async () => {
          fetchCustomers();
        }}
        onCreated={async () => {
          fetchCustomers();
        }} />
    </Box >
  );
};

export default CustomerLedger;