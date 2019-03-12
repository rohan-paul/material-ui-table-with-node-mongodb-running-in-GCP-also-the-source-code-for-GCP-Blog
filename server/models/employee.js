"use strict";

const mongoose = require("mongoose"),
  autopopulate = require("mongoose-autopopulate"),
  Department = require("./department"),
  Schema = mongoose.Schema,
  mongoosePaginate = require("mongoose-paginate");

let employeeSchema = new Schema(
  {
    department_objectId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      autopopulate: true
    },
    employee_name: { type: String },
    work_description: { type: String },
    avg_employee_productivity: { type: Number }, // in Tonnes
    benchmark_employee_productivity: { type: Number }, // in Tonnes
    date: { type: Date }
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);

// plugins
employeeSchema.plugin(autopopulate);
employeeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Employee", employeeSchema);
