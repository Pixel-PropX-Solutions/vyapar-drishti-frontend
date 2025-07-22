import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    useTheme,
    FormControl,
    Alert,
    Autocomplete,
    Slide,
    Paper,
    Card,
    CardContent,
    Grid,
    InputAdornment
} from "@mui/material";
import {
    Timeline,
    Person,
    Email,
    CheckCircle,
    Save,
    AccountBalance,
    Cancel,
    AddCircleOutlined,
    Image,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createCustomer, updateCustomer } from "@/services/customers";
import countries from "@/internals/data/CountriesStates.json";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton } from "@/common/buttons/ActionButton";
import { capitalizeInput } from "@/utils/functions";
import ImageUpload from "@/common/ImageUpload";
import { SectionCard } from "./sectionCard";
import { setEditingCustomer } from "@/store/reducers/customersReducer";
import PhoneNumber from "@/common/PhoneNumber";


interface CustomerFormData {
    company_id: string;
    parent: string;
    parent_id: string;
    mailing_name: string;
    mailing_pincode: string;
    mailing_country?: string;
    mailing_state: string;
    mailing_address?: string;
    alias?: string;
    name: string;
    email?: string;
    image?: string | File | null;
    code: string;
    number: string;
    bank_name?: string;
    account_number?: string;
    bank_ifsc?: string;
    bank_branch?: string;
    account_holder?: string;
    gstin?: string;
}

interface ValidationErrors {
    [key: string]: string;
}

const EditCustomer: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { type } = useParams();
    const navigate = useNavigate();
    const customerType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const customerImageRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [fetchingGST, setFetchingGST] = useState(false);
    const { currentCompany, user } = useSelector((state: RootState) => state.auth);
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user.user_settings.current_company_id);
    const { customerType_id, editingCustomer } = useSelector((state: RootState) => state.customersLedger);
    const isGSTINRequired: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst && customerType === 'Creditors';
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [expandedSections, setExpandedSections] = useState({
        profile: true,
        contact: true,
        address: false,
        bank: false
    });

    const [data, setData] = useState<CustomerFormData>({
        name: '',
        email: '',
        code: '',
        number: '',
        image: '',
        mailing_name: '',
        mailing_address: '',
        mailing_country: '',
        mailing_state: '',
        mailing_pincode: '',
        company_id: '',
        parent: '',
        parent_id: '',
        bank_name: '',
        account_number: '',
        bank_ifsc: '',
        bank_branch: '',
        account_holder: '',
        gstin: '',
    });

    const validateForm = useCallback((): boolean => {
        const errors: ValidationErrors = {};
        Object.keys(data).forEach(key => {
            const field = key as keyof CustomerFormData;
            const error = validateField(field, String(data[field] || ''));
            if (error) errors[field] = error;
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data]);

    const handleInputChange = (
        field: string,
        value: string
    ) => {

        setData(prev => ({
            ...prev,
            [field]: value
        }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        const error = validateField(field, value);
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: error
            }));
        }
    };

    const handleImageChange = useCallback((file: File) => {
        if (!file) return;

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB.');
            return;
        }

        setData(prev => ({
            ...prev,
            image: file
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    }, [handleImageChange]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleBoxClick = () => {
        customerImageRef.current?.click();
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData(prev => ({
            ...prev,
            image: ''
        }));
        if (customerImageRef.current) {
            customerImageRef.current.value = '';
        }
    }, []);

    const validateField = (field: string, value: string): string => {
        if (field === 'name' && !value.trim()) return 'Billing Name is required. This name is used for invoicing and legal purposes.';
        if (gst_enable && !data.mailing_country && field === 'mailing_state' && !value.trim()) return 'Please select country first.';
        if (gst_enable && field === 'mailing_country' && !value.trim()) return 'Billing country is required.';
        if (gst_enable && field === 'mailing_state' && !value.trim()) return 'Billing state is required.';
        if (isGSTINRequired && field === 'gstin' && !value.trim()) return 'GSTIN is required.';

        // if (field === 'mailing_address' && !value.trim()) return '';
        if (field === 'mailing_pincode' && value && !/^\d{1,6}$/.test(value)) return 'Invalid pincode format';
        if (field === 'code' && value && !/^\+\d{1,4}$/.test(value)) return 'Invalid phone code format';
        if (field === 'number' && value && !/^\d{10}$/.test(value)) return 'Invalid phone number format';
        if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        if (field === 'name' && value.trim().length < 2) return 'Name must be at least 2 characters';
        if (field === 'gstin' && value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9][Z][0-9A-Z]$/.test(value)) return 'Invalid GSTIN format';
        if (field === 'account_number' && value && !/^\d{9,18}$/.test(value)) return 'Invalid bank account number format';
        if (field === 'bank_ifsc' && value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return 'Invalid IFSC code format';
        return '';
    };

    useEffect(() => {
        if (editingCustomer) {
            setData({
                name: editingCustomer.ledger_name || '',
                mailing_name: editingCustomer.mailing_name || '',
                mailing_address: editingCustomer.mailing_address || '',
                mailing_country: editingCustomer.mailing_country || '',
                mailing_state: editingCustomer.mailing_state || '',
                mailing_pincode: editingCustomer.mailing_pincode || '',
                parent: editingCustomer.parent || '',
                parent_id: editingCustomer.parent_id || '',
                company_id: editingCustomer.company_id || '',
                email: editingCustomer.email || '',
                code: editingCustomer.phone?.code || '',
                number: editingCustomer.phone?.number || '',
                image: typeof editingCustomer.image === 'string' ? editingCustomer.image : '',
                bank_name: editingCustomer?.bank_name || '',
                account_number: editingCustomer?.account_number || '',
                bank_ifsc: editingCustomer?.bank_ifsc || '',
                bank_branch: editingCustomer?.bank_branch || '',
                account_holder: editingCustomer?.account_holder || '',
                gstin: editingCustomer.gstin || '',
            });

            setImagePreview(
                typeof editingCustomer?.image === "string" ? editingCustomer.image : null
            );

        } else {
            setData(prev => ({
                ...prev,
                company_id: currentCompany?._id || '',
                parent: customerType || '',
                parent_id: customerType_id || '',
            }));
        }
    }, [currentCompany?._id, customerType_id, customerType, editingCustomer]);


    useEffect(() => {
        setIsFormValid(validateForm());
    }, [validateForm]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting.');
            return;
        }

        setIsLoading(true);
        const sanitizedData: Record<string, string | File | undefined> = {
            name: data.name?.trim(),
            user_id: user?._id,
            company_id: currentCompany?._id,
        };

        if (data.email?.trim())
            sanitizedData.email = data.email.trim();
        if (data.parent?.trim()) sanitizedData.parent = data.parent.trim();
        if (data.parent_id?.trim()) sanitizedData.parent_id = data.parent_id.trim();
        if (data.mailing_pincode?.trim()) sanitizedData.mailing_pincode = data.mailing_pincode.trim();
        if (data.code?.trim()) sanitizedData.code = data.code.trim();
        if (data.number?.trim()) sanitizedData.number = data.number.trim();
        if (data.mailing_name?.trim()) sanitizedData.mailing_name = data.mailing_name.trim();
        if (data.mailing_address?.trim()) sanitizedData.mailing_address = data.mailing_address.trim();
        if (data.mailing_country?.trim()) sanitizedData.mailing_country = data.mailing_country.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
        if (data.mailing_state?.trim()) sanitizedData.mailing_state = data.mailing_state.trim();
        if (data.bank_name?.trim()) sanitizedData.bank_name = data.bank_name.trim();
        if (data.account_number?.trim()) sanitizedData.account_number = data.account_number.trim();
        if (data.bank_ifsc?.trim()) sanitizedData.bank_ifsc = data.bank_ifsc.trim();
        if (data.bank_branch?.trim()) sanitizedData.bank_branch = data.bank_branch.trim();
        if (data.account_holder?.trim()) sanitizedData.account_holder = data.account_holder.trim();
        if (data.gstin?.trim()) sanitizedData.gstin = data.gstin.trim();

        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value !== undefined && value !== null) {
                if (typeof value === 'string' || value instanceof Blob) {
                    formData.append(key, value);
                }
            }
        });

        try {
            await toast.promise(
                !editingCustomer
                    ? dispatch(createCustomer(formData)).unwrap()
                    : dispatch(
                        updateCustomer({ data: formData, id: editingCustomer._id ?? "" })
                    ).unwrap(),
                {
                    loading: (
                        <b>{!editingCustomer ? "Creating" : "Updating"} {customerType}... ⏳</b>
                    ),
                    success: (
                        <b>
                            {customerType} {!editingCustomer ? "created" : "updated"} successfully! 🎉
                        </b>
                    ),
                    error: (
                        <b>Failed to {!editingCustomer ? "create" : "update"} {customerType}. 🚫</b>
                    ),
                }
            );
            navigate('/customers');
        } catch {
            // Error handled by toast
        } finally {
            navigate('/customers');
            setIsLoading(false);
        }
    };

    const handlefetchGSTINDetails = async () => {
        setFetchingGST(true);

        setTimeout(() => {
            setFetchingGST(false);
        }, 2000);
    };

    return (
        <Box
            sx={{
                p: 3, width: "100%",
            }}
        >
            {/* Header with Progress */}
            <Card sx={{ mb: 2, p: 2, }}>
                <CardContent>
                    <Paper
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: 'transparent'
                        }}
                    >
                        <Grid item sx={{ width: "50%" }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                            >
                                {editingCustomer ? 'Update ' : 'Create new '}{customerType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" >
                                Fill in the details below to {editingCustomer ? 'update the ' : 'create a new '}{customerType}.
                            </Typography>
                        </Grid>

                        <Grid
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <ActionButton
                                variant="contained"
                                startIcon={<Cancel />}
                                color="error"
                                onClick={() => {
                                    dispatch(setEditingCustomer(null));
                                    navigate(-1);
                                }}
                                disabled={isLoading}
                                sx={{
                                    background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                                    border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
                                    '&:hover': {
                                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                        background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                                    },
                                }}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="contained"
                                startIcon={isLoading ? <Timeline className="animate-spin" /> : editingCustomer ? <Save /> : <AddCircleOutlined />}
                                color="success"
                                onClick={handleSubmit}
                                disabled={isLoading || !isFormValid}
                                sx={{
                                    background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                                    border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                                    '&:hover': {
                                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                        background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                                    },
                                }}
                            >
                                {isLoading ? editingCustomer ? `Updating...` : `Creating...` : editingCustomer ? `Update ${customerType}` : `Create ${customerType}`}
                            </ActionButton>
                            <Slide direction="down" in={showSuccessAlert} mountOnEnter unmountOnExit>
                                <Alert
                                    severity="success"
                                    icon={<CheckCircle fontSize="inherit" />}
                                    onClose={() => setShowSuccessAlert(false)}
                                    sx={{
                                        borderRadius: 1,
                                        mt: 1,
                                        '& .MuiAlert-icon': {
                                            fontSize: 24,
                                            alignItems: 'center'
                                        }
                                    }}
                                >
                                    Customer details updated successfully!
                                </Alert>
                            </Slide>
                        </Grid>
                    </Paper>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                {/* Required Information Section */}
                <SectionCard
                    title="Required Information"
                    icon={<Person sx={{ color: '#667eea' }} />}
                    section="profile"
                    toggleSection={toggleSection}
                    expandedSections={expandedSections}
                    required
                >
                    {gst_enable && <FormControl fullWidth sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label={`GSTIN Number (${isGSTINRequired ? 'Required' : 'Optional'})`}
                            placeholder="27XXXXXXXXXXXX"
                            value={data.gstin || ''}
                            required={isGSTINRequired}
                            onChange={(e) => handleInputChange('gstin', capitalizeInput(e.target.value, 'characters'))}
                            error={!!validationErrors.gstin}
                            helperText={validationErrors.gstin || "15-digit GSTIN number"}
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    padding: '0',
                                    paddingLeft: '8px',
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handlefetchGSTINDetails}
                                            disabled={fetchingGST}
                                            sx={{
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                transition: 'all 0.2s',
                                                boxShadow: 'none',
                                                height: "2.2rem",
                                                background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                                                color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                                                '&:hover': {
                                                    color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                                    background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                                                },
                                            }}
                                        >
                                            {fetchingGST ? <Timeline className="animate-spin" /> : `Fetch Details`}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>}

                    <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label={`Billing Name (Required)`}
                            placeholder="The Acme Corporation Ltd."
                            value={data.name || ''}
                            required
                            onChange={(e) => handleInputChange('name', capitalizeInput(e.target.value, 'words'))}
                            error={!!validationErrors.name}
                            helperText={validationErrors.name || "This name is used for invoicing and legal purposes."}
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ width: '50%' }}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={[
                                        ...(countries?.map(con => ({
                                            label: con.name,
                                        })) ?? []),
                                    ]}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.label || ''
                                    }
                                    freeSolo
                                    renderOption={(props, option) => {
                                        const { key, ...rest } = props;
                                        return (
                                            <li
                                                key={key}
                                                {...rest}
                                                style={{
                                                    fontWeight: 400,
                                                    color: 'inherit',
                                                    ...(props.style || {}),
                                                }}
                                            >
                                                {option.label}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select country"
                                            size="small"
                                            id="mailing_country"
                                            label={`Country (Required)`}
                                            autoComplete="off"
                                            error={!!validationErrors.mailing_country}
                                            helperText={validationErrors.mailing_country || "Country for mailing address"}
                                        />
                                    )}
                                    value={data.mailing_country || ''}
                                    onChange={(_, newValue) => {
                                        handleInputChange(
                                            'mailing_country',
                                            typeof newValue === 'string'
                                                ? newValue
                                                : (typeof newValue === 'object' && newValue !== null && 'label' in newValue)
                                                    ? newValue.label
                                                    : ''
                                        );
                                    }}
                                    sx={{
                                        '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ width: '50%' }}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={(() => {
                                        const country = countries.find(con => con.name === data.mailing_country);
                                        if (!country) return [];
                                        return country.states.length === 0 ? ['No States'] : country.states;
                                    })()}
                                    freeSolo
                                    renderOption={(props, option) => {
                                        const { key, ...rest } = props;
                                        return (
                                            <li
                                                key={key}
                                                {...rest}
                                                style={{
                                                    fontWeight: 400,
                                                    color: 'inherit',
                                                    ...(props.style || {}),
                                                }}
                                            >
                                                {option}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select state"
                                            disabled={!data.mailing_country}
                                            size="small"
                                            label={`State (Required)`}
                                            autoComplete="off"
                                            error={!!validationErrors.mailing_state}
                                            helperText={validationErrors.mailing_state || "State for address"}
                                        />
                                    )}
                                    value={data.mailing_state || ''}
                                    onChange={(_, newValue) => {
                                        handleInputChange(
                                            'mailing_state',
                                            capitalizeInput((() => {
                                                const country = countries.find(con => con.name === data.mailing_country);
                                                if (!country || country.states.length < 1) return '';
                                                return newValue || '';
                                            })(), 'words')
                                        );
                                    }}
                                    sx={{
                                        '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                    {!gst_enable && <FormControl fullWidth sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label={`GSTIN Number (${isGSTINRequired ? 'Required' : 'Optional'})`}
                            placeholder="27XXXXXXXXXXXX"
                            value={data.gstin || ''}
                            required={isGSTINRequired}
                            onChange={(e) => handleInputChange('gstin', capitalizeInput(e.target.value, 'characters'))}
                            error={!!validationErrors.gstin}
                            helperText={validationErrors.gstin || "15-digit GSTIN number"}
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    padding: '0',
                                    paddingLeft: '8px',
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handlefetchGSTINDetails}
                                            disabled={fetchingGST}
                                            sx={{
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                transition: 'all 0.2s',
                                                boxShadow: 'none',
                                                height: "2.2rem",
                                                background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                                                color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                                                '&:hover': {
                                                    color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                                    background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                                                },
                                            }}
                                        >
                                            {fetchingGST ? <Timeline className="animate-spin" /> : `Fetch Details`}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>}
                </SectionCard>

                <SectionCard
                    title="Profile Information (Optional)"
                    icon={<Person sx={{ color: '#667eea' }} />}
                    section="contact"
                    toggleSection={toggleSection}
                    expandedSections={expandedSections}
                >
                    <Box sx={{ display: 'flex', gap: 2, my: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ width: '50%', }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Contact Person Name (If any)"
                                placeholder="Enter contact person name"
                                value={data.mailing_name || ''}
                                onChange={(e) => handleInputChange('mailing_name', capitalizeInput(e.target.value, 'words'))}
                                error={!!validationErrors.mailing_name}
                                helperText={validationErrors.mailing_name || "Customer's mailing name"}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1,
                                    }
                                }}
                            />

                            <PhoneNumber
                                size={'small'}
                                code={data.code || ''}
                                number={data.number || ''}
                                codeHandler={handleInputChange}
                                numberHandler={(e) => handleInputChange('number', e.target.value)}
                                codeWidth={'30%'}
                                numberWidth={'70%'}
                                gap={1}
                                codeLabel={'Code'}
                                codePlaceholder={'+91'}
                                numberLabel={'Phone Number'}
                                numberPlaceholder={"******7548"}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                label="Contact Email (Optional)"
                                type="email"
                                margin="normal"
                                placeholder="john@example.com"
                                value={data.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                error={!!validationErrors.email}
                                helperText={validationErrors.email || "Primary contact email"}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1,
                                    },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box sx={{ width: '50%' }} >
                            <TextField
                                fullWidth
                                size="small"
                                // margin="normal"
                                label="Street Address (Optional)"
                                placeholder="123 Main St, Apt 4B"
                                value={data.mailing_address || ''}
                                onChange={(e) => handleInputChange('mailing_address', capitalizeInput(e.target.value, 'words'))}
                                error={!!validationErrors.mailing_address}
                                helperText={validationErrors.mailing_address || "Street address for correspondence"}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1,
                                    }
                                }}
                                multiline
                                rows={3}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                margin="normal"
                                label="Postal Code (Optional)"
                                inputMode="numeric"
                                placeholder="90210"
                                value={data.mailing_pincode || ''}
                                onChange={(e) => handleInputChange('mailing_pincode', e.target.value)}
                                error={!!validationErrors.mailing_pincode}
                                helperText={validationErrors.mailing_pincode || "6-digit postal code"}
                                InputProps={{
                                    sx: {
                                        borderRadius: 1,
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </SectionCard>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 1 }}>
                <SectionCard
                    title="Profile Image (Optional)"
                    icon={<Image sx={{ color: '#667eea' }} />}
                    section="address"
                    toggleSection={toggleSection}
                    expandedSections={expandedSections}
                >

                    <Box sx={{ mt: 2 }}>
                        <ImageUpload
                            title={`${customerType} Image`}
                            inputRef={customerImageRef}
                            imagePreview={imagePreview}
                            isDragActive={isDragActive}
                            handleDrop={handleDrop}
                            handleDragEnter={handleDragEnter}
                            handleDragLeave={handleDragLeave}
                            handleBoxClick={handleBoxClick}
                            handleImageChange={handleImageChange}
                            removeImage={removeImage}
                        />

                    </Box>
                </SectionCard>

                <SectionCard
                    title="Bank Details (Optional)"
                    icon={<AccountBalance sx={{ color: '#667eea' }} />}
                    section="bank"
                    toggleSection={toggleSection}
                    expandedSections={expandedSections}
                >
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Bank Name (Optional)"
                            placeholder="e.g. State Bank of India"
                            value={data.bank_name || ''}
                            onChange={(e) => handleInputChange('bank_name', capitalizeInput(e.target.value, 'words'))}
                            error={!!validationErrors.bank_name}
                            helperText={validationErrors.bank_name || "Name of the bank"}
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <FormControl fullWidth sx={{ width: '50%' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Account Holder Name (Optional)"
                                    placeholder="John Doe"
                                    value={data.account_holder || ''}
                                    onChange={(e) => handleInputChange('account_holder', capitalizeInput(e.target.value, 'characters'))}
                                    error={!!validationErrors.bank_account_holder}
                                    helperText={validationErrors.bank_account_holder || "Name on the bank account"}
                                    InputProps={{
                                        sx: {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ width: '50%' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    margin="normal"
                                    label="Account Number (Optional)"
                                    placeholder="123456789012"
                                    value={data.account_number || ''}
                                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                                    error={!!validationErrors.account_number}
                                    helperText={validationErrors.account_number || "12-digit account number"}
                                    InputProps={{
                                        sx: {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Box sx={{ width: '50%' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="IFSC Code (Optional)"
                                    placeholder="e.g. SBIN0001234"
                                    value={data.bank_ifsc || ''}
                                    onChange={(e) => handleInputChange('bank_ifsc', capitalizeInput(e.target.value, 'characters'))}
                                    error={!!validationErrors.bank_ifsc}
                                    helperText={validationErrors.bank_ifsc}
                                    InputProps={{
                                        sx: {
                                            borderRadius: 1,
                                        }
                                    }}
                                    inputProps={{
                                        autoCapitalize: "characters"
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Bank Branch (Optional)"
                                    placeholder="Main Branch, Downtown"
                                    value={data.bank_branch || ''}
                                    onChange={(e) => handleInputChange('bank_branch', capitalizeInput(e.target.value, 'words'))}
                                    error={!!validationErrors.bank_branch}
                                    helperText={validationErrors.bank_branch || "Name of the bank branch"}
                                    InputProps={{
                                        sx: {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </SectionCard>
            </Box>


            {/* Footer with Action Buttons */}
            <Box sx={{
                p: 2,
                mt: 1,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
            }}>
                <ActionButton
                    variant="contained"
                    startIcon={<Cancel />}
                    color="error"
                    onClick={() => {
                        dispatch(setEditingCustomer(null));
                        navigate(-1);
                    }}
                    disabled={isLoading}
                    sx={{
                        background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
                        '&:hover': {
                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                            background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                        },
                    }}
                >
                    Cancel
                </ActionButton>
                <ActionButton
                    variant="contained"
                    startIcon={isLoading ? <Timeline className="animate-spin" /> : editingCustomer ? <Save /> : <AddCircleOutlined />}
                    color="success"
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
                    sx={{
                        background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                        border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                        '&:hover': {
                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                            background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                        },
                    }}
                >
                    {isLoading ? editingCustomer ? `Updating...` : `Creating...` : editingCustomer ? `Update ${customerType}` : `Create ${customerType}`}
                </ActionButton>
            </Box>
        </Box>
    );
}

export default EditCustomer;
