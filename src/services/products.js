/** @format */

const { products } = require("../constants/testProducts");
const Product = require("../models/Product");
const inStock = (item) => item.stock >= 1;

const getProducts = async (req, res) => {
  let { name, instock } = req.query;
  instock = instock ? JSON.parse(instock) : null;
  const productName = name || null;
  console.log("in stock value: ", instock);
  const stockQuery = instock ? 1 : 0;
  console.log("stock query: ", stockQuery);

  if (!productName && !instock) {
    const products = await Product.find();
    return res.status(200).json({ data: products });
  }

  if (!productName) {
    const products = Product.find({ instock: inStock });
    return res.status(200).json({ data: products });
  }

  const products = await Product.find({
    name: { $regex: productName },
    stock: { $gte: stockQuery },
  });

  console.log("no products in stock: ", products.length === 0 && instock);
  if (products.length === 0 && instock) {
    return res.status(200).json({
      message: `No products found with name: ${productName} that are in stock`,
    });
  } else if (products.length === 0 && !instock) {
    return res.status(200).json({
      message: `No products found with name: ${productName}`,
    });
  }

  return res.status(200).json({ data: products });
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).catch((e) =>
    console.log(`Error when retrieving product with id ${id}: ${e}`)
  );

  if (!product)
    return res.status(404).json({ message: `Product with id ${id} not found` });

  if (product.stock <= 0)
    return res
      .status(404)
      .json({ message: `Product with id ${id} out of stock` });

  return res.status(200).json({ data: product });
};

const createProduct = async (req, res) => {
  const { name, price, length, width, height, stock } = req.body;

  const product = new Product({
    name: name,
    price: price,
    length: length,
    width: width,
    height: height,
    stock: stock,
  });

  Product.create(product)
    .then((data) => {
      return res
        .status(201)
        .json({ message: "Product successfully created", data: data });
    })
    .catch((err) => {
      return res.status(409).json({
        message: "Error while creating product",
        err: err,
      });
    });
};

const getProductReviews = async (req, res) => {
  const { id } = req.params;
  const reviewsList = [];

  if (id && products.hasOwnProperty(id)) {
    const reviews = products[id].reviews;

    reviews.map(({ id, rating }) =>
      reviewsList.push({ id: id, rating: rating })
    );
    return res.status(200).json({ data: reviewsList });
  }

  res.status(404).json({ message: `Reviews for product id ${id} not found.` });
};

const validate = (method) => {
  switch (method) {
    case "createProduct": {
      return [
        body("name")
          .exists()
          .withMessage("Required field")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("price")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("length")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("width")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("height")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("stock")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
      ];
    }
  }
};

module.exports = {
  getOneProduct: getOneProduct,
  getProducts: getProducts,
  createProduct: createProduct,
  getProductReviews: getProductReviews,
};
