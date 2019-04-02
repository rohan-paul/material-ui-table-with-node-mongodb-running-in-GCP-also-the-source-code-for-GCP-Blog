import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#fdff00" },
    error: { main: "#f44336" }
  }
});
