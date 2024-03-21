const express = require("express");
const { User } = require("./dataBase");
const functions = require("./public/scripts/functions.js");
const port = 3000;
const path = require("path");
const { default: mongoose } = require("mongoose");
const methodOverride = require("method-override");
const server = express();
const ejsMate = require("ejs-mate");
const userRouter = require("./views/routers/user.js");
const myAccountRouter = require("./views/routers/myAccount.js");
const registerRouter = require("./views/routers/register.js");
const serieRouter = require("./views/routers/serie.js");
const topSeriesRouter = require("./views/routers/topSeries.js");
const othersRouter = require("./views/routers/others.js");
const homeRouter = require("./views/routers/home.js");
const { ErrorApp, errHandler } = require("./public/scripts/ErrorApp.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const localsVeriables = require("./public/partials/middlewares/localsVeriables.js");
// let success = false;
const checkingData = functions.checkingData;
server.use(
  session({
    name: "serieSearcherSession",
    secret: "alongsecret aside",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //for a week
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
server.use(passport.initialize());
server.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
server.use(flash());
server.engine("ejs", ejsMate);
server.set("view engine", "ejs");
server.set("views", path.join(__dirname + "/views"));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(express.urlencoded({ extended: true }));

server.use(checkingData);
server.use(localsVeriables);
server.use("/", homeRouter);
server.use("/user", userRouter);
server.use("/myAccount", myAccountRouter);
server.use("/register", registerRouter);
server.use("/serie", serieRouter);
server.use("/topSeries", topSeriesRouter);
server.use("/:sub/:g", othersRouter);

// -----------
//home
//-----------
// server.get("/", (req, res) => {
//   res.redirect("/home");
// });

// server.get("/home", (req, res) => {
//   // const data = req.data;

//   res.render("index", {
//     // success: req.flash("success"),
//     err: req.flash("error"),
//   });
//   // success = success ? false : success;
// });
// ----------------
// user
// ----------------

// server.get("/user", (req, res) => {
//   const path = req.path;
//   res.render("forms", {
//     path,
//     err: req.flash("error"),
//     // success: req.flash("success"),
//   });
// });
// server.get(
//   "/user/favourite/:id",
//   asyncWrap(async (req, res, next) => {
//     const { id } = req.params;
//     // res.send(`name: ${name}, password: ${userpassword} serial id: ${id}`);
//     const [owner] = await User.find({ _id: req.user._id });
//     const data = req.data;
//     const [serial] = data.filter((element) => {
//       return element._id == id;
//     });
//     if (owner && serial) {
//       if (typeof owner.favMovies == "undefined") {
//         owner.favMovies = [];
//         // owner.favMovies[0] = serial._id; <-- that is 1 vrsion when favMovies stored strings now there is stored objectId  so we store whole serial to populate it when needed:
//         owner.favMovies[0] = serial;

//         await owner.save();
//       } else if (!owner.favMovies.includes(serial._id)) {
//         owner.favMovies.push(serial);

//         console.log(`serial with id ${serial._id} added to array favMovies`);
//         await owner.save();
//       } else {
//         console.log(
//           `serial with id ${serial._id} is already in array favMovies`
//         );
//       }
//       res.redirect("/myAccount");
//     } else {
//       throw new ErrorApp();
//     }
//   })
// );
// server.get(
//   "/user/:name",
//   asyncWrap(async (req, res, next) => {
//     if (req.isAuthenticated()) {
//       const [userData] = await User.find({ _id: req.user._id });
//       if (userData) {
//         res.render(`index`, {
//           fullName: userData.username,
//           userData,
//           // success: req.flash("success"),
//           err: "",
//         });
//       } else {
//         throw new ErrorApp(
//           "such user doesn't exist try to log in once again",
//           400,
//           "forms"
//         );
//       }
//     } else {
//       throw new ErrorApp("such page doesn't exist", 500);
//     }
//   })
// );
// server.post(
//   "/user",
//   userFormValidator,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/user",
//   }),
//   asyncWrap(async (req, res, next) => {
//     const [userExist] = await User.find({ _id: req.user._id });

//     if (userExist) {
//       req.flash("success", "Succesfully logged in");

//       res.redirect(`/user/${userExist.username}`);
//     } else {
//       throw new ErrorApp("your userdata are incorrect", 401, "forms");
//     }
//   })
// );
// -----------------------
// myAccount
//-----------------------

//
// -------------------
//register
//--------------------

// server.get("/register", (req, res) => {
//   const path = req.path;

//   res.render("forms", {
//     path,
//     err: "",
//     // success: req.flash("success"),
//   });
// });
// server.post(
//   "/register",
//   registerFormValidator,
//   asyncWrap(async (req, res) => {
//     const { password, username, mail } = req.body;
//     const newUser = new User({
//       username,
//       mail,
//     });
//     await User.register(newUser, password);
//     await newUser.save();
//     req.flash("success", "user succesfully Added");
//     res.redirect("/home");
//   })
// );
//---------------
// serie
//---------------
// server.get(
//   "/serie/:id",
//   asyncWrap(async (req, res) => {
//     const data = req.data;
//     const [serial] = data.filter((element) => {
//       return element._id == req.params.id;
//     });
//     if (serial) {
//       const genresofserial = serial.genres;
//       // console.log(`genres: `, genres);
//       let serials = [];
//       genresofserial.forEach((genre) => {
//         data.forEach((element) => {
//           if (element.genres.includes(genre) && element.name !== serial.name) {
//             serials.push(element);
//           }
//         });
//       });
//       let isFav = false;
//       if (req.isAuthenticated()) {
//         const [userData] = await User.find({ _id: req.user._id });
//         isFav = userData.favMovies.includes(serial._id);
//       }
//       res.render("simple", {
//         serial,
//         serials,

//         isFav,
//       });
//     } else {
//       throw new ErrorApp();
//     }
//   })
// );
// server.get(
//   "/serie/:id/addComment",
//   asyncWrap(async (req, res) => {
//     if (req.isAuthenticated()) {
//       res.render("forms", {
//         comment: "",
//         path: "addComment",
//         id: req.params.id,
//         err: "",
//         // success: req.flash("success"),
//       });
//     } else {
//       throw new ErrorApp("unauthorized enter", 500);
//     }
//   })
// );
// server.post(
//   "/serie/:id/addComment",
//   reviewValidator,
//   asyncWrap(async (req, res) => {
//     if (req.isAuthenticated()) {
//       // const {id,owner}
//       const { id } = req.params;

//       const { note, body } = req.body;
//       const serial = await Movie.findById(id);
//       // const creator = await User.findById(owner);
//       const [creator] = await User.find({ _id: req.user._id });

//       const newReview = new Review({ user: creator, note, body, serial });
//       creator.comments.push(newReview);
//       serial.reviews.push(newReview);
//       await creator.save();
//       await serial.save();
//       await newReview.save();

//       req.flash("success", "Your comment was added");
//       res.redirect("/myAccount");
//     } else {
//       throw new ErrorApp("Something went wrong", 500, "index");
//     }
//   })
// );
// server.get(
//   "/serie/:id/comments",
//   asyncWrap(async (req, res) => {
//     const { id } = req.params;
//     const serial = await Movie.findById(id);
//     if (serial) {
//       const comments = await Review.find({ serial: id });
//       if (comments.length) {
//         const users = await Review.find({ serial: id }).populate("user");
//         res.render("reviews-side", {
//           users,
//           comments,
//           serial,
//         });
//       } else {
//         req.flash(
//           "error",
//           `Error: There is no comments for this serial. Be the first One and put one in! :) status: 500 `
//         );
//         res.render("index", {
//           // success: req.flash("success"),
//           err: req.flash("error"),
//         });
//       }
//     } else {
//       throw new ErrorApp("Serial not found", 500);
//     }
//   })
// );

// ----------------
//others
//------------------
// server.get("/topSeries", (req, res) => {
//   let data = req.data;
//   // data.sort();
//   data = data.sort((a, b) => b.score - a.score);

//   const subpage = "Top Series";

//   res.render("subpage", { data, subpage });
// });
// server.get(
//   "/:sub/:g",
//   asyncWrap(async (req, res) => {
//     const endpoint = req.params.sub;
//     // console.log(`endpoint: ${endpoint}`);
//     if (endpoint == "country" || endpoint == "genre") {
//       let isElement;
//       let search = endpoint == "country" ? "country" : "genres";
//       if (endpoint == "country") {
//         isElement = countries.includes(req.params.g);
//       } else {
//         isElement = genres.includes(req.params.g);
//       }

//       if (isElement) {
//         const subpage = req.params.g;
//         const data = await Movie.find({ [search]: subpage });
//         res.render("subpage", {
//           data,
//           subpage,
//         });
//       } else {
//         throw new ErrorApp("page not found", 404);
//       }
//     } else {
//       throw new ErrorApp("page not found", 404);
//     }
//   })
// );
server.all("*", (req, res, next) => {
  throw new ErrorApp("page not found", 404);
});

server.use(errHandler);
server.listen(port, () => {
  console.log("server works on port: ", port);
});
