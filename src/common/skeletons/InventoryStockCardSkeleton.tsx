import { Box, Grid, Paper, Skeleton, styled } from "@mui/material";
import theme from "@/theme";

const StockCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
    borderRadius: 12,
}));

interface SkeletonProps {
    color: string;
    border: string;
}

const InventoryStockCardSkeleton = (props: SkeletonProps) => {
    const { color, border } = props;
    return (
        <Grid item xs={12} sm={6} md={2.4}>
            <StockCard sx={{
                bgcolor: color,
                borderLeft: border,
            }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                        <Skeleton variant="text" width={60} height={40} />
                    </Box>
                    <Skeleton variant="text" width="100%" height={18} sx={{ mt: 2, mx: 'auto' }} />
                </Box>
            </StockCard>
        </Grid>
    );
};

export default InventoryStockCardSkeleton;