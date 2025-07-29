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
} from '@mui/material';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { InventoryItem } from '@/utils/types';
import { formatDate } from '@/utils/functions';
import { useNavigate } from 'react-router-dom';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
}));

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

    return (
        <>
            <TableRow
                sx={{
                    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(182, 185, 188, 0.20)' : '#f1f8ff', },
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transition: 'background-color 0.2s',
                }}
            >
                {/* <CustomTableCell padding="checkbox">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                        style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            accentColor: '#1976d2',
                            borderRadius: '3px',
                            border: '1.5px solid #c4c4c4',
                            outline: 'none',
                            transition: 'all 0.2s ease-in-out',
                            verticalAlign: 'middle',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                </CustomTableCell> */}
                <CustomTableCell>
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
                </CustomTableCell>
                <CustomTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row?.current_stock <= 0 && (
                            <Chip
                                size="small"
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="error"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                        {(row?.current_stock > 0 && row?.current_stock < (row?.low_stock_alert)) && (
                            <Chip
                                size="small"
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="warning"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                        {row?.current_stock > (row?.low_stock_alert) && (
                            <Chip
                                size="small"
                                label={`${row?.current_stock} ${row?.unit}`}
                                color="success"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                    </Box>
                </CustomTableCell>
                <CustomTableCell>
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
                </CustomTableCell>
                <CustomTableCell>
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
                </CustomTableCell>
                <CustomTableCell>
                    {row.last_restock_date ?
                        (<Tooltip title={formatDate(row.last_restock_date)} arrow placement="top">
                            <Typography variant="body2">{formatDate(row.last_restock_date)}</Typography>
                        </Tooltip>) :
                        (<Tooltip title='Not Restocked Yet' arrow placement="top">
                            <Typography variant="body2">Not Restocked Yet</Typography>
                        </Tooltip>)}
                </CustomTableCell>
                <CustomTableCell>
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
                </CustomTableCell>
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
