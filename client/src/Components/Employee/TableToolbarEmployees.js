import React, { Component } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import DeleteIcon from "@material-ui/icons/Delete"
import toolbarStyles from "../commonStyles/toolbarStyles"
import { CSVLink } from "react-csv"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ShowEmployee from "./ShowEmployees"
import EditEmployee from "./EditEmployees"
import SearchFilter from "./SearchFilterEmployees"
import DateRangeFilter from "./DateRangeFilterEmployees"
import CurrentMonthEmployee from "./CurrentMonthEmployees"
import Paper from "@material-ui/core/Paper"
import requiredIf from "react-required-if" // React PropType to conditionally add .isRequired based on other props
const moment = require("moment")

class TableToolbarEmployee extends Component {
  state = {
    shouldSearchFilterCompOpen: false,
    shouldDateRangeFilterCompOpen: false,
    shouldCurrentMonthDataCompOpen: false,
    shouldCurrentDateDataCompOpen: false,
    searchValue: "",
    searchSelection: "",
    dateRangeTooltip: "",
    textFilterCancelTooltip: "",
    arrowRef: null
  }

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    })
  }

  setDateRangeTooltip = tooltipfromchild => {
    this.setState({
      dateRangeTooltip: tooltipfromchild
    })
  }

  clearDateRangeTooltip = () => {
    this.setState({
      dateRangeTooltip: ""
    })
  }

  setTextFilterTooltip = tooltipfromchild => {
    this.setState({
      textFilterCancelTooltip: tooltipfromchild
    })
  }

  clearTextFilterTooltip = () => {
    this.setState({
      textFilterCancelTooltip: ""
    })
  }

  handleSearchInput = (e, { action }) => {
    if (
      action === "menu-close" ||
      action === "input-blur" ||
      action === "set-value"
    ) {
      return
    } else {
      this.setState({ searchValue: e })
    }
  }

  // In this TableToolbarEmployee component, I set the searchValue for the query, and with the handleQueryString() function I pass that value up to the parent List component .
  handleSearchSelection = ({ value }) => {
    this.setState(
      {
        searchSelection: value,
        searchValue: value
      },
      () => {
        if (this.state.searchValue) {
          this.props.handleQueryString(this.state.searchValue)
        }
      }
    )
  }

  openSearchFilterCompOnClick = () => {
    if (this.state.shouldSearchFilterCompOpen === false) {
      this.setState({
        shouldSearchFilterCompOpen: true
      })
    }
  }

  closeSearchFilterCompOnClick = () => {
    this.setState(
      {
        shouldSearchFilterCompOpen: false,
        searchValue: ""
      },
      () => {
        this.props.clearAllQueryString()
        this.clearTextFilterTooltip()
      }
    )
  }

  closeCurrentMonthDataCompOnClick = () => {
    this.setState({
      shouldCurrentMonthDataCompOpen: false
    })
    this.props.clearCurrentMonthSearch()
  }

  closeCurrentDateDataCompOnClick = () => {
    this.setState({
      shouldCurrentDateDataCompOpen: false
    })
    this.props.clearCurrentDateSearch()
  }

  openDateRangeFilterCompOnClick = () => {
    if (this.state.shouldDateRangeFilterCompOpen === false) {
      this.setState({
        shouldDateRangeFilterCompOpen: true
      })
    }
  }

  closeDateRangeFilterCompOnClick = () => {
    this.setState(
      {
        shouldDateRangeFilterCompOpen: false
      },
      () => {
        this.props.clearUserSearchedDateRange()
      }
    )
  }

  render() {
    const {
      numSelected,
      confirmDeleteCustom,
      checkedItems,
      itemToEdit,
      editItem,
      unSelectItems,
      classes
    } = this.props

    const { searchValue, searchSelection } = this.state

    const momentMonthNumber = moment().month()
    const currentMonth = moment(moment().month(momentMonthNumber)).format(
      "MMMM"
    )

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          {numSelected === 1 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} item selected
            </Typography>
          ) : numSelected > 1 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} items selected
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
              Showing only Employees who joined today
              <Typography >
              <h5>Click next button to see all of this month  </h5>
            </Typography>
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />

        {/* This Paper class will render CURRENT MONTH data */}
        {!this.state.shouldDateRangeFilterCompOpen &&
        !this.state.shouldSearchFilterCompOpen &&
        !this.state.shouldCurrentMonthDataCompOpen &&
        !this.state.shouldCurrentDateDataCompOpen ? (
          <Paper
            className={classes.monthlyData}
            onClick={() =>
              this.setState(
                {
                  shouldCurrentMonthDataCompOpen: true
                },
                () => {
                  this.props.getCurrentMonthData()
                }
              )
            }
          >
            Employees in {currentMonth}
          </Paper>
        ) : null}
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {numSelected === 1 ? (
                <CSVLink
                  data={this.props.downloadSelectedItems}
                  style={{ marginRight: "24px", paddingTop: "25px" }}
                >
                  <FontAwesomeIcon icon="download" size="1x" color="black" />
                </CSVLink>
              ) : null}

              <IconButton
                aria-label="Show"
                variant="contained"
                className={classes.button}
                style={{ marginRight: "20px" }}
              >
                {numSelected === 1 ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <ShowEmployee
                      itemToEdit={itemToEdit}
                      checkedItems={this.props.checkedItems}
                    />
                  </div>
                ) : null}
              </IconButton>

              {numSelected > 1 ? (
                <CSVLink
                  data={this.props.downloadSelectedItems}
                  style={{ marginRight: "24px", paddingTop: "13px" }}
                >
                  <FontAwesomeIcon icon="download" size="1x" color="black" />
                </CSVLink>
              ) : null}

              <IconButton
                aria-label="Delete"
                onClick={confirmDeleteCustom.bind(null, checkedItems)}
                variant="contained"
                className={classes.button}
                style={{ marginRight: "20px" }}
              >
                <DeleteIcon className={classes.rightIcon} />
              </IconButton>

              <IconButton
                aria-label="Edit"
                variant="contained"
                className={classes.button}
              >
                {numSelected === 1 ? (
                  <EditEmployee
                    editItemToParentState={editItem}
                    itemToEdit={itemToEdit}
                    unSelectItems={unSelectItems}
                    checkedItems={this.props.checkedItems}
                    allDepartmentsForSiblingCommunication={
                      this.props.allDepartmentsForSiblingCommunication
                    }
                  />
                ) : null}
              </IconButton>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "auto",
                width: "100%"
              }}
            >
              <div className={classes.spacerCurrentMonth} />
              {!this.state.shouldDateRangeFilterCompOpen &&
              !this.state.shouldSearchFilterCompOpen ? (
                <CSVLink
                  data={this.props.totalItemsFormatted}
                  style={{ marginRight: "24px", paddingTop: "13px" }}
                >
                  <FontAwesomeIcon icon="download" size="1x" color="#0099e5" />
                </CSVLink>
              ) : null}

              {this.state.shouldCurrentMonthDataCompOpen &&
              !this.state.shouldCurrentDateDataCompOpen ? (
                <CurrentMonthEmployee
                  setDateRangeTooltip={this.setDateRangeTooltip}
                  closeCurrentMonthDataCompOnClick={
                    this.closeCurrentMonthDataCompOnClick
                  }
                  clearDateRangeTooltip={this.clearDateRangeTooltip}
                />
              ) : null}

              <IconButton
                aria-label="Filter list"
                onClick={this.openDateRangeFilterCompOnClick}
                style={{ marginRight: "15px" }}
              >
                {this.state.shouldDateRangeFilterCompOpen ? (
                  <DateRangeFilter
                    closeDateRangeFilterCompOnClick={
                      this.closeDateRangeFilterCompOnClick
                    }
                    totalItemsFormatted={this.props.totalItemsFormatted}
                    ifUserWantsDateRangeData={
                      this.props.ifUserWantsDateRangeData
                    }
                    page={this.props.page}
                    rowsPerPage={this.props.rowsPerPage}
                    handleStartDateChangeParent={
                      this.props.handleStartDateChangeParent
                    }
                    handleEndDateChangeParent={
                      this.props.handleEndDateChangeParent
                    }
                    ifUserSearchedDateRange={this.props.ifUserSearchedDateRange}
                    start_date={this.props.start_date}
                    end_date={this.props.end_date}
                    setDateRangeTooltip={this.setDateRangeTooltip}
                    clearDateRangeTooltip={this.clearDateRangeTooltip}
                  />
                ) : this.state.shouldSearchFilterCompOpen ||
                  this.state.shouldCurrentMonthDataCompOpen ||
                  this.state.shouldCurrentDateDataCompOpen ? null : (
                  <FontAwesomeIcon
                    icon="calendar-alt"
                    color="#0099e5"
                    size="1x"
                  />
                )}
              </IconButton>

              <IconButton
                aria-label="Filter list"
                onClick={this.openSearchFilterCompOnClick}
              >
                {this.state.shouldSearchFilterCompOpen ? (
                  <SearchFilter
                    closeSearchFilterCompOnClick={
                      this.closeSearchFilterCompOnClick
                    }
                    totalItemsFormatted={this.props.totalItemsFormatted}
                    handleColumnToQuery={this.props.handleColumnToQuery}
                    value={searchSelection}
                    onChange={e => this.handleSearchSelection(e)}
                    inputValue={searchValue}
                    onInputChange={(e, action) =>
                      this.handleSearchInput(e, action)
                    }
                    style={{ marginRight: "100px" }}
                    setTextFilterTooltip={this.setTextFilterTooltip}
                    clearTextFilterTooltip={this.clearTextFilterTooltip}
                  />
                ) : this.state.shouldDateRangeFilterCompOpen ||
                  this.state.shouldCurrentMonthDataCompOpen ||
                  this.state.shouldCurrentDateDataCompOpen ? null : (
                  <FontAwesomeIcon icon="filter" color="#0099e5" size="1x" />
                )}
              </IconButton>
            </div>
          )}
        </div>
      </Toolbar>
    )
  }
}

TableToolbarEmployee.propTypes = {
  classes: PropTypes.object.isRequired,
  totalItemsFormatted: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  confirmDeleteCustom: PropTypes.func.isRequired,
  checkedItems: PropTypes.array.isRequired,
  itemToEdit: requiredIf(
    PropTypes.array,
    props => props.checkedItems.length === 1
  ),
  editItem: PropTypes.func.isRequired,
  handleQueryString: PropTypes.func.isRequired,
  handleColumnToQuery: PropTypes.func.isRequired,
  clearAllQueryString: PropTypes.func.isRequired,
  ifUserWantsDateRangeData: PropTypes.func.isRequired,
  unSelectItems: PropTypes.func.isRequired,
  downloadSelectedItems: PropTypes.array.isRequired,
  clearUserSearchedDateRange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleStartDateChangeParent: PropTypes.func.isRequired,
  handleEndDateChangeParent: PropTypes.func.isRequired,
  ifUserSearchedDateRange: PropTypes.bool.isRequired,
  start_date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  getCurrentMonthData: PropTypes.func.isRequired,
  ifUserClickedForCurrentMonth: PropTypes.bool.isRequired,
  clearCurrentMonthSearch: PropTypes.func.isRequired,
  allDepartmentsForSiblingCommunication: PropTypes.array.isRequired
}

export default withStyles(toolbarStyles)(TableToolbarEmployee)
