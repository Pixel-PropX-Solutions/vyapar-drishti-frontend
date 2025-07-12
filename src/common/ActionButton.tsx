import { Button, styled } from "@mui/material";

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  boxShadow: 'none',
}));