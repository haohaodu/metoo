/** @format */

const express = require("express");
const reviewService = require("../services/reviews");

const router = express.Router();

router.get("/", reviewService.createReview);

module.exports = router;
