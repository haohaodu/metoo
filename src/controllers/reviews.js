/** @format */

const express = require("express");
const reviewService = require("../services/reviews");

const router = express.Router();

router.post("/products/:id", reviewService.createReview);

module.exports = router;
