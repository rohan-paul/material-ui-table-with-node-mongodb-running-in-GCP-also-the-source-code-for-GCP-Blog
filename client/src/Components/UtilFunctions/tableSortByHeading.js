module.exports = {
  desc: (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  },

  /* stableSort() higher order function to sort by a table heading
      1> the argument 'comparisonCB' is the getSorting() defined below.
      2> The sort() method takes a single compareFunction as a callback and compares each pair of successive elements.
       */
  stableSort: (array, comparisonCB) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparisonCB(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  },

  /* getSorting() to be passed as a callback to the above stableSort(). The argument 'orderBy' will initially start (as a state) its value with 'imported_date' (which is a table header label) and then will take on whichever table header label the user clicks on.
      A> First the 'orderBy' value will be set by handleRequestSort() with its argument 'property'
      B> Then this function will be passed down as a prop 'onRequestSort' to EnhancedTableHead child component.
      C> In EnhancedTableHead, it will be called within createSortHandler() function and will be invoked on onClick and passed row.tableHeaderProp (which is the Table-header field value)
       */
  getSorting: (order, orderBy) => {
    return order === "desc"
      ? (a, b) => module.exports.desc(a, b, orderBy)
      : (a, b) => -module.exports.desc(a, b, orderBy);
  }
};

/* Special Note - Inside the getSorting() function I am calling a “local” function (desc()) within module.exports from another function (getSorting()) in module.exports with < module.exports >

*/
