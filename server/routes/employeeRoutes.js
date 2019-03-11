"use strict";

const express = require("express"),
  Department = require("../models/department"),
  router = express.Router(),
  moment = require("moment"),
  Employee = require("../models/employee");

const _ = require("lodash");
const flatMap = require("lodash/flatMap");
const { createAllocationEmployee } = require("./createAllocationLodash");

// General route to get raw database from direct call to mongo (not needed in the app)
router.get("/directdatafrommongo", (req, res, next) => {
  Employee.find(
    {},
    null,
    {
      sort: { createdAt: -1 }
    },
    (err, docs) => {
      if (err) {
        return next(err);
      } else {
        res.status(200).json(docs);
      }
    }
  );
});

// To GET ALL Imports without mongoose-paginate - Working in Postman*
router.get("/", (req, res, next) => {
  Employee.find(
    {},
    null,
    {
      sort: { createdAt: -1 }
    },
    (err, records) => {
      if (err) {
        return next(err);
      } else {
        const flatDocs = _.flatMap(records, item => [
          createAllocationEmployee(item)
        ]);
        res.status(200).json(flatDocs);
      }
    }
  );
});

// To GET ALL Imports with mongoose-paginate - max 5 or 10 or 15 at a time (determined by whatever users sets it to be at the front-end MAT-UI). By sating < lean: true > the returned data will be made lean i.e. the "department_objectId": "5c6121e4722f134f27c49ee4", will be a single line instead of a nested object with all details. Working in Postman*
router.get("/paginate", (req, res, next) => {
  let pageOptions = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.rowsperpage) || 5
  };

  if (req.query.page && req.query.rowsperpage) {
    Employee.paginate(
      {},
      {
        offset: pageOptions.page * pageOptions.limit,
        limit: pageOptions.limit,
        sort: { createdAt: -1 }
      },

      (err, records) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          const flatDocs = _.flatMap(records.docs, item => [
            createAllocationEmployee(item)
          ]);
          res.status(200).json(flatDocs);
        }
      }
    );
  }
});

// Create a new item (note, I have to have an object_id reference of the relevant department) -Working in Postman*
router.post("/", (req, res, next) => {
  let employee = new Employee(req.body);
  employee.save((err, newImport) => {
    if (err) {
      console.log("Failed to post new data because ", err);
      return next(err);
    } else {
      res.status(200).send(newImport);
    }
  });
});

// Edit / Update by _id - Working in Postman*
router.put("/:id", (req, res, next) => {
  let editedItem = req.body;

  // I also had to reformat the date, else mongo was saving the date record as one day previous
  editedItem.date = moment(editedItem.date).format("YYYY-MM-DD");

  Employee.findByIdAndUpdate(req.params.id, editedItem, {
    new: true
  }).exec((err, record) => {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      res.status(200).json(record);
    }
  });
});

// Delete by _id array - Working in Postman
router.delete("/delete", (req, res, next) => {
  Employee.remove(
    { _id: { $in: req.body.employee_id_list_arr } },
    (err, records) => {
      if (err) {
        console.log(err);
        return next(err);
      } else {
        res.status(200).send(records);
      }
    }
  );
});

// get Imports by date range WITHOUT PAGINATION - Working in Postman
router.post("/daterange", (req, res, next) => {
  let startDateByUser = moment(req.body.start_date).format("YYYY-MM-DD");
  let endDateByUser = moment(req.body.end_date).format("YYYY-MM-DD");
  // Now, Increment the user input date by one, because the query should return records for both the user-input date inclusive data
  let incremented_endDateByUser = moment(endDateByUser)
    .add(1, "days")
    .format("YYYY-MM-DD");

  Employee.find(
    {
      date: {
        $gte: startDateByUser,
        $lt: incremented_endDateByUser
      }
    },
    (err, records) => {
      if (err) {
        return next(err);
      } else {
        const flatDocs = _.flatMap(records, item => [
          createAllocationEmployee(item)
        ]);
        res.status(200).json(flatDocs);
      }
    }
  );
});

// get Employee works by date range - WORKING WITH PAGINATION - Working in Postman
// The signature is - Model.paginate([query], [options], [callback])
router.post("/paginate/daterange", (req, res, next) => {
  let startDateByUser = moment(req.body.start_date).format("YYYY-MM-DD");
  let endDateByUser = moment(req.body.end_date).format("YYYY-MM-DD");

  // Now, Increment the user input date by one, because the query should return records for both the user-input date inclusive data
  let incremented_endDateByUser = moment(endDateByUser)
    .add(1, "days")
    .format("YYYY-MM-DD");

  let pageOptions = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.rowsperpage) || 5
  };

  Employee.paginate(
    {
      date: {
        $gte: startDateByUser,
        $lt: incremented_endDateByUser
      }
    },
    {
      offset: pageOptions.page * pageOptions.limit,
      limit: pageOptions.limit,
      sort: { createdAt: -1 }
    },

    (err, records) => {
      if (err) {
        console.log(err);
        return next(err);
      } else {
        const flatDocs = _.flatMap(records.docs, item => [
          createAllocationEmployee(item)
        ]);
        res.status(200).json(flatDocs);
      }
    }
  );
});

// get employee by Today's Date WITHOUT pagination- WORKING IN POSTMAN
router.get("/current/today", (req, res, next) => {
  let today = moment().format("YYYY-MM-DD");
  let tomorrow = moment(today)
    .add(1, "days")
    .format("YYYY-MM-DD");
  Employee.find(
    {
      date: {
        $gte: today,
        $lt: tomorrow
      }
    },
    (err, records) => {
      if (err) {
        return next(err);
      }
      const flatDocs = _.flatMap(records, item => [
        createAllocationEmployee(item)
      ]);
      res.status(200).json(flatDocs);
    }
  );
});

// get employee by Today's Date - Rohan's code with pagination(Working in Postman)
router.post("/paginate/current/today", (req, res, next) => {
  let pageOptions = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.rowsperpage) || 5
  };
  let today = moment().format("YYYY-MM-DD");
  let tomorrow = moment(today)
    .add(1, "days")
    .format("YYYY-MM-DD");

  Employee.paginate(
    {
      date: {
        $gte: today,
        $lt: tomorrow
      }
    },
    {
      offset: pageOptions.page * pageOptions.limit,
      limit: pageOptions.limit,
      sort: { createdAt: -1 }
    },
    (err, records) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      const flatDocs = _.flatMap(records.docs, item => [
        createAllocationEmployee(item)
      ]);
      res.status(200).json(flatDocs);
    }
  );
});

// get employee by current month WITHOUT mongoose-pagination - Rohan's code (Working in Postman)
router.post("/currentmonth", (req, res, next) => {
  var startDate = moment(new Date())
    .startOf("month")
    .format("YYYY-MM-DD");
  var endDate = moment(new Date())
    .endOf("month")
    .add(1, "days")
    .format("YYYY-MM-DD");

  Employee.find(
    {
      date: {
        $gte: startDate,
        $lt: endDate
      }
    },
    (err, records) => {
      if (err) {
        return next(err);
      }
      const flatDocs = _.flatMap(records, item => [
        createAllocationEmployee(item)
      ]);
      res.status(200).json(flatDocs);
    }
  );
});

// get employee by current month WITH mongoose-pagination - Rohan's code (Working in Postman)
router.post("/paginate/currentmonth", (req, res, next) => {
  var startDate = moment(new Date())
    .startOf("month")
    .format("YYYY-MM-DD");
  var endDate = moment(new Date())
    .endOf("month")
    .add(1, "days")
    .format("YYYY-MM-DD");

  let pageOptions = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.rowsperpage) || 5
  };

  Employee.paginate(
    {
      date: {
        $gte: startDate,
        $lt: endDate
      }
    },
    {
      offset: pageOptions.page * pageOptions.limit,
      limit: pageOptions.limit,
      sort: { createdAt: -1 }
    },

    (err, records) => {
      if (err) {
        return next(err);
      }
      const flatDocs = _.flatMap(records.docs, item => [
        createAllocationEmployee(item)
      ]);
      res.status(200).json(flatDocs);
    }
  );
});

module.exports = router;

/* 1> To test the POST (New Item) route http://localhost:3000/api/employee in Postman - ie. adding a new item, in below Postman request, I have to take an existing object_id from the department module - If I dont yet have a department module take an arbitrary _id for filling up the objectId field for the 'department_objectId' prop of the scheme.

The below one is with a real object_id

{
    "department_objectId":"5c6c0f969c84ea3c7194a7de",
    "avg_employee_productivity":"6",
	"benchmark_employee_productivity":"20",
    "date":"2019-02-26"
}

==========

2> To test Edit route - http://localhost:3000/api/employee/5c75512bc014924f462b753b

{
     "department_objectId":"5c6c0f839c84ea3c7194a7dd",
    "avg_employee_productivity":"6",
    "benchmark_employee_productivity":"25",
    "date":"2019-02-26"
}

3> Testing DELETE - router.delete("/delete"

{
	"employee_id_list_arr":["5c6a6ecc1c01895fcfa3fe5d"]
}

4> To test router.post("/paginate/daterange",  - First post a a document with date set to as below

"date":"2019-02-12",

Then send a POST request with Params of page=0 and rowsperpage=2

{
    "start_date": "2019-02-12",
    "end_date": "2019-02-12"
}


*/
