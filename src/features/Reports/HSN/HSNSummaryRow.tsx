import { useState, useMemo } from 'react';
import {
    Box,
    TableCell,
    TableRow,
    Typography,
    IconButton,
    Collapse,
    useTheme,
    alpha,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    Chip,
    Avatar,
    Tooltip,
    Badge,
    LinearProgress,
    Fade,
    Zoom,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { HSNSummary } from '@/utils/types';
import { formatDate } from '@/utils/functions';
import { useNavigate } from 'react-router-dom';

// Enhanced Styled Components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    position: 'relative',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '& .MuiTableCell-root': {
        padding: '8px 16px',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
        fontWeight: 500,
        transition: 'all 0.2s ease',
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        transform: 'translateX(4px)',
        transition: 'all 0.2s ease',
        '& .expand-button': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            transform: 'scale(1.1)',
        },
    },
    '&.expanded': {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },

}));

const ExpandButton = styled(IconButton)(({ theme }) => ({
    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(0.8),
    backgroundColor: alpha(theme.palette.grey[100], 0.6),
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        transform: 'scale(1.1)',
    },
    '&.expanded': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const SerialBadge = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: theme.spacing(1),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '0.85rem',
    marginRight: theme.spacing(1),
    transition: 'all 0.3s ease',
}));

const DetailTable = styled(Table)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    borderRadius: 1,
    overflow: 'hidden',
    '& .MuiTableHead-root': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: theme.palette.text.primary,
            padding: theme.spacing(1.5, 2),
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        },
    },
    '& .MuiTableBody-root': {
        '& .MuiTableRow-root': {
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                transform: 'scale(1.002)',
            },
            '& .MuiTableCell-body': {
                padding: theme.spacing(1.5, 2),
                fontSize: '0.85rem',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            },
        },
    },
}));


const InvoiceChip = styled(Chip)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    fontWeight: 600,
    '&.sales': {
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.dark,
        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
    },
    '&.purchase': {
        backgroundColor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.dark,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
    },
}));

const ValueBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    '& .value': {
        fontWeight: 700,
        fontSize: '0.95rem',
        lineHeight: 1.2,
    },
    '& .label': {
        fontSize: '0.7rem',
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginTop: theme.spacing(0.2),
    },
}));

const TotalsRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.grey[50], 0.8),
    '& .MuiTableCell-root': {
        fontWeight: 700,
        fontSize: '0.9rem',
        color: theme.palette.text.primary,
        borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderBottom: 'none',
        padding: theme.spacing(1.5, 2),
    },
}));

interface InventoryRowRowProps {
    row: HSNSummary;
    serial: number;
}

export const HSNSummaryRow = (props: InventoryRowRowProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { row, serial } = props;
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Calculate invoice totals
    const invoiceTotals = useMemo(() => {
        if (!row.invoices?.length) return { totalAmount: 0, taxableValue: 0, totalTax: 0, totalQty: 0 };

        return row.invoices.reduce(
            (acc, invoice) => ({
                totalAmount: acc.totalAmount + (invoice.total_amount || 0),
                taxableValue: acc.taxableValue + (invoice.taxable_value || 0),
                totalTax: acc.totalTax + (invoice.total_tax || 0),
                totalQty: acc.totalQty + (invoice.quantity || 0),
            }),
            { totalAmount: 0, taxableValue: 0, totalTax: 0, totalQty: 0 }
        );
    }, [row.invoices]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const handleRowClick = () => {
        setOpen(!open);
    };

    const handleInvoiceClick = (invoiceId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/invoices/${invoiceId}`);
    };

    return (
        <>
            <StyledTableRow
                className={open ? 'expanded' : ''}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleRowClick}
            >
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SerialBadge
                            sx={{
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                backgroundColor: isHovered
                                    ? alpha(theme.palette.primary.main, 0.2)
                                    : alpha(theme.palette.primary.main, 0.1)
                            }}
                        >
                            {serial}
                        </SerialBadge>

                        <Tooltip
                            title={open ? 'Collapse details' : 'Expand details'}
                            arrow
                        >
                            <ExpandButton
                                className={`expand-button ${open ? 'expanded' : ''}`}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(!open);
                                }}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </ExpandButton>
                        </Tooltip>

                        {row.invoices?.length > 0 && (
                            <Badge
                                badgeContent={row.invoices.length}
                                color="primary"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '0.7rem',
                                        minWidth: 18,
                                        height: 18
                                    }
                                }}
                            >
                                <ReceiptIcon fontSize="small" color="action" />
                            </Badge>
                        )}
                    </Box>
                </TableCell>

                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: theme.palette.secondary.main,
                                fontSize: '0.8rem',
                                fontWeight: 700
                            }}
                        >
                            {row.hsn_code?.substring(0, 2) || 'HS'}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" fontWeight="600" color="primary.main">
                                {row.hsn_code}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                HSN Code
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                                mb: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.3
                            }}
                        >
                            {row.item}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Chip
                        label={row.unit || 'N/A'}
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            minWidth: 50,
                            fontSize: '0.75rem'
                        }}
                    />
                </TableCell>

                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="700" color="primary.main">
                            {formatNumber(row.quantity || 0)}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <ValueBox>
                        <Typography className="value" color="success.main">
                            {formatCurrency(row.total_value || 0)}
                        </Typography>
                        <Typography className="label">
                            Total Value
                        </Typography>
                    </ValueBox>
                </TableCell>

                <TableCell>
                    <ValueBox>
                        <Typography className="value" color="primary.main">
                            {formatCurrency(row.taxable_value || 0)}
                        </Typography>
                        <Typography className="label">
                            Taxable
                        </Typography>
                    </ValueBox>
                </TableCell>
               
                <TableCell>
                    <ValueBox>
                        <Typography className="value" color="primary.main">
                            {formatCurrency(row.tax_rate || 0)}%
                        </Typography>
                        <Typography className="label">
                            Tax Rate
                        </Typography>
                    </ValueBox>
                </TableCell>

                <TableCell>
                    <ValueBox>
                        <Typography className="value" color="warning.main">
                            {formatCurrency(row.tax_amount || 0)}
                        </Typography>
                        <Typography className="label">
                            Tax Amount
                        </Typography>
                        {row.taxable_value && row.tax_amount && (
                            <LinearProgress
                                variant="determinate"
                                value={(row.tax_amount / row.taxable_value) * 100}
                                sx={{
                                    width: 40,
                                    height: 3,
                                    mt: 0.5,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: theme.palette.warning.main,
                                    },
                                }}
                            />
                        )}
                    </ValueBox>
                </TableCell>
            </StyledTableRow>

            {/* Enhanced Detail Panel */}
            <TableRow>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        borderTop: open ? `2px solid ${alpha(theme.palette.divider, 0.99)}` : "none",
                        borderBottom: open ? `2px solid ${alpha(theme.palette.divider, 0.99)}` : "none"
                    }}
                    colSpan={9}
                >
                    <Collapse in={open} timeout={500}>
                        <Box sx={{ margin: 1 }}>
                            <Fade in={open}>
                                <Box>
                                    {/* Header Section */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                        pb: 1,
                                        borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                                width: 48,
                                                height: 48
                                            }}>
                                                <AssessmentIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                                    Invoice Details
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Complete transaction history for {row.item}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Enhanced Invoice Table */}
                                    <Paper elevation={0} sx={{
                                        borderRadius: 1,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                        overflow: 'hidden',
                                        mb: 2
                                    }}>
                                        <TableContainer>
                                            <DetailTable >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CalendarTodayIcon fontSize="small" />
                                                                Date
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <BusinessIcon fontSize="small" />
                                                                Party Details
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <AccountBalanceIcon fontSize="small" />
                                                                TIN / GSTIN
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                            Type
                                                        </TableCell>
                                                        <TableCell >
                                                            Invoice No.
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>
                                                            Unit
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'right' }}>
                                                            QTY
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'right' }}>
                                                            Total Amount
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'right' }}>
                                                            Taxable Value
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'right' }}>
                                                            Tax Amount
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {row.invoices && row.invoices.length > 0 ? (
                                                        row.invoices.map((invoice, index) => (
                                                            <Zoom
                                                                key={`${invoice.voucher_id}-${index}-${row.item_id}-${row.hsn_code}`}
                                                                in={open}
                                                                style={{ transitionDelay: `${index * 100}ms` }}
                                                            >
                                                                <TableRow
                                                                    hover
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                                            transform: 'scale(1.01)',
                                                                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                                        }
                                                                    }}
                                                                >
                                                                    <TableCell>
                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight={600}>
                                                                                {formatDate(invoice.date)}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {new Date(invoice.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Box>
                                                                            <Typography
                                                                                variant="body2"
                                                                                fontWeight={600}
                                                                                sx={{
                                                                                    display: '-webkit-box',
                                                                                    WebkitLineClamp: 1,
                                                                                    WebkitBoxOrient: 'vertical',
                                                                                    overflow: 'hidden',
                                                                                    mb: 0.5
                                                                                }}
                                                                            >
                                                                                {invoice.party_name}
                                                                            </Typography>
                                                                            {invoice.party_tin && (
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {invoice.party_tin}
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Chip
                                                                            label={invoice.party_tin || 'N/A'}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontSize: '0.7rem',
                                                                                maxWidth: '100%'
                                                                            }}
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        <InvoiceChip
                                                                            label="Sales"
                                                                            size="small"
                                                                            className="sales"
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                                                {invoice.voucher_number}
                                                                            </Typography>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={(e) => handleInvoiceClick(invoice.voucher_id, e)}
                                                                                sx={{
                                                                                    opacity: 0.7,
                                                                                    '&:hover': { opacity: 1 }
                                                                                }}
                                                                            >
                                                                                <OpenInNewIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        <Chip
                                                                            label={row.unit || 'N/A'}
                                                                            size="small"
                                                                            color="default"
                                                                            sx={{ fontSize: '0.7rem' }}
                                                                        />
                                                                    </TableCell>

                                                                    <TableCell align="right">
                                                                        <Typography variant="body2" fontWeight={600}>
                                                                            {formatNumber(invoice.quantity || 0)}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align="right">
                                                                        <Typography variant="body2" fontWeight={700} color="success.main">
                                                                            {formatCurrency(invoice.total_amount || 0)}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align="right">
                                                                        <Typography variant="body2" fontWeight={600} color="primary.main">
                                                                            {formatCurrency(invoice.taxable_value || 0)}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align="right">
                                                                        <Typography variant="body2" fontWeight={600} color="warning.main">
                                                                            {formatCurrency(invoice.total_tax || 0)}
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Zoom>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    gap: 2,
                                                                    color: 'text.secondary'
                                                                }}>
                                                                    <ReceiptIcon sx={{ fontSize: 48, opacity: 0.5 }} />
                                                                    <Typography variant="body1" fontWeight={600}>
                                                                        No invoices found
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        This item hasn't been used in any transactions yet.
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {/* Enhanced Totals Row */}
                                                    {row.invoices && row.invoices.length > 0 && (
                                                        <TotalsRow>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <AssessmentIcon fontSize="small" color="primary" />
                                                                    <Typography variant="subtitle2" fontWeight={800}>
                                                                        Totals
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell />
                                                            <TableCell />
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={`${row.invoices.length} invoices`}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell />
                                                            <TableCell />
                                                            <TableCell align="right">

                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="subtitle2" fontWeight={800} color="success.main">
                                                                    {formatCurrency(invoiceTotals.totalAmount)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                                                    {formatCurrency(invoiceTotals.taxableValue)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="subtitle2" fontWeight={800} color="warning.main">
                                                                    {formatCurrency(invoiceTotals.totalTax)}
                                                                </Typography>
                                                            </TableCell>
                                                        </TotalsRow>
                                                    )}
                                                </TableBody>
                                            </DetailTable>
                                        </TableContainer>
                                    </Paper>


                                </Box>
                            </Fade>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};