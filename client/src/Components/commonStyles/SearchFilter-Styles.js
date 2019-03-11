import { emphasize } from "@material-ui/core/styles/colorManipulator";

var styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: "flex",
    borderRadius: 2,
    border: "1px solid #ced4da",
    backgroundColor: theme.palette.common.white,
    fontSize: 14,
    minHeight: 28,
    padding: "8px 0 8px 20px",
    opacity: "1 !important",
    justifyContent: "center"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "center"
  },
  margin: {
    margin: theme.spacing.unit
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    borderRadius: 0,
    backgroundColor: "#ffffff",
    fontWeight: "bold"
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 14,
    display: "none"
  },
  placeholder: {
    position: "absolute",
    left: 22,
    fontSize: 14,
    fontWeight: "normal",
    color: "rgba(9, 10, 60,0.38)"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  textSearchFilter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: "flex",
    width: "30em",
    flexDirection: "row"
  },

  currentMonthData: {
    width: "740px",
    height: "55px",
    paddingLeft: "15px",
    verticalAlign: "center",
    textAlign: "center",
    color: "white",
    backgroundColor: "#007bff",
    borderRadius: "10px",
    fontSize: 20,
    cursor: "pointer"
  },
  currentMonthDataEmployee: {
    width: "800px",
    height: "55px",
    paddingLeft: "15px",
    verticalAlign: "center",
    textAlign: "center",
    color: "white",
    backgroundColor: "#007bff",
    borderRadius: "10px",
    fontSize: 20,
    cursor: "pointer"
  },
  divider: {
    height: theme.spacing.unit * 2
  },
  labelRoot: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 0,
    color: theme.palette.primary.dark,
    position: "absolute",
    left: "-64px",
    top: "-12px"
  }
});

export default styles;
