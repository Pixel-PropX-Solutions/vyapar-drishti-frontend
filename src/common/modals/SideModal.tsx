import React, { useEffect, useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Drawer,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import ActionButtonSuccess from '../buttons/ActionButtonSuccess';
import ActionButtonCancel from '../buttons/ActionButtonCancel';
import { AccountBalanceWallet } from '@mui/icons-material';


type CategoriesModalProps<T extends { _id: string; ledger_name: string; }> = {
    open: boolean;
    title: string;
    search: string;
    buttonText: string;
    onClose: () => void;
    categories?: T[];
    onAddCategory?: (data: T) => void;
    onEditCategory?: (data: T) => void;
    onDeleteCategory?: (data: T) => void;
};

export function CategoriesModal<T extends { _id: string; ledger_name: string; }>({
    open,
    title,
    search,
    onClose,
    buttonText,
    categories: initialCategories = [],
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
}: CategoriesModalProps<T>): React.JSX.Element {

    const theme = useTheme();
    const [categories, setCategories] = useState<T[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState<boolean>(false);
    const [editValue, setEditValue] = useState('');

    // ✅ Sync when categories prop changes externally
    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // 🟢 STEP 1: Add button now starts creation mode
    const handleAddCategory = () => {
        if (creating) return; // prevent duplicates
        setCreating(true);
        setEditingId(null);
        setEditValue('');
    };

    // 🟢 STEP 2: Create new category
    const handleCreate = () => {
        const trimmed = editValue.trim();
        if (!trimmed) return;

        const newCategory = {
            _id: Date.now().toString(),
            ledger_name: trimmed,
        } as T;

        setCategories([newCategory, ...categories]);
        setCreating(false);
        setEditValue('');

        if (onAddCategory) onAddCategory(newCategory);
    };

    // 🟡 STEP 3: Edit mode
    const handleEdit = (_id: string, currentName: string) => {
        setEditingId(_id);
        setCreating(false);
        setEditValue(currentName);
    };

    // 🟡 STEP 4: Update edited category
    const handleUpdate = (_id: string) => {
        const trimmed = editValue.trim();
        if (!trimmed) return;

        const updated = categories.map(cat =>
            cat._id === _id ? { ...cat, ledger_name: trimmed } : cat
        ) as T[];

        setCategories(updated);
        setEditingId(null);
        setEditValue('');

        const updatedItem = updated.find(cat => cat._id === _id);
        if (updatedItem && onEditCategory) onEditCategory(updatedItem);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
        setCreating(false);
    };

    // 🔴 STEP 5: Delete category
    const handleDelete = (_id: string) => {
        const deleted = categories.find(cat => cat._id === _id);
        if (deleted && onDeleteCategory) {
            onDeleteCategory(deleted);
        }
    };


    const filteredCategories = categories.filter((category) =>
        category.ledger_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600, md: 700 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: 'none',
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                },
                zIndex: 1300,
            }}
            open={open}
            onClose={onClose}
            transitionDuration={400}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    pb: 2,
                    mb: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                        {title} list
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleAddCategory}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 1.5,
                        px: 3,
                        py: 1,
                        bgcolor: '#2563eb',
                        '&:hover': {
                            bgcolor: '#1d4ed8',
                        },
                    }}
                >
                    {buttonText}
                </Button>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <TextField
                    fullWidth
                    size='small'
                    placeholder={search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />,
                    }}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                        },
                    }}
                />

                <TableContainer component={Paper} elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        fontSize: '0.875rem',
                                        borderBottom: '2px solid #e5e7eb',
                                    }}
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        fontSize: '0.875rem',
                                        borderBottom: '2px solid #e5e7eb',
                                    }}
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {creating && (
                                <TableRow
                                    sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                    <TableCell sx={{ py: 2 }}>
                                        <TextField
                                            fullWidth
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                            autoFocus
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter category name"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    bgcolor: 'white',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <ActionButtonSuccess
                                                onClick={handleCreate}
                                                startIcon={<AddIcon />}
                                                text='Create'
                                                size='small'
                                            />
                                            <ActionButtonCancel
                                                onClick={handleCancel}
                                                startIcon={<ClearIcon />}
                                                text='Cancel'
                                                size='small'
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                                <TableRow
                                    key={category._id}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#f9fafb',
                                        },
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ py: 2 }}>
                                        {editingId === category._id ? (
                                            <TextField
                                                fullWidth
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdate(category._id);
                                                    }
                                                }}
                                                autoFocus
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        bgcolor: 'white',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            category.ledger_name
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            {editingId === category._id ? (
                                                <>
                                                    <ActionButtonSuccess
                                                        onClick={() => handleUpdate(category._id)}
                                                        startIcon={<AddIcon />}
                                                        text='Update'
                                                        size='small'
                                                    />
                                                    <ActionButtonCancel
                                                        onClick={handleCancel}
                                                        startIcon={<ClearIcon />}
                                                        text='Cancel'
                                                        size='small'
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <ActionButtonSuccess
                                                        onClick={() => handleEdit(category._id, category.ledger_name)}
                                                        startIcon={<EditIcon />}
                                                        text='Edit'
                                                        size='small'
                                                    />
                                                    <ActionButtonCancel
                                                        onClick={() => handleDelete(category._id)}
                                                        startIcon={<DeleteIcon />}
                                                        text='Delete'
                                                        size='small'
                                                    />
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ textAlign: "center", py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <AccountBalanceWallet sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                No {title.toLowerCase()} created yet
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Try adjusting your search or filter criteria, or create your very first {title.toLowerCase()} for today
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Drawer>
    );
};
