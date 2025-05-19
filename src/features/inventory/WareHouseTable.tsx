import React from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Tooltip,
    MenuItem,
    Pagination,
    FormControl,
    Card,
    TableSortLabel,
    Skeleton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { SortField, SortOrder, WareHouseProduct } from '@/utils/types';
import { WareHouseRow } from './warehouseRow';

// Styled Components with enhanced visuals
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
    whiteSpace: 'nowrap'
}));

interface WareHouseTableProps {
    stockItems: WareHouseProduct[];
    sortRequest: (field: SortField) => void;
    stateChange: (key: string, value: string) => void;
    isLoading?: boolean;
    limit: number;
    sortField: SortField;
    sortOrder: SortOrder;
    pageChange?: (_: React.ChangeEvent<unknown>, newPage: number) => void;
    setDrawerData?: React.Dispatch<React.SetStateAction<{
        isOpen: boolean;
        type: 'stockIn' | 'stockOut' | null;
        product: WareHouseProduct | null;
    }>>;
}


const WareHouseTable = (props: WareHouseTableProps) => {
    const theme = useTheme();
    const { wareHouseProduct, pageMeta } = useSelector((state: RootState) => state.inventory);
    const { stockItems, stateChange, isLoading, limit, sortField, sortOrder, setDrawerData, sortRequest, pageChange } = props;


    return (
        <Card sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0}>
                {isLoading ? (
                    <Box sx={{ p: 2 }}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <Box key={item} sx={{ display: 'flex', my: 2, px: 2 }}>
                                {/* <Skeleton variant="rectangular" width={24} height={30} sx={{ mr: 2 }} /> */}
                                <Skeleton variant="text" width="40%" height={30} sx={{ mr: 2 }} />
                                <Skeleton variant="text" width="10%" height={30} sx={{ mr: 2 }} />
                                <Skeleton variant="text" width="15%" height={30} sx={{ mr: 2 }} />
                                <Skeleton variant="text" width="15%" height={30} sx={{ mr: 2 }} />
                                <Skeleton variant="text" width="20%" height={30} />
                            </Box>
                        ))}
                    </Box>
                ) : stockItems?.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No inventory items found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Try adjusting your filters or add new items to your inventory
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            color="primary"
                        >
                            Add New Item
                        </Button>
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : 'rgba(25, 118, 210, 0.08)' }}>
                                {/* <CustomTableCell padding="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={
                                            (wareHouseProduct || []).length > 0 &&
                                            selectedRows.length === (wareHouseProduct || []).length
                                        }
                                        onChange={handleSelectAll}
                                        style={{
                                            cursor: 'pointer',
                                            width: '18px',
                                            height: '18px',
                                            accentColor: '#1976d2',
                                            borderRadius: '3px',
                                            border: '1.5px solid #c4c4c4',
                                            outline: 'none',
                                            transition: 'all 0.2s ease-in-out',
                                            verticalAlign: 'middle',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </CustomTableCell> */}
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Product Name" arrow>
                                        <TableSortLabel
                                            active={sortField === "product_name"}
                                            direction={sortField === "product_name" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("product_name")}
                                        >
                                            Product Name
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Sort by Quantity" arrow>
                                        <TableSortLabel
                                            active={sortField === "available_quantity"}
                                            direction={sortField === "available_quantity" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("available_quantity")}
                                        >
                                            Qty
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Sort by Purchase Price" arrow>
                                        <TableSortLabel
                                            active={sortField === "available_product_price"}
                                            direction={sortField === "available_product_price" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("available_product_price")}
                                        >
                                            Purchase Price
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Sale Price
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Last Updated Date" arrow>
                                        <TableSortLabel
                                            active={sortField === "created_at"}
                                            direction={sortField === "created_at" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("created_at")}
                                        >
                                            Last Updated
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell align="center" sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Actions
                                </CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockItems?.map((item) => (
                                <WareHouseRow
                                    key={item._id}
                                    row={item}
                                    setDrawerData={setDrawerData}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Enhanced pagination with better information */}
            {!isLoading && Array.isArray(wareHouseProduct) && wareHouseProduct.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {`Showing ${(pageMeta?.page - 1) * limit + 1}-${Math.min(
                            pageMeta?.page * limit,
                            pageMeta?.total
                        )} of ${pageMeta?.total} items`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControl size="small" sx={{ width: 80 }}>
                            <TextField
                                select
                                label="Show"
                                value={limit}
                                onChange={(e) => stateChange('limit', e.target.value)}
                                size="small"
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </TextField>
                        </FormControl>
                        <Pagination
                            count={Math.ceil(pageMeta?.total / limit)}
                            page={pageMeta?.page}
                            onChange={pageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                            size="small"
                        />
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default WareHouseTable;