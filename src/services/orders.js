/** @format */

const Order = require("../models/Order");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({ data: orders });
};

const getOneOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order)
    return res.status(404).json({ message: `Cannot find order with id ${id}` });
  return res.status(200).json({ data: order });
};

const createOrder = async (req, res) => {
  const { name, products } = req.body;

  // check if we have stock first
  let flag = 0;
  Promise.all(
    products.map(async ({ id, quantity }) => {
      const product = await Product.findById(id);
      if (!product) flag++;
      else if (product.stock < quantity) flag += 2;
    })
  );

  if (flag > 0)
    return flag % 2 === 0
      ? res.status(404).send({ message: `Not enough stock for product orders` })
      : res
          .status(404)
          .json({ message: `Product with id ${id} does not exist` });

  // update all product orders stock
  products.map(async ({ id, quantity }) => {
    const product = await Product.findById(id).catch((e) =>
      console.log("error looking for product id")
    );

    const updatedStock = product.stock - quantity;
    await Product.findByIdAndUpdate(id, { stock: updatedStock })
      .then((data) => console.log("new product: ", data))
      .catch((e) => console.log("something went wrong while doing order: ", e));
  });

  const order = await Order.create({
    name: name,
    products: products,
  }).catch((e) => console.log("error while creating order", e));

  if (!order)
    return res
      .status(409)
      .json({ message: "Something went wrong creating order" });

  console.log("5");
  return res
    .status(201)
    .json({ message: "Order successfully created", data: order });
};

module.exports = {
  getOrders: getOrders,
  getOneOrder: getOneOrder,
  createOrder: createOrder,
};
