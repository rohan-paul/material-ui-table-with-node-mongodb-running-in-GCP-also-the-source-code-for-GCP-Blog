// This snackbar will be rendered when I submit an empty description field in each of the individual modules like "Development Works", "Income & Port Dues" etc
// Also this same showEmptyFieldSnackbar will render the snackbar after successfully deleting a document, port-notice, GO, Tariff or Tidal data

module.exports = {
  showDeleteSnackbar: () => {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, 2000);
  }
};
