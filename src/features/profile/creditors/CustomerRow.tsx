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
    Chip,
    Fade,
    Zoom,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import { GetUserLedgers } from "@/utils/types";
import { Email, PeopleAlt, Phone, Today } from "@mui/icons-material";
import { formatDate } from "@/utils/functions";
// import { GetProduct } from "@/utils/types";

interface ProductRowProps {
    cus: GetUserLedgers;
    onDelete: (id: string) => void;
    onEdit: (cus: GetUserLedgers) => void;
    onView: (cus: GetUserLedgers) => void;
    index: number;
}


export const CustomerRow: React.FC<ProductRowProps> = ({ cus, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const confirmDelete = () => {
        onDelete(cus?._id ?? '');
        setOpenDeleteDialog(false);
    };

    const getInitials = (name: string): string => {
        return name
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
                        borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
                    }}
                    onClick={() => onView(cus)}
                >
                    {/* Product Info */}
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    mr: 2,
                                    objectFit: 'contain',
                                    bgcolor: getAvatarColor(cus.name),
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(cus.name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={typeof cus?.image === 'string' ? cus.image : (cus?.image instanceof File ? URL.createObjectURL(cus.image) : '')}
                            >
                                {(getInitials(cus.name))}
                            </Avatar>
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
                                    {cus.name}
                                </Typography>
                                {cus.alias && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        icon={<PeopleAlt />}
                                        label={cus.alias}
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
                                </Box>}
                            </Box>
                        </Box>
                    </TableCell>

                    {/* Quantity with Status */}
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
                                <Phone
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle", mr: 1 }}
                                />
                                {cus.phone?.code}{" "}
                                {cus?.phone?.number || "N/A"}
                            </Typography>
                            <Chip
                                icon={<Email />}
                                label={cus.email || 'No Email'}
                                color={'primary'}
                                size="medium"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: '22px',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                    </TableCell>

                    {/* Selling Price */}
                    <TableCell align="right" sx={{ px: 1 }}>
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
                                    {cus.mailing_state ? `State: ${cus.mailing_state}` : 'State: N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>

                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon
                                    sx={{
                                        fontSize: '1.1rem',
                                        mr: 0.5,
                                        color: cus.parent.includes('Debtors') ? theme.palette.error.main : theme.palette.success.main
                                    }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: cus.parent.includes('Debtors') ? theme.palette.error.main : theme.palette.success.main,
                                    }}
                                >
                                    {cus.parent || "N/A"}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>

                    {/* Purchase Price */}
                    <TableCell align="right" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Today sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(cus.created_at) || "N/A"}
                            </Typography>
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
                                            onView(cus);
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

                                <Tooltip title="Edit Customer" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(cus);
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

                                <Tooltip title="Delete Customer" arrow>
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
                        borderRadius: 3,
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
                    Delete {cus.name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The product will be permanently removed from your company database.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{cus.name}</strong>"?
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