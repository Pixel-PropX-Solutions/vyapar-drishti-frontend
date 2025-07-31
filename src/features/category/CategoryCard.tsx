import React, { useState } from "react";
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    // Drawer,
    IconButton,
    // List,
    // ListItem,
    // ListItemText,
    Stack,
    Tooltip,
    Typography,
    useTheme,
    Zoom
} from "@mui/material";
import { getAvatarColor, getInitials } from "@/utils/functions";
import { Edit, Delete, Category, } from "@mui/icons-material";
import { GetCategory } from "@/utils/types";
interface CategoryCardProps {
    category: GetCategory;
    onDelete: (id: string) => void;
    onEdit: (category: GetCategory) => void;
    // onView: (category: GetCategory) => void;
}


export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onDelete, onEdit }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    // const [openDrawer, setOpenDrawer] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const confirmDelete = () => {
        onDelete(category?._id ?? '');
        setOpenDeleteDialog(false);
    };

    return (

        <>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                elevation={3}
                sx={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                    },
                    overflow: "visible",
                }}
                // onClick={() => setOpenDrawer(true)}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                mr: 2,
                                bgcolor: getAvatarColor(category.category_name),
                                fontSize: '1rem',
                                fontWeight: 700,
                                boxShadow: `0 4px 12px ${alpha(getAvatarColor(category.category_name), 0.3)}`,
                                transition: 'all 0.3s ease',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            }}
                            src={category?.image ? category.image : ''}
                        >
                            {(getInitials(category.category_name))}
                        </Avatar>
                        <Typography
                            variant="body1"
                            gutterBottom
                            noWrap
                            title={category?.category_name}
                        >
                            {category?.category_name || ''}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Category
                                sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
                            />
                            <Typography variant="body2" noWrap>
                                {category?.description || 'No description provided'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                            <Typography variant="h6" noWrap>
                                {category?.stock_items_count || 0} Products
                            </Typography>
                            <Zoom appear in>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                    <Tooltip title="Edit Category" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(category);
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
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete Category" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setOpenDeleteDialog(true);
                                                e.stopPropagation();
                                            }}
                                            sx={{
                                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                                color: theme.palette.error.main,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.error.main, 0.2),
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Zoom>
                        </Box>

                    </Stack>
                </CardContent>
            </Card>


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
                        gap: 2,
                        color: theme.palette.error.main,
                        fontWeight: 600,
                    }}
                >
                    <Delete />
                    Delete {category.category_name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The category will be permanently removed from your inventory if it is not associated with any products.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{category.category_name}</strong>"?
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
                        startIcon={<Delete />}
                    >
                        Delete Category
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                aria-labelledby="category-details-title"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 700, md: 900 },
                        borderRadius: 1,
                        boxShadow: `0 24px 50px ${alpha(theme.palette.error.main, 0.2)}`,
                    }
                }}
                {...(openDrawer ? {} : { inert: '' })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        fontWeight: 600,
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Tooltip title="Close">
                            <IconButton
                                onClick={() => setOpenDrawer(false)}
                                sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        transform: 'rotate(90deg)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 800,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Product in {category.category_name}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.divider,
                        borderRadius: 4,
                        '&:hover': { backgroundColor: theme.palette.text.secondary }
                    }
                }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Category Name: <strong>{category.category_name}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Description: {category.description || 'No description provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Total Products: {category.stock_items_count || 0}
                        </Typography>
                        <Typography variant="body2">
                            Created At: {new Date(category.created_at).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Products in this Category:
                        </Typography>
                        <List>
                            {category.stock_items.map((item) => (
                                <ListItem key={item._id}>
                                    <ListItemText primary={item.stock_item_name} secondary={`Price: 12`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                </Box>
            </Drawer> */}
        </>
    );
};
