/** @format */

let nextProductId = 5;
let nextReviewId = 5;
let products = {};

const createReview = async (req, res) => {
  const { rating, productId } = req.body;
  let review = {
    id: nextReviewId,
    rating: rating,
  };
  products[productId].reviews.push(review);
  nextReviewId++;
  return res.status(201).json({ message: "Review successfully created." });
};

module.exports = {
  createReview: createReview,
};
