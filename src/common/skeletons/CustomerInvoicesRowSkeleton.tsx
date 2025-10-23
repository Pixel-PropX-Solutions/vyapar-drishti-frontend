import React from "react";
import {
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export const CustomerInvoicesRowSkeleton: React.FC = () => (
    <TableRow >
        <TableCell align="left">
            <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 1 }} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={100} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={160} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={40} height={20} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={40} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
    </TableRow>
);