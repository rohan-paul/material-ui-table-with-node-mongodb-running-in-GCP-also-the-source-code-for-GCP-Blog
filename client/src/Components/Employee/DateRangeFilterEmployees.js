import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import WrongDateRangeSnackBar from "./Snackbars/WrongDateRangeSnackBar";
import EmptyFieldSnackBar from "./Snackbars/EmptyFieldSnackBar";
import NoRecordForDateRangeQuery from "./Snackbars/NoRecordForDateRangeQuerySnackbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import styles from "../commonStyles/SearchFilter-Styles.js";
import toolbarStyles from "../commonStyles/toolbarStyles";
import combineStyles from "../commonStyles/combineStyles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
const moment = require("moment");

class DateRangeFilter extends Component {
  state = {
    start_date: new Date(),
    end_date: new Date(),
    dateRangeQueryResult: [],
    totalDateRangeSearchResultChild: [],
    openWrongDateRangeSnackBar: false,
    openEmptyTextFieldSnackbar: false,
    noRecordForDateRangeQuery: false,
    arrowRef: null
  };

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  closeWrongDateRangeSnackBar = () => {
    this.setState({ openWrongDateRangeSnackBar: false });
  };

  closeNoRecordForDateRangeQuery = (event, reason) => {
    this.setState({ noRecordForDateRangeQuery: false });
  };

  closeEmptyFieldSnackbar = () => {
    this.setState({ openEmptyTextFieldSnackbar: false });
  };

  //   moment(start_date).format("MMM D, YYYY 12:00:00 ") >
  //   moment(end_date).format("MMM D, YYYY 12:00:00 ")
  handleStartDateChange = date => {
    if (this.state.end_date === "" || this.props.end_date === "") {
      this.setState(
        {
          start_date: date
        },
        () => {
          this.props.handleStartDateChangeParent(date);
        }
      );
    } else if (this.state.end_date !== "" || this.props.end_date !== "") {
      this.setState(
        {
          start_date: date
        },
        () => {
          const { start_date, end_date } = this.state;

          if (start_date === "" && end_date !== "") {
            this.setState({ openEmptyTextFieldSnackbar: true });
          } else if (
            moment(start_date).format("YYYY-MM-DD") >
            moment(end_date).format("YYYY-MM-DD")
          ) {
            this.setState({ openWrongDateRangeSnackBar: true });
          } else if (start_date && start_date <= end_date) {
            axios
              .all([
                axios.post(
                  "/api/employee/paginate/daterange",
                  {
                    start_date,
                    end_date
                  },
                  {
                    params: {
                      page: this.props.page,
                      rowsperpage: this.props.rowsPerPage
                    }
                  }
                ),
                axios.post("/api/employee/daterange", {
                  start_date,
                  end_date
                })
              ])
              .then(
                axios.spread((paginatedRange, nonPaginatedRange) => {
                  this.setState(
                    {
                      dateRangeQueryResult: paginatedRange.data,
                      totalDateRangeSearchResultChild: nonPaginatedRange.data
                    },
                    () => {
                      if (this.state.dateRangeQueryResult.length === 0) {
                        this.setState({ noRecordForDateRangeQuery: true });
                      }
                    }
                  );
                  this.props.ifUserWantsDateRangeData(
                    this.state.dateRangeQueryResult,
                    this.state.totalDateRangeSearchResultChild
                  );
                  this.props.handleStartDateChangeParent(date);
                })
              );
          }
        }
      );
    }
  };

  handleEndDateChange = date => {
    this.setState(
      {
        end_date: date
      },
      () => {
        const { start_date, end_date } = this.state;

        if (start_date === "" && end_date !== "") {
          this.setState({ openEmptyTextFieldSnackbar: true });
        } else if (
          moment(start_date).format("YYYY-MM-DD") >
          moment(end_date).format("YYYY-MM-DD")
        ) {
          this.setState({ openWrongDateRangeSnackBar: true });
        } else if (start_date && start_date <= end_date) {
          axios
            .all([
              axios.post(
                "/api/employee/paginate/daterange",
                {
                  start_date,
                  end_date
                },
                {
                  params: {
                    page: this.props.page,
                    rowsperpage: this.props.rowsPerPage
                  }
                }
              ),
              axios.post("/api/employee/daterange", {
                start_date,
                end_date
              })
            ])
            .then(
              axios.spread((paginatedRange, nonPaginatedRange) => {
                this.setState(
                  {
                    dateRangeQueryResult: paginatedRange.data,
                    totalDateRangeSearchResultChild: nonPaginatedRange.data
                  },
                  () => {
                    if (this.state.dateRangeQueryResult.length === 0) {
                      this.setState({ noRecordForDateRangeQuery: true });
                    }
                  }
                );
                this.props.ifUserWantsDateRangeData(
                  this.state.dateRangeQueryResult,
                  this.state.totalDateRangeSearchResultChild
                );
                this.props.handleEndDateChangeParent(date);
              })
            );
        }
      }
    );
  };

  closeDateRangeQuery = () => {
    this.setState(
      {
        start_date: new Date(),
        end_date: new Date(),
        dateRangeQueryResult: [],
        totalDateRangeSearchResultChild: []
      },
      () => {
        this.props.ifUserWantsDateRangeData(
          this.state.dateRangeQueryResult,
          this.state.totalDateRangeSearchResultChild
        );
        this.props.closeDateRangeFilterCompOnClick();
        this.props.clearDateRangeTooltip();
      }
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          alignContent="center"
          direction="row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              marginRight: "700px"
            }}
          >
            <Paper className={classes.textSearchFilter}>
              <DatePicker
                keyboard
                margin="normal"
                classes={{
                  root: classes.space
                }}
                format="dd/MM/yyyy"
                mask={value =>
                  value
                    ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                    : []
                }
                label="Date of Employment (starting search date)"
                disableOpenOnEnter
                animateYearScrolling={false}
                style={{ paddingRight: "5px" }}
                value={
                  this.props.ifUserSearchedDateRange
                    ? this.props.start_date
                    : this.state.start_date
                }
                onChange={this.handleStartDateChange}
              />
              <DatePicker
                keyboard
                margin="normal"
                classes={{
                  root: classes.space
                }}
                format="dd/MM/yyyy"
                mask={value =>
                  value
                    ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
                    : []
                }
                label="Date of Employment (ending search date)"
                disableOpenOnEnter
                animateYearScrolling={false}
                style={{ paddingLeft: "5px" }}
                value={
                  this.props.ifUserSearchedDateRange
                    ? this.props.end_date
                    : this.state.end_date
                }
                onChange={this.handleEndDateChange}
              />
              <Tooltip
                title={
                  <React.Fragment>
                    <h2>Clear the Date Range Search Filter</h2>
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
                  this.props.setDateRangeTooltip(
                    "Clear the Date Range Search Filter"
                  )
                }
              >
                <IconButton
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.margin}
                  onClick={this.closeDateRangeQuery}
                  style={{ paddingLeft: "55px", marginTop: 0 }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <WrongDateRangeSnackBar
                openWrongDateRangeSnackBar={
                  this.state.openWrongDateRangeSnackBar
                }
                closeWrongDateRangeSnackBar={this.closeWrongDateRangeSnackBar}
              />
              <EmptyFieldSnackBar
                openEmptyTextFieldSnackbar={
                  this.state.openEmptyTextFieldSnackbar
                }
                closeEmptyFieldSnackbar={this.closeEmptyFieldSnackbar}
              />
              <NoRecordForDateRangeQuery
                openNoRecordForDateRangeQuery={
                  this.state.noRecordForDateRangeQuery
                }
                closeNoRecordForDateRangeQuery={
                  this.closeNoRecordForDateRangeQuery
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

DateRangeFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles)(DateRangeFilter);
