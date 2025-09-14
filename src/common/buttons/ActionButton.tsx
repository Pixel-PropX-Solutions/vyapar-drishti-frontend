import {
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha,
} from '@mui/material';



type PaletteColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export const ActionButton = ({
    icon,
    title,
    color,
    onClick
}: {
    icon: React.ReactNode;
    title: string;
    color: PaletteColor;
    onClick: () => void;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Tooltip title={title} arrow placement="top">
            <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={onClick}
                sx={{
                    bgcolor: alpha(theme.palette[color].main, 0.1),
                    color: theme.palette[color].main,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        bgcolor: alpha(theme.palette[color].main, 0.15),
                        border: `1px solid ${theme.palette[color].main}`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
                    },
                }}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
}