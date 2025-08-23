import React from "react";
import { CardContent, Typography, Box, Grid } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { StyledCard } from "./StyledCard";

const icons = {
    LocalShippingIcon: <LocalShippingIcon color="primary" fontSize="large" />,
    StorefrontIcon: <StorefrontIcon color="primary" fontSize="large" />,
};

interface InvoiceSummaryCardProps {
    title: string;
    icon: keyof typeof icons;
    details: any;
}

const InvoiceSummaryCard: React.FC<InvoiceSummaryCardProps> = ({
    title,
    icon,
    details,
}) => {
    return (
        <Grid item xs={12} md={4}>
            <StyledCard>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                        {icons[icon]}
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                        {details?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {details?.address?.street_address_1},{" "}
                        {details?.address?.street_address_2 && `${details?.address?.street_address_2}, `}
                        {details?.address?.city}, {details?.address?.state} -{" "}
                        {details?.address?.zip_code}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        Phone: {details?.phone}
                    </Typography>
                    <Typography variant="body2">TIN: {details?.TIN}</Typography>
                    <Typography variant="body2">DL No: {details?.DL_No}</Typography>
                </CardContent>
            </StyledCard>
        </Grid>
    );
};

export default InvoiceSummaryCard;
