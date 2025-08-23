import { useTheme } from "@mui/material";
import { ActionButton } from "./ActionButton1";

interface ActionButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  startIcon?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  text?: React.ReactNode | string;
}

const ActionButtonCancel: React.FC<ActionButtonProps> = ({
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