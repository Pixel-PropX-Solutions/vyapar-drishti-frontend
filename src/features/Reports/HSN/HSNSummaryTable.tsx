import React from 'react';
import {
    Box,
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
    Fade,
    Zoom,
    Button,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { SummarySortField, SortOrder, HSNSummary } from '@/utils/types';
import { BottomPagination } from '@/common/modals/BottomPagination';
import { useNavigate } from 'react-router-dom';
import { HSNSummaryRow } from './HSNSummaryRow';
import { Info } from '@mui/icons-material';

interface PageMeta {
    page: number;
    limit: number;
    total: number;
    total_value: number;
    taxable_value: number;
    tax_amount: number;
}

// Enhanced Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: 1,
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    background: `
        linear-gradient(135deg, 
            ${alpha('#ffffff', 0.95)} 0%, 
            ${alpha('#fafbfc', 0.95)} 100%
        )
    `,
    backdropFilter: 'blur(20px)',
    overflowX: 'scroll',
    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.secondary.main} 50%, 
            ${theme.palette.primary.main} 100%
        )`,
        borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`,
    },
}));


const SortableHeader = styled(TableSortLabel)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '& .MuiTableSortLabel-icon': {
        color: theme.palette.primary.main,
        opacity: 0.6,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(0.9)',
    },
    '&:hover': {
        color: theme.palette.primary.main,
        '& .MuiTableSortLabel-icon': {
            opacity: 1,
            transform: 'scale(1.1)',
        },
    },
    '&.Mui-active': {
        color: theme.palette.primary.main,
        fontWeight: 700,
        '& .MuiTableSortLabel-icon': {
            color: theme.palette.primary.main,
            opacity: 1,
            transform: 'scale(1.1)',
        },
    },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(10, 6),
    textAlign: 'center',
    background: `
        linear-gradient(135deg, 
            ${alpha(theme.palette.grey[50], 0.8)} 0%, 
            ${alpha(theme.palette.grey[100], 0.4)} 100%
        )
    `,
    borderRadius: theme.spacing(3),
    margin: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
}));

const TotalsRow = styled(TableRow)(({ theme }) => ({
    background: `
        linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.08)} 0%, 
            ${alpha(theme.palette.primary.main, 0.04)} 50%,
            ${alpha(theme.palette.secondary.main, 0.06)} 100%
        )
    `,
    backdropFilter: 'blur(10px)',
    '& .MuiTableCell-root': {
        borderBottom: 'none',
        borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        fontWeight: 800,
        padding: theme.spacing(1, 1),
        color: theme.palette.text.primary,

    },
}));


interface InventoryTableProps {
    summaryData: HSNSummary[];
    sortRequest: (field: SummarySortField) => void;
    stateChange: (key: string, value: string) => void;
    isLoading?: boolean;
    limit: number;
    sortField: SummarySortField;
    sortOrder: SortOrder;
    pageMeta: PageMeta;
    pageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const HSNSummaryTable = (props: InventoryTableProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { summaryData, pageMeta, isLoading, limit, sortField, sortOrder, sortRequest, pageChange } = props;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const renderLoadingSkeleton = () => (
        <Box sx={{ p: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box key={item} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[50], 0.5)
                }}>
                    <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width="12%" height={24} />
                    <Skeleton variant="text" width="25%" height={24} />
                    <Skeleton variant="text" width="8%" height={24} />
                    <Skeleton variant="text" width="10%" height={24} />
                    <Skeleton variant="text" width="12%" height={24} />
                    <Skeleton variant="text" width="12%" height={24} />
                    <Skeleton variant="text" width="13%" height={24} />
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            {/* Enhanced Main Table */}
            <Fade in timeout={600}>
                <StyledTableContainer>
                    {isLoading ? (
                        renderLoadingSkeleton()
                    ) : summaryData?.length === 0 ? (
                        <EmptyStateContainer>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Box sx={{
                                    p: 3,
                                    borderRadius: '50%',
                                    bgcolor: alpha(theme.palette.grey[200], 0.5),
                                    border: `2px dashed ${alpha(theme.palette.grey[400], 0.5)}`
                                }}>
                                    <InventoryIcon sx={{
                                        fontSize: 64,
                                        color: theme.palette.text.secondary,
                                        opacity: 0.7
                                    }} />
                                </Box>

                                <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                                    <Typography variant="h4" gutterBottom fontWeight={700}>
                                        No HSN/SAC Code found
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                        Your inventory appears to be empty or no HSN/SAC match your current search criteria.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your filters or add new products with HSN/SAC to get started.
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        sx={{ borderRadius: 1 }}
                                        onClick={() => navigate('/products')}
                                    >
                                        View All Items
                                    </Button>
                                </Box>
                            </Box>
                        </EmptyStateContainer>
                    ) : (
                        <Table sx={{ width: '100%' }} stickyHeader>
                            <TableHead sx={{
                                background: `
                                        linear-gradient(135deg, 
                                            ${alpha(theme.palette.primary.main, 0.12)} 0%, 
                                            ${alpha(theme.palette.primary.main, 0.06)} 50%,
                                            ${alpha(theme.palette.secondary.main, 0.08)} 100%
                                        )
                                    `,
                                '& .MuiTableCell-head': {
                                    borderBottom: 'none',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    color: theme.palette.text.primary,
                                    background: 'transparent',
                                    backdropFilter: 'blur(15px)',
                                },
                            }}>
                                <TableRow>
                                    <TableCell >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap', }}>
                                            <Typography variant="inherit"># Sr. No.</Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap', }}>
                                        <Tooltip
                                            title={'Sort by HSN/SAC Code'}
                                            arrow
                                            placement="top"
                                            TransitionComponent={Zoom}
                                        >
                                            <SortableHeader
                                                active={sortField === "hsn_code"}
                                                direction={sortField === "hsn_code" ? sortOrder : "asc"}
                                                onClick={() => sortRequest("hsn_code")}
                                            >
                                                HSN Code
                                            </SortableHeader>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell>
                                        <Tooltip
                                            title={'Sort by Product Name'}
                                            arrow
                                            placement="top"
                                            TransitionComponent={Zoom}
                                        >
                                            <SortableHeader
                                                active={sortField === "stock_item_name"}
                                                direction={sortField === "stock_item_name" ? sortOrder : "asc"}
                                                onClick={() => sortRequest("stock_item_name")}
                                            >
                                                Product
                                            </SortableHeader>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell>
                                        Unit
                                    </TableCell>

                                    <TableCell>
                                        <Tooltip
                                            title={'Sort by Total Quantity'}
                                            arrow
                                            placement="top"
                                            TransitionComponent={Zoom}
                                        >
                                            <SortableHeader
                                                active={sortField === "current_stock"}
                                                direction={sortField === "current_stock" ? sortOrder : "asc"}
                                                onClick={() => sortRequest("current_stock")}
                                            >
                                                Quantity
                                            </SortableHeader>
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'right', whiteSpace: 'nowrap', }}>
                                        <Typography variant="inherit">Total Value</Typography>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'right', whiteSpace: 'nowrap', }}>
                                        <Typography variant="inherit">Taxable Value</Typography>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'right', whiteSpace: 'nowrap', }}>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Typography variant="inherit">Tax Rate</Typography>
                                            <Tooltip
                                                title={'Total Tax Rate e.g. CGST + SGST'}
                                                arrow
                                                placement="top"
                                                TransitionComponent={Zoom}
                                            >
                                                <Info sx={{
                                                    fontSize: 20,
                                                    color: theme.palette.text.secondary,
                                                    opacity: 0.7
                                                }} />
                                            </Tooltip>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'right', whiteSpace: 'nowrap', }}>
                                        <Typography variant="inherit">Tax Amount</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {summaryData?.map((item, index) => {
                                    const serial = index + 1 + (pageMeta?.page - 1) * limit;
                                    return (
                                        <HSNSummaryRow
                                            key={`${item.hsn_code}-${item.item_id}-${index}`}
                                            row={item}
                                            serial={serial}
                                        />
                                    );
                                })}

                                {/* Enhanced Spacer Row */}
                                <TableRow>
                                    <TableCell colSpan={8} sx={{
                                        padding: 0,
                                        borderBottom: 'none',
                                        height: theme.spacing(2),
                                        background: `linear-gradient(90deg, 
                                            transparent 0%, 
                                            ${alpha(theme.palette.divider, 0.1)} 50%, 
                                            transparent 100%
                                        )`
                                    }} />
                                </TableRow>

                                {/* Enhanced Totals Row */}
                                <TotalsRow>
                                    <TableCell colSpan={3}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: 'fit-content',
                                            gap: 1.5,
                                            py: 1,
                                            whiteSpace: 'nowrap',
                                            px: 2,
                                            borderRadius: 1,
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                        }}>
                                            <TrendingUpIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                            <Typography variant="subtitle1" fontWeight={800}>
                                                Grand Total
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>

                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <Box sx={{
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end'
                                        }}>
                                            <Typography variant="subtitle1" fontWeight={800} color="success.main">
                                                {formatCurrency(pageMeta.total_value)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Total Value
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <Box sx={{
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end'
                                        }}>
                                            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                                                {formatCurrency(pageMeta.taxable_value)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Total Taxable Value
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <Box sx={{
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end'
                                        }}>
                                            <Typography variant="subtitle1" fontWeight={800} color="warning.main">
                                                {formatCurrency(pageMeta.tax_amount)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Total Tax
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TotalsRow>
                            </TableBody>
                        </Table>
                    )}
                </StyledTableContainer>
            </Fade>

            {/* Enhanced Pagination with Summary */}
            {!isLoading && summaryData?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <BottomPagination
                        total={pageMeta.total}
                        item="items"
                        page={pageMeta?.page}
                        metaPage={pageMeta.page}
                        rowsPerPage={limit}
                        onChange={pageChange}
                    />
                </Box>
            )}
        </Box>
    );
};

export default HSNSummaryTable;
