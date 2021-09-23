/** @format */

const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("Review", ReviewSchema);
