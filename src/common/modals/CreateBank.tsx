import React, {  useEffect,  useState } from "react";
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
    FormControl,
    Stack,
    Fade,
    LinearProgress,
    Chip,
    Zoom,
    Avatar,
    Divider,
    useMediaQuery,
    Autocomplete,
    alpha,
    MenuItem,
    Select,
    InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    AccountBalance,
    Person,
    CreditCard,
    Code,
    Store,
    LocationOn,
    Timeline,
    CheckCircle,
    Info,
    AccountBalanceWallet,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createAccountingGroup, viewDefaultAccountingGroup } from "@/services/accountingGroup";

interface CreateBankModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (data?: any) => void;
    onUpdated?: () => void;
    bankLedger?: any | null;
}

interface BankFormData {
    ledger_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    branch: string;
    parent: string;
    opening_balance: string;
    balance_type: 'Dr' | 'Cr';
}

const CreateBankModal: React.FC<CreateBankModalProps> = ({
    open,
    onClose,
    onCreated,
    onUpdated,
    bankLedger,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const { defaultAccountingGroup } = useSelector((state: RootState) => state.accountingGroup);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [selectedParentOption, setSelectedParentOption] = useState<{
        label: string;
        value: string;
    } | null>({ label: 'Bank Accounts', value: 'Bank Accounts' });

    const [data, setData] = useState<BankFormData>({
        ledger_name: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
        bank_name: '',
        branch: '',
        parent: 'Bank Accounts',
        opening_balance: '',
        balance_type: 'Dr',
    });

    const accountingGroupOptions = defaultAccountingGroup?.map(group => ({
        label: group.accounting_group_name,
        value: group.accounting_group_name,
    })) || [];

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!data.ledger_name.trim()) {
            errors.ledger_name = 'Ledger name is required';
        } else if (data.ledger_name.length < 2) {
            errors.ledger_name = 'Ledger name must be at least 2 characters';
        }

        if (!data.account_holder_name.trim()) {
            errors.account_holder_name = 'Account holder name is required';
        }

        if (!data.account_number.trim()) {
            errors.account_number = 'Account number is required';
        }

        if (!data.ifsc_code.trim()) {
            errors.ifsc_code = 'IFSC code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc_code)) {
            errors.ifsc_code = 'Invalid IFSC code format';
        }

        if (!data.bank_name.trim()) {
            errors.bank_name = 'Bank name is required';
        }

        if (data.opening_balance && isNaN(parseFloat(data.opening_balance))) {
            errors.opening_balance = 'Opening balance must be a valid number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof BankFormData, value: string) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleParentChange = (
        _: React.SyntheticEvent<Element, Event>,
        value: string | { label: string; value: string } | null
    ) => {
        if (typeof value === 'string') {
            setSelectedParentOption({ label: value, value });
            handleInputChange('parent', value);
        } else if (value) {
            setSelectedParentOption(value);
            handleInputChange('parent', value.value);
        } else {
            setSelectedParentOption(null);
            handleInputChange('parent', '');
        }
    };

    const resetForm = () => {
        setData({
            ledger_name: '',
            account_holder_name: '',
            account_number: '',
            ifsc_code: '',
            bank_name: '',
            branch: '',
            parent: 'Bank Accounts',
            opening_balance: '',
            balance_type: 'Dr',
        });
        setFormErrors({});
        setSelectedParentOption({ label: 'Bank Accounts', value: 'Bank Accounts' });
    };

    useEffect(() => {
        dispatch(viewDefaultAccountingGroup());
        if (open && bankLedger) {
            setData({
                ledger_name: bankLedger.ledger_name || '',
                account_holder_name: bankLedger.account_holder_name || '',
                account_number: bankLedger.account_number || '',
                ifsc_code: bankLedger.ifsc_code || '',
                bank_name: bankLedger.bank_name || '',
                branch: bankLedger.branch || '',
                parent: bankLedger.parent || 'Bank Accounts',
                opening_balance: bankLedger.opening_balance || '',
                balance_type: bankLedger.balance_type || 'Dr',
            });
            setSelectedParentOption(
                bankLedger.parent
                    ? { label: bankLedger.parent, value: bankLedger.parent }
                    : { label: 'Bank Accounts', value: 'Bank Accounts' }
            );
        } else if (open && !bankLedger) {
            resetForm();
        }
    }, [open, bankLedger, dispatch]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            ledger_name: data.ledger_name.trim(),
            account_holder_name: data.account_holder_name.trim(),
            account_number: data.account_number.trim(),
            ifsc_code: data.ifsc_code.trim().toUpperCase(),
            bank_name: data.bank_name.trim(),
        };

        if (data.branch && data.branch !== '') sanitizedData.branch = data.branch.trim();
        if (data.parent && data.parent !== '') sanitizedData.parent = data.parent.trim();
        if (data.opening_balance && data.opening_balance !== '') {
            sanitizedData.opening_balance = parseFloat(data.opening_balance);
            sanitizedData.balance_type = data.balance_type;
        }

        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'string' || typeof value === 'number') {
                formData.append(key, value.toString());
            }
        });
        formData.append('company_id', currentCompany?._id || '');

        if (bankLedger && bankLedger._id) {
            // Update logic would go here
            setIsLoading(false);
            onClose();
            if (onUpdated) onUpdated();
            toast.success('Bank ledger successfully updated! 🎉');
        } else {
            await dispatch(createAccountingGroup(formData))
                .unwrap()
                .then((response) => {
                    const newLedger = {
                        name: response.ledger_name,
                        _id: response._id
                    };
                    onCreated(newLedger);
                    setIsLoading(false);
                    resetForm();
                    onClose();
                    toast.success('Bank ledger successfully created! 🎉');
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error || 'An unexpected error occurred. Please try again later.');
                });
        }
    };

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600, md: 700 },
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
            <Fade in={isLoading}>
                <LinearProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        height: 3
                    }}
                />
            </Fade>

            {/* Header */}
            <Box sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}15 100%)`,
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
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                <AccountBalance fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>
                                {bankLedger ? 'Edit Bank Ledger' : 'Create Bank Ledger'}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {bankLedger ? 'Update the details of your bank account' : 'Create a new bank account ledger'}
                        </Typography>
                    </Box>
                </Box>

                {!isMobile && (
                    <Chip
                        icon={<Info />}
                        label="Fill required fields"
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
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
                    <Paper
                        elevation={3}
                        sx={{
                            px: 3,
                            py: 2,
                            mb: 3,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <Stack spacing={2.5}>
                            {/* Ledger Name */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AccountBalanceWallet color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Ledger Name *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="e.g., New Quality Marble - (2019-2020)"
                                    value={data.ledger_name}
                                    onChange={(e) => handleInputChange('ledger_name', e.target.value)}
                                    error={!!formErrors.ledger_name}
                                    helperText={formErrors.ledger_name || 'Unique identifier for this ledger'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            },
                                            '&.Mui-focused': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.shadows[4]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <Divider />

                            {/* Bank Account Details Section */}
                            <Typography variant="h6" fontWeight={700} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountBalance />
                                Bank Account Details
                            </Typography>

                            {/* Account Holder Name */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Person color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Account Holder Name *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="Enter account holder's name"
                                    value={data.account_holder_name}
                                    onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                                    error={!!formErrors.account_holder_name}
                                    helperText={formErrors.account_holder_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* Account Number */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CreditCard color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Account Number *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="Enter account number"
                                    value={data.account_number}
                                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                                    error={!!formErrors.account_number}
                                    helperText={formErrors.account_number}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* IFSC Code */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Code color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        IFSC Code *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="e.g., SBIN0001234"
                                    value={data.ifsc_code}
                                    onChange={(e) => handleInputChange('ifsc_code', e.target.value.toUpperCase())}
                                    error={!!formErrors.ifsc_code}
                                    helperText={formErrors.ifsc_code || 'Format: 4 letters + 0 + 6 alphanumeric'}
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* Bank Name */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Store color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Bank Name *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="Enter bank name"
                                    value={data.bank_name}
                                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                    error={!!formErrors.bank_name}
                                    helperText={formErrors.bank_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* Branch */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <LocationOn color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Branch
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="Enter branch name/location (optional)"
                                    value={data.branch}
                                    onChange={(e) => handleInputChange('branch', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <Divider />

                            {/* Parent Group */}
                            <FormControl fullWidth>
                                <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                    Under (Parent Group)
                                </Typography>
                                <Autocomplete
                                    options={accountingGroupOptions || []}
                                    freeSolo
                                    value={selectedParentOption}
                                    onChange={handleParentChange}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.label
                                    }
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            {...props}
                                            sx={{
                                                fontWeight: 400,
                                                color: 'inherit',
                                                borderTop: 'none',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.action.hover, 0.1)
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select or enter parent group"
                                            variant="outlined"
                                            fullWidth
                                            helperText="Typically 'Bank Accounts' under Current Assets"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    '&:hover fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                        borderWidth: 2
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>

                            <Divider />

                            {/* Opening Balance Section */}
                            <Typography variant="h6" fontWeight={700} color="primary">
                                Opening Balance
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                {/* Opening Balance Amount */}
                                <FormControl fullWidth>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                        Amount
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        placeholder="0.00"
                                        value={data.opening_balance}
                                        onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                                        error={!!formErrors.opening_balance}
                                        helperText={formErrors.opening_balance}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">₹</InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: theme.shadows[2]
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>

                                {/* Balance Type */}
                                <FormControl sx={{ minWidth: 120 }}>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                        Type
                                    </Typography>
                                    <Select
                                        value={data.balance_type}
                                        onChange={(e) => handleInputChange('balance_type', e.target.value)}
                                        sx={{
                                            borderRadius: 1,
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }}
                                    >
                                        <MenuItem value="Dr">Dr (Debit)</MenuItem>
                                        <MenuItem value="Cr">Cr (Credit)</MenuItem>
                                    </Select>
                                </FormControl>
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

                        <Button
                            variant="contained"
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            onClick={handleSubmit}
                            disabled={isLoading || !data.ledger_name.trim() || !data.account_holder_name.trim() || !data.account_number.trim() || !data.ifsc_code.trim() || !data.bank_name.trim()}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: theme.shadows[6],
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                    transform: 'translateY(-3px)',
                                    boxShadow: theme.shadows[12],
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                    transform: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                minWidth: 200
                            }}
                        >
                            {isLoading
                                ? (bankLedger ? 'Updating Ledger...' : 'Creating Ledger...')
                                : (bankLedger ? 'Update Ledger' : 'Create Ledger')
                            }
                        </Button>
                    </Stack>

                    {!isMobile && data.ledger_name.trim() && data.account_holder_name.trim() && data.account_number.trim() && data.ifsc_code.trim() && data.bank_name.trim() && (
                        <Zoom in timeout={300}>
                            <Chip
                                icon={<CheckCircle />}
                                label="Ready to submit"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        </Zoom>
                    )}
                </Stack>
            </Box>
        </Drawer>
    );
};

export default CreateBankModal;