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
  FilterList as FilterIcon,
  AddCircle as AddCircleIcon,
  RefreshOutlined,
  // ArrowUpwardOutlined,
  // ArrowDownwardOutlined,
  // MoreHoriz,
  Edit,
  Visibility,
  Delete,
} from "@mui/icons-material";
// import {
//   // alpha,
//   // useColorScheme,
// } from "@mui/material/styles";
import { CreditorSortField, SortOrder, GetCreditors } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { viewAllCreditors } from "@/services/creditors";

const Creditors: React.FC = () => {
  // const { mode } = useColorScheme();

  const { creditors, pageMeta, loading } = useSelector((state: RootState) => state.creditor);

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [state, setState] = useState({
    searchQuery: "",
    filterState: "All-States",
    is_deleted: false,
    page: 1,
    rowsPerPage: 10,
    sortField: "created_at" as CreditorSortField,
    sortOrder: "asc" as SortOrder,
  });

  const { searchQuery, filterState, page, is_deleted, rowsPerPage, sortField, sortOrder } = state;


  // Fetch stockists data from API
  useEffect(() => {
    const fetchCreditors = async () => {
      dispatch(
        viewAllCreditors({
          searchQuery: searchQuery,
          filterState: filterState,
          is_deleted: is_deleted,
          pageNumber: page,
          limit: rowsPerPage,
          sortField: sortField,
          sortOrder: sortOrder,
        })
      )
    };

    fetchCreditors();
  }, [
    searchQuery,
    page,
    rowsPerPage,
    is_deleted,
    sortField,
    filterState,
    sortOrder,
    dispatch,
  ]);

  // Handle sorting change
  const handleSortRequest = (field: CreditorSortField) => {
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
      page: 1,
      rowsPerPage: 10,
      sortField: "created_at" as CreditorSortField,
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
  const handleViewCreditor = (creditor: GetCreditors) => {
    navigate(`/creditors/${creditor._id}`)
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
                Creditors Directory
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                {pageMeta.total} creditors available in your database after applying
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
                    navigate("/create/user");
                  }}
                  sx={{
                    width: "max-content",
                  }}
                >
                  Add Creditors
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
          placeholder="Search by name, company, city, or email..."
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

      {/* Creditors Table */}
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
                <TableCell>Contact Info</TableCell>
                {/* <TableCell>Closing Balance</TableCell> */}
                <TableCell>
                  <Tooltip title="Sort by City">
                    <TableSortLabel
                      active={sortField === "city"}
                      direction={sortField === "city" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("city")}
                    >
                      Legal Info
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                {/* <TableCell>
                  <Tooltip title="Sort by State">
                    <TableSortLabel
                      active={sortField === "state"}
                      direction={sortField === "state" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("state")}
                    >
                      Actions
                    </TableSortLabel>
                  </Tooltip>
                </TableCell> */}
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditors?.length > 0 ? (
                creditors.map((cred, index) => {
                  if (!cred.name) {
                    return null;
                  }
                  return (
                    <TableRow
                      key={cred._id}
                      hover
                      onClick={() => handleViewCreditor(cred)}
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
                            {cred.name.split(" ").map((word) => word[0]).join("").toUpperCase()}
                          </Avatar>
                          <Box>

                            <Typography variant="subtitle2">
                              {cred.company_name ? cred.name : ''}
                            </Typography>

                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {cred.company_name ? cred.company_name : cred.name}
                        </Typography>
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
                          {cred.phone?.code}{" "}
                          {cred?.phone?.number || "N/A"}
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
                          {cred?.email || "No Email Provided"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          GSTIN - {cred.gstin || "No GSTIN Provided"}
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
                          PAN - {cred?.pan_number || "No PAN Provided"}
                        </Typography>
                      </TableCell>

                      {/* <TableCell>
                        <Chip
                          label={cred.billing?.state || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell> */}
                      {/* <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          <PhoneIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {cred.phone?.code}{" "}
                          {cred?.phone?.number || "N/A"}
                        </Typography>
                      </TableCell> */}
                      <TableCell>
                        <Box sx={{ display: 'flex', columnGap: 1 }}>
                          {/* <Tooltip title="You Got">
                            <IconButton
                              size="small"
                              color="success"
                              sx={{
                                background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
                                "&:hover": {
                                  background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
                                },
                                fontWeight: 900,
                                whiteSpace: "nowrap",

                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <ArrowDownwardOutlined
                                sx={{
                                  color: 'white',
                                  filter: 'drop-shadow(0 0 1px white)'
                                }}
                                style={{
                                  fontSize: '1.5rem',
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="You Gave">
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                background: mode === 'light' ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.error.light, 0.5),
                                "&:hover": {
                                  background: mode === 'light' ? alpha(theme.palette.error.main, 1) : alpha(theme.palette.error.light, 1),
                                },
                                fontWeight: 900,
                                whiteSpace: "nowrap",

                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <ArrowUpwardOutlined
                                sx={{
                                  color: 'white',
                                  filter: 'drop-shadow(0 0 1px white)'
                                }}
                                style={{
                                  fontSize: '1.5rem',
                                }}
                              />
                            </IconButton>
                          </Tooltip> */}

                          <Tooltip title="More Actions">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No Creditors found</Typography>
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
    </Box >
  );
};

export default Creditors;
