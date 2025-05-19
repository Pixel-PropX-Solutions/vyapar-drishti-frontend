import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";


export const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s",
  gap: 0,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));