const express = require("express");
const { app } = require("../app");
const usersRouter = express.Router();
const {getAllUsers, getUserFromName} = require('../controllers/users-controller')

usersRouter.route('/:username').get(getUserFromName)
usersRouter.route('/').get(getAllUsers)






module.exports = {usersRouter}