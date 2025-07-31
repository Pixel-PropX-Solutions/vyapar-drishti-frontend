import React from "react";
import {
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export const TimelineRowSkeleton: React.FC = () => (
    <TableRow >
        <TableCell align="left">
            <Skeleton variant="text" width={250} height={20} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={60} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={180} height={20} />
        </TableCell>
        <TableCell align="left">
            <Skeleton variant="text" width={80} height={20} />
        </TableCell>
    </TableRow>
);