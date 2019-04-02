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
import { styles } from "../commonStyles/AddNewItemStyles";
import theme from "../commonStyles/AddNewItemThemes";
import EmptyFieldSnackBar from "./Snackbars/EmptyFieldSnackBar";
import EditItemConfirmSnackbar from "./Snackbars/EditItemConfirmSnackbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

class EditDepartment extends Component {
  state = {
    open: false,
    openEditItemConfirmSnackbar: false,
    openEmptyTextFieldSnackbar: false,
    vertical: "top",
    horizontal: "center",
    name: this.props.departmentToEdit[0].name,
    type: this.props.departmentToEdit[0].type,
    arrowRef: null
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
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
    this.setState({ openEditItemConfirmSnackbar: false });
    this.props.unSelectItems();
  };

  closeEmptyFieldSnackbar = () => {
    this.setState({ openEmptyTextFieldSnackbar: false }, () => {});
  };

  handleEditFormSubmit = () => {
    const { editItemToParentState } = this.props;
    const { name, type } = this.state;
    if (name !== "" && type !== "") {
      axios
        .put(`/api/department/${this.props.departmentToEdit[0]._id}`, {
          name,
          type
        })
        .then(() => {
          editItemToParentState();
          this.setState(
            {
              open: false,
              openEditItemConfirmSnackbar: true,
              vertical: "top",
              horizontal: "center"
            },
            () => {
              history.push("/department");
            }
          );
        })
        .catch(error => {
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

  render() {
    const { classes } = this.props;
    const { name, type } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <IconButton onClick={this.handleFabOpen} aria-label="Edit">
            <EditIcon />
          </IconButton>
          <Dialog
            open={this.state.open}
            onClose={this.handleToggle}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={"md"}
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
              Edit Department
              <IconButton
                onClick={this.handleToggle}
                style={{ float: "right", marginBotton: "20px" }}
              >
                <CancelIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent required>
              <TextField
                required
                autoFocus
                classes={{
                  root: classes.space
                }}
                value={name}
                onChange={e =>
                  this.setState({
                    name: e.target.value
                  })
                }
                error={name === ""}
                helperText={name === "" ? "Please enter Name" : " "}
                label="Name"
                type="email"
                fullWidth
              />
              <TextField
                required
                autoFocus
                multiline
                classes={{
                  root: classes.space
                }}
                value={type}
                onChange={e =>
                  this.setState({
                    type: e.target.value
                  })
                }
                error={type === ""}
                helperText={type === "" ? "Please enter Type" : " "}
                label="Type"
                type="email"
                fullWidth
              />
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
                disabled={name === "" || type === ""}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <EditItemConfirmSnackbar
            openEditItemConfirmSnackbar={this.state.openEditItemConfirmSnackbar}
            closeNewItemConfirmSnackbar={this.closeNewItemConfirmSnackbar}
          />

          <EmptyFieldSnackBar
            openEmptyTextFieldSnackbar={this.state.openEmptyTextFieldSnackbar}
            closeEmptyFieldSnackbar={this.closeEmptyFieldSnackbar}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

EditDepartment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditDepartment);

/* The Cancel button's color was done initially implementing MUI override - https://material-ui.com/customization/overrides/
But later changed to regular inline style, as I was not able to differentiate the coloring the Cancel button with Save
*/
