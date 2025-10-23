import React, { useState, } from "react";
import {
    Box,
    Typography,
    useTheme,
    alpha,
    TableCell,
    TableRow,
    Fade,
    Checkbox,
} from "@mui/material";
import { GetAllVouchars } from "@/utils/types";
import {
    CancelOutlined,
    CheckCircleOutline,
    ScheduleOutlined,
    Today
} from "@mui/icons-material";
import { formatDate } from "@/utils/functions";

interface CustomerInvoicesRowProps {
    inv: any;
    onView: (inv: GetAllVouchars) => void;
    index: number;
    selected?: boolean;
    onSelect?: (checked: boolean) => void;
}


export const CustomerInvoicesRow: React.FC<CustomerInvoicesRowProps> = ({ inv, index, selected, onSelect }) => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <Fade in timeout={300 + index * 100}>
                <TableRow
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
                        "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "& .MuiTableCell-root": {
                            padding: '8px 16px',
                        },
                        borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
                    }}
                    onClick={() => { if (onSelect) onSelect(!selected); }}
                >
                    {/* Select Check Box */}
                    <TableCell align="left" sx={{ px: 1, }}>
                        <Checkbox checked={!!selected} onChange={(e, checked) => {
                            e.stopPropagation();
                            if (onSelect) onSelect(checked);
                        }} />
                    </TableCell>

                    {/* Invoice Creation Date */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Today sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(inv.date) || "N/A"}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Party Information */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 0.5,
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {inv?.customer}
                        </Typography>
                    </TableCell>

                    {/* Invoice Type */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {inv.voucher_type}
                        </Typography>
                    </TableCell>

                    {/* Invoice Payment Status */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && (inv.grand_total === inv.paid_amount) &&
                                <CheckCircleOutline sx={{ mr: 0.5, color: theme.palette.success.main }} />}
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && (inv.paid_amount === 0) &&
                                <CancelOutlined sx={{ mr: 0.5, color: theme.palette.error.main }} />}
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && ((inv.grand_total > inv.paid_amount) && (inv.paid_amount > 0)) &&
                                <ScheduleOutlined sx={{ mr: 0.5, color: theme.palette.warning.main }} />}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    color: ['Purchase', 'Sales'].includes(inv.voucher_type) &&
                                        (inv.grand_total === inv.paid_amount) ? theme.palette.success.main : inv.paid_amount === 0 ? theme.palette.error.main : (inv.grand_total > inv.paid_amount && inv.paid_amount > 0) ? theme.palette.warning.main : theme.palette.text.primary,
                                }}
                            >
                                {['Purchase', 'Sales'].includes(inv.voucher_type) && ((inv.grand_total === inv.paid_amount) ? "Paid" : (inv.paid_amount === 0 ? "Unpaid" : "Partially Paid"))}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Invoice Number */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {inv.voucher_number ? `${inv.voucher_number}` : ' N/A'}
                        </Typography>
                    </TableCell>

                    {/* Debit Invoice amount */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {(inv.amount > 0) && <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    mr: 0.5,
                                    color: theme.palette.error.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.error.main,
                                }}
                            >
                                {inv.amount > 0 ? Math.abs(inv.amount) : " "}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Credit Invoice amount */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {!(inv.amount > 0) && <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    mr: 0.5,
                                    color: theme.palette.success.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.success.main,
                                }}
                            >
                                {inv.amount > 0 ? "" : Math.abs(inv.amount)}
                            </Typography>
                        </Box>
                    </TableCell>
                </TableRow>
            </Fade>
        </>
    );
};