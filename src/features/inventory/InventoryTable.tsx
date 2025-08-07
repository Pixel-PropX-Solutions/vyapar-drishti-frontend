import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    TableSortLabel,
    Skeleton,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import { InventorySortField, SortOrder, InventoryItem } from '@/utils/types';
import { InventoryRow } from './InventoryRow';
import { BottomPagination } from '@/common/modals/BottomPagination';

interface inventoryPageMeta {
    page: number;
    limit: number;
    total: number;
    unique_categories: string[];
    unique_groups: string[];
};


// Styled Components with enhanced visuals
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
    whiteSpace: 'nowrap'
}));

interface InventoryTableProps {
    stockItems: InventoryItem[];
    sortRequest: (field: InventorySortField) => void;
    stateChange: (key: string, value: string) => void;
    isLoading?: boolean;
    limit: number;
    sortField: InventorySortField;
    sortOrder: SortOrder;
    pageMeta: inventoryPageMeta;
    pageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}


const InventoryTable = (props: InventoryTableProps) => {
    const theme = useTheme();
    const { stockItems, pageMeta, isLoading, limit, sortField, sortOrder, sortRequest, pageChange } = props;


    return (
        <>
            <TableContainer component={Paper} elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                    boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                    mb: 2,
                }}>
                {isLoading ? (
                    <Box sx={{ p: 2 }}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <Box key={item} sx={{ display: 'flex', my: 2, px: 2 }}>
                                <Skeleton variant="text" width="5%" height={30} sx={{ mr: 2 }} />
                                <Skeleton variant="text" width="35%" height={30} sx={{ mr: 2 }} />
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
                            No items found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Try adjusting your filters or creating new products.
                        </Typography>
                    </Box>
                ) : (
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: alpha(theme.palette.grey[50], 0.8),
                                width: '100%',
                                '& .MuiTableCell-head': {
                                    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                                "& .MuiTableCell-root": {
                                    padding: '8px 16px',
                                },
                            }}>
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    Sr. No.
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Product Name" arrow>
                                        <TableSortLabel
                                            active={sortField === "stock_item_name"}
                                            direction={sortField === "stock_item_name" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("stock_item_name")}
                                        >
                                            Product Name
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    <Tooltip title="Sort by Quantity" arrow>
                                        <TableSortLabel
                                            active={sortField === "current_stock"}
                                            direction={sortField === "current_stock" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("current_stock")}
                                        >
                                            Qty
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Purchase Rate
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Sale Rate
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Last Restock Date" arrow>
                                        <TableSortLabel
                                            active={sortField === "last_restock_date"}
                                            direction={sortField === "last_restock_date" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("last_restock_date")}
                                        >
                                            Last Restocked
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell align="center" sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Actions
                                </CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockItems?.map((item, index) => {
                                const serial = index + 1 + (pageMeta?.page - 1) * limit;
                                return (
                                    <InventoryRow
                                        key={item._id}
                                        row={item}
                                        serial={serial}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            {/* Enhanced pagination with better information */}
            <BottomPagination
                total={pageMeta.total}
                item="items"
                page={pageMeta?.page}
                metaPage={pageMeta.page}
                rowsPerPage={limit}
                onChange={pageChange}
            />
        </>

    );
};

export default InventoryTable;