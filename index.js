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
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const localsVeriables = require("./public/partials/middlewares/localsVeriables.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dB = "movieBooking";

if (process.env.NODE__ENV !== "production") {
  require("dotenv").config();
}
const checkingData = functions.checkingData;
const secret = process.env.SECRET || "someSecuredSecretHere";
const DB_URL = process.env.DB_URL || `mongodb://127.0.0.1:27017/${dB}`;
server.use(
  session({
    name: "serieSearcherSession",
    store: MongoStore.create({ mongoUrl: DB_URL }),
    secret,
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
server.use(mongoSanitize());
server.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

server.use(checkingData);
server.use(localsVeriables);
server.use("/", homeRouter);
server.use("/user", userRouter);
server.use("/myAccount", myAccountRouter);
server.use("/register", registerRouter);
server.use("/serie", serieRouter);
server.use("/topSeries", topSeriesRouter);
server.use("/:sub/:g", othersRouter);

server.all("*", (req, res, next) => {
  throw new ErrorApp("page not found", 404);
});

server.use(errHandler);
server.listen(port, () => {
  console.log("server works on port: ", port);
});
