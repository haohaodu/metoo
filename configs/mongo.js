/** @format */
const mongoose = require("mongoose");
require("dotenv/config");

const mg = mongoose.connect(process.env.DB_CONNECTION);

module.exports = mg;
