const { genres, countries, User } = require("../../../dataBase");
const { asyncWrap } = require("../../scripts/ErrorApp");

module.exports = asyncWrap(async (req, res, next) => {
  res.locals.genres = genres;
  res.locals.countries = countries;
  res.locals.myAccount = req.isAuthenticated();
  res.locals.isFav = false;
  res.locals.data = req.data;
  res.locals.err = req.flash("error");
  res.locals.success = req.flash("success");
  // console.log(
  //   `req.flash(error): ${req.flash("error")} req.flash(success): ${req.flash(
  //     "success"
  //   )}`
  // );
  next();
});
