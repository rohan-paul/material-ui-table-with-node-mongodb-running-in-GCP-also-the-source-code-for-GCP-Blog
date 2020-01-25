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
import AddNewEmployee from "./AddNewEmployee";
import TableToolbarEmployee from "./TableToolbarEmployees";
import TableHeadEmployee from "./TableHeadEmployees";
import orderByLodash from "lodash/orderBy";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TableFooter from "@material-ui/core/TableFooter";
import TablePaginationActionsWrapped from "../UtilFunctions/TablePaginationActionsWrapped";
import IconButton from "@material-ui/core/IconButton";
import { Helmet } from "react-helmet";
const tableSortByHeadingUtilFunc = require("../UtilFunctions/tableSortByHeading");
const moment = require("moment");

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

class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalItemsUnformatted: [],
      totalItemsFormatted: [],
      order: "desc",
      orderBy: "date",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      queryStringFromChild: "",
      columnToQuery: "department_name",
      itemsDateRangePaginated: [],
      totalDateRangeSearchResultParent: [],
      start_date: new Date(),
      end_date: new Date(),
      ifUserSearchedDateRange: false,
      ifUserClickedForCurrentMonth: false,
      currentMonthPaginated: [],
      currentMonthTotal: [],
      currentDatePaginated: [],
      currentDateTotal: [],
      arrowRef: null
    };
  }

  // function to handle the placement of the arrow on top of the Tooltip
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  addItem = item => {
    this.setState({
      totalItemsFormatted: [item, ...this.state.totalItemsFormatted],
      currentDateTotal: [item, ...this.state.currentDateTotal],
      currentMonthTotal: [item, ...this.state.currentMonthTotal]
    });
  };

  returnDocumentToEdit = id => {
    if (this.state.selected.length !== 0) {
      return this.state.totalItemsFormatted.filter(item => item._id === id);
    }
  };

  editItem = () => {
    // I need to apply this 'ifUserSearchedDateRange' and 'ifUserClickedForCurrentMonth' check to re-render the Table with the updated data.
    if (this.state.ifUserSearchedDateRange) {
      const { start_date, end_date } = this.state;
      this.setState({ page: this.state.page }, () => {
        axios
          .post(
            "/api/employee/paginate/daterange",
            {
              start_date,
              end_date
            },
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState({
              itemsDateRangePaginated: res.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    } else if (this.state.ifUserClickedForCurrentMonth) {
      this.setState({ page: this.state.page }, () => {
        axios
          .post(
            `/api/employee/paginate/currentmonth`,
            {},
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState(
              {
                currentMonthPaginated: res.data
              },
              () => {
                this.setState({
                  ifUserClickedForCurrentMonth: true
                });
              }
            );
          })
          .catch(error => {
            console.log(error);
          });
      });
    } else {
      // having to put this extra if condition ((this.state.currentDatePaginated.length === 1)) and the database call here to resolve an issue - that for the last item left in the table, after edit submission the date and work-description was not getting rendered immediately. Edited data will get rendered only after page refresh
      if (this.state.currentDatePaginated.length === 1) {
        axios
          .post(
            "/api/employee/paginate/current/today",
            {},
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState({
              currentDatePaginated: res.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.setState({
          currentDatePaginated: [this.state.currentDatePaginated],
          totalDateRangeSearchResultParent: [
            this.state.totalDateRangeSearchResultParent
          ]
        });
      }
    }
  };

  confirmDeleteCustom = idArr => {
    let payload = {
      employee_id_list_arr: idArr
    };
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure ?</h1>
            <p>You want to delete this Employee Record</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                if (this.state.ifUserSearchedDateRange) {
                  const { start_date, end_date } = this.state;
                  axios
                    .delete("/api/employee/delete", {
                      data: payload
                    })
                    .then(() => {
                      axios
                        .post(
                          "/api/employee/paginate/daterange",
                          {
                            start_date,
                            end_date
                          },
                          {
                            params: {
                              page: this.state.page,
                              rowsperpage: this.state.rowsPerPage
                            }
                          }
                        )
                        .then(res => {
                          this.setState({
                            itemsDateRangePaginated: res.data,
                            selected: []
                          });
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
                    });
                } else if (this.state.ifUserClickedForCurrentMonth) {
                  this.setState({ page: this.state.page }, () => {
                    axios
                      .delete("/api/employee/delete", {
                        data: payload
                      })
                      .then(() => {
                        axios
                          .post(
                            `/api/employee/paginate/currentmonth`,
                            {},
                            {
                              params: {
                                page: this.state.page,
                                rowsperpage: this.state.rowsPerPage
                              }
                            }
                          )
                          .then(res => {
                            this.setState({
                              currentMonthPaginated: res.data,
                              selected: []
                            });
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
                      });
                  });
                } else {
                  axios
                    .delete("/api/employee/delete", {
                      data: payload
                    })
                    .then(() => {
                      this.setState({
                        currentDatePaginated: [this.state.currentDatePaginated],
                        selected: []
                      });
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
                }
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  };

  // Function to handle the request from user to sort by a particular heading.
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    // In below I am setting the state with destructuring, given both key-value is the same word. So in setState, I just mention the key from the state variable.
    this.setState({ order, orderBy });
  };

  // Function to return true if an item is selected or false if NOT
  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // Function to handle when the checkbox for the select all is clicked to select all the items in that page
  handleSelectAllClick = event => {
    if (event.target.checked) {
      if (
        this.state.ifUserSearchedDateRange === false &&
        this.state.ifUserClickedForCurrentMonth === false &&
        this.state.queryStringFromChild === ""
      ) {
        this.setState(state => ({
          selected: state.currentDatePaginated.map(n => n._id)
        }));
        return;
      } else if (this.state.queryStringFromChild !== "") {
        const lowerCaseQuery = this.state.queryStringFromChild.toLowerCase();

        const totalTextQueryResult = this.state.totalItemsFormatted.filter(
          item => {
            return (
              item[this.state.columnToQuery] &&
              item[this.state.columnToQuery]
                .toLowerCase()
                .includes(lowerCaseQuery)
            );
          }
        );
        const itemsToRenderInThisPage = totalTextQueryResult.slice(
          this.state.page * this.state.rowsPerPage,
          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
        );
        this.setState(state => ({
          selected: itemsToRenderInThisPage.map(n => n._id)
        }));
        return;
      } else if (this.state.ifUserClickedForCurrentMonth === true) {
        this.setState(state => ({
          selected: state.currentMonthPaginated.map(n => n._id)
        }));
        return;
      } else {
        this.setState(state => ({
          selected: state.itemsDateRangePaginated.map(n => n._id)
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

  // Function to add item's _id to the 'selected' array when I click on them and make them checked
  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If its a new item that has been selected, then concat it to the old array of selections
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
      .all([
        axios.get(`/api/employee/current/today`),
        axios.post(`/api/employee/paginate/current/today`, {
          params: {
            page: this.state.page,
            rowsperpage: this.state.rowsPerPage
          }
        })
      ])
      .then(
        axios.spread((getTotalCurrentDateData, getCurrentDatePaginated) => {
          this.setState({
            currentDateTotal: getTotalCurrentDateData.data,
            currentDatePaginated: getCurrentDatePaginated.data
          });
        })
      )
      .then(
        axios.get("/api/employee/").then(res => {
          this.setState(
            {
              totalItemsUnformatted: res.data
            },
            () => {
              this.setState({
                totalItemsFormatted: this.state.totalItemsUnformatted.map(
                  item => {
                    if (item.date) {
                      item = {
                        ...item,
                        date:
                          moment(item.date).format("MMM D, YYYY 12:00:00 ") +
                          `AM`
                      };
                    }
                    return item;
                  }
                )
              });
            }
          );
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.itemsDateRangePaginated.length !==
      prevState.itemsDateRangePaginated.length ||
      this.state.totalDateRangeSearchResultParent.length !==
      prevState.totalDateRangeSearchResultParent.length ||
      this.state.totalItemsFormatted.length !==
      prevState.totalItemsFormatted.length ||
      this.state.rowsPerPage !== prevState.rowsPerPage ||
      this.state.currentDateTotal.length !==
      prevState.currentDateTotal.length ||
      this.state.selected !== prevState.selected
    ) {
      if (this.state.ifUserSearchedDateRange) {
        const { start_date, end_date } = this.state;
        this.setState({ page: this.state.page }, () => {
          axios
            .post(
              "/api/employee/paginate/daterange",
              {
                start_date,
                end_date
              },
              {
                params: {
                  page: this.state.page,
                  rowsperpage: this.state.rowsPerPage
                }
              }
            )
            .then(res => {
              this.setState({
                itemsDateRangePaginated: res.data
              });
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else if (this.state.ifUserClickedForCurrentMonth) {
        this.setState({ page: this.state.page }, () => {
          axios
            .post(
              `/api/employee/paginate/currentmonth`,
              {},
              {
                params: {
                  page: this.state.page,
                  rowsperpage: this.state.rowsPerPage
                }
              }
            )
            .then(res => {
              this.setState(
                {
                  currentMonthPaginated: res.data
                },
                () => {
                  this.setState({
                    ifUserClickedForCurrentMonth: true
                  });
                }
              );
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else {
        this.setState({ page: this.state.page }, () => {
          axios
            .all([
              axios.get(`/api/employee/current/today`),
              axios.post(
                `/api/employee/paginate/current/today`,
                {},
                {
                  params: {
                    page: this.state.page,
                    rowsperpage: this.state.rowsPerPage
                  }
                }
              )
            ])
            .then(
              axios.spread(
                (getTotalCurrentDateData, getCurrentDatePaginated) => {
                  this.setState({
                    currentDateTotal: getTotalCurrentDateData.data,
                    currentDatePaginated: getCurrentDatePaginated.data
                  });
                }
              )
            )
            .then(
              axios.get("/api/employee/").then(res => {
                this.setState(
                  {
                    totalItemsUnformatted: res.data
                  },
                  () => {
                    this.setState({
                      totalItemsFormatted: this.state.totalItemsUnformatted.map(
                        item => {
                          if (item.date) {
                            item = {
                              ...item,
                              date:
                                moment(item.date).format(
                                  "MMM D, YYYY 12:00:00 "
                                ) + `AM`
                            };
                          }
                          return item;
                        }
                      )
                    });
                  }
                );
              })
            )
            .catch(error => {
              console.log(error);
            });
        });
      }
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
      columnToQuery: "department_name"
    });
  };

  clearCurrentMonthSearch = () => {
    this.setState({
      ifUserClickedForCurrentMonth: false
    });
  };

  clearUserSearchedDateRange = () => {
    this.setState({
      ifUserSearchedDateRange: false
    });
  };

  handleStartDateChangeParent = startdate => {
    this.setState({
      start_date: startdate
    });
  };

  handleEndDateChangeParent = enddate => {
    this.setState({
      end_date: enddate
    });
  };

  // Function that will fire when clicked on current month data button
  getCurrentMonthData = () => {
    this.setState(
      {
        page: 0
      },
      () => {
        axios
          .all([
            axios.post(`/api/employee/currentmonth`),
            axios.post(`/api/employee/paginate/currentmonth`, {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            })
          ])
          .then(
            axios.spread(
              (getTotalCurrentMonthData, getCurrentMonthPaginated) => {
                this.setState(
                  {
                    currentMonthTotal: getTotalCurrentMonthData.data,
                    currentMonthPaginated: getCurrentMonthPaginated.data
                  },
                  () => {
                    this.setState({
                      ifUserClickedForCurrentMonth: true
                    });
                  }
                );
              }
            )
          );
      }
    );
  };

  // Function to handle when next page is clicked in the Pagination Component
  handleChangePage = (event, page) => {
    const {
      start_date,
      end_date,
      ifUserSearchedDateRange,
      ifUserClickedForCurrentMonth
    } = this.state;

    // If user has run a query for daterange, then only render the next page of that query result
    if (ifUserSearchedDateRange) {
      this.setState({ page }, () => {
        axios
          .post(
            "/api/employee/paginate/daterange",
            {
              start_date,
              end_date
            },
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState({
              itemsDateRangePaginated: res.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    } else if (ifUserClickedForCurrentMonth) {
      this.setState({ page }, () => {
        axios
          .post(
            `/api/employee/paginate/currentmonth`,
            {},
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState({
              currentMonthPaginated: res.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    } else {
      this.setState({ page }, () => {
        axios
          .post(
            `/api/employee/paginate/current/today`,
            {},
            {
              params: {
                page: this.state.page,
                rowsperpage: this.state.rowsPerPage
              }
            }
          )
          .then(res => {
            this.setState({
              currentDatePaginated: res.data
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  };

  ifUserWantsDateRangeData = (
    dateRangeArrToRenderInCurrentPage,
    fullDateRangeSearchResult
  ) => {
    this.setState({
      itemsDateRangePaginated: [...dateRangeArrToRenderInCurrentPage],
      totalDateRangeSearchResultParent: [...fullDateRangeSearchResult],
      ifUserSearchedDateRange: true
    });
  };

  render() {
    const { classes } = this.props;
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      itemsDateRangePaginated,
      totalDateRangeSearchResultParent,
      totalItemsFormatted,
      queryStringFromChild,
      start_date,
      end_date,
      ifUserSearchedDateRange,
      currentMonthTotal,
      currentMonthPaginated,
      ifUserClickedForCurrentMonth,
      currentDatePaginated,
      currentDateTotal
    } = this.state;

    // lowercase the queryStringFromChild string that the user types
    const lowerCaseQuery =
      typeof queryStringFromChild == "string"
        ? queryStringFromChild && queryStringFromChild.toLowerCase()
        : typeof queryStringFromChild == "number"
          ? queryStringFromChild
          : null;

    const totalTextQueryResult =
      lowerCaseQuery !== ""
        ? totalItemsFormatted.filter(
          item =>
            item[this.state.columnToQuery] &&
            item[this.state.columnToQuery]
              .toLowerCase()
              .includes(lowerCaseQuery)
        )
        : null;

    // Conditionally set the list of items that will be actually be of interest for rendering. e.g. If 'itemsDateRangePaginated' OR 'queryStringFromChild' OR 'ifUserClickedForCurrentMonth' is not set by user then render currentDatePaginated list of items. Else only render the items that the user wants.
    const itemsToRenderInThisPage = !ifUserClickedForCurrentMonth
      ? !ifUserSearchedDateRange
        ? orderByLodash(
          queryStringFromChild
            ? totalTextQueryResult.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : currentDatePaginated
        )
        : itemsDateRangePaginated
      : currentMonthPaginated;

    const itemToEdit = this.returnDocumentToEdit(this.state.selected[0]);

    // filter the whole database returning only the selected items
    const downloadSelectedItems = totalItemsFormatted.filter(item => {
      return selected.indexOf(item._id) !== -1;
    });

    const emptyRows =
      rowsPerPage -
      Math.min(
        rowsPerPage,
        itemsToRenderInThisPage.length - page * rowsPerPage
      );

    // in below the whole table header is a different component 'TableHeadEmployee'
    return (
      <MuiThemeProvider>
        <div>
          <Helmet>
            <meta charSet="utf-8" />
            <title>MyCompany | Employee!</title>
            <meta name="description" content="MyCompany | Employee!" />
            <meta name="theme-color" content="#008f68" />
            <body class="dark" />
          </Helmet>
          <Row>
            <Col xs="12">
              {console.log("SELECTED IS ", selected)}
              <Paper className={classes.root}>
                <TableToolbarEmployee
                  totalItemsFormatted={this.state.totalItemsFormatted}
                  numSelected={selected.length}
                  confirmDeleteCustom={this.confirmDeleteCustom}
                  checkedItems={selected}
                  itemToEdit={itemToEdit}
                  editItem={this.editItem}
                  handleQueryString={this.handleQueryString}
                  handleColumnToQuery={this.handleColumnToQuery}
                  clearAllQueryString={this.clearAllQueryString}
                  ifUserWantsDateRangeData={this.ifUserWantsDateRangeData}
                  unSelectItems={this.unSelectItems}
                  downloadSelectedItems={downloadSelectedItems}
                  clearUserSearchedDateRange={this.clearUserSearchedDateRange}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                  handleStartDateChangeParent={this.handleStartDateChangeParent}
                  handleEndDateChangeParent={this.handleEndDateChangeParent}
                  ifUserSearchedDateRange={ifUserSearchedDateRange}
                  start_date={start_date}
                  end_date={end_date}
                  getCurrentMonthData={this.getCurrentMonthData}
                  ifUserClickedForCurrentMonth={ifUserClickedForCurrentMonth}
                  clearCurrentMonthSearch={this.clearCurrentMonthSearch}
                  allDepartmentsForSiblingCommunication={
                    this.props.allDepartmentsForSiblingCommunication
                  }
                />
                <div className={classes.tableWrapper}>
                  <Table className={classes.table}>
                    <TableHeadEmployee
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onRequestSort={this.handleRequestSort}
                      page={page}
                      count={
                        queryStringFromChild
                          ? totalTextQueryResult.length
                          : ifUserSearchedDateRange
                            ? totalDateRangeSearchResultParent.length
                            : ifUserClickedForCurrentMonth
                              ? currentMonthTotal.length
                              : currentDateTotal.length
                      }
                      rowsPerPage={parseInt(rowsPerPage)}
                      noOfItemsInCurrentPage={itemsToRenderInThisPage.length}
                    />
                    <TableBody>
                      {tableSortByHeadingUtilFunc
                        .stableSort(
                          itemsToRenderInThisPage,
                          tableSortByHeadingUtilFunc.getSorting(order, orderBy)
                        )
                        .map(n => {
                          const isSelected = this.isSelected(n._id);
                          return (
                            <TableRow
                              hover
                              onClick={event => this.handleClick(event, n._id)}
                              role="checkbox"
                              aria-checked={isSelected}
                              tabIndex={-1}
                              key={n._id || n.id}
                              selected={isSelected}
                              style={{
                                height: "35px"
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
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "15%"
                                }}
                              >
                                {n.department_name}
                              </CustomTableCell>
                              <CustomTableCell
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "15%"
                                }}
                              >
                                {n.employee_name}
                              </CustomTableCell>
                              <CustomTableCell
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "30%"
                                }}
                              >
                                {n.work_description}
                              </CustomTableCell>
                              <CustomTableCell
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "20%"
                                }}
                              >
                                {n.avg_employee_productivity}
                              </CustomTableCell>
                              <CustomTableCell
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "15%"
                                }}
                              >
                                {n.benchmark_employee_productivity}
                              </CustomTableCell>
                              <CustomTableCell
                                className={classes.customTableCell}
                                align="center"
                                style={{
                                  width: "15%"
                                }}
                              >
                                {moment(n.date).format("MMM D, YYYY 12:00:00 ")}{" "}
                                {`AM`}
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
                              : ifUserSearchedDateRange
                                ? totalDateRangeSearchResultParent.length
                                : ifUserClickedForCurrentMonth
                                  ? currentMonthTotal.length
                                  : currentDateTotal.length
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
                  The Employee Record you selected has been successfully deleted
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
                  <h2>Add a new Employee Record</h2>
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
                className={classes.fabButton}
              >
                <AddNewEmployee
                  addNewItemToParentState={this.addItem}
                  allDepartmentsForSiblingCommunication={
                    this.props.allDepartmentsForSiblingCommunication
                  }
                />
              </IconButton>
            </Tooltip>
          </div>


        </div>
      </MuiThemeProvider>
    );
  }
}

EmployeeList.propTypes = {
  classes: PropTypes.object.isRequired
};

// Use the utililty function combineStyles() to create a compatible function for `withStyles`:
const combinedStyles = combineStyles(styles, toolbarStyles);

export default withStyles(combinedStyles)(EmployeeList);

/*
1> FAB - https://material-ui.com/demos/buttons/#floating-action-buttons

2> For rendering the newly added item, I am updating the parent's state by passing date from Child to parent.
A> Define a callback in my parent (addItem function) which takes the data I need in as a parameter.

B> Pass that callback as a prop to the child
<AddNewEmployee addNewItemToParentState={this.addItem} />

C> Call the callback using this.props.[callback] in the child, and pass in the data as the argument.

3> I needed the componentDidUpdate, as without it this component will not update the state properly. So without componentDidUpdate() after I add a new item, that will render at the top of the list first and also, clicking immediately on the Delete button on that newly added item will FAIL.

4> The state property "totalItemsFormatted" is ONLY required for the searching by a text/string functionality. That is, the user will type the 'Date of Commencement' and 'Date of Completion' in exactly the format that its showing in the rendered Table in the page.

5> Why I needed the the state 'totalItemsUnformatted' and 'totalItemsFormatted' -

BECAUSE without 'totalItemsUnformatted' previously, I WAS MUTATING THE STATE DIRECTLY IN THE BELOW LINE (in both componentDidMount and componentDidUpdate)

this.state.totalItemsFormatted[index].date =
                        moment(item.date).format("MMM D, YYYY 12:00:00 ") +
                        `AM`;

In the above, I am directly changing the property of 'date' in the state named 'totalItemsFormatted'

For more read - https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
*/
