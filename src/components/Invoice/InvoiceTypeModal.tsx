import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Fade,
    Autocomplete,
    InputAdornment,
    Backdrop,
    useTheme,
    alpha,
} from "@mui/material";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoiceGroups } from "@/services/accountingGroup";
import {
    Receipt,
    CheckCircle,
    BusinessCenter,
} from "@mui/icons-material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (vouchar_type: string) => void;
}



const InvoiceTypeModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [voucharType, setVoucharType] = useState("");
    // const location = window.location.pathname;
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const { invoiceGroupList } = useSelector((state: RootState) => state.accountingGroup);

    const handleSubmit = () => {
        if (voucharType.trim()) {
            onSubmit(voucharType);
        }
    };

    const modalStyle = {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: '90%', sm: 500 },
        maxHeight: '90vh',
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: theme.shadows[24],
        p: 0,
        overflow: 'hidden'
    };

    useEffect(() => {
        dispatch(getAllInvoiceGroups(currentCompany?._id || ''));
    }, [dispatch, currentCompany?._id]);


    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                sx: { backgroundColor: alpha('#000', 0.7) }
            }}
            {...(open ? {} : { inert: '' })}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    {/* Header */}
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            p: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Receipt sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h5" fontWeight="600">
                            Create New Invoice
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                            Select the type of invoice you want to create
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 4 }}>
                        <Autocomplete
                            options={invoiceGroupList}
                            getOptionLabel={(option) => option.name}
                            value={invoiceGroupList.find(group => group._id === voucharType) || null}
                            onChange={(_, newValue) => setVoucharType(newValue?.name || "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Invoice Type"
                                    placeholder="Choose invoice type..."
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BusinessCenter color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                            sx={{
                                '& .MuiAutocomplete-endAdornment': {
                                    display: 'none'
                                }
                            }}
                            renderOption={(props, option) => {
                                const { key, ...rest } = props;
                                return (
                                    <Box component="li" key={key} {...rest} sx={{ p: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="500">
                                                {option.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            }}
                        />

                        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!voucharType}
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                                }}
                                startIcon={<CheckCircle />}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default InvoiceTypeModal;
