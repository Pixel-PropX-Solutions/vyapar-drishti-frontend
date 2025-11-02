import {
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ActionButton } from "@/common/buttons/ActionButton";
import { useNavigate } from "react-router-dom";


interface PageHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <ActionButton
                                icon={<ArrowBack fontSize="small" />}
                                title="Back"
                                color="primary"
                                onClick={() => navigate(-1)}
                            />
                            <Box>
                                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                            {children}
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
