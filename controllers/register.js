const { asyncWrap, ErrorApp } = require("../public/scripts/ErrorApp");
const { User } = require("../dataBase");
module.exports.registerForm = (req, res) => {
  const path = req.originalUrl;

  res.render("forms", {
    path,
    err: "",
    // success: req.flash("success"),
  });
};
module.exports.register = asyncWrap(async (req, res, next) => {
  const { password, username, mail } = req.body;
  const newUser = new User({
    username,
    mail,
  });
  const Registered = await User.register(newUser, password);
  await newUser.save();
  req.login(Registered, (err) => {
    if (err) return next(err);
    req.flash("success", "user succesfully Added");
    res.redirect("/myAccount");
  });
});
