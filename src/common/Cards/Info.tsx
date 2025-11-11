import {
    Typography,
    Box,
    Card,
    CardContent,
    useTheme,
    alpha,
} from "@mui/material";


interface PageHeaderProps {
    title: string;
    subtitle: string;
    gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'glass';
}

export default function Info({ title, subtitle, gradient = 'primary' }: PageHeaderProps) {
    const theme = useTheme();
    // Gradient Backgrounds
    type GradientType = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'glass';
    const gradients: Record<GradientType, string> = {
        primary: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.35)} 100%)`,
        secondary: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.35)} 100%)`,
        success: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.35)} 100%)`,
        warning: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.35)} 100%)`,
        error: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.3)} 100%)`,
        info: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)} 0%, ${alpha(theme.palette.info.main, 0.3)} 100%)`,
        glass: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
    };

    return (
        <Card sx={{ background: gradients[gradient], borderRadius: '8px', my: 1, p: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', width: 'max-content' }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                    <Typography variant="body1" fontWeight="700" color="text.primary">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
