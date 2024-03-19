const express = require("express");
const Router = express.Router();
const { User } = require("../../dataBase");

Router.get("/", (req, res) => {
  const path = req.path;
  res.render("forms", {
    myAccount,
    countries,
    genres,
    path,
    err: "",
    success: "",
  });
});
Router.get(
  "/favourite/:id",
  asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    // res.send(`name: ${name}, password: ${userpassword} serial id: ${id}`);
    const [owner] = await User.find({ name, password: userpassword });
    const data = req.data;
    const [serial] = data.filter((element) => {
      // console.log(
      //   `element._id == id ${element._id}==${id}-->${
      //     element._id == id
      //   } typeof element._id: ${typeof element._id} typeof id: ${typeof id} `
      // );
      return element._id == id;
    });
    if (owner && serial) {
      // console.log(
      //   `owner: ${owner} serial: ${serial} serial id: ${serial._id} owner favMoies: ${owner.favMovies}`
      // );
      if (typeof owner.favMovies == "undefined") {
        owner.favMovies = [];
        // owner.favMovies[0] = serial._id; <-- that is 1 vrsion when favMovies stored strings now there is stored objectId  so we store whole serial to populate it when needed:
        owner.favMovies[0] = serial;

        await owner.save();
      } else if (!owner.favMovies.includes(serial._id)) {
        // owner.favMovies.push(serial._id); <--first version now:
        owner.favMovies.push(serial);

        console.log(`serial with id ${serial._id} added to array favMovies`);
        await owner.save();
      } else {
        console.log(
          `serial with id ${serial._id} is already in array favMovies`
        );
      }
      res.redirect("/myAccount");
    } else {
      // next(new ErrorApp());
      throw new ErrorApp();
    }
  })
);
Router.get(
  "/:name",
  asyncWrap(async (req, res, next) => {
    // console.log(`params: ${req.params.name}`);
    name = req.params.name;
    if (userpassword && name) {
      const password = userpassword;

      // console.log(`password: ${password}`);
      const [userData] = await User.find({ name, password });
      if (userData) {
        const data = req.data;
        myAccount = true;

        res.render(`index`, {
          countries,
          genres,
          fullName: userData.name,
          data,
          userData,
          myAccount,
          isFaV: "",
          success: "",
          err: "",
        });
      } else {
        throw new ErrorApp(
          "such user doesn't exist try to log in once again",
          400,
          "forms"
        );
      }
      // console.log(`path: ${req.path}`);
    } else {
      // const message = "you are unauthorised";
      // const data = req.data;
      // res.render("error", { countries, genres, message, data });
      throw new ErrorApp("such page doesn't exist", 500);
    }
  })
);

Router.post(
  "/",
  userFormValidator,
  asyncWrap(async (req, res, next) => {
    const { user } = req.body;
    const { password, username } = user;
    // if (password && username) {
    const [userExist] = await User.find({ name: username, password });
    // userExist
    //   ? console.log("user Exist: ", userExist.name)
    //   : console.log("such user doesnt exist");
    if (userExist) {
      // req.name = userExist.name;
      name = userExist.name;
      userpassword = userExist.password;
      // console.log(`name ${req.name} password: ${userpassword}`);
      res.redirect(`/user/${userExist.name}`);
    } else {
      throw new ErrorApp("your userdata are incorrect", 401, "forms");
    }
  })
);
