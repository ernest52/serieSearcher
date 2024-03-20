const { countries } = require("../../dataBase");
const { genres } = require("../../dataBase");

// const Joi=require("../../node_modules/joi")
const Joi = require("joi");
// let myAccount;
const ErrorApp = class extends Error {
  constructor(message, status, page, path) {
    super();
    this.page = page;
    this.message = message;
    this.status = status;
    this.path = path;
  }
};

const errHandler = function (err, req, res, next) {
  let { status = 500, page = "index", path } = err;
  // message = `${status} error : ${message}`;
  const data = req.data;
  req.flash("error", `Error: ${err.message} status: ${err.status}`);
  res.status(status).render(page, {
    setSection: false,
    err: req.flash("error"),
    data,
    path,
    serial: "",
    favourites: "",
    user: "",
  });
};

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      // console.log(err);
      next(err);
    });
  };
}

module.exports.ErrorApp = ErrorApp;
module.exports.errHandler = errHandler;
module.exports.asyncWrap = asyncWrap;

module.exports.registerFormValidator = (req, res, next) => {
  const userSchema = Joi.object({
    username: Joi.string().min(5).max(50).trim().required(),
    password: Joi.string().min(8).max(20).trim().required(),
    mail: Joi.string().trim().email().required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    const { details } = error;

    const msg = details.map((det) => det.message).join(",");
    // end of JOI
    // console.log(`req.path => ${req.path}`);
    if (req.path == "/myAccount/update") {
      // myAccount = true;
      throw new ErrorApp(msg, 400, "forms", "update");
    } else {
      throw new ErrorApp(msg, 400, "forms", "/register");
    }
  } else {
    next();
  }
};

module.exports.userFormValidator = (req, res, next) => {
  const userSchema = Joi.object({
    username: Joi.string().min(5).max(50).trim().required(),
    password: Joi.string().min(8).max(20).trim().required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    const { details } = error;

    const msg = details.map((det) => det.message).join(",");
    // end of JOI

    throw new ErrorApp(msg, 400, "forms");
  } else {
    next();
  }
};

module.exports.searcherValidator = (req, res, next) => {
  const Schema = Joi.object({
    title: Joi.string().min(3).trim().required(),
  });
  const { error } = Schema.validate(req.body);
  if (error) {
    const { details } = error;
    const msg = details.map((det) => det.message).join(",");
    throw new ErrorApp(msg, 500, "myAccount");
  } else {
    next();
  }
};
module.exports.reviewValidator = (req, res, next) => {
  const Schema = Joi.object({
    note: Joi.number().min(1).max(10).required(),
    body: Joi.string().min(5).max(150).required(),
  });
  const { error } = Schema.validate(req.body);
  if (error) {
    const { details } = error;
    const msg = details.map((det) => det.message).join(",");
    // myAccount = true;
    throw new ErrorApp(msg, 500, "index");
  } else {
    next();
  }
};
