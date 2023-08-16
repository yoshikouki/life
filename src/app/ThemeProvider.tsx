"use client";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  getInitColorSchemeScript,
} from "@mui/material/styles";
import { type ReactNode } from "react";
import { cssVarsThemeOptions } from "./theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = extendTheme(cssVarsThemeOptions);

  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      {getInitColorSchemeScript({
        defaultMode: "dark",
      })}
      {children}
    </CssVarsProvider>
  );
}
