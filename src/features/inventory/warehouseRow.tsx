import React, { useState } from 'react';
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
import CurrencyRupee from '@mui/icons-material/CurrencyRupee';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { WareHouseProduct } from '@/utils/types';
import { formatDate, formatDatewithTime } from '@/utils/functions';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5),
}));

const StockInButton = styled(Button)(({ theme }) => ({
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

const StockOutButton = styled(Button)(({ theme }) => ({
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

interface WareHouseRowProps {
    row: any;
    setDrawerData?: React.Dispatch<React.SetStateAction<{
        isOpen: boolean;
        type: 'stockIn' | 'stockOut' | null;
        product: WareHouseProduct | null;
    }>>;
}

export const WareHouseRow = (props: WareHouseRowProps) => {
    const theme = useTheme();
    const { row, setDrawerData } = props;
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
                            {row?.productDetails?.product_name}
                        </Typography>
                    </Box>
                </CustomTableCell>
                <CustomTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row?.available_quantity <= 0 ? (
                            <Chip
                                size="small"
                                label={`${row?.available_quantity}`}
                                color="error"
                                sx={{ fontWeight: 'bold' }}
                            />
                        ) : row?.available_quantity < 10 ? (
                            <Chip
                                size="small"
                                label={`${row?.available_quantity}`}
                                color="warning"
                                sx={{ fontWeight: 'bold' }}
                            />
                        ) : (
                            <Chip
                                size="small"
                                label={`${row?.available_quantity}`}
                                color="success"
                                sx={{ fontWeight: 'bold' }}
                            />
                        )}
                    </Box>
                </CustomTableCell>
                <CustomTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CurrencyRupee fontSize="small" color="action" />
                        <Typography>{Number(row?.purchase_price).toFixed(2)}</Typography>
                    </Box>
                </CustomTableCell>
                <CustomTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CurrencyRupee fontSize="small" color="action" />
                        <Typography>{Number(row?.sell_price || row?.purchase_price).toFixed(2)}</Typography>
                    </Box>
                </CustomTableCell>
                <CustomTableCell>
                    <Tooltip title={formatDatewithTime(row?.updated_at)} arrow>
                        <Typography variant="body2">{formatDatewithTime(row?.updated_at)}</Typography>
                    </Tooltip>
                </CustomTableCell>
                <CustomTableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <StockInButton
                            startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
                            size="small"
                            onClick={() => {
                                if (setDrawerData) {
                                    setDrawerData({
                                        isOpen: true,
                                        type: 'stockIn',
                                        product: row,
                                    });
                                }
                            }}
                        >
                            Stock In
                        </StockInButton>
                        <StockOutButton
                            startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 16 }} />}
                            size="small"
                            onClick={() => {
                                if (setDrawerData) {
                                    setDrawerData({
                                        isOpen: true,
                                        type: 'stockOut',
                                        product: row,
                                    });
                                }
                            }}
                        >
                            Stock Out
                        </StockOutButton>
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
                                            <strong>Category:</strong> {row?.productDetails?.category || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Description:</strong> {row?.productDetails?.description || 'No description available'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: theme.palette.divider }}>
                                        <Typography variant="body2">
                                            <strong>State:</strong> {row?.productDetails?.state || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Expiry Date:</strong> {formatDate(row?.productDetails?.expiry_date) || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Storage Requirement:</strong> {row?.productDetails?.storage_requirement || 'No special Storage required'}
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
