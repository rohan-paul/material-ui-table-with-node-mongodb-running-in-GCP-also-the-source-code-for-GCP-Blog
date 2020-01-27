import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import styles from "../commonStyles/SearchFilter-Styles.js";
import toolbarStyles from "../commonStyles/toolbarStyles";
import combineStyles from "../commonStyles/combineStyles";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
const moment = require("moment");

class CurrentMonthEmployee extends Component {
  state = {
    arrowRef: null
  };

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  closeCurrentMonthData = () => {
    this.props.closeCurrentMonthDataCompOnClick();
    this.props.clearDateRangeTooltip();
  };

  render() {
    const { classes } = this.props;

    const momentMonthNumber = moment().month();
    const currentMonth = moment(moment().month(momentMonthNumber)).format(
      "MMMM"
    );

    return (
      <Paper className={classes.currentMonthDataEmployee}>
        Showing Employees only for {currentMonth}
        <Tooltip
          title={
            <React.Fragment>
              <h2>
                Clear filter for only {currentMonth} and show all Employees
              </h2>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          placement="top-end"
          classes={{
            tooltip: classes.bootstrapTooltip,
            popper: classes.bootstrapPopper,
            tooltipPlacementLeft: classes.bootstrapPlacementLeft,
            tooltipPlacementRight: classes.bootstrapPlacementRight,
            tooltipPlacementTop: classes.bootstrapPlacementTop,
            tooltipPlacementBottom: classes.bootstrapPlacementBottom
          }}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(this.state.arrowRef),
                  element: this.state.arrowRef
                }
              }
            }
          }}
          onOpen={() =>
            this.props.setDateRangeTooltip("Clear the Date Range Search Filter")
          }
        >
          <IconButton
            variant="contained"
            size="small"
            className={classes.margin}
            onClick={this.closeCurrentMonthData}
            style={{
              marginLeft: "55px",
              marginTop: 0,
              color: "white"
            }}
          >
            <CancelIcon style={{ marginLeft: "15px", marginRight: 0 }} />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }
}

CurrentMonthEmployee.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles)(CurrentMonthEmployee);
