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
        <TableCell align="left">
            <Skeleton variant="text" width={100} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={160} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
            </Box>
        </TableCell>
    </TableRow>
);