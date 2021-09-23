/** @format */

let nextProductId = 5;
let nextReviewId = 5;
const { products } = require("../constants/testProducts");
const inStock = (item) => item.stock >= 1;

const getProducts = async (req, res) => {
  let { name, instock } = req.query;
  let productList = [];

  if (instock) instock = JSON.parse(instock);

  // get all products
  if (!name && !instock) {
    Object.keys(products).map((key) => productList.push(products[key]));
    return res.status(200).json({ data: productList });
  }

  // get all products in stock
  if (!name && instock) {
    Object.keys(products).map((key) => {
      if (products[key].stock > 0) productList.push(products[key]);
    });
    if (productList.length === 0)
      return res
        .status(200)
        .json({ message: "No products in stock", data: {} });
    return res.status(200).json({ data: productList });
  }

  // get all products with specific name (in stock or all)
  if (name) {
    //   loop through db and check if product with name exists
    Object.keys(products).map((key) => {
      const product = products[key];
      if (product.name.includes(name)) {
        // check if the found product is in stock
        if (instock) {
          if (product.stock > 0) productList.push(product);
        } else productList.push(product);
      }
    });
    // check if no matching names are found and type was in stock
    if (productList.length === 0 && instock)
      return res.status(404).json({
        message: `Product with name ${name} not in stock or does not exist.`,
      });
    if (productList.length === 0)
      return res
        .status(404)
        .json({ message: `Product with name ${name} not found.` });
    res.status(200).json({
      data: productList,
    });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const { instock } = req.query;

  // specific product exists in db
  if (products.hasOwnProperty(id)) {
    // specific product is out of stock
    if (instock && !inStock(products[id])) {
      return res
        .status(404)
        .json({ message: `Product with id ${id} out of stock` });
    }
    // specific product is in stock, or instock option not provided
    return res.status(200).json({ data: products[id] });
  }

  // specific product not found
  else
    return res
      .status(404)
      .json({ message: `Product with id ${id} not found.` });
};

const createProduct = async (req, res) => {
  const { name, price, length, width, height, stock } = req.body;
  let product = {
    id: nextProductId,
    name: name,
    price: price,
    length: length,
    width: width,
    height: height,
    stock: stock,
    reviews: [],
  };
  products[nextProductId] = product;
  nextProductId++;
  console.log("product list: ", products);
  return res.status(201).json({ message: "Product successfully created" });
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
