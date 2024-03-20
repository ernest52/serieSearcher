const { asyncWrap, ErrorApp } = require("../public/scripts/ErrorApp");
const { User } = require("../dataBase");
module.exports.LogInForm = (req, res) => {
  const path = req.path;
  res.render("forms", {
    path,
    err: req.flash("error"),
    // success: req.flash("success"),
  });
};
module.exports.LogInPost = asyncWrap(async (req, res, next) => {
  const [userExist] = await User.find({ _id: req.user._id });

  if (userExist) {
    req.flash("success", "Succesfully logged in");

    res.redirect(`/user/${userExist.username}`);
  } else {
    throw new ErrorApp("your userdata are incorrect", 401, "forms");
  }
});

module.exports.addFav = asyncWrap(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;
    // res.send(`name: ${name}, password: ${userpassword} serial id: ${id}`);
    const [owner] = await User.find({ _id: req.user._id });
    const data = req.data;
    const [serial] = data.filter((element) => {
      return element._id == id;
    });
    if (serial) {
      if (!owner.favMovies.includes(serial._id)) {
        owner.favMovies.push(serial);
        await owner.save();
      }
      req.flash("success", `Serial: "${serial.name}" added to you favourite`);
      res.redirect("/myAccount");
    } else {
      throw new ErrorApp();
    }
  } else {
    throw new ErrorApp("You are not authorised to see this page", 500);
  }
});

module.exports.LogInGet = asyncWrap(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const [userData] = await User.find({ _id: req.user._id });
    if (userData) {
      res.render(`index`, {
        fullName: userData.username,
        userData,
        // success: req.flash("success"),
        err: "",
      });
    } else {
      throw new ErrorApp(
        "such user doesn't exist try to log in once again",
        400,
        "forms"
      );
    }
  } else {
    throw new ErrorApp("such page doesn't exist", 500);
  }
});
