/** @format */

let products = {
  1: {
    name: `doofus`,
    stock: 1,
  },
  2: {
    name: `scoobey`,
    stock: 0,
  },
};
let reviews = {};

const express = require("express");
const app = express();

app.use(express.json());

const inStock = (item) => item.stock >= 1;

app.get("/products", (req, res) => {
  const { id, name, type } = req.query;
  let productList = [];

  if (!id && !name) return res.status(200).json(products);

  if (id) {
    // check if product with id exists
    if (products.hasOwnProperty(id)) {
      // if they are looking for in-stock products, check if we have any left
      if (type === "in-stock" && !inStock(products[id])) {
        return res
          .status(404)
          .json({ message: `Product with id ${id} out of stock` });
      }
      return res.status(200).json({ data: [products[id]] });
    }
    // product does not exist
    else
      return res
        .status(404)
        .json({ message: `Product with id ${id} not found.` });
  }

  if (name) {
    //   loop through db and check if product with name exists
    Object.keys(products).map((key) => {
      const product = products[key];

      if (product.name.includes(name)) {
        // check if the found product is in stock
        if (type === "in-stock") {
          // only add it if the product is in stock
          if (product.stock > 0) productList.push(product);
        } else productList.push(product);
      }
    });
    console.log("product list: ", productList);
    // check if no matching names are found and type was in stock
    if (productList.length === 0 && type === "in-stock")
      return res.status(404).json({
        message: `Product with name ${name} not in stock.`,
      });
    if (productList.length === 0)
      return res
        .status(404)
        .json({ message: `Product with name ${name} not found.` });
    // if products were found and type is 'all' return all the products
    if (type !== "in-stock")
      return res.status(200).json({
        data: productList,
      });
  }
  return res.status(200).json({
    data: products[key],
  });
});

app.listen(3000);
console.log("Server listening at http://localhost:3000");
