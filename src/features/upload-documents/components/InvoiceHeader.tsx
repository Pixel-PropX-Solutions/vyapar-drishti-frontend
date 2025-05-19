import React from "react";
import { Button, Card, CardContent, Grid, Paper, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface InvoiceHeaderProps {
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    handleSave: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ editMode, setEditMode, handleSave }) => {
    return (
        <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
                <Paper
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "transparent",
                    }}
                >
                    <Grid item sx={{ width: "50%" }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            PharmaBill Manager
                        </Typography>
                    </Grid>

                    <Grid
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Grid item xs={12} sm={6} md={12}>
                            {editMode ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setEditMode(false)}
                                    sx={{ ml: 2 }}
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditMode(true)}
                                    sx={{ ml: 2 }}
                                >
                                    Edit
                                </Button>
                            )}
                            <Tooltip title="Print Invoice" sx={{ ml: 2 }}>
                                <Button
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Paper>
            </CardContent>
        </Card>
    );
};

export default InvoiceHeader;
