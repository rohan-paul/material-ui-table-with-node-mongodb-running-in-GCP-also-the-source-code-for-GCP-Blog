import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import toolbarStyles from "../commonStyles/toolbarStyles";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditDepartment from "./EditDepartment";
import SearchFilterDepartment from "./SearchFilterDepartment";

class TableToolbarDepartment extends Component {
  state = {
    shouldSearchFilterCompOpen: false,
    searchValue: "",
    searchSelection: "",
    textFilterCancelTooltip: "",
    arrowRef: null
  };

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  setTextFilterTooltip = tooltipfromchild => {
    this.setState({
      textFilterCancelTooltip: tooltipfromchild
    });
  };

  clearTextFilterTooltip = () => {
    this.setState({
      textFilterCancelTooltip: ""
    });
  };

  handleSearchInput = (e, { action }) => {
    if (
      action === "menu-close" ||
      action === "input-blur" ||
      action === "set-value"
    ) {
      return;
    } else {
      this.setState({ searchValue: e });
    }
  };

  // In this TableToolbarDepartment component, I set the searchValue for the query, and with the handleQueryString() function I pass that value up to the parent component DepartmentList
  handleSearchSelection = ({ value }) => {
    this.setState(
      {
        searchSelection: value,
        searchValue: value
      },
      () => {
        if (this.state.searchValue) {
          this.props.handleQueryString(this.state.searchValue);
        }
      }
    );
  };

  openSearchFilterCompOnClick = () => {
    if (this.state.shouldSearchFilterCompOpen === false) {
      this.setState({
        shouldSearchFilterCompOpen: true
      });
    }
  };

  closeSearchFilterCompOnClick = () => {
    this.setState(
      {
        shouldSearchFilterCompOpen: false,
        searchValue: ""
      },
      () => {
        this.props.clearAllQueryString();
        this.clearTextFilterTooltip();
      }
    );
  };

  render() {
    const {
      numSelected,
      confirmDeleteCustom,
      checkedItems,
      departmentToEdit,
      editItem,
      unSelectItems,
      classes
    } = this.props;

    const { searchValue, searchSelection } = this.state;

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
              Departments
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {numSelected === 1 ? (
                <Tooltip
                  title={
                    <React.Fragment>
                      <h2>Download data for the selected item(s)</h2>
                      <span
                        className={classes.arrow}
                        ref={this.handleArrowRef}
                      />
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
                >
                  <CSVLink
                    data={this.props.downloadSelectedItems}
                    style={{ marginRight: "48px", paddingTop: "25px" }}
                  >
                    <FontAwesomeIcon icon="download" size="1x" color="black" />
                  </CSVLink>
                </Tooltip>
              ) : null}
              {numSelected > 1 ? (
                <Tooltip
                  title={
                    <React.Fragment>
                      <h2>Download data for the selected item(s)</h2>
                      <span
                        className={classes.arrow}
                        ref={this.handleArrowRef}
                      />
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
                >
                  <CSVLink
                    data={this.props.downloadSelectedItems}
                    style={{ marginRight: "48px", paddingTop: "13px" }}
                  >
                    <FontAwesomeIcon icon="download" size="1x" color="black" />
                  </CSVLink>
                </Tooltip>
              ) : null}
              <Tooltip
                title={
                  <React.Fragment>
                    <h2>Delete</h2>
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
              >
                <IconButton
                  aria-label="Delete"
                  onClick={confirmDeleteCustom.bind(null, checkedItems)}
                  variant="contained"
                  className={classes.button}
                  style={{ marginRight: "40px" }}
                >
                  <DeleteIcon className={classes.rightIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  <React.Fragment>
                    <h2>Edit</h2>
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
              >
                <IconButton
                  aria-label="Edit"
                  variant="contained"
                  className={classes.button}
                >
                  {numSelected === 1 ? (
                    <EditDepartment
                      editItemToParentState={editItem}
                      departmentToEdit={departmentToEdit}
                      unSelectItems={unSelectItems}
                    />
                  ) : null}
                </IconButton>
              </Tooltip>
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
              {!this.state.shouldSearchFilterCompOpen ? (
                <Tooltip
                  title={
                    <React.Fragment>
                      <h2>Download entire data</h2>
                      <span
                        className={classes.arrow}
                        ref={this.handleArrowRef}
                      />
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
                >
                  <CSVLink
                    data={this.props.allDepartments}
                    style={{ marginRight: "48px", paddingTop: "13px" }}
                  >
                    <FontAwesomeIcon
                      icon="download"
                      size="1x"
                      color="#0099e5"
                    />
                  </CSVLink>
                </Tooltip>
              ) : null}
              <Tooltip
                title={
                  <React.Fragment>
                    {this.state.textFilterCancelTooltip === "" ? (
                      <h2>Filter List with Search Term</h2>
                    ) : null}
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
              >
                <IconButton
                  aria-label="Filter list"
                  onClick={this.openSearchFilterCompOnClick}
                >
                  {this.state.shouldSearchFilterCompOpen ? (
                    <SearchFilterDepartment
                      closeSearchFilterCompOnClick={
                        this.closeSearchFilterCompOnClick
                      }
                      allDepartments={this.props.allDepartments}
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
                  ) : (
                    <FontAwesomeIcon icon="filter" color="#0099e5" size="1x" />
                  )}
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Toolbar>
    );
  }
}

TableToolbarDepartment.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(TableToolbarDepartment);
