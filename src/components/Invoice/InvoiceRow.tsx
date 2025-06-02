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
    // Avatar,
    IconButton,
    TableCell,
    TableRow,
    // Chip,
    Fade,
    Zoom,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import CategoryIcon from "@mui/icons-material/Category";
import { GetAllVouchars } from "@/utils/types";
import {
    CurrencyRupee,
    Print,
    // Email, PeopleAlt, Phone, 
    Today
} from "@mui/icons-material";
import { formatDate } from "@/utils/functions";
// import { GetProduct } from "@/utils/types";

interface ProductRowProps {
    inv: GetAllVouchars;
    onDelete: (id: string) => void;
    onEdit: (inv: GetAllVouchars) => void;
    onView: (inv: GetAllVouchars) => void;
    onPrint?: (inv: GetAllVouchars) => void;
    index: number;
}


export const InvoicerRow: React.FC<ProductRowProps> = ({ inv, onDelete, onEdit, onView, onPrint, index }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const confirmDelete = () => {
        onDelete(inv?._id ?? '');
        setOpenDeleteDialog(false);
    };

    // const getInitials = (name: string): string => {
    //     return name
    //         .split(' ')
    //         .map(word => word.charAt(0))
    //         .join('')
    //         .toUpperCase()
    //         .slice(0, 2);
    // };

    // const getAvatarColor = (name: string): string => {
    //     const colors = [
    //         '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    //         '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    //     ];
    //     const index = name.length % colors.length;
    //     return colors[index];
    // };

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
                        borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
                    }}
                    onClick={() => onView(inv)}
                >
                    {/* Product Info */}
                    <TableCell sx={{ pl: 3, }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: theme.palette.text.primary,
                                    mb: 0.5,
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                {index}
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Today sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(inv.created_at) || "N/A"}
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        color: theme.palette.text.primary,
                                        mb: 0.5,
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {inv.party_name}
                                </Typography>
                                {/* {inv.alias && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        icon={<PeopleAlt />}
                                        label={inv.alias}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: '0.7rem',
                                            height: '20px',
                                            borderRadius: '10px',
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            borderColor: alpha(theme.palette.primary.main, 0.2),
                                            color: theme.palette.primary.main,
                                        }}
                                    />
                                </Box>} */}
                            </Box>
                        </Box>
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {/* <Phone
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle", mr: 1 }}
                                /> */}
                                {inv.voucher_type}{" "}
                                {/* {inv?.phone?.number || "N/A"} */}
                            </Typography>
                            {/* <Chip
                                icon={<Email />}
                                label={inv.email || 'No Email'}
                                color={'primary'}
                                size="medium"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: '22px',
                                    fontWeight: 600,
                                }}
                            /> */}
                        </Box>
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {inv.voucher_number ? `${inv.voucher_number}` : ' N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>

                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {inv.is_deemed_positive && <CurrencyRupee
                                    sx={{
                                        fontSize: '1.1rem',
                                        mr: 0.5,
                                        color: !inv.is_deemed_positive ? theme.palette.error.main : theme.palette.success.main,
                                    }} />}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: !inv.is_deemed_positive ? theme.palette.error.main : theme.palette.success.main,
                                    }}
                                >
                                    {inv.is_deemed_positive ? Math.abs(inv.amount) : " "}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {!inv.is_deemed_positive && <CurrencyRupee
                                    sx={{
                                        fontSize: '1.1rem',
                                        mr: 0.5,
                                        color: inv.is_deemed_positive ? theme.palette.success.main : theme.palette.error.main,
                                    }} />}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: inv.is_deemed_positive ? theme.palette.success.main : theme.palette.error.main,
                                    }}
                                >
                                    {inv.is_deemed_positive ? " " : inv.amount}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 3, pl: 1 }}>
                        <Zoom in={isHovered} timeout={200}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
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
                                <Tooltip title="Print Invoice" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onPrint)
                                                onPrint(inv);
                                        }}
                                        sx={{
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            color: theme.palette.success.main,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <Print fontSize="small" />
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