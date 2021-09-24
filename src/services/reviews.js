/** @format */
const Review = require("../models/Review");

const createReview = async (req, res) => {
  const { rating, id } = req.body;
  const review = await Review.create({
    rating: rating,
    product_id: id,
  });

  if (!review)
    return res
      .status(409)
      .json({ message: "Something went wrong creating review" });

  return res
    .status(201)
    .json({ message: "Review successfully created", data: review });
};

const getProductReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ product_id: id });

  if (reviews.length === 0)
    return res
      .status(404)
      .json({ message: `Reviews for product with id ${id} not found.` });
  return res.status(200).json({ data: reviews });
};

const validate = () => {
  /**
   *
   * Reviews{
   *    reviews: []
   * }
   */
};

module.exports = {
  createReview: createReview,
  getProductReviews: getProductReviews,
};
