import React from "react";
import {
    Box,
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const ProductRowSkeleton: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user.user_settings.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;

    return (
        <TableRow sx={{
            "& .MuiTableCell-root": {
                padding: '8px 16px',
            }
        }}>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={36} height={36} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width={140} height={14} />
                        <Skeleton variant="text" width={140} height={14} />
                    </Box>
                </Box>
            </TableCell>
            {/* <TableCell align="center">
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
            </TableCell> */}
            <TableCell align="center">
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
            </TableCell>
            {gst_enable && <TableCell align="center">
                <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto' }} />
            </TableCell>}
            <TableCell align="center">
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
            </TableCell>
            <TableCell align="center">
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
            </TableCell>
            <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </TableCell>
        </TableRow>
    )
};