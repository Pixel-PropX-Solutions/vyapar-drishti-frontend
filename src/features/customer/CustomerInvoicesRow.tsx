import React, { useState, } from "react";
import {
    Box,
    Typography,
    useTheme,
    Tooltip,
    alpha,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    TableCell,
    TableRow,
    Fade,
    Zoom,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    onDelete: (id: string) => void;
    onEdit: (inv: GetAllVouchars) => void;
    onView: (inv: GetAllVouchars) => void;
    index: number;
}


export const CustomerInvoicesRow: React.FC<CustomerInvoicesRowProps> = ({ inv, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const confirmDelete = () => {
        onDelete(inv?._id ?? '');
        setOpenDeleteDialog(false);
    };

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
                    onClick={() => onView(inv)}
                >
                    {/* Serial No */}
                    <TableCell align="left" sx={{ pl: 3, }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                // fontSize: '0.95rem',
                                color: theme.palette.text.primary,
                                mb: 0.5,
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {index}
                        </Typography>
                    </TableCell>

                    {/* Invoice Creation Date */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Today sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    // fontSize: '1rem',
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
                                // fontSize: '0.95rem',
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
                                // fontSize: '1rem',
                                color: theme.palette.text.primary,
                            }}
                        >
                            {inv.voucher_type}
                        </Typography>
                    </TableCell>

                    {/* Invoice Payment Status */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && inv.status === 'Paid' &&
                                <CheckCircleOutline sx={{ mr: 0.5, color: theme.palette.success.main }} />}
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && inv.status === 'Unpaid' &&
                                <CancelOutlined sx={{ mr: 0.5, color: theme.palette.error.main }} />}
                            {['Purchase', 'Sales'].includes(inv.voucher_type) && inv.status === 'Partially Paid' &&
                                <ScheduleOutlined sx={{ mr: 0.5, color: theme.palette.warning.main }} />}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1rem',
                                    color: ['Purchase', 'Sales'].includes(inv.voucher_type) ?
                                        inv.status === 'Paid' ? theme.palette.success.main : inv.status === 'Unpaid' ? theme.palette.error.main : inv.status === 'Partially Paid' ? theme.palette.warning.main : theme.palette.text.primary : theme.palette.text.primary,
                                }}
                            >
                                {['Purchase', 'Sales'].includes(inv.voucher_type) ? inv.status ? inv.status : 'Status Unknown' : ""}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Invoice Number */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                // fontSize: '1rem',
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {inv.voucher_number ? `${inv.voucher_number}` : ' N/A'}
                        </Typography>
                    </TableCell>

                    {/* Debit Invoice amount */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {inv.is_deemed_positive && <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    mr: 0.5,
                                    color: !inv.is_deemed_positive ? theme.palette.success.main : theme.palette.error.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: !inv.is_deemed_positive ? theme.palette.success.main : theme.palette.error.main,
                                }}
                            >
                                {inv.is_deemed_positive ? Math.abs(inv.amount) : " "}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Credit Invoice amount */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {!inv.is_deemed_positive && <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    mr: 0.5,
                                    color: inv.is_deemed_positive ? theme.palette.error.main : theme.palette.success.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: inv.is_deemed_positive ? theme.palette.error.main : theme.palette.success.main,
                                }}
                            >
                                {inv.is_deemed_positive ? " " : inv.amount}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Zoom appear in timeout={200}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                                <Tooltip title="View Details" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(inv);
                                        }}
                                        sx={{
                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                            color: theme.palette.info.main,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.info.main, 0.2),
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Invoice" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(inv);
                                        }}
                                        sx={{
                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                            color: theme.palette.warning.main,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Invoice" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            setOpenDeleteDialog(true);
                                            e.stopPropagation();
                                        }}
                                        sx={{
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            color: theme.palette.error.main,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Zoom>
                    </TableCell>
                </TableRow>
            </Fade>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: `0 24px 50px ${alpha(theme.palette.error.main, 0.2)}`,
                    }
                }}
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        color: theme.palette.error.main,
                        fontWeight: 600,
                    }}
                >
                    <DeleteIcon />
                    Delete {inv.voucher_number}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The product will be permanently removed from your company database.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{inv.voucher_number}</strong>"?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                        startIcon={<DeleteIcon />}
                    >
                        Delete Customer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};