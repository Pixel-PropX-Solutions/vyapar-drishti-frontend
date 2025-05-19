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
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Store as StoreIcon,
  // Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  AddCircle as AddCircleIcon,
  RefreshOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { viewAllChemist } from "@/services/chemist";
import { Chemist, Name, SortField, SortOrder } from "@/utils/types";
import { useNavigate } from "react-router-dom";

const ChemistList: React.FC = () => {
  const { chemistList, pageMeta, loading } = useSelector(
    (state: RootState) => state.chemist
  );
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

  const { searchQuery, filterState, page, rowsPerPage, sortField, sortOrder } =
    state;

  // Helper functions for names and addresses
  const getFullName = (name: Name): string => {
    if (!name) return "N/A";
    return `${name.first_name || ""} ${name.middle_name ? name.middle_name + " " : ""
      }${name.last_name || ""}`.trim();
  };

  useEffect(() => {
    const fetchChemists = async () => {
      dispatch(
        viewAllChemist({
          searchQuery: searchQuery,
          filterState: filterState,
          pageNumber: page,
          limit: rowsPerPage,
          sortField: sortField,
          sortOrder: sortOrder,
        })
      );
    };

    fetchChemists();
  }, [
    searchQuery,
    page,
    rowsPerPage,
    sortField,
    filterState,
    sortOrder,
    dispatch,
  ]);

  const handleSortRequest = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setState((prevState) => ({
      ...prevState,
      sortOrder: isAsc ? "desc" : "asc",
      sortField: field,
    }));
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

  const handleChangePage = (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setState((prevState) => ({
      ...prevState,
      page: newPage,
    }));
    // setPage(newPage);
  };

  // managing searchQuery, filterState, page, rowsPerPage
  const handleStateChange = (field: string, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handle view chemist details
  const handleViewChemist = (chemist: Chemist) => {
    navigate(`/chemists/${chemist._id}`);
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
                Chemists Directory
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                {pageMeta.total} chemists available in your database after applying
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
                  Create User
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
            value={rowsPerPage.toString()}
            label="Show"
            size="small"
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

      {/* Chemists Table */}
      <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress  />
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
                  <Tooltip title="Sort by Shop Name">
                    <TableSortLabel
                      active={sortField === "shop_name"}
                      direction={sortField === "shop_name" ? sortOrder : "asc"}
                      onClick={() => handleSortRequest("shop_name")}
                    >
                      Shop Name
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemistList?.length > 0 ? (
                chemistList.map((chemist, index) => {
                  if (!chemist.ChemistData || !chemist.ChemistData.name) {
                    return null;
                  }
                  return (
                    <TableRow
                      key={chemist._id}
                      hover
                      onClick={() => handleViewChemist(chemist)}
                    >
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{ whiteSpace: "nowrap", display: "flex",  justifyContent: "center" }}
                        >
                          {(pageMeta.page - 1) * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                          >
                            {chemist.ChemistData.name.first_name.charAt(0) ||
                              ""}
                            {chemist.ChemistData.name.last_name.charAt(0) || ""}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {getFullName(chemist.ChemistData.name)}
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
                              {chemist.email}
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
                          {chemist.ChemistData.shop_name || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Lic: {chemist.ChemistData.licence_number || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {chemist.ChemistData.address.city || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={chemist.ChemistData.address.state || "N/A"}
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
                          {chemist.ChemistData.phone_number.country_code || ""}{" "}
                          {chemist.ChemistData.phone_number.phone_number ||
                            "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewChemist(chemist);
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Edit Chemist">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleEditChemist(chemist);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip> */}
                          <Tooltip title="Delete Chemist">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DeleteIcon />
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
                    <Typography variant="body1">No chemists found</Typography>
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
          )} of ${pageMeta.total} chemists`}
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

export default ChemistList;
