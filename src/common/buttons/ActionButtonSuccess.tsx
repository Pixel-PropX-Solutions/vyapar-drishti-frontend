import { useTheme } from "@mui/material";
import { Button, styled } from "@mui/material";

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 600,
    padding: theme.spacing(1, 2),
    transition: 'all 0.2s',
    boxShadow: 'none',
}));


interface ActionButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    startIcon?: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    text?: React.ReactNode | string;
}
const ActionButtonSuccess: React.FC<ActionButtonProps> = ({
    variant,
    startIcon,
    onClick,
    disabled,
    text,
}) => {
    const theme = useTheme();
    return (
        <ActionButton
            variant={variant || 'contained'}
            startIcon={startIcon}
            color="success"
            onClick={onClick}
            disabled={disabled}
            sx={{
                background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                '&:hover': {
                    color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                    background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                },
            }}
        >
            {text ?? 'Submit'}
        </ActionButton>
    );
};

export default ActionButtonSuccess;