import { Card, CardContent, Skeleton, Divider, Box } from "@mui/material";

const CategoryCardSkeleton: React.FC = () => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flexGrow: 1, }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={36} height={36} sx={{ mr: 2 }} />
                    <Skeleton variant="text" width={140} height={14} />

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </Box>

            <Divider sx={{ my: 1.5 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />

        </CardContent>
    </Card>
);

export default CategoryCardSkeleton;