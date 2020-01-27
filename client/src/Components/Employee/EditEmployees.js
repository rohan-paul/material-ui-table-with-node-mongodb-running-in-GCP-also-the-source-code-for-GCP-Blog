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
import { withStyles } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import { styles } from "../commonStyles/AddNewItemStyles";
import theme from "../commonStyles/AddNewItemThemes";
import EmptyFieldSnackBar from "./Snackbars/EmptyFieldSnackBar";
import EditItemConfirmSnackbar from "./Snackbars/EditItemConfirmSnackbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem } from "material-ui/Menu";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 550
    }
  }
};

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.department_name.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
    width: "100%"
  };
}

class EditEmployee extends Component {
  state = {
    open: false,
    openNewItemAddedConfirmSnackbar: false,
    openEmptyTextFieldSnackbar: false,
    vertical: "top",
    horizontal: "center",
    department_objectId: this.props.itemToEdit[0].department_objectId,
    employee_name: this.props.itemToEdit[0].employee_name,
    work_description: this.props.itemToEdit[0].work_description,
    avg_employee_productivity: this.props.itemToEdit[0]
      .avg_employee_productivity,
    benchmark_employee_productivity: this.props.itemToEdit[0]
      .benchmark_employee_productivity,
    department_name: this.props.itemToEdit[0].department_name,
    date: this.props.itemToEdit[0].date
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
    this.props.unSelectItems();
  };

  closeEmptyFieldSnackbar = () => {
    this.setState({ openEmptyTextFieldSnackbar: false }, () => {});
  };

  handleEditFormSubmit = () => {
    const { editItemToParentState } = this.props;

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
        .put(`/api/employee/${this.props.itemToEdit[0]._id}`, {
          department_objectId,
          employee_name,
          work_description,
          avg_employee_productivity,
          benchmark_employee_productivity,
          date
        })
        .then(() => {
          editItemToParentState();
          this.setState(
            {
              open: false,
              openNewItemAddedConfirmSnackbar: true,
              vertical: "top",
              horizontal: "center"
            },
            () => {
              history.push("/employee");
            }
          );
        })
        .catch(error => {
          console.log(error);
          alert(
            "Ooops something wrong happened while editing, please try again"
          );
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
      this.handleEditFormSubmit();
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
            <IconButton onClick={this.handleFabOpen} aria-label="Edit">
              <EditIcon />
            </IconButton>
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
              >
                Edit Employees Record
                <IconButton
                  onClick={this.handleToggle}
                  style={{ float: "right", marginBotton: "20px" }}
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
                    MenuProps={MenuProps}
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
                      ? "Please enter Employee Productivity"
                      : " "
                  }
                  label="Avg. Employee Productivity"
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
                      ? "Please enter Other Services"
                      : " "
                  }
                  label="Standard Employee Productivity"
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
                  variant="contained"
                  size="large"
                  classes={{
                    root: classes.spaceDialogAction
                  }}
                  style={{ backgroundColor: "#ee0053" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.handleEditFormSubmit}
                  classes={{
                    root: classes.spaceDialogAction
                  }}
                  color="primary"
                  variant="contained"
                  size="large"
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
            <EditItemConfirmSnackbar
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

EditEmployee.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(EditEmployee);

/* The Cancel button's color was done initially implementing MUI override - https://material-ui.com/customization/overrides/
But later changed to regular inline style, as I was not able to differentiate the coloring the Cancel button with Save
*/
