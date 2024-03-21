const express = require("express");
const Router = express.Router();
const { registerFormValidator } = require("../../public/scripts/ErrorApp");
const { User } = require("../../dataBase");
const { registerForm, register } = require("../../controllers/register");
Router.route("/").get(registerForm).post(registerFormValidator, register);
module.exports = Router;
