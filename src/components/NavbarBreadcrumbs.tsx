import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation, useNavigate } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography
        variant="body1"
        sx={{
          cursor: "pointer",
          ":hover": {
            textDecoration: "underline",
          },
        }}
        onClick={() => {
          navigate(`/`);
        }}
      >
        Home
      </Typography>
      {location.pathname.split("/").map((item, index) => {
        if (item)
          return (
            <Typography
              onClick={() => {
                if (location.pathname.split("/").length !== index + 1) {
                  navigate(`/${item}`);
                }
              }}
              key={index}
              variant="body1"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                cursor:
                  location.pathname.split("/").length !== index + 1
                    ? "pointer"
                    : "default",
                ":hover": {
                  textDecoration:
                    location.pathname.split("/").length !== index + 1
                      ? "underline"
                      : "none",
                },
              }}
            >
              {item.charAt(0).toLocaleUpperCase() + item.slice(1)}
            </Typography>
          );
      })}
    </StyledBreadcrumbs>
  );
}
