/** @format */

const productsController = require("../controllers/products");
const reviewsController = require("../controllers/reviews");
// const ordersController = require("../controllers/orders");

const express = require("express");

let router = express.Router();

console.log("use router");

router.use("/products", productsController);
router.use("/reviews", reviewsController);
// router.use("/orders", ordersController);

console.log("finish router");

module.exports = router;
