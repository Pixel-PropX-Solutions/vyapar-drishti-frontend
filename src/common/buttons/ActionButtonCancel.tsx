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
  size?: 'small' | 'medium' | 'large';
}

const ActionButtonCancel: React.FC<ActionButtonProps> = ({
  variant,
  startIcon,
  onClick,
  disabled,
  text,
  size = 'medium'
}) => {
  const theme = useTheme();
  return (
    <ActionButton
      size={size}
      variant={variant || 'contained'}
      startIcon={startIcon}
      color="error"
      onClick={onClick}
      disabled={disabled}
      sx={{
        background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
        color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
        '&:hover': {
          color: theme.palette.mode === 'dark' ? '#000' : '#fff',
          background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
        },
      }}
    >
      {text ?? 'Cancel'}
    </ActionButton>
  );
};

export default ActionButtonCancel;