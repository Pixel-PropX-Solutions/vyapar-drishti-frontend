import { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    TableCell,
    TableRow,
    Typography,
    Tooltip,
    Chip,
    IconButton,
    Collapse,
    styled,
    Button,
    useTheme,
    alpha,
} from '@mui/material';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { InventoryItem } from '@/utils/types';
import { formatDate } from '@/utils/functions';
import { useNavigate } from 'react-router-dom';

const AddSalesButton = styled(Button)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
    color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
    '&:hover': {
        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
        background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
    },
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    padding: '6px 12px',
    minWidth: 'unset',
    textTransform: 'none',
    transition: 'all 0.2s',
    fontWeight: 600,
}));

const AddPurchaseButton = styled(Button)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
    color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
    '&:hover': {
        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
        background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
    },
    borderRadius: '20px',
    padding: '6px 12px',
    whiteSpace: 'nowrap',
    minWidth: 'unset',
    textTransform: 'none',
    transition: 'all 0.2s',
    fontWeight: 600,
}));

interface InventoryRowRowProps {
    row: InventoryItem;
}

export const InventoryRow = (props: InventoryRowRowProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <TableRow
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
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
            >
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                            sx={{ mr: 1 }}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        <Typography variant="body1" fontWeight="medium">
                            {row?.stock_item_name}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row?.current_stock < 0 && (
                            <Chip
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="error"
                                sx={{ fontWeight: 'bold', px: 1, py: 1.5, }}
                            />
                        )}
                        {(row?.current_stock >= 0 && row?.current_stock <= (row?.low_stock_alert)) && (
                            <Chip
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="warning"
                                sx={{ fontWeight: 'bold', px: 1, py: 1.5, }}
                            />
                        )}
                        {row?.current_stock > (row?.low_stock_alert) && (
                            <Chip
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="success"
                                sx={{ fontWeight: 'bold', px: 1, py: 1.5, }}
                            />
                        )}
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                mr: 0.5,
                            }}
                        >
                            &#8377;
                        </Typography>
                        <Typography>{Number(row?.avg_purchase_rate).toFixed(2)}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                mr: 0.5,
                            }}
                        >
                            &#8377;
                        </Typography>
                        <Typography>{Number(row?.avg_sale_rate || row?.avg_purchase_rate).toFixed(2)}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    {row.last_restock_date ?
                        (<Tooltip title={formatDate(row.last_restock_date)} arrow placement="top">
                            <Typography variant="body2">{formatDate(row.last_restock_date)}</Typography>
                        </Tooltip>) :
                        (<Tooltip title='Not Restocked Yet' arrow placement="top">
                            <Typography variant="body2">Not Restocked Yet</Typography>
                        </Tooltip>)}
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <AddPurchaseButton
                            startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
                            size="small"
                            onClick={() => navigate('/invoices/create/purchase')}
                        >
                            Add Purchase
                        </AddPurchaseButton>
                        <AddSalesButton
                            startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 16 }} />}
                            size="small"
                            onClick={() => navigate('/invoices/create/sales')}
                        >
                            Add Sales
                        </AddSalesButton>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Product Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{
                                        p: 2,
                                        bgcolor: theme.palette.divider,
                                    }}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Product Information
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Category:</strong> {row?.category || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Description:</strong> {row?.description || 'No description available'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: theme.palette.divider }}>
                                        <Typography variant="body2">
                                            <strong>Group:</strong> {row?.group || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>HSN/SAC:</strong> {row?.gst_hsn_code || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Alias :</strong> {row?.alias_name || 'No alias available'}
                                        </Typography>

                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};
