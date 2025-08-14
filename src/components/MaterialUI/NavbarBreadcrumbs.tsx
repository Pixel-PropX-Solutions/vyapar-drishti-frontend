import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getEntityName } from "@/services/user";

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
  const dispatch = useDispatch<AppDispatch>();

  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const pathSegments = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const fetchNames = async () => {
      const newMap: Record<string, string> = {};

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];

        // Check if this segment is a UUID
        if (/^[0-9a-fA-F-]{36}$/.test(segment)) {
          // The previous segment should be the entity type
          const entity = pathSegments[i - 1];
          if (!entity) continue; // skip if somehow no entity before UUID

          try {
            // Dispatch Redux action with detected entity + id
            const res = await dispatch(getEntityName({ entity, id: segment }));
            if (res.meta.requestStatus === "fulfilled") {
              newMap[segment] = (res.payload as { name: string }).name;
            } else {
              console.error(`Failed to fetch name for ${entity} ID ${segment}`, res);
            }
          } catch (err) {
            console.error(`Failed to fetch name for ${entity} ID ${segment}`, err);
          }
        }
      }

      setNameMap((prev) => ({ ...prev, ...newMap }));
    };

    fetchNames();
  }, [location.pathname]);


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
      {pathSegments.map((item, index) => {
        const label = nameMap[item] || (item.charAt(0).toUpperCase() + item.slice(1));
        const isLast = index === pathSegments.length - 1;
        const linkPath = "/" + pathSegments.slice(0, index + 1).join("/");

        return (
          <Typography
            key={index}
            variant="body1"
            onClick={() => !isLast && navigate(linkPath)}
            sx={{
              color: "text.primary",
              fontWeight: 600,
              cursor: isLast ? "default" : "pointer",
              ":hover": { textDecoration: isLast ? "none" : "underline" },
            }}
          >
            {label}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
}
