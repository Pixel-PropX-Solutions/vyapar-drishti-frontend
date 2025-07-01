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
    Avatar,
    IconButton,
    TableCell,
    TableRow,
    // Chip,
    Fade,
    Zoom,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import CategoryIcon from "@mui/icons-material/Category";
import { GetAllAccountingGroups } from "@/utils/types";
import { viewProduct } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { formatDate } from "@/utils/functions";

interface ProductRowProps {
    cusGroup: GetAllAccountingGroups;
    onDelete: (id: string) => void;
    onEdit: (cusGroup: GetAllAccountingGroups) => void;
    onView: (cusGroup: GetAllAccountingGroups) => void;
    index: number;
}


export const CustomerGroupsRow: React.FC<ProductRowProps> = ({ cusGroup, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany } = useSelector((state: RootState) => state.auth)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const confirmDelete = () => {
        onDelete(cusGroup?._id ?? '');
        setOpenDeleteDialog(false);
    };

    const getInitials = (name: string): string => {
        return name.replace(/[()]/g, '')
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (name: string): string => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    // const getStockStatus = (quantity: number) => {
    //     if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const, icon: <TrendingDownIcon fontSize="small" /> };
    //     if (quantity < 10) return { label: 'Low Stock', color: 'warning' as const, icon: <TrendingDownIcon fontSize="small" /> };
    //     return { label: 'In Stock', color: 'success' as const, icon: <TrendingUpIcon fontSize="small" /> };
    // };

    // const stockStatus = getStockStatus(cusGroup?.current_stock || 0);
    // const profit = (cusGroup.sales_value / cusGroup.sales_qty - (cusGroup.purchase_value / cusGroup.purchase_qty));
    // const profitMargin = cusGroup.purchase_value ? ((profit / (cusGroup.sales_value / cusGroup.sales_qty)) * 100) : 0;

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
                    onClick={() => onView(cusGroup)}
                >
                    {/* Group Info */}
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 2,
                                    bgcolor: getAvatarColor(cusGroup.accounting_group_name),
                                    fontSize: '.9rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(cusGroup.accounting_group_name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={cusGroup?.image ? cusGroup.image : ''}
                            >
                                {(getInitials(cusGroup.accounting_group_name))}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        // fontSize: '0.95rem',
                                        color: theme.palette.text.primary,
                                        // mb: 0.5,
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {cusGroup.accounting_group_name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '0.7rem',
                                        height: '20px',
                                        color: theme.palette.primary.main,
                                        mb: 0.5,
                                        // transition: 'color 0.3s ease',
                                    }}
                                >
                                    {cusGroup.description || 'No Description'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>

                    {/* Quantity with Status */}
                    <TableCell align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {cusGroup.parent || 'Primary'}
                            </Typography>
                            {/* <Chip
                                icon={stockStatus.icon}
                                label={stockStatus.label}
                                color={stockStatus.color}
                                size="small"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: '22px',
                                    fontWeight: 600,
                                }}
                            /> */}
                        </Box>
                    </TableCell>

                    {/* Selling Price */}
                    {/* <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {cusGroup.primary_group}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell> */}
                    {/* <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CurrencyRupeeIcon sx={{ fontSize: '1.1rem', mr: 0.5, color: theme.palette.success.main }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: theme.palette.success.main,
                                    }}
                                >
                                    {cusGroup.description || 'No Sales yet'}
                                </Typography>
                            </Box>
                             {profitMargin > 0 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: profitMargin > 20 ? theme.palette.success.main : theme.palette.warning.main,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {profitMargin.toFixed(1)}% margin
                                </Typography>
                            )} 
                        </Box>
                    </TableCell> */}

                    {/* Purchase Price */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {/* <CurrencyRupeeIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} /> */}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    // fontSize: '1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(cusGroup?.created_at)}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center" >
                        <Zoom in={isHovered} timeout={200}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                                {/* <Tooltip title="View Details" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(cusGroup);
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
                                </Tooltip> */}

                                <Tooltip title="Edit Product" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            onEdit(cusGroup);
                                            dispatch(viewProduct({ product_id: cusGroup._id, company_id: currentCompany?._id ?? '' }));
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

                                <Tooltip title="Delete Product" arrow>
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
                    Delete {cusGroup.accounting_group_name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The Customer Group will be permanently removed from your inventory.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{cusGroup.accounting_group_name}</strong>"?
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
                        Delete Product
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};