import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { useColorScheme } from "@mui/material/styles";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;

  return (
    <CssVarsProvider>
      <AppThemeInner
        disableCustomTheme={disableCustomTheme}
        themeComponents={themeComponents}
      >
        {children}
      </AppThemeInner>
    </CssVarsProvider>
  );
}

function AppThemeInner({
  children,
  disableCustomTheme,
  themeComponents,
}: AppThemeProps) {
  const { mode } = useColorScheme();

  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          palette: {
            mode: mode === "system" ? "light" : mode,
            ...(mode === "dark"
              ? colorSchemes.dark.palette
              : colorSchemes.light.palette),
          },
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents, mode]);

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
