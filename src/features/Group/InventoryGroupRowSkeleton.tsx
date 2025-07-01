import React from "react";
import {
    Box,
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export const InventoryGroupRowSkeleton: React.FC = () => (
    <TableRow sx={{
        "& .MuiTableCell-root": {
            padding: '8px 16px',
        },
    }}>
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={36} height={36} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={140} height={20} />
                    <Skeleton variant="rectangular" width={100} height={10} sx={{ borderRadius: 1, mt: 0.5 }} />
                </Box>
            </Box>
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={60} height={16} sx={{ mx: 'auto' }} />
            {/* <Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 1, mx: 'auto', mt: 0.5 }} /> */}
        </TableCell>
        {/* <TableCell align="right">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="right">
            <Skeleton variant="text" width={80} height={32} sx={{ ml: 'auto' }} />
        </TableCell> */}
        <TableCell align="right">
            <Skeleton variant="text" width={80} height={16} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                {/* <Skeleton variant="circular" width={32} height={32} /> */}
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
            </Box>
        </TableCell>
    </TableRow>
);