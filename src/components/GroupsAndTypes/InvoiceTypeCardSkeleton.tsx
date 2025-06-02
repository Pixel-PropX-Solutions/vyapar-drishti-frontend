import { Card, CardContent, Skeleton, Divider, Stack, Box } from "@mui/material";

const InvoiceTypeCardSkeleton: React.FC = () => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <CardContent sx={{ flexGrow: 1, }}>

      {/* <Skeleton variant="text" width="70%" height={32} /> */}
      {/* <Skeleton variant="rectangular" width={100} height={24} sx={{ mb: 2 }} /> */}
      <Skeleton variant="text" width="100%" />
      {/* <Skeleton variant="text" width="100%" /> */}

      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={1.5}>
        {[1].map((item) => (
          <Box key={item} sx={{ display: "flex", alignItems: "center" }}>
            {/* <Skeleton
              variant="circular"
              width={20}
              height={20}
              sx={{ mr: 1 }}
            /> */}
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default InvoiceTypeCardSkeleton;