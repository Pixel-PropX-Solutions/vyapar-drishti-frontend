import React from "react";
import {
    Box,
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export const InvoicesRowSkeleton: React.FC = () => (
    <TableRow >
        <TableCell align="center">
            <Skeleton variant="text" width={20} height={32} />
        </TableCell>
        <TableCell>
            <Skeleton variant="text" width={100} height={28} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={160} height={32} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Skeleton variant="text" width={40} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Skeleton variant="text" width={40} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
            </Box>
        </TableCell>
    </TableRow>
);