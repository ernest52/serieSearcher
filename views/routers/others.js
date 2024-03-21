const express = require("express");
const Router = express.Router({ mergeParams: true });

const otherPages = require("../../controllers/others");
Router.get("/", otherPages);

module.exports = Router;
