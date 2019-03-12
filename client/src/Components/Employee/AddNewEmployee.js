import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import history from "../../history";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import { styles } from "../commonStyles/AddNewItemStyles";
import theme from "../commonStyles/AddNewItemThemes";
import EmptyFieldSnackBar from "./Snackbars/EmptyFieldSnackBar";
import NewItemAddedConfirmSnackbar from "./Snackbars/NewItemAddedConfirmSnackbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem } from "material-ui/Menu";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.department_name.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
    width: "100%"
  };
}

class AddNewEmployee extends Component {
  state = {
    open: false,
    openNewItemAddedConfirmSnackbar: false,
    openEmptyTextFieldSnackbar: false,
    vertical: "top",
    horizontal: "center",
    department_objectId: "",
    employee_name: "",
    work_description: "",
    avg_employee_productivity: "",
    benchmark_employee_productivity: "",
    department_name: "",
    date: new Date()
  };

  handleCommencementDateChange = date => {
    this.setState({
      date: date
    });
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleFabOpen = () => {
    this.setState({ open: true });
  };

  closeNewItemConfirmSnackbar = () => {
    this.setState({ openNewItemAddedConfirmSnackbar: false });
  };

  closeEmptyFieldSnackbar = () => {
    this.setState({ openEmptyTextFieldSnackbar: false });
  };

  handleFormSubmit = () => {
    const { addNewItemToParentState } = this.props;
    const {
      department_objectId,
      employee_name,
      work_description,
      avg_employee_productivity,
      benchmark_employee_productivity,
      date
    } = this.state;
    if (
      department_objectId !== "" &&
      employee_name !== "" &&
      work_description !== "" &&
      avg_employee_productivity !== "" &&
      benchmark_employee_productivity !== "" &&
      date !== ""
    ) {
      axios
        .post("/api/employee/", {
          department_objectId,
          employee_name,
          work_description,
          avg_employee_productivity,
          benchmark_employee_productivity,
          date
        })
        .then(() => {
          addNewItemToParentState({
            department_objectId,
            employee_name,
            work_description,
            avg_employee_productivity,
            benchmark_employee_productivity,
            date
          });
          this.setState({
            open: false,
            openNewItemAddedConfirmSnackbar: true,
            vertical: "top",
            horizontal: "center"
          });
          history.push("/employee");
        })
        .catch(error => {
          alert("Ooops something wrong happened, please try again");
        });
    } else {
      this.setState({ openEmptyTextFieldSnackbar: true });
    }
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  handleEnterEscapeKeyPress = e => {
    if (e.key === "Enter") {
      this.handleFormSubmit();
    } else if (e.key === "Escape") {
      this.handleCancel();
    }
  };

  handleDepartmentNameChangeOnSelect = event => {
    const selectedDepartmentObject = this.props.allDepartmentsForSiblingCommunication.filter(
      item => item.name === event.target.value
    );
    this.setState({
      department_name: event.target.value,
      department_objectId: selectedDepartmentObject[0]._id
    });
  };

  render() {
    const { classes, allDepartmentsForSiblingCommunication } = this.props;
    const {
      department_objectId,
      employee_name,
      work_description,
      avg_employee_productivity,
      benchmark_employee_productivity,
      department_name,
      date
    } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>
            <Fab
              onClick={this.handleFabOpen}
              aria-pressed="true"
              color="secondary"
              size="large"
              aria-label="Add"
              fontSize="large"
            >
              <AddIcon className={styles.largeIcon} />
            </Fab>

            <Dialog
              open={this.state.open}
              onClose={this.handleToggle}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth={"sm"}
              variant="contained"
              PaperProps={{
                classes: {
                  root: classes.paper
                }
              }}
              onKeyDown={this.handleEnterEscapeKeyPress}
            >
              <DialogTitle
                id="form-dialog-title"
                className={this.props.classes.styledHeader}
                disableTypography
                style={{ height: "60px", paddingTop: "10px" }}
              >
                New Employees
                <IconButton
                  onClick={this.handleToggle}
                  style={{
                    float: "right"
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent required>
                <FormControl className={classes.formControl}>
                  <TextField
                    select
                    id="standard-number"
                    required
                    autoFocus
                    value={department_name}
                    onChange={this.handleDepartmentNameChangeOnSelect}
                    error={department_name === ""}
                    helperText={
                      this.state.department_name === ""
                        ? "Please enter the Department Name"
                        : " "
                    }
                    style={{ width: "540px", marginTop: "30px" }}
                    label="Department Name"
                    InputProps={{
                      classes: {
                        underline: classes.underline
                      }
                    }}
                  >
                    {allDepartmentsForSiblingCommunication.map(item => (
                      <MenuItem
                        key={item.name}
                        value={item.name}
                        style={getStyles(item.name, this)}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
                <TextField
                  required
                  autoFocus
                  classes={{
                    root: classes.space
                  }}
                  value={employee_name}
                  onChange={e =>
                    this.setState({
                      employee_name: e.target.value
                    })
                  }
                  error={employee_name === ""}
                  helperText={
                    employee_name === "" ? "Please enter Employee Name" : " "
                  }
                  label="Employee Name"
                  type="string"
                  fullWidth
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />
                <TextField
                  required
                  autoFocus
                  multiline
                  classes={{
                    root: classes.space
                  }}
                  value={work_description}
                  onChange={e =>
                    this.setState({
                      work_description: e.target.value
                    })
                  }
                  error={work_description === ""}
                  helperText={
                    work_description === ""
                      ? "Please enter Work Description"
                      : " "
                  }
                  label="Description of Work"
                  type="string"
                  fullWidth
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />

                <TextField
                  id="standard-number"
                  required
                  autoFocus
                  classes={{
                    root: classes.space
                  }}
                  value={avg_employee_productivity}
                  onChange={e =>
                    this.setState({
                      avg_employee_productivity: e.target.value
                    })
                  }
                  error={
                    avg_employee_productivity === "" ||
                    avg_employee_productivity < 0
                  }
                  helperText={
                    avg_employee_productivity === ""
                      ? "Please enter Avg. Employees Productivity (Lines of Codes per Hour)"
                      : " "
                  }
                  label="Avg. Employees Productivity (Lines of Codes per Hour)"
                  type="number"
                  fullWidth
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />
                <TextField
                  id="standard-number"
                  required
                  autoFocus
                  classes={{
                    root: classes.space
                  }}
                  value={benchmark_employee_productivity}
                  onChange={e =>
                    this.setState({
                      benchmark_employee_productivity: e.target.value
                    })
                  }
                  error={
                    benchmark_employee_productivity === "" ||
                    benchmark_employee_productivity < 0
                  }
                  helperText={
                    benchmark_employee_productivity === ""
                      ? "Please enter Standard Employees Productivity (Lines of Codes per Hour)"
                      : " "
                  }
                  label="Standard Employees Productivity (Lines of Codes per Hour)"
                  type="number"
                  fullWidth
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />

                <div
                  style={{
                    display: "flex"
                  }}
                >
                  <div style={{ display: "flex", margin: "auto" }}>
                    <DatePicker
                      keyboard
                      classes={{
                        root: classes.space
                      }}
                      format="dd/MM/yyyy"
                      mask={value =>
                        value
                          ? [
                              /\d/,
                              /\d/,
                              "/",
                              /\d/,
                              /\d/,
                              "/",
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/
                            ]
                          : []
                      }
                      label="Date of Employment"
                      value={date}
                      onChange={this.handleCommencementDateChange}
                      disableOpenOnEnter
                      animateYearScrolling={false}
                      style={{ paddingRight: "5px" }}
                    />
                  </div>
                </div>
              </DialogContent>
              <DialogActions
                className={this.props.classes.styledFooter}
                style={{
                  margin: "0px"
                }}
              >
                <Button
                  onClick={this.handleCancel}
                  classes={{
                    root: classes.spaceDialogAction
                  }}
                  variant="contained"
                  size="large"
                  style={{
                    backgroundColor: "#ee0053"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.handleFormSubmit}
                  classes={{
                    root: classes.spaceDialogAction
                  }}
                  color="primary"
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={
                    department_objectId === "" ||
                    employee_name === "" ||
                    work_description === "" ||
                    avg_employee_productivity === "" ||
                    benchmark_employee_productivity === "" ||
                    department_name === "" ||
                    date === ""
                  }
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            <NewItemAddedConfirmSnackbar
              openNewItemAddedConfirmSnackbar={
                this.state.openNewItemAddedConfirmSnackbar
              }
              closeNewItemConfirmSnackbar={this.closeNewItemConfirmSnackbar}
            />

            <EmptyFieldSnackBar
              openEmptyTextFieldSnackbar={this.state.openEmptyTextFieldSnackbar}
              closeEmptyFieldSnackbar={this.closeEmptyFieldSnackbar}
            />
          </div>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

AddNewEmployee.propTypes = {
  classes: PropTypes.object.isRequired,
  allDepartmentsForSiblingCommunication: PropTypes.array.isRequired,
  addNewItemToParentState: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(AddNewEmployee);
