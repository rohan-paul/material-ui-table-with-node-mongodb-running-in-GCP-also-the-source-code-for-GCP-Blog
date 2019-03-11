import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContent from "../../UtilFunctions/MySnackbarContent";
import { withStyles } from "@material-ui/core";
import { styles } from "../../commonStyles/AddNewItemStyles";
import PropTypes from "prop-types";

class EmptyFieldSnackBar extends Component {
  state = {
    vertical: "top",
    horizontal: "center"
  };

  render() {
    const {
      classes,
      closeEmptyFieldSnackbar,
      openEmptyTextFieldSnackbar
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openEmptyTextFieldSnackbar}
        autoHideDuration={4000}
        onClose={closeEmptyFieldSnackbar}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <MySnackbarContent
          onClose={closeEmptyFieldSnackbar}
          variant="warning"
          className={classes.margin}
          message="Please Fill all the required fields !"
        />
      </Snackbar>
    );
  }
}

EmptyFieldSnackBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EmptyFieldSnackBar);
