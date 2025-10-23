import React, { useState, } from "react";
import {
    Box,
    Typography,
    useTheme,
    alpha,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TableCell,
    TableRow,
    Fade,
    Alert,
    Menu,
    MenuItem,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GetAllVouchars } from "@/utils/types";
import {
    MoreVert,
    Print,
    Today
} from "@mui/icons-material";
import { formatDate } from "@/utils/functions";
import MenuButton from "../MaterialUI/MenuButton";

interface ProductRowProps {
    inv: GetAllVouchars;
    onDelete: (id: string) => void;
    onEdit: (inv: GetAllVouchars) => void;
    onView: (inv: GetAllVouchars) => void;
    onPrint?: (inv: GetAllVouchars) => void;
    index: number;
    selected?: boolean;
    onSelect?: (checked: boolean) => void;
}

export const InvoicerRow: React.FC<ProductRowProps> = ({ inv, onDelete, onEdit, onView, onPrint, index, selected, onSelect }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                        background: selected ? alpha(theme.palette.primary.main, 0.15) : 'inherit',
                        "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                        "& .MuiTableCell-root": {
                            padding: '8px 16px',
                        },
                        borderLeft: `4px solid ${isHovered ? theme.palette.primary.main : 'transparent'}`,
                    }}
                >
                    {/* Select Check Box */}
                    <TableCell align="left" sx={{ px: 1, }}>
                        <Checkbox checked={!!selected} onChange={(_, checked) => {
                            if (onSelect) onSelect(checked);
                        }} />
                    </TableCell>

                    {/* Serial No */}
                    {/* <TableCell align="left" sx={{ px: 1, }}>
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
                    </TableCell> */}

                    {/* Invoice Creation Date */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Today sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.text.secondary }} />
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
                            {inv.party_name}
                        </Typography>
                    </TableCell>

                    {/* Invoice Type */}
                    <TableCell align="left">
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
                            {inv.amount > 0 && <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    mr: 0.5,
                                    color: !(inv.amount > 0) ? theme.palette.error.main : theme.palette.success.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: !(inv.amount > 0) ? theme.palette.error.main : theme.palette.success.main,
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
                                    // fontSize: '1.1rem',
                                    mr: 0.5,
                                    color: inv.amount > 0 ? theme.palette.success.main : theme.palette.error.main,
                                }}
                            >
                                &#8377;
                            </Typography>}
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    // fontSize: '1.1rem',
                                    color: inv.amount > 0 ? theme.palette.success.main : theme.palette.error.main,
                                }}
                            >
                                {inv.amount > 0 ? " " : Math.abs(inv.amount)}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center" >
                        <>
                            <MenuButton
                                data-screenshot="toggle-mode"
                                onClick={(e) => {
                                    handleClick(e);
                                    e.stopPropagation();
                                }}
                                disableRipple
                                size="small"
                                aria-label="Open Menu"
                                aria-controls={open ? "notifications-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <MoreVert />
                            </MenuButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="notifications-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        variant: "outlined",

                                        elevation: 0,
                                        sx: {
                                            my: "4px",
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                {['Sales', 'Purchase'].includes(inv.voucher_type) && <MenuItem
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: .5
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(inv);
                                        handleClose();
                                    }}
                                >
                                    <VisibilityIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
                                    <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                        View
                                    </Typography>
                                </MenuItem>}

                                {['Sales', 'Purchase'].includes(inv.voucher_type) && <MenuItem
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: .5
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(inv);
                                        handleClose();
                                    }}
                                >
                                    <EditIcon fontSize="small" sx={{ color: theme.palette.warning.light }} />
                                    <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.warning.light }}>
                                        Edit
                                    </Typography>
                                </MenuItem>}

                                <MenuItem
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: .5
                                    }}
                                    onClick={(e) => {
                                        setOpenDeleteDialog(true);
                                        e.stopPropagation();
                                        handleClose();
                                    }}
                                >
                                    <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.light }} />
                                    <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.error.light }}>
                                        Delete
                                    </Typography>
                                </MenuItem>

                                {['Sales', 'Purchase', "Payment", "Receipt"].includes(inv.voucher_type) && <MenuItem
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: .5
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onPrint)
                                            onPrint(inv);
                                        handleClose();
                                    }}
                                >
                                    <Print fontSize="small" sx={{ color: theme.palette.success.light }} />
                                    <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.success.light }}>
                                        Print
                                    </Typography>
                                </MenuItem>}
                            </Menu>
                        </>
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
                        This action cannot be undone. Any information regarding this invoice will be lost.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete the invoice with "<strong>{inv.voucher_number}</strong>"?
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
                        Delete Invoice
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};