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
import { SortField, SortOrder, InventoryItem, PageMeta } from '@/utils/types';
import { InventoryRow } from './InventoryRow';
import { BottomPagination } from '@/common/modals/BottomPagination';

// Styled Components with enhanced visuals
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
    whiteSpace: 'nowrap'
}));

interface InventoryTableProps {
    stockItems: InventoryItem[];
    sortRequest: (field: SortField) => void;
    stateChange: (key: string, value: string) => void;
    isLoading?: boolean;
    limit: number;
    sortField: SortField;
    sortOrder: SortOrder;
    pageMeta: PageMeta;
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
                                            Purchase Rate
                                        </TableSortLabel>
                                    </Tooltip>
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Sale Rate
                                </CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Last Updated Date" arrow>
                                        <TableSortLabel
                                            active={sortField === "created_at"}
                                            direction={sortField === "created_at" ? sortOrder : "asc"}
                                            onClick={() => sortRequest("created_at")}
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
                            {stockItems?.map((item) => (
                                <InventoryRow
                                    key={item._id}
                                    row={item}
                                />
                            ))}
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