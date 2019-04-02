import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContent from "../../UtilFunctions/MySnackbarContent";
import { withStyles } from "@material-ui/core";
import { styles } from "../../commonStyles/AddNewItemStyles";
import PropTypes from "prop-types";

class NoRecordForDateRangeQuerySnackbar extends Component {
  state = {
    vertical: "top",
    horizontal: "center"
  };

  render() {
    const {
      classes,
      openNoRecordForDateRangeQuery,
      closeNoRecordForDateRangeQuery
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openNoRecordForDateRangeQuery}
        autoHideDuration={4000}
        onClose={closeNoRecordForDateRangeQuery}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <MySnackbarContent
          onClose={closeNoRecordForDateRangeQuery}
          variant="info"
          className={classes.margin}
          message="No record found between the date ranges you searched for !"
        />
      </Snackbar>
    );
  }
}

NoRecordForDateRangeQuerySnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NoRecordForDateRangeQuerySnackbar);
