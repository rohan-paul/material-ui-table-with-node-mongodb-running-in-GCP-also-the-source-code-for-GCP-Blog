export const styles = theme => ({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#fdff00" },
    error: { main: "#ee0053" }
  },
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflow: "auto"
  },
  space: {
    marginTop: theme.spacing.unit * 2
  },
  fab: {
    margin: theme.spacing.unit
  },
  fabButton: {
    position: "fixed",
    zIndex: 1,
    top: "auto",
    bottom: 0,
    marginBottom: 10,
    right: 10,
    margin: "0 auto"
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 16
  },
  table: {
    minWidth: 500,
    tableLayout: "auto",
    overflowX: "fixed"
  },
  tableWrapper: {
    overflow: "auto"
  },
  customTableCell: {
    whiteSpace: "nowrap",
    maxWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

/*
To clip text with an ellipsis when it overflows a table cell, you will need to set the max-width CSS property on each td class for the overflow to work.

For responsive layouts; use the max-width CSS property to specify the effective minimum width of the column, or just use max-width: 0; for unlimited flexibility.
*/
