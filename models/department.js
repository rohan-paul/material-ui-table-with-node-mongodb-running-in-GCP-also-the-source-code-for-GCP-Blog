"use strict";
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let departmentSchema = new Schema(
  {
    name: { type: String, unique: true },
    type: { type: String }
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);

// exports
module.exports = mongoose.model("Department", departmentSchema);
