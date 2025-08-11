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
    Fade,
    Zoom,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GetStockItem } from "@/utils/types";
import { viewProduct } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAvatarColor, getInitials } from "@/utils/functions";
import { CurrencyRupee } from "@mui/icons-material";

interface ProductRowProps {
    product: GetStockItem;
    onDelete: (id: string) => void;
    onEdit: (product: GetStockItem) => void;
    onView: (product: GetStockItem) => void;
    index: number;
}


export const ProductRow: React.FC<ProductRowProps> = ({ product, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id == currentCompanyId);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const closingValue = (((product?.purchase_value + product?.opening_value) / (product?.purchase_qty + product?.opening_balance)) * product?.current_stock) || 0;
    const closingRate = (((product?.purchase_value + product?.opening_value) / (product?.purchase_qty + product?.opening_balance)) || 0).toFixed(2);

    const confirmDelete = () => {
        onDelete(product?._id ?? '');
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
                        borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
                        "& .MuiTableCell-root": {
                            padding: '8px 16px',
                        },
                    }}
                    onClick={() => onView(product)}
                >
                    {/* Product Info */}
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 2,
                                    bgcolor: getAvatarColor(product.stock_item_name),
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(product.stock_item_name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={product?.image ? product.image : ''}
                            >
                                {(getInitials(product.stock_item_name))}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        mb: 0.5,
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {product.stock_item_name}
                                </Typography>
                                {product.description && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            mb: 0.5,
                                        }}
                                    >
                                        {product.description}
                                    </Typography>
                                </Box>}
                            </Box>
                        </Box>
                    </TableCell>

                    {/* Product Low Stock Alert */}
                    {/* {!gst_enable && <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {product.low_stock_alert || 0}
                        </Typography>
                    </TableCell>} */}

                    {/* Product HSN/SAC Code */}
                    {gst_enable && <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {product.gst_hsn_code ? (`#${product.gst_hsn_code}`) : ('-')}
                        </Typography>
                    </TableCell>}

                    {/* Product Opening Balance */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {product.opening_balance || 0}  {product.unit}
                        </Typography>
                    </TableCell>

                    {/* Product Closing Quantity */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {product?.current_stock} {product.unit}
                        </Typography>
                    </TableCell>

                    {/* Product Closing Rate */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            <CurrencyRupee sx={{ fontSize: '0.875rem', verticalAlign: 'middle', mr: 1 }} />
                            {closingRate}
                        </Typography>
                    </TableCell>

                    {/* Product Closing Balance */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            <CurrencyRupee sx={{ fontSize: '0.875rem', verticalAlign: 'middle', mr: 1 }} />
                            {closingValue.toFixed(2)}
                        </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                        <Zoom appear in >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                                <Tooltip title="View Details" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(product);
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

                                <Tooltip title="Edit Product" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            onEdit(product);
                                            dispatch(viewProduct({ product_id: product._id, company_id: currentCompanyDetails?._id ?? '' }));
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
                    Delete {product.stock_item_name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The product will be permanently removed from your inventory.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{product.stock_item_name}</strong>"?
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