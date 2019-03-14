import React from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import { styles } from "../commonStyles/ModuleItemListStyles";
import toolbarStyles from "../commonStyles/toolbarStyles";
import combineStyles from "../commonStyles/combineStyles";
import { withStyles } from "@material-ui/core";

// make sure the 'tableHeaderProp' below is the property name of the mongodb schema's property name of the relevant model
const rows = [
  {
    tableHeaderProp: "name",
    disablePadding: true,
    label: "Department Name"
  },
  {
    tableHeaderProp: "type",
    disablePadding: false,
    label: "Department Type"
  }
];

class TableHeadDepartment extends React.Component {
  state = {
    arrowRef: null
  };

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      page,
      rowsPerPage,
      count,
      noOfItemsInCurrentPage
    } = this.props;

    const { classes } = this.props;

    return (
      <TableHead>
        <TableRow>
          <Tooltip
            title={
              <React.Fragment>
                <h2>
                  {noOfItemsInCurrentPage > 1
                    ? `Select all ${noOfItemsInCurrentPage}`
                    : `Select the item `}
                </h2>
                <span className={classes.arrow} ref={this.handleArrowRef} />
              </React.Fragment>
            }
            enterDelay={300}
            placement={"top-end"}
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
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  page !== Math.max((0, Math.ceil(count / rowsPerPage) - 1))
                    ? numSelected > 0 && numSelected < rowsPerPage
                    : numSelected > 0 && numSelected < noOfItemsInCurrentPage
                }
                checked={
                  noOfItemsInCurrentPage === 0
                    ? false
                    : page !== Math.max(0, Math.ceil(count / rowsPerPage) - 1)
                    ? numSelected === rowsPerPage
                    : noOfItemsInCurrentPage < rowsPerPage
                    ? numSelected === noOfItemsInCurrentPage
                    : numSelected === rowsPerPage
                }
                onChange={onSelectAllClick}
              />
            </TableCell>
          </Tooltip>
          {rows.map(
            row => (
              <TableCell
                className={classes.row}
                key={row.tableHeaderProp}
                align="center"
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.tableHeaderProp ? order : false}
              >
                <Tooltip
                  title={
                    <React.Fragment>
                      <h2>Sort by {row.label}</h2>
                      <span
                        className={classes.arrow}
                        ref={this.handleArrowRef}
                      />
                    </React.Fragment>
                  }
                  enterDelay={300}
                  placement={"top-end"}
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
                  <TableSortLabel
                    active={orderBy === row.tableHeaderProp}
                    direction={order}
                    onClick={this.createSortHandler(row.tableHeaderProp)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

TableHeadDepartment.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles)(TableHeadDepartment);

/* The expresseion < Math.max(0, Math.ceil(count / rowsPerPage) - 1) > is the index value of the variable 'page' ONLY when I am on the last page. So the condition //#endregion
< page === Math.max(0, Math.ceil(count / rowsPerPage) - 1) >  WILL ONLY BE TRUE on the last page.


Note, - The variable 'page' is a built-in prop of TablePagination API (https://material-ui.com/api/table-pagination/) - and the value of 'page' is a zero-based index of the current page.
 */
