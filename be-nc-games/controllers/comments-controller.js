const { enterNewComment, removeComment, alterComments } = require("../models/comments-model");

exports.postNewComment = (req, res, next) => {
  const { body: { username, body }} = req;
  const { params: { review_id }} = req;
  enterNewComment(review_id, username, body)
    .then((body) => {
      res.status(201).send(body);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((body) => {
      res.status(204).send(body);
    })
    .catch(next);
};

exports.patchComment= (req, res, next) => {
  const { body: { inc_votes }} = req;
  const { comment_id } = req.params;
  alterComments(comment_id, inc_votes).then((body) => {
    res.status(201).send(body)
  })
}


