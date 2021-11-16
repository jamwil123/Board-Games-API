const { fetchAllUsers, fetchOneUser } = require("../models/users-model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((body) => {
    res.status(200).send(body);
  });
};

exports.getUserFromName = (req, res, next) => {
    const {params} = req
  fetchOneUser(params).then((body) => {
    res.status(200).send(body)
  }).catch(next)
};
