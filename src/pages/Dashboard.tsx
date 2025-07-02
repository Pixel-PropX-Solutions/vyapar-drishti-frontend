import type { } from "@mui/x-date-pickers/themeAugmentation";
import type { } from "@mui/x-charts/themeAugmentation";
import type { } from "@mui/x-data-grid-pro/themeAugmentation";
import type { } from "@mui/x-tree-view/themeAugmentation";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "@/components/MaterialUI/AppNavbar";
import Header from "@/components/MaterialUI/Header";
import SideMenu from "@/components/MaterialUI/SideMenu";
import AppTheme from "@/theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "@/theme/customizations";
import { Outlet } from "react-router-dom";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: {
  disableCustomTheme?: boolean;
}) {

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", position: "relative" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <Stack
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 0, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
