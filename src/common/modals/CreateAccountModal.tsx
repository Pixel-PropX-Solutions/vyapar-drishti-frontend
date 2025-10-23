import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
    Drawer,
    useTheme,
    Tooltip,
    Stack,
    Chip,
    useMediaQuery,
    InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Timeline,
    CurrencyRupee as CurrencyIcon,
    Info,
    Check,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import ActionButtonSuccess from "../buttons/ActionButtonSuccess";
import BackDropLoading from "../loaders/BackDropLoading";
import { createCustomer } from "@/services/customers";

interface AccountModalProps {
    open: boolean;
    onClose: () => void;
}

interface AccountFormData {
    bank_account_number: string;
    bank_account_holder: string;
    bank_ifsc: string;
    bank_name: string;
    bank_branch: string;
    opening_balance: number;
}

const AccountModal: React.FC<AccountModalProps> = ({
    open,
    onClose
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { current_company_id } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<AccountFormData>({
        bank_account_number: '',
        bank_account_holder: '',
        bank_ifsc: '',
        bank_name: '',
        bank_branch: '',
        opening_balance: 0,
    });
    const [balanceType, setBalanceType] = useState<'Debit' | 'Credit'>('Debit');

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!data.bank_account_holder.trim()) {
            errors.bank_account_holder = 'Account holder name is required';
        }
        if (!data.bank_ifsc.trim()) {
            errors.bank_ifsc = 'IFSC code is required';
        }
        if (!data.bank_name.trim()) {
            errors.bank_name = 'Bank name is required';
        }
        if (!data.bank_branch.trim()) {
            errors.bank_branch = 'Bank branch is required';
        }
        if (!data.bank_account_number.trim()) {
            errors.bank_account_number = 'Account number is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof AccountFormData,
        value: any
    ) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const resetForm = () => {
        setData({
            bank_account_number: '',
            bank_account_holder: '',
            bank_ifsc: '',
            bank_name: '',
            bank_branch: '',
            opening_balance: 0,
        });
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            const firstErrorField = Object.keys(formErrors)[0];
            toast.error(formErrors[firstErrorField]);
            return;
        }

        setIsLoading(true);

        const payload = {
            company_id: current_company_id || '',
            opening_balance: balanceType === 'Debit' ? data.opening_balance : -data.opening_balance,
            bank_account_number: data.bank_account_number,
            bank_account_holder: data.bank_account_holder,
            bank_ifsc: data.bank_ifsc,
            bank_name: data.bank_name,
            bank_branch: data.bank_branch,
            name: `${data.bank_name} - ${data.bank_account_number}`,
            parent: 'Bank Accounts',
            parent_id: 'caea08ac-37fe-4f3b-9577-a6ed78777fa3',
        };

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            formData.append(key, value as any);
        });

        dispatch(createCustomer(formData)).then(() => {
            toast.success(`Accounts created successfully!`);
            resetForm();
            onClose();
            setIsLoading(false);
            navigate('/accounts');
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error || "Failed to add account. 🚫");
        }).finally(() => {
            setIsLoading(false);
        })
    };


    return (
        <>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 650, md: 750 },
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                        overflow: 'hidden',
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                    }
                }}
                open={open}
                onClose={onClose}
                transitionDuration={300}
            >
                {/* Header */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `2px solid ${theme.palette.success.main}`,
                    background: `linear-gradient(135deg, ${theme.palette.success.main}20 0%, ${theme.palette.success.light}15 100%)`,
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Close" arrow>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        transform: 'scale(1.1) rotate(90deg)',
                                        boxShadow: theme.shadows[4],
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Add Bank Account
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {!isMobile && (
                        <Chip
                            icon={<Info />}
                            label="Fill required fields"
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: theme.palette.success.main,
                                color: theme.palette.success.main,
                            }}
                        />
                    )}
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.divider,
                        borderRadius: 1,
                        '&:hover': { backgroundColor: theme.palette.action.hover }
                    }
                }}>
                    <Box sx={{ p: 3 }}>
                        {/* Bank Info Form */}
                        <Paper
                            elevation={1}
                            sx={{
                                px: 3,
                                py: 3,
                                mb: 3,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Stack spacing={3}>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {/* Account Holder Name */}
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Account Holder Name"
                                        label="Account Holder Name"
                                        value={data.bank_account_holder}
                                        onChange={(e) => handleInputChange('bank_account_holder', e.target.value)}
                                        error={!!formErrors.bank_account_holder}
                                        helperText={formErrors.bank_account_holder}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                    {/* Account Holder Number */}
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Account Number"
                                        label="Account Number"
                                        value={data.bank_account_number}
                                        onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                                        error={!!formErrors.bank_account_number}
                                        helperText={formErrors.bank_account_number}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>


                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {/* Bank Name */}
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Bank Name"
                                        label="Bank Name"
                                        value={data.bank_name}
                                        onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                        error={!!formErrors.bank_name}
                                        helperText={formErrors.bank_name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {/* Bank IFSC */}
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Bank IFSC"
                                        label="Bank IFSC"
                                        value={data.bank_ifsc}
                                        onChange={(e) => handleInputChange('bank_ifsc', e.target.value)}
                                        error={!!formErrors.bank_ifsc}
                                        helperText={formErrors.bank_ifsc}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                    {/* Branch Name */}
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Branch Name"
                                        label="Branch Name"
                                        value={data.bank_branch}
                                        onChange={(e) => handleInputChange('bank_branch', e.target.value)}
                                        error={!!formErrors.bank_branch}
                                        helperText={formErrors.bank_branch}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Opening Balance */}
                                <TextField
                                    fullWidth
                                    label="Opening Balance"
                                    type="number"
                                    placeholder="Enter Opening Balance"
                                    value={data.opening_balance}
                                    onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                                    error={!!formErrors.opening_balance}
                                    helperText={formErrors.opening_balance || `Enter the opening balance for this account`}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                        }
                                    }}
                                />

                                <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                                    {['Debit', 'Credit'].map((type) => (
                                        <Tooltip key={type} title={`You ${type === 'Debit' ? 'have' : 'owe'} ${data.opening_balance}`} arrow>
                                            <Button
                                                variant={balanceType === type ? "contained" : "outlined"}
                                                onClick={() => { setBalanceType(type as 'Debit' | 'Credit') }}
                                                sx={{
                                                    borderRadius: 1,
                                                    px: 2,
                                                    py: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    minWidth: 'auto',
                                                    flex: 1,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                        boxShadow: theme.shadows[4],
                                                    },
                                                }}
                                                endIcon={balanceType === type ? <Check /> : null}
                                            >
                                                {type === 'Debit' ? 'You have' : 'You owe'}
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </Stack>


                            </Stack>
                        </Paper>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                    backdropFilter: 'blur(20px)',
                }}>
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: isMobile ? '100%' : 'auto' }}>
                            <Button
                                variant="outlined"
                                onClick={resetForm}
                                disabled={isLoading}
                                fullWidth={isMobile}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4]
                                    }
                                }}
                            >
                                Reset Form
                            </Button>

                            <ActionButtonSuccess
                                onClick={handleSubmit}
                                startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                                disabled={isLoading}
                                text={isLoading
                                    ? 'Adding bank...'
                                    : 'Add bank'
                                }
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Drawer>
            <BackDropLoading isLoading={isLoading} text={`Adding Bank Account...`} />
        </>
    );
};

export default AccountModal;
