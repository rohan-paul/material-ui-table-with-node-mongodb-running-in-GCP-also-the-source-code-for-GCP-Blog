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
import { styles } from "../commonStyles/AddNewItemStyles";
import theme from "../commonStyles/AddNewItemThemes";
import EmptyFieldSnackBar from "./Snackbars/EmptyFieldSnackBar";
import NewItemAddedConfirmSnackbar from "./Snackbars/NewItemAddedConfirmSnackbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

class AddNewDepartment extends Component {
  state = {
    open: false,
    openNewItemAddedConfirmSnackbar: false,
    openEmptyTextFieldSnackbar: false,
    vertical: "top",
    horizontal: "center",
    name: "",
    type: ""
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

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  handleFormSubmit = () => {
    const { addNewItemToParentState } = this.props;
    const { name, type } = this.state;
    if (name !== "" && type !== "") {
      axios
        .post("/api/department/", {
          name,
          type
        })
        .then(() => {
          addNewItemToParentState({
            name,
            type
          });
          this.setState(
            {
              open: false,
              openNewItemAddedConfirmSnackbar: true,
              vertical: "top",
              horizontal: "center"
            },
            () => {
              history.push("/department");
            }
          );
        })
        .catch(error => {
          console.log("THE ERROR RESPONSE IS ", error.response);
          if (
            error.response &&
            error.response.data.name === "MongoError" &&
            (error.response && error.response.data.code === 11000)
          ) {
            alert(
              "Duplicate Department Name! please select another name for the Department"
            );
          } else {
            alert(
              "Ooops something wrong happened while adding new item, please try again"
            );
          }
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

  render() {
    const { classes } = this.props;
    const { name, type } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
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
              New Department
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
                value={type}
                onChange={e =>
                  this.setState({
                    type: e.target.value
                  })
                }
                error={type === ""}
                helperText={
                  type === "" ? "Please enter Type of Department" : " "
                }
                label="Type of Department"
                type="string"
                fullWidth
                InputProps={{
                  classes: {
                    underline: classes.underline
                  }
                }}
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
                disabled={name === "" || type === ""}
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
      </MuiThemeProvider>
    );
  }
}

AddNewDepartment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddNewDepartment);

// The Cancel button color - https://material-ui.com/customization/overrides/
