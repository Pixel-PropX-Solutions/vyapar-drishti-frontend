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
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
    Zoom
} from "@mui/material";
import { formatDate, getAvatarColor, getInitials } from "@/utils/functions";
import { Edit, Delete, Category, Visibility } from "@mui/icons-material";
import { GetInventoryGroups } from "@/utils/types";
interface InventoryGroupCardProps {
    group: GetInventoryGroups;
    onDelete: (id: string) => void;
    onEdit: (group: GetInventoryGroups) => void;
    onView: (group: GetInventoryGroups) => void;
}


export const InventoryGroupCard: React.FC<InventoryGroupCardProps> = ({ group, onDelete, onEdit, onView }) => {
    const theme = useTheme();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const confirmDelete = () => {
        onDelete(group?._id ?? '');
        setOpenDeleteDialog(false);
    };

    return (

        <>
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                elevation={3}
                sx={{
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
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    mr: 2,
                                    bgcolor: getAvatarColor(group.inventory_group_name),
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: `0 4px 12px ${alpha(getAvatarColor(group.inventory_group_name), 0.3)}`,
                                    transition: 'all 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}
                                src={group?.image ? group.image : ''}
                            >
                                {(getInitials(group.inventory_group_name))}
                            </Avatar>
                            <Typography
                                variant="body1"
                                gutterBottom
                                noWrap
                            >
                                {group?.inventory_group_name || ''}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Category
                                sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
                            />
                            <Typography variant="body2" noWrap
                            >
                                {group?.description || 'No description provided'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Parent: {group?.parent || 'None'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Created on: {formatDate(group?.created_at || '')}
                            </Typography>
                        </Box>
                        <Zoom in={isHovered} timeout={200}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                <Tooltip title="View Details" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(group);
                                        }}
                                        sx={{
                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                            color: theme.palette.info.main,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.info.main, 0.2),
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit Group" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(group);
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

                                <Tooltip title="Delete Group" arrow>
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
                    Delete {group.inventory_group_name}?
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. The group will be permanently removed from your inventory if it is not associated with any products.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete "<strong>{group.inventory_group_name}</strong>"?
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
                        Delete Group
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
