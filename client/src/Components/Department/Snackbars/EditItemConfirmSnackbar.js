import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContent from "../../UtilFunctions/MySnackbarContent";
import { withStyles } from "@material-ui/core";
import { styles } from "../../commonStyles/AddNewItemStyles";
import PropTypes from "prop-types";

class EditItemConfirmSnackbar extends Component {
  state = {
    vertical: "top",
    horizontal: "center"
  };

  render() {
    const {
      classes,
      openEditItemConfirmSnackbar,
      closeNewItemConfirmSnackbar
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openEditItemConfirmSnackbar}
        autoHideDuration={2000}
        onClose={closeNewItemConfirmSnackbar}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <MySnackbarContent
          onClose={closeNewItemConfirmSnackbar}
          variant="success"
          className={classes.margin}
          message="Edited Department details has been saved successfully"
        />
      </Snackbar>
    );
  }
}

EditItemConfirmSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditItemConfirmSnackbar);
