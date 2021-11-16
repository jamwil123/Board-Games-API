const {
  selectOneReview,
  insertIntoReviews,
  fetchAllReviews,
  fetchCommentsByReviews,
} = require("../models/reviews-model");

exports.getReviews = (req, res, next) => {
  const { params } = req;
  selectOneReview(params)
    .then((body) => {
      res.status(200).send({ reviews: body });
    })
    .catch(next);
};

exports.patchReviews = (req, res, next) => {
  const { params, body } = req;
  insertIntoReviews(params, body)
    .then((body) => {
      res.status(201).send({ reviews: body });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  const { query } = req;
  let category = query.category;
  let orderByValue = query.sort_by;
  let orderAscOrDesc = query.order;
  fetchAllReviews(orderByValue, orderAscOrDesc, category)
    .then((body) => {
      res.status(200).send({ reviews: body });
    })
    .catch(next);
};

exports.getCommentsByReviews = (req, res, next) => {
  const {
    params: { review_id },
  } = req;
  fetchCommentsByReviews(review_id)
    .then((body) => {
      res.status(200).send({ comments: body });
    })
    .catch(next);
};
