import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import { styles } from "../commonStyles/AddNewItemStyles";
import theme from "../commonStyles/AddNewItemThemes";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

class ShowEmployee extends Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleFabOpen = () => {
    this.setState({ open: true });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  handleEscapeKeyPress = e => {
    if (e.key === "Escape") {
      this.handleCancel();
    }
  };

  render() {
    const { classes } = this.props;

    const employee_name =
      this.props.itemToEdit[0] && this.props.itemToEdit[0].employee_name;
    const work_description =
      this.props.itemToEdit[0] && this.props.itemToEdit[0].work_description;

    const avg_employee_productivity =
      this.props.itemToEdit[0] &&
      this.props.itemToEdit[0].avg_employee_productivity;
    const benchmark_employee_productivity =
      this.props.itemToEdit[0] &&
      this.props.itemToEdit[0].benchmark_employee_productivity;
    const department_name =
      this.props.itemToEdit[0] && this.props.itemToEdit[0].department_name;
    const date = this.props.itemToEdit[0] && this.props.itemToEdit[0].date;

    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>
            <IconButton onClick={this.handleFabOpen} aria-label="Edit">
              <VisibilityIcon />
            </IconButton>
            <Dialog
              open={this.state.open}
              onClose={this.handleToggle}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
              maxWidth={"sm"}
              variant="contained"
            >
              <DialogTitle
                id="form-dialog-title"
                className={this.props.classes.styledHeader}
              >
                Details of this Employees
                <IconButton
                  onClick={this.handleToggle}
                  style={{ float: "right" }}
                >
                  <CancelIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent required>
                <TextField
                  autoFocus
                  classes={{
                    root: classes.space
                  }}
                  value={department_name}
                  style={{ width: "540px", marginTop: "30px" }}
                  label="Department Name"
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                  type="string"
                  fullWidth
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />
                <TextField
                  autoFocus
                  classes={{
                    root: classes.space
                  }}
                  value={employee_name}
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
                  autoFocus
                  multiline
                  classes={{
                    root: classes.space
                  }}
                  value={work_description}
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
                  autoFocus
                  multiline
                  classes={{
                    root: classes.space
                  }}
                  value={avg_employee_productivity}
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
                      disableOpenOnEnter
                      animateYearScrolling={false}
                      style={{ paddingRight: "5px" }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

ShowEmployee.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ShowEmployee);
