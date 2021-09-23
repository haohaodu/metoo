/** @format */

let nextProductId = 5;
let nextReviewId = 5;

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const router = require("./src/routes");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

console.log("after get");

app.listen(process.env.PORT || 5000, () =>
  console.log("Server listening at http://localhost:5000")
);
