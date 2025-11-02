import { useState } from 'react';
import {
    Box,
    TableCell,
    TableRow,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Chip,
    LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import { BillSummary } from '@/utils/types';
import { formatDate } from '@/utils/functions';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Enhanced Styled Components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    position: 'relative',
    transition: 'all 0.2s ease',
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


const ValueBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    whiteSpace: 'nowrap',
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

interface InventoryRowRowProps {
    row: BillSummary;
    serial: number;
}

export const BillSummaryRow = (props: InventoryRowRowProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { row, serial } = props;
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
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
                    </Box>
                </TableCell>

                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
                        <Box>
                            <Typography variant="body1" fontWeight="600" color="primary.main">
                                {row.voucher_number}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Invoice No.
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={(e) => handleInvoiceClick(row._id, e)}
                            sx={{
                                opacity: 0.7,
                                '&:hover': { opacity: 1 }
                            }}
                        >
                            <OpenInNew fontSize="small" />
                        </IconButton>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box sx={{ whiteSpace: 'nowrap', }}>
                        <Typography variant="body2" fontWeight={600}>
                            {formatDate(row.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                                whiteSpace: 'nowrap',
                                mb: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.3
                            }}
                        >
                            {row.party_name}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight="600"
                            sx={{
                                whiteSpace: 'nowrap',
                                mb: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.3
                            }}
                        >
                            {row.party_tin}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>
                    <Chip
                        label={row.voucher_type || 'Sales'}
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                            minWidth: 50,
                            fontSize: '0.75rem'
                        }}
                    />
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
                        <Typography className="value" color="warning.main">
                            {formatCurrency(row.tax_amount || 0)}
                        </Typography>
                        <Typography className="label">
                            Tax Amount
                        </Typography>
                        {row.total_value && row.tax_amount && (
                            <LinearProgress
                                variant="determinate"
                                value={(row.tax_amount / row.total_value) * 100}
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
        </>
    );
};