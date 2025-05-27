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
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Pagination,
  Tooltip,
  TableSortLabel,
  FormControl,
  MenuItem,
  useTheme,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Store as StoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  AddCircle as AddCircleIcon,
  RefreshOutlined,
} from "@mui/icons-material";
import { Stockist, Name, SortField, SortOrder } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { viewAllStockist } from "@/services/stockist";
import { useNavigate } from "react-router-dom";
import { ROLE_ENUM } from "@/utils/enums";

const StockistList: React.FC = () => {

  const { stockistList, pageMeta, loading } = useSelector((state: RootState) => state.stockist);
  const { user } = useSelector((state: RootState) => state.auth);

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState({
    searchQuery: "",
    filterState: "All-States",
    page: 1,
    rowsPerPage: 10,
    sortField: "created_at" as SortField,
    sortOrder: "asc" as SortOrder,
  });

  const { searchQuery, filterState, page, rowsPerPage, sortField, sortOrder } = state;

  const getFullName = (name: Name | null): string => {
    if (!name) return "N/A";
    return `${name.first_name || ""} ${name.middle_name ? name.middle_name + " " : ""
      }${name.last_name || ""}`.trim();
  };

  // Fetch stockists data from API
  useEffect(() => {
    const fetchStockists = async () => {
      dispatch(
        viewAllStockist({
          searchQuery: searchQuery,
          filterState: filterState,
          pageNumber: page,
          limit: rowsPerPage,
          sortField: sortField,
          sortOrder: sortOrder,
        })
      )
    };

    fetchStockists();
  }, [
    searchQuery,
    page,
    rowsPerPage,
    sortField,
    filterState,
    sortOrder,
    dispatch,
  ]);

  // Handle sorting change
  const handleSortRequest = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setState((prevState) => ({
      ...prevState,
      sortOrder: isAsc ? "desc" : "asc",
      sortField: field
    }))
    // setSortOrder(isAsc ? "desc" : "asc");
    // setSortField(field);
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
      page: 1,
      rowsPerPage: 10,
      sortField: "created_at" as SortField,
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
  const handleViewStockist = (stockist: Stockist) => {
    navigate(`/stockists/${stockist._id}`)
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
                Stockists Directory
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                {pageMeta.total} stockists available in your database after applying
                filters
              </Typography>
            </Grid>

            {user?.user_type === ROLE_ENUM.ADMIN && <Grid
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
                    navigate("/create/user");
                  }}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Create User
                </Button>


              </Grid>
            </Grid>}
          </Paper>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <TextField
          sx={{ flexGrow: 1, minWidth: "250px" }}
          variant="outlined"
          size="small"
          placeholder="Search by name, shop, city, or email..."
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

      {/* Stockists Table */}
      <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell size="small">
                  Sr. No.
                </TableCell>
                <TableCell>
                  <Tooltip title="Sort by Name">
                    <TableSortLabel
                      active={sortField === "name"}
                      direction={sortField === "name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("name")}
                    >
                      Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Sort by Company Name">
                    <TableSortLabel
                      active={sortField === "company_name"}
                      direction={sortField === "company_name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("company_name")}
                    >
                      Company Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Sort by City">
                    <TableSortLabel
                      active={sortField === "city"}
                      direction={sortField === "city" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("city")}
                    >
                      City
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Sort by State">
                    <TableSortLabel
                      active={sortField === "state"}
                      direction={sortField === "state" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("state")}
                    >
                      State
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Contact</TableCell>
                {user?.user_type === ROLE_ENUM.ADMIN && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {stockistList?.length > 0 ? (
                stockistList.map((stockist, index) => {
                  if (!stockist.StockistData || !stockist.StockistData.name) {
                    return null; // Skip rendering problematic items
                  }
                  return (
                    <TableRow
                      key={stockist._id}
                      hover
                      onClick={() => handleViewStockist(stockist)}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center" }}
                        >
                          {(pageMeta.page - 1) * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                          >
                            {stockist.StockistData.name.first_name?.charAt(0) ||
                              ""}
                            {stockist.StockistData.name.last_name?.charAt(0) ||
                              ""}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {getFullName(stockist.StockistData.name)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <EmailIcon
                                sx={{ fontSize: "0.75rem", marginRight: "5px" }}
                              />
                              {stockist.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <StoreIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {stockist.StockistData?.company_name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {stockist.StockistData?.address?.city || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stockist.StockistData?.address?.state || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          <PhoneIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {"stockist.StockistData?.phone_number?.country_code" 
                            }{" "}
                          {"stockist.StockistData?.phone_number?.phone_number" 
                            }
                        </Typography>
                      </TableCell>
                      {user?.user_type === ROLE_ENUM.ADMIN && <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewStockist(stockist);
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Stockist">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete logic here
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>}

                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No stockists found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
          )} of ${pageMeta.total} stockists`}
        </Typography>
        <Pagination
          count={Math.ceil(pageMeta.total / rowsPerPage)}
          page={pageMeta.page}
          onChange={handleChangePage}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default StockistList;
