const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

//create schema
const wordSchema = new Schema({
  id: { type: String, unique: true, dropDups: true },
  definition: String
});

//create model
const wordModel = mongoose.model("Word", wordSchema);

module.exports = wordModel;
