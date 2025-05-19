import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";


export const StyledCard = styled(Card)(() => ({
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    },
    height: "100%",
  }));