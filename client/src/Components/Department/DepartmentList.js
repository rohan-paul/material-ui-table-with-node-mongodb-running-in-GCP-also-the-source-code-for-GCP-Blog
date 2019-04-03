import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../UtilFunctions/confirmDelete.css";
import "../UtilFunctions/snackbar.css";
import { showDeleteSnackbar } from "../UtilFunctions/showEmptyFieldAndDeleteSnackbar";
import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import AddNewDepartment from "./AddNewDepartment";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { styles } from "../commonStyles/ModuleItemListStyles";
import toolbarStyles from "../commonStyles/toolbarStyles";
import combineStyles from "../commonStyles/combineStyles";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import TableToolbarDepartment from "./TableToolbarDepartment";
import TableHeadDepartment from "./TableHeadDepartment";
import orderByLodash from "lodash/orderBy";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TableFooter from "@material-ui/core/TableFooter";
import TablePaginationActionsWrapped from "../UtilFunctions/TablePaginationActionsWrapped";
import IconButton from "@material-ui/core/IconButton";
import { Helmet } from "react-helmet";

const CustomTableCell = withStyles(theme => ({
  head: {
    background: "#66CCFF",
    color: theme.palette.common.white,
    align: "left"
  },
  body: {
    fontSize: 14,
    align: "left"
  }
}))(TableCell);

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

/* stableSort() higher order function to sort by a table heading
1> the argument 'comparisonCB' is the getSorting() defined below.
2> The sort() method takes a single compareFunction as a callback and compares each pair of successive elements.
 */
function stableSort(array, comparisonCB) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparisonCB(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

/* getSorting() to be passed as a callback to the above sableSort(). The argument 'orderBy' will initially start (as a state) its value with 'employee_name' (which is the first table header label) and then will take on whichever table header label the user clicks on.
A> First the 'orderBy' value will be set by handleRequestSort() with its argument 'property'
B> Then this function will be passed down as a prop 'onRequestSort' to EnhancedTableHead child component.
C> In EnhancedTableHead, it will be called within createSortHandler() function and will be invoked on onClick and passed row.tableHeaderProp (which is the Table-header field value)
 */
function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class DepartmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDepartments: [],
      openEditModal: false,
      editingOnItemDone: false,
      order: "desc",
      orderBy: "name",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      queryStringFromChild: "",
      columnToQuery: "name",
      currentPageRenderedList: [],
      arrowRef: null
    };
  }

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  openEditComponent = () => {
    this.setState({
      openEditModal: true
    });
  };

  addItem = item => {
    this.setState(
      {
        allDepartments: [item, ...this.state.allDepartments]
      },
      () => {
        this.props.setDepartmentForSiblingCommunication(
          this.state.allDepartments
        );
      }
    );
  };

  editItem = () => {
    // * having to put this extra if condition and the database call here to resolve an issue that for the last item left in the table, after edit submission the employee_name and work-description was not getting rendered immediately. Edited data will get rendered only after page refresh
    if (this.state.allDepartments.length === 1) {
      axios
        .get("/api/department")
        .then(res => {
          this.setState({
            allDepartments: res.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState(
        {
          allDepartments: [this.state.allDepartments]
        },
        () => {
          this.props.setDepartmentForSiblingCommunication(
            this.state.allDepartments
          );
        }
      );
    }
  };

  returnDocumentToEdit = id => {
    if (this.state.selected.length !== 0) {
      return this.state.allDepartments.filter(item => item._id === id);
    }
  };

  confirmDeleteCustom = idArr => {
    let payload = {
      department_id_list_arr: idArr
    };
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete this Department Item</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                axios
                  .delete("/api/department/delete", {
                    data: payload
                  })
                  .then(() => {
                    this.setState(
                      {
                        allDepartments: [this.state.allDepartments],
                        selected: []
                      },
                      () => {
                        this.props.setDepartmentForSiblingCommunication(
                          this.state.allDepartments
                        );
                      }
                    );
                  })
                  .then(() => {
                    showDeleteSnackbar();
                    onClose();
                  })
                  .catch(error => {
                    if (error.response.status === 401) {
                      this.props.history.push("/login");
                      alert("Please Login, session expired");
                      onClose();
                    } else {
                      alert(
                        "Oops something wrong happened while deleting, please try again"
                      );
                    }
                  });
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  };

  // Function to handle the the request from user to sort by a particular heading.
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    // In below I am setting the state with destructuring, given both key-value is the same word. So in setState, I just mention the key from the state variable.
    this.setState({ order, orderBy });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // Todo - include logic for text based query
  handleSelectAllClick = event => {
    const {
      page,
      rowsPerPage,
      queryStringFromChild,
      allDepartments,
      order,
      orderBy
    } = this.state;

    if (event.target.checked) {
      if (queryStringFromChild === "") {
        const listOfItemsInCurrentPage = stableSort(
          allDepartments,
          getSorting(order, orderBy)
        ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        console.log("LIST OF CURRENT PAGE ITEMS ", listOfItemsInCurrentPage);
        this.setState(state => ({
          selected: listOfItemsInCurrentPage.map(n => n._id)
        }));
        return;
      } else if (this.state.queryStringFromChild !== "") {
        const lowerCaseQuery = this.state.queryStringFromChild.toLowerCase();

        const totalTextQueryResult = this.state.allDepartments.filter(item => {
          return (
            item[this.state.columnToQuery] &&
            item[this.state.columnToQuery]
              .toLowerCase()
              .includes(lowerCaseQuery)
          );
        });
        const departmentListToRender = totalTextQueryResult.slice(
          this.state.page * this.state.rowsPerPage,
          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
        );
        this.setState(state => ({
          selected: departmentListToRender.map(n => n._id)
        }));
        return;
      }
    }
    this.setState({ selected: [] });
  };

  unSelectItems = () => {
    this.setState({
      selected: []
    });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({ selected: newSelected });
  };

  componentDidMount() {
    axios
      .get("/api/department")
      .then(res => {
        this.setState({
          allDepartments: res.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.rowsPerPage !== prevState.rowsPerPage ||
      this.state.page !== prevState.page ||
      this.state.allDepartments.length !== prevState.allDepartments.length ||
      this.state.selected !== prevState.selected
    ) {
      return axios
        .get("/api/department")
        .then(res => {
          this.setState({
            allDepartments: res.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleQueryString = queryTypedInChild => {
    this.setState({
      queryStringFromChild: queryTypedInChild
    });
  };

  handleColumnToQuery = columnToQueryInChild => {
    this.setState({
      columnToQuery: columnToQueryInChild
    });
  };

  clearAllQueryString = () => {
    this.setState({
      queryStringFromChild: "",
      columnToQuery: "name"
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      allDepartments,
      queryStringFromChild
    } = this.state;

    // lowercase the queryStringFromChild string that the user types
    const lowerCaseQuery =
      queryStringFromChild && queryStringFromChild.toLowerCase();

    const totalTextQueryResult = allDepartments.filter(
      item =>
        item[this.state.columnToQuery] &&
        item[this.state.columnToQuery].toLowerCase().includes(lowerCaseQuery)
    );

    const departmentListToRender = orderByLodash(
      queryStringFromChild
        ? totalTextQueryResult
        : stableSort(allDepartments, getSorting(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
    );

    const departmentToEdit = this.returnDocumentToEdit(this.state.selected[0]);

    // filter the whole database returning only the selected items
    const downloadSelectedItems = allDepartments.filter(item => {
      return selected.indexOf(item._id) !== -1;
    });

    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, departmentListToRender.length - page * rowsPerPage);

    // in below the whole table header is a different component 'EnhancedTableHead'
    return (
      <MuiThemeProvider>
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>MyCompany Department List</title>
            <meta name="description" content="MyCompany List of Departments!" />
          </Helmet>
          <Row>
            <Col xs="12">
              <Paper className={classes.root}>
                <TableToolbarDepartment
                  allDepartments={this.state.allDepartments}
                  numSelected={selected.length}
                  confirmDeleteCustom={this.confirmDeleteCustom}
                  checkedItems={selected}
                  deleteItem={this.deleteItem}
                  departmentToEdit={departmentToEdit}
                  editItem={this.editItem}
                  handleQueryString={this.handleQueryString}
                  handleColumnToQuery={this.handleColumnToQuery}
                  clearAllQueryString={this.clearAllQueryString}
                  unSelectItems={this.unSelectItems}
                  downloadSelectedItems={downloadSelectedItems}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                />
                <div className={classes.tableWrapper}>
                  <Table className={classes.table}>
                    <TableHeadDepartment
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onRequestSort={this.handleRequestSort}
                      page={page}
                      count={
                        queryStringFromChild
                          ? totalTextQueryResult.length
                          : allDepartments.length
                      }
                      rowsPerPage={parseInt(rowsPerPage)}
                      noOfItemsInCurrentPage={departmentListToRender.length}
                    />
                    <TableBody>
                      {departmentListToRender.map((n, i) => {
                        const isSelected = this.isSelected(n._id);
                        return (
                          <TableRow
                            hover
                            onClick={event => this.handleClick(event, n._id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n._id || n.id || i}
                            selected={isSelected}
                            style={{
                              height: "15px"
                            }}
                          >
                            <CustomTableCell
                              padding="checkbox"
                              style={{
                                width: "10px"
                              }}
                            >
                              <Checkbox checked={isSelected} />
                            </CustomTableCell>
                            <CustomTableCell
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                maxWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "18%"
                              }}
                            >
                              {n.name}
                            </CustomTableCell>

                            <CustomTableCell
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                maxWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "10%"
                              }}
                            >
                              {n.work_description}
                            </CustomTableCell>
                            <CustomTableCell
                              align="left"
                              style={{
                                whiteSpace: "nowrap",
                                maxWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {n.type}
                            </CustomTableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 0 * emptyRows }}>
                          <CustomTableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={6}
                          count={
                            queryStringFromChild
                              ? totalTextQueryResult.length
                              : allDepartments.length
                          }
                          rowsPerPage={parseInt(rowsPerPage)}
                          page={page}
                          SelectProps={{
                            native: true
                          }}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActionsWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                <div id="snackbar">
                  The Department you selected has been successfully deleted
                </div>
              </Paper>
            </Col>
          </Row>
          <Row>
            <br />
          </Row>

          <div className="float-sm-right m-b-sm">
            <Tooltip
              title={
                <React.Fragment>
                  <h2>Add a new Department</h2>
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
                variant="contained"
                className={classes.fabButton}
              >
                <AddNewDepartment addNewItemToParentState={this.addItem} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

DepartmentList.propTypes = {
  classes: PropTypes.object.isRequired
};

// Use the utility function combineStyles() to create a compatible function for `withStyles`:
const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles)(DepartmentList);

// export default withStyles(styles)(DepartmentList);

/*
1> FAB - https://material-ui.com/demos/buttons/#floating-action-buttons

2> For rendering the newly added item, I am updating the parent's state by passing date from Child to parent.
A> Define a callback in my parent (addItem function) which takes the data I need in as a parameter.

B> Pass that callback as a prop to the child
<AddNewDepartment addNewItemToParentState={this.addItem} />

C> Call the callback using this.props.[callback] in the child, and pass in the data as the argument.

3> I needed the componentDidUpdate, as without it this component will not update the state properly. So without componentDidUpdate() after I add a new item, that will render at the top of the list first and also, clicking immediately on the Delete button on that newly added item will FAIL.

*/
