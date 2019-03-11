import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContent from "../../UtilFunctions/MySnackbarContent";
import { withStyles } from "@material-ui/core";
import { styles } from "../../commonStyles/AddNewItemStyles";
import PropTypes from "prop-types";

class WrongDateRangeSnackBar extends Component {
  state = {
    vertical: "top",
    horizontal: "center"
  };

  render() {
    const {
      classes,
      closeWrongDateRangeSnackBar,
      openWrongDateRangeSnackBar
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openWrongDateRangeSnackBar}
        autoHideDuration={6000}
        onClose={closeWrongDateRangeSnackBar}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <MySnackbarContent
          onClose={closeWrongDateRangeSnackBar}
          variant="warning"
          className={classes.margin}
          message="The Start Date should be equal to or earlier than the End Date !"
        />
      </Snackbar>
    );
  }
}

WrongDateRangeSnackBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WrongDateRangeSnackBar);
