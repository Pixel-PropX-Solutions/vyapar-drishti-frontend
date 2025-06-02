import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Stack,
    useTheme,
    Tooltip,
    alpha,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GetAllInvoiceGroups } from "@/utils/types";
import { Edit, TypeSpecimen } from "@mui/icons-material";

const InvoiceTypesCard: React.FC<{
    invGroup: GetAllInvoiceGroups;
    onDelete: (id: string) => void;
    onEdit: (invGroup: GetAllInvoiceGroups) => void;
    // onView: (invGroup: GetAllInvoiceGroups) => void;
    index: number;
    // setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}> = ({ invGroup, onDelete, onEdit }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const theme = useTheme();
    const handleDelete = () => {
        setOpenDeleteDialog(true);
    };


    return (
        <Card
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
                position: "relative",
                overflow: "visible",
            }}
        >
            {invGroup?.user_id && invGroup?.company_id && (
                <Tooltip title="Edit Invoice Group" arrow>
                    <Edit
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(invGroup);
                        }}
                        sx={{
                            position: "absolute",
                            bottom: -10,
                            right: 40,
                            zIndex: 1,
                            cursor: "pointer",
                            border: `2px solid ${theme.palette.info.main}`,
                            fontSize: "2.5rem",
                            color: alpha(theme.palette.text.primary, 0.4),
                            background: alpha(theme.palette.info.main, 0.2),
                            borderRadius: 1,
                            p: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translateY(2px)",
                                color: alpha(theme.palette.text.primary, 1),
                                borderColor: theme.palette.info.dark,
                                background: alpha(theme.palette.info.main, 0.3),
                            },
                        }}
                    />
                </Tooltip>)}

            {invGroup?.user_id && invGroup?.company_id && (
                <Tooltip title="Delete Invoice Group" arrow>
                    <DeleteIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        sx={{
                            position: "absolute",
                            bottom: -10,
                            right: -10,
                            zIndex: 1,
                            cursor: "pointer",
                            border: `2px solid ${theme.palette.error.light}`,
                            fontSize: "2.5rem",
                            color: alpha(theme.palette.text.primary, 0.4),
                            background: alpha(theme.palette.error.light, 0.2),
                            borderRadius: 1,
                            p: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translateY(2px)",
                                color: alpha(theme.palette.text.primary, 1),
                                borderColor: theme.palette.error.main,
                                background: alpha(theme.palette.error.light, 0.3),
                            },
                        }}
                    />
                </Tooltip>)}

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    noWrap
                    title={invGroup?.name}
                >
                    {invGroup?.name}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TypeSpecimen
                            sx={{ mr: 1, color: theme.palette.info.dark, fontSize: "1.2rem" }}
                        />
                        <Typography variant="body2" noWrap
                            title={'Type of Invoice Group'}>
                            {invGroup?.parent || invGroup?.name}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete {invGroup?.name}?
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this Invoice group? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenDeleteDialog(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(invGroup?._id || "");
                        }}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default InvoiceTypesCard;