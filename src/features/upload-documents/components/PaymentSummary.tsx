import React from "react";
import { CardContent, Typography, Box, Divider, Grid } from "@mui/material";
import { StyledCard } from "./StyledCard";

interface PaymentSummaryProps {
    totals: any;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ totals }) => {
    return (
        <Grid item xs={12} md={4}>
            <StyledCard >
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Payment Summary
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">&#8377;{totals?.subtotal?.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Discount:</Typography>
                        <Typography variant="body2">&#8377;{totals?.discount?.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">GST Total:</Typography>
                        <Typography variant="body2">&#8377;{totals?.GST_total?.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight="bold">
                            Grand Total:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            &#8377;{totals?.grand_total?.toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </StyledCard>
        </Grid>
    );
};

export default PaymentSummary;
