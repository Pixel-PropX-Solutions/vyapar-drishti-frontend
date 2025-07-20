import React from "react";
import {
    Box,
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export const DeletedProductRowSkeleton: React.FC = () => (
    <TableRow>
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={140} height={28} />
                    <Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1, mt: 0.5 }} />
                </Box>
            </Box>
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={60} height={32} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
            </Box>
        </TableCell>
    </TableRow>
);