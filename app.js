/** @format */

let nextProductId = 3;
let nextReviewId = 5;
let products = {
  1: {
    id: 1,
    name: `doofus`,
    stock: 1,
    price: 15,
    length: 4,
    width: 2,
    height: 1,
    reviews: {
      1: {
        id: 1,
        rating: 2,
      },
      2: {
        id: 2,
        rating: 5,
      },
    },
  },
  2: {
    id: 2,
    name: `scoobey`,
    stock: 0,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
    reviews: {
      3: {
        id: 3,
        rating: 9,
      },
      4: {
        id: 4,
        rating: 10,
      },
    },
  },

  3: {
    id: 3,
    name: `scoobey`,
    stock: 0,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
  },

  4: {
    id: 4,
    name: `scoobey`,
    stock: 0,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
    reviews: {},
  },
};

const express = require("express");
const {
  productValidationRules,
  reviewValidationRules,
  validate,
} = require("./src/validate");
const logger = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

const inStock = (item) => item.stock >= 1;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/product/:id", (req, res) => {
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
});

app.get("/products", (req, res) => {
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
});

app.post("/product", productValidationRules(), validate, (req, res) => {
  const { name, price, length, width, height, stock } = req.body;
  let product = {
    id: nextProductId,
    name: name,
    price: price,
    length: length,
    width: width,
    height: height,
    stock: stock,
  };
  products[nextProductId] = product;
  nextProductId++;
  return res.status(201).json({ message: "Product successfully created" });
});

app.post("/review", reviewValidationRules(), validate, (req, res) => {
  const { rating, productId } = req.body;
  let review = {
    id: nextReviewId,
    rating: rating,
  };
  products[productId].reviews[nextReviewId] = review;
  nextReviewId++;
  return res.status(201).json({ message: "Review successfully created" });
});

app.get("/reviews/:productId", (req, res) => {
  const { productId } = req.params;

  if (products.hasOwnProperty(productId))
    return res.status(200).json({ data: products[productId].reviews });

  res.status(404).json({ message: `Product with id ${productId} not found.` });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server listening at http://localhost:5000")
);
