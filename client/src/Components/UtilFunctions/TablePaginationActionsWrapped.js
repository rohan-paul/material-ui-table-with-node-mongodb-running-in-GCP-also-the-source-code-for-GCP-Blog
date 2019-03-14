import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Tooltip from "@material-ui/core/Tooltip";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  state = {
    arrowRef: null
  };

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <Tooltip
          title={
            <React.Fragment>
              <h2>First page</h2>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          placement="bottom-start"
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
        >
          <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
          >
            {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <React.Fragment>
              <h2>Previous page</h2>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          placement="bottom-start"
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
        >
          <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <React.Fragment>
              <h2>Next page</h2>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          placement="bottom-start"
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
        >
          <IconButton
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <React.Fragment>
              <h2>Last page</h2>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </React.Fragment>
          }
          placement="bottom-start"
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
        >
          <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

// Make an HOC from the above TablePaginationActions component which will be exported and used in DevelopmentList.js
const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

export default TablePaginationActionsWrapped;
