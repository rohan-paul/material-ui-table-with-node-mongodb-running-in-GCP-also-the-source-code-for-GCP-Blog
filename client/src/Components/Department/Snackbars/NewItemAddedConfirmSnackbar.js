import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContent from "../../UtilFunctions/MySnackbarContent";
import { withStyles } from "@material-ui/core";
import { styles } from "../../commonStyles/AddNewItemStyles";
import PropTypes from "prop-types";

class NewItemAddedConfirmSnackbar extends Component {
  state = {
    vertical: "top",
    horizontal: "center"
  };

  render() {
    const {
      classes,
      openNewItemAddedConfirmSnackbar,
      closeNewItemConfirmSnackbar
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openNewItemAddedConfirmSnackbar}
        autoHideDuration={3000}
        onClose={closeNewItemConfirmSnackbar}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        style={{ marginTop: "35px" }}
      >
        <MySnackbarContent
          onClose={closeNewItemConfirmSnackbar}
          variant="success"
          className={classes.margin}
          message="New Department has been saved successfully"
        />
      </Snackbar>
    );
  }
}

NewItemAddedConfirmSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewItemAddedConfirmSnackbar);
