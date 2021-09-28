/** @format */

const express = require("express");
const orderService = require("../services/orders");

const router = express.Router();

router.get("/", orderService.getOrders);
router.get(
  "/:id",
  orderService.validateOrder("getOneOrder"),
  orderService.getOneOrder
);
router.post(
  "/",
  orderService.validateOrder("createOrder"),
  orderService.createOrder
);

module.exports = router;
