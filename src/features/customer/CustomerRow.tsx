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
    Menu,
    MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GetUserLedgers } from "@/utils/types";
import {
    AddCircle,
    Close,
    Email,
    MoreVert,
    PeopleAlt,
    Phone,
    RemoveCircle,
    SwapHoriz,
    Today
} from "@mui/icons-material";
import { formatDate } from "@/utils/functions";
import MenuButton from "@/components/MaterialUI/MenuButton";
import { setInvoiceTypeId } from "@/store/reducers/invoiceReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import JournalSideModal from "@/common/modals/JournalSideModal";
import { PaymentReceiptSideModal } from "@/common/modals/PaymentReceiptSideModal";

interface Bank { _id: string, ledger_name: string, balance: number }

interface CustomerRowProps {
    cus: GetUserLedgers;
    onDelete: (id: string) => void;
    onEdit: (cus: GetUserLedgers) => void;
    onView: (cus: GetUserLedgers) => void;
    index: number;
}


export const CustomerRow: React.FC<CustomerRowProps> = ({ cus, onDelete, onEdit, onView, index }) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openExpenseIncomeModal, setOpenExpenseIncomeModal] = useState(false);
    const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
    const { invoiceGroups } = useSelector((state: RootState) => state.invoice);
    const [isHovered, setIsHovered] = useState(false);
    const [type, setType] = useState<'payment' | 'receipt' | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [bank, setBank] = useState<Bank>({ _id: '', ledger_name: '', balance: 0 });
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const confirmDelete = () => {
        onDelete(cus?._id ?? '');
        setOpenDeleteDialog(false);
    };

    const getInitials = (name: string): string => {
        if (!name) return '';
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
        const safeName = name || '';
        const index = safeName.length % colors.length;
        return colors[index];
    };

    return (
        <>
            <Fade in timeout={300 + index * 100}>
                <TableRow
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{
                        "& .MuiTableCell-root": {
                            padding: '8px 16px',
                        },
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
                    {/* Customer Info */}
                    <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 2,
                                    objectFit: 'contain',
                                    bgcolor: getAvatarColor(cus.ledger_name),
                                    fontSize: '.9rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(cus.ledger_name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={typeof cus?.image === 'string' ? cus.image : (cus?.image instanceof File ? URL.createObjectURL(cus.image) : '')}
                            >
                                {(getInitials(cus.ledger_name))}
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
                                    {cus.ledger_name}
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

                    {/* Contact Information */}
                    <TableCell align="left" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {cus?.phone?.number && (<Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '.9rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                <Phone
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle", fontSize: '.9rem', mr: 1 }}
                                />
                                {cus.phone?.code}{" "}
                                {cus?.phone?.number || ""}
                            </Typography>)}
                            {cus.email && (<Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '.8rem',
                                    color: theme.palette.text.primary,
                                }}
                            >
                                <Email sx={{ mr: 0.5, fontSize: '.9rem', color: theme.palette.text.secondary }} />
                                {cus.email || ''}
                            </Typography>)}
                        </Box>
                        {!cus.email && !cus.phone?.number && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>

                            </Box>
                        )}
                    </TableCell>

                    {/* Customer Mailing State */}
                    <TableCell align="center" sx={{ px: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {cus.mailing_state}
                            {(cus.mailing_country && cus.mailing_state) && `, ${cus.mailing_country}`}
                            {(cus.mailing_country && !cus.mailing_state) && `${cus.mailing_country}`}
                        </Typography>
                    </TableCell>
                    {/* Closing Balance */}
                    <TableCell align="center">
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                                color: cus.total_amount === 0 ? '' : cus.total_amount < 0 ? theme.palette.success.main : theme.palette.error.main,
                            }}
                        >
                            {cus.total_amount === 0 ? '-' : Math.abs(cus.total_amount)}{cus.total_amount === 0 ? '' : cus.total_amount > 0 ? ' DR' : ' CR'}
                        </Typography>
                    </TableCell>

                    {/* Created At Date */}
                    <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Today sx={{ mr: 0.5, fontSize: '.9rem', color: theme.palette.text.secondary }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {formatDate(cus.created_at) || "N/A"}
                            </Typography>
                        </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                        <Zoom appear in timeout={200}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                <MenuButton
                                    data-screenshot="toggle-mode"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClick(e);
                                    }}
                                    disableRipple
                                    size="small"
                                    aria-label="Open notifications"
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                    }}
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
                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: .5
                                        }}
                                        onClick={(e) => {
                                            handleClose();
                                            onView(cus);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <VisibilityIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                            View
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: .5
                                        }}
                                        onClick={(e) => {
                                            handleClose();
                                            onEdit(cus);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <EditIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                                            Edit
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: .5
                                        }}
                                        onClick={(e) => {
                                            handleClose();
                                            setIsJournalModalOpen(true);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <SwapHoriz fontSize="small" sx={{ color: theme.palette.info.main }} />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                            Add Journal
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: .5
                                        }}
                                        onClick={(e) => {
                                            dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Receipt'))?._id || ''));
                                            handleClose();
                                            setBank({
                                                _id: cus._id,
                                                ledger_name: cus.ledger_name,
                                                balance: cus.total_amount,
                                            });
                                            setType('receipt');
                                            setOpenExpenseIncomeModal(true);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <AddCircle fontSize="small" sx={{ color: theme.palette.success.main }} />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                                            You Got
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: .5
                                        }}
                                        onClick={(e) => {
                                            handleClose();
                                            dispatch(setInvoiceTypeId(invoiceGroups.find((group) => group.name.includes('Payment'))?._id || ''));
                                            setBank({
                                                _id: cus._id,
                                                ledger_name: cus.ledger_name,
                                                balance: cus.total_amount,
                                            });
                                            setType('payment');
                                            setOpenExpenseIncomeModal(true);
                                            e.stopPropagation();
                                        }}
                                    >
                                        <RemoveCircle fontSize="small" sx={{ color: theme.palette.error.light }} />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.error.light }}>
                                            You give
                                        </Typography>
                                    </MenuItem>

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
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                        <Typography fontSize="small" variant="subtitle1" sx={{ fontWeight: 'bold', }}>
                                            Delete
                                        </Typography>
                                    </MenuItem>
                                </Menu>
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
                        justifyContent: 'space-between',
                        gap: 2,
                        color: theme.palette.error.main,
                        fontWeight: 600,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon />
                        Delete {cus.ledger_name}?
                    </Box>
                    <Tooltip title="Close" arrow>
                        <IconButton
                            size="medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDeleteDialog(false);
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
                            <Close fontSize="medium" />
                        </IconButton>
                    </Tooltip>

                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. This customer will be permanently removed from your company database if it is not attached to any other bills.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{cus.ledger_name}</strong>"?
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
                        Delete&nbsp;<strong>{cus.ledger_name}</strong>
                    </Button>
                </DialogActions>
            </Dialog>

            {openExpenseIncomeModal && <PaymentReceiptSideModal
                open={openExpenseIncomeModal}
                onClose={() => {
                    setBank({
                        _id: '',
                        ledger_name: '',
                        balance: 0,
                    })
                    setType('payment');
                    setOpenExpenseIncomeModal(false);
                }}
                entity='Customers'
                type={type}
                bankAccount={bank}
            />}
            {isJournalModalOpen && <JournalSideModal open={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)} />}
        </>
    );
};