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
import EditIcon from "@mui/icons-material/Edit";
import { GetInventoryGroups } from "@/utils/types";
import { viewProduct } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { formatDate } from "@/utils/functions";

interface ProductRowProps {
    inventoryGroup: GetInventoryGroups;
    onDelete: (id: string) => void;
    onEdit: (inventoryGroup: GetInventoryGroups) => void;
    onView: (inventoryGroup: GetInventoryGroups) => void;
    index: number;
}


export const InventoryGroupsRow: React.FC<ProductRowProps> = ({ inventoryGroup, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany } = useSelector((state: RootState) => state.auth)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const confirmDelete = () => {
        onDelete(inventoryGroup?._id ?? '');
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
                    onClick={() => onView(inventoryGroup)}
                >
                    {/* Group Info */}
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 2,
                                    bgcolor: getAvatarColor(inventoryGroup.inventory_group_name),
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(inventoryGroup.inventory_group_name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={inventoryGroup?.image ? inventoryGroup.image : ''}
                            >
                                {(getInitials(inventoryGroup.inventory_group_name))}
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
                                    {inventoryGroup.inventory_group_name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '0.7rem',
                                        height: '20px',
                                        color: theme.palette.primary.main,
                                        mb: 0.5,
                                    }}
                                >
                                    {inventoryGroup.description || 'No Description'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    {/* Group Type */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {inventoryGroup.parent || 'Primary Group'}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Group HSN/SAC Code */}
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
                                    {inventoryGroup.gst_hsn_code || 'No HSN/SAC Code'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell> */}
                    {/* GST Taxability */}
                    {/* <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: theme.palette.success.main,
                                    }}
                                >
                                    {inventoryGroup.gst_taxability || 'Taxable'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell> */}
                    {/* Created At */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    // fontSize: '1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(inventoryGroup?.created_at)}
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
                                            onView(inventoryGroup);
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
                                            onEdit(inventoryGroup);
                                            dispatch(viewProduct({ product_id: inventoryGroup._id, company_id: currentCompany?._id ?? '' }));
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
                    Delete {inventoryGroup.inventory_group_name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The Customer Group will be permanently removed from your inventory.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{inventoryGroup.inventory_group_name}</strong>"?
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