import React from "react";
import { alpha, Box, Paper, Typography, Pagination } from "@mui/material";
import theme from "@/theme";

interface BottomPaginationProps {
    total: number;
    item: string;
    page: number;
    metaPage: number;
    rowsPerPage: number;
    onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}


export const BottomPagination: React.FC<BottomPaginationProps> = ({ page, total, item, metaPage, onChange, rowsPerPage }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                mt: 1,
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                    {`Showing ${(metaPage - 1) * rowsPerPage + 1}-${Math.min(
                        metaPage * rowsPerPage,
                        total
                    )} of ${total} ${item}`}
                </Typography>
            </Box>

            {total > rowsPerPage && (
                <Pagination
                    count={Math.ceil(total / rowsPerPage)}
                    page={page}
                    onChange={onChange}
                    color="primary"
                    size={"medium"}
                    showFirstButton
                    showLastButton
                    sx={{
                        "& .MuiPaginationItem-root": {
                            mx: { xs: 0.25, sm: 0.5 },
                            borderRadius: 1,
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                            '&.Mui-selected': {
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            },
                        },
                    }}
                />
            )}
        </Paper>
    );
};

export default Pagination;