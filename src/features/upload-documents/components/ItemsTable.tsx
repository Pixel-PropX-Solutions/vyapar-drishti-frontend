import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Tooltip,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Paper,
    InputAdornment,
    Fade,
    Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Item, ItemToSent } from "@/utils/types";
import { AnimatedTableRow } from "./AnimatedTableRow";
import { Inventory, ReceiptLong } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface ItemsTableProps {
    items: Item[];
    dataItems?: ItemToSent[];
    editMode: boolean;
    handleFieldChange: (name: string, value: unknown) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({
    items,
    dataItems,
    editMode,
    handleFieldChange,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { productsListing } = useSelector((state: RootState) => state.product);

    // Calculate totals
    const totalQuantity = items?.reduce(
        (sum, item) => sum + parseFloat(item.quantity || "0"),
        0
    );

    const totalAmount = items
        ?.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0)
        .toFixed(2);

    const totalGST = items
        ?.reduce((sum, item) => {
            const itemAmount = parseFloat(item.amount || "0");
            const gstRate = parseFloat(item.GST_percent || "0") / 100;
            return sum + itemAmount * gstRate;
        }, 0)
        .toFixed(2);

    const handleAddItem = () => {
        setIsLoading(true);
        const newItem: Item = {
            product_name: "",
            pack: "",
            batch: "",
            HSN: "",
            expiry: new Date().toISOString().substring(0, 7),
            quantity: "0",
            MRP: "0.00",
            GST_percent: "0",
            amount: "0.00",
        };
        const newItems = [...items, newItem];

        // Simulate a slight delay for better UX
        setTimeout(() => {
            handleFieldChange("items", newItems);
            setIsLoading(false);
        }, 300);
    };

    const handleRemoveItem = (index: number) => {
        setIsLoading(true);
        const newItems = [...items];
        newItems.splice(index, 1);

        setTimeout(() => {
            handleFieldChange("items", newItems);
            setIsLoading(false);
        }, 300);
    };

    const calculateRowAmount = (
        index: number,
        quantity: string,
        mrp: string,
        gst: string
    ) => {
        const quantityNum = parseFloat(quantity || "0");
        const mrpNum = parseFloat(mrp || "0");
        const gstNum = parseFloat(gst || "0");
        const gstAmount = (mrpNum * gstNum) / 100;

        const amount = (quantityNum * mrpNum + gstAmount).toFixed(2);
        handleFieldChange(`items.${index}.amount`, amount);
    };

    console.log(dataItems)

    return (
        <Box p={2}>
            <Card
                variant="outlined"
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                    >
                        <Box display="flex" alignItems="center">
                            <Inventory sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6" color="primary" fontWeight="500">
                                Inventory Items
                                <Chip
                                    label={items?.length || 0}
                                    size="small"
                                    color="primary"
                                    sx={{ ml: 1, height: 20, fontWeight: "bold" }}
                                />
                            </Typography>
                        </Box>
                        <Box>
                            {editMode && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddItem}
                                    size="small"
                                    disabled={isLoading}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add Item
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{ p: 1.5, mb: 1.5, bgcolor: "#f9f9ff", borderRadius: 2 }}
                    >
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            <ReceiptLong
                                sx={{ mr: 1, fontSize: 16, verticalAlign: "text-bottom" }}
                            />
                            Invoice Summary
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                            <Chip
                                label={`Total Quantity: ${totalQuantity}`}
                                color="default"
                                size="small"
                            />
                            <Chip
                                label={`GST Amount: ₹${totalGST}`}
                                color="info"
                                size="small"
                            />
                            <Chip
                                label={`Total Amount: ₹${totalAmount}`}
                                color="success"
                                size="small"
                                sx={{ fontWeight: "500" }}
                            />
                        </Box>
                    </Paper>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                    >
                        <Typography
                            variant="caption"
                            color="error.light"
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            mt={0.5}
                            fontWeight="600"
                        >
                            <ErrorOutlineIcon fontSize="medium" />
                            Enter total number of tablets, not number of packets
                        </Typography>
                    </Box>

                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: 500,
                            borderRadius: 2,
                            overflow: "auto",
                            "&::-webkit-scrollbar": {
                                width: "8px",
                                height: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "rgba(0,0,0,0.05)",
                            }
                        }}
                    >
                        <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                            width: "18%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 1
                                        }}
                                    >
                                        Product Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "8%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        Pack
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "10%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        Batch
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "10%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        HSN
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "13%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        Expiry
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "8%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        QTY
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "9%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        MRP (₹)
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "9%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        Rate (₹)
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "8%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        GST %
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            width: "11%",
                                            backgroundColor: "#f1f5f9",
                                            borderBottom: "2px solid #e0e0e0",
                                            py: 1.5,
                                            px: 0.75
                                        }}
                                    >
                                        Amount
                                    </TableCell>
                                    {editMode && (
                                        <TableCell
                                            sx={{
                                                fontWeight: "bold",
                                                width: "6%",
                                                backgroundColor: "#f1f5f9",
                                                borderBottom: "2px solid #e0e0e0",
                                                py: 1.5,
                                                px: 0.5
                                            }}
                                        >
                                            Action
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items?.map((item, index) => {
                                    return (
                                        <AnimatedTableRow
                                            key={index}
                                            sx={
                                                {
                                                    '&:hover': {
                                                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                                                    },
                                                    m: 0
                                                }
                                            }
                                        >

                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    size="small"
                                                    options={productsListing || []}
                                                    getOptionLabel={(option) => option?.product_name || ''}
                                                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Type something for suggestions"
                                                            size="small"
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 1.5,
                                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                        borderColor: 'primary.main',
                                                                    },
                                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                        borderWidth: '1px',
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    value={
                                                        productsListing?.find(
                                                            product => product?.product_name?.toLowerCase() === item.product_name?.toLowerCase()
                                                        ) || productsListing?.find(
                                                            product => product?.product_name?.toLowerCase()?.includes((item?.product_name || '').toLowerCase())
                                                        ) || null // Ensure the value is never undefined
                                                    }
                                                    onChange={(_, newValue) => {
                                                        handleFieldChange(
                                                            `items.${index}.product_name`,
                                                            newValue?.product_name || ''
                                                        );
                                                    }}
                                                    filterOptions={(options, state) => {
                                                        return options.filter(option =>
                                                            option?.product_name?.toLowerCase().includes(state.inputValue.toLowerCase())
                                                        );
                                                    }}
                                                    popupIcon={null}
                                                    disabled={!editMode}
                                                    disablePortal
                                                    sx={{
                                                        '& .MuiAutocomplete-endAdornment': {
                                                            display: 'none'
                                                        }
                                                    }}
                                                    slotProps={{
                                                        paper: {
                                                            sx: {
                                                                backgroundColor: '#fff',
                                                                border: '1px solid #ddd',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.pack || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            `items.${index}.pack`,
                                                            e.target.value
                                                        )
                                                    }
                                                    name="pack"
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                        }
                                                    }}
                                                />

                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.batch || ""} // Ensure value is never null
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            `items.${index}.batch`,
                                                            e.target.value
                                                        )
                                                    }
                                                    name="batch"
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.HSN || ""} // Ensure value is never null
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            `items.${index}.HSN`,
                                                            String(e.target.value)
                                                        )
                                                    }
                                                    name="HSN"
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        value={
                                                            item?.expiry ? new Date(item?.expiry) : new Date()
                                                        }
                                                        onChange={(date) => {
                                                            const formattedDate = date
                                                                ?.toISOString()
                                                                .substring(0, 7);
                                                            handleFieldChange(
                                                                `items.${index}.expiry`,
                                                                formattedDate
                                                            );
                                                        }}
                                                        format="MM/yy"
                                                        closeOnSelect={true}
                                                        views={["year", "month"]}
                                                        disabled={!editMode}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                size: "small",
                                                                InputProps: {
                                                                    sx: {
                                                                        "& .MuiButtonBase-root": {
                                                                            border: "none",
                                                                        },
                                                                        borderRadius: 1.5,
                                                                        fontSize: "0.875rem",

                                                                        "& fieldset": {
                                                                            borderColor: "rgba(0, 0, 0, 0.15)",
                                                                        },
                                                                        "&:hover fieldset": {
                                                                            borderColor: "rgba(0, 0, 0, 0.25)",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.quantity || ""} // Ensure value is never null
                                                    onChange={(e) => {
                                                        const newQty = e.target.value;
                                                        handleFieldChange(
                                                            `items.${index}.quantity`,
                                                            newQty
                                                        );
                                                    }}
                                                    disabled={!editMode}
                                                    size="small"
                                                    name="quantity"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                            textAlign: "right",
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.MRP || ""} // Ensure value is never null
                                                    name="MRP"
                                                    onChange={(e) => {
                                                        const MRP = e.target.value;
                                                        handleFieldChange(`items.${index}.MRP`, MRP);
                                                    }}
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                            textAlign: "right",
                                                            pl: .5, // Make room for the currency symbol
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ mr: 0 }}>
                                                                ₹
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.rate || ""} // Ensure value is never null
                                                    name="rate"
                                                    onChange={(e) => {
                                                        const rate = e.target.value;
                                                        handleFieldChange(`items.${index}.rate`, rate);
                                                        calculateRowAmount(
                                                            index,
                                                            item?.quantity || "0",
                                                            rate,
                                                            item?.GST_percent || "0"
                                                        );
                                                        calculateRowAmount(
                                                            index,
                                                            item?.quantity || "0",
                                                            rate,
                                                            item?.GST_percent || "0"
                                                        );
                                                    }}
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                            textAlign: "right",
                                                            pl: .5, // Make room for the currency symbol
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ mr: 0 }}>
                                                                ₹
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.GST_percent || ""} // Ensure value is never null
                                                    onChange={(e) => {
                                                        handleFieldChange(
                                                            `items.${index}.GST_percent`,
                                                            e.target.value
                                                        );
                                                    }}
                                                    name="GST_percent"
                                                    disabled={!editMode}
                                                    size="small"
                                                    fullWidth

                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            fontSize: "0.875rem",
                                                            "& fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.15)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: "rgba(0, 0, 0, 0.25)",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                            textAlign: "right",
                                                            pr: .5, // Make room for the % symbol
                                                        }
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end" sx={{ ml: 0 }}>
                                                                %
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 0.75 }}>
                                                <TextField
                                                    value={item?.amount || ""} // Ensure value is never null
                                                    name="amount"
                                                    size="small"
                                                    onChange={(e) => {
                                                        handleFieldChange(
                                                            `items.${index}.amount`,
                                                            e.target.value
                                                        );
                                                    }}
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 1.5,
                                                            bgcolor: "#f5f5f5",
                                                            fontSize: "0.875rem",
                                                            fontWeight: "500",
                                                        },
                                                        "& .MuiInputBase-input": {
                                                            py: 1,
                                                            textAlign: "right",
                                                            pl: .5, // Make room for the currency symbol
                                                            color: "#2e7d32", // Success green color
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ mr: 0 }}>
                                                                ₹
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </TableCell>
                                            {editMode && (
                                                <TableCell align="center" sx={{ py: 1, px: 0.5 }}>
                                                    <Tooltip title="Remove Item">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRemoveItem(index)}
                                                            sx={{
                                                                padding: 0.5,
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            )}
                                        </AnimatedTableRow>
                                    );
                                })}
                                {items?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={editMode ? 10 : 9} align="center">
                                            <Box
                                                py={4}
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                            >
                                                <Inventory
                                                    sx={{
                                                        fontSize: 48,
                                                        color: "text.secondary",
                                                        opacity: 0.3,
                                                        mb: 2,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    mb={2}
                                                >
                                                    No items added to this invoice yet.
                                                </Typography>
                                                {editMode && (
                                                    <Fade in={true} timeout={1000}>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<AddIcon />}
                                                            onClick={handleAddItem}
                                                            size="medium"
                                                            color="primary"
                                                            sx={{ mt: 1, borderRadius: 2 }}
                                                        >
                                                            Add First Item
                                                        </Button>
                                                    </Fade>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {items?.length > 0 && (
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Typography variant="body2" color="text.secondary">
                                {items?.length} of {items?.length} items displayed
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ItemsTable;
