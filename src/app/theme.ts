import { grey } from "@mui/material/colors";
import { type CssVarsThemeOptions } from "@mui/material/styles";
import { M_PLUS_Rounded_1c } from "next/font/google";

export const font = M_PLUS_Rounded_1c({
  weight: ["100", "400", "900"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const cssVarsThemeOptions: CssVarsThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: grey[100], // #f5f5f5
        },
        text: {
          primary: grey[800], // #424242
          secondary: grey[700], // #616161
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#000",
          paper: "#40221B",
        },
        text: {
          primary: grey[50], // #fafafa
          secondary: grey[400], // #bdbdbd
        },
      },
    },
  },

  typography: {
    allVariants: {
      fontFamily: font.style.fontFamily,
    },
    h1: {
      fontSize: "2rem",
      fontWeight: 900,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 900,
    },
    button: {
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1),
          fontWeight: 900,
        }),
        text: {
          backdropFilter: "blur(8px)",
        },
        outlined: {
          backdropFilter: "blur(8px)",
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: ({ _theme }) => ({
          textDecoration: "none",
          "&:hover": {
            textDecoration: "none",
          },
        }),
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        a: {
          color: "inherit",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
};
