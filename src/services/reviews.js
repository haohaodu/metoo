/** @format */
const Review = require("../models/Review");
const Product = require("../models/Product");
const axios = require("axios");

const createReview = async (req, res) => {
  const {id} = req.params;
  const { rating } = req.body;
  const product = await axios.get(`http://localhost:5000/products/${id}`).
  then(({data}) =>  data)
  .catch(e => console.log("error retrieving product with id: ", e, id))

  const review = new Review({
    rating: rating,
  });

  Product.updateOne(
    {id: id},
    {$addToSet: {reviews: [review]}}
  ).then(data => console.log("success: ", data)).catch(e => console.log("err: ", e))
  console.log("product: ", product)

  return res.status(201).json({ message: "Review successfully created." });
};

const validate = () => {
  /**
   * 
   * Reviews{
   *    reviews: []
   * }
   */
}

module.exports = { 
  createReview: createReview,
};
