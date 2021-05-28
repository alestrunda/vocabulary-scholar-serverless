const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

//create schema
const errorSchema = new Schema({
  date: String,
  description: String,
  error: String
});

//create model
const errorModel = mongoose.model("Error", errorSchema);

module.exports = errorModel;
