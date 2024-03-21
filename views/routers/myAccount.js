const express = require("express");
const Router = express.Router();
const { User, Movie, Review } = require("../../dataBase");
const {
  asyncWrap,
  ErrorApp,
  searcherValidator,
} = require("../../public/scripts/ErrorApp");
const {
  myAccountRenderGet,
  serialSearcherPanel,
  myAccountSettings,
  logOut,
  removeAccount,
  updateAccountForm,
  updateAccount,
  commentsShower,
  commnetsUpdateForm,
  commentsUpdate,
  commentsDelete,
  addToFavourite,
  deleteFromFavourite,
} = require("../../controllers/myAccount");

Router.get("/", myAccountRenderGet);
Router.post("/", searcherValidator, serialSearcherPanel);
Router.get("/settings", myAccountSettings);
Router.post("/logout", logOut);
Router.get("/remove", removeAccount);
Router.get("/update", updateAccountForm);
Router.patch("/update", updateAccount);
Router.get("/comments", commentsShower);
Router.get("/comments/:id/update", commnetsUpdateForm);
Router.post("/comments/:id/update", commentsUpdate);
Router.delete("/comments/:id/delete", commentsDelete);

Router.get("/favourites/:id", addToFavourite);

Router.get("/favourites/delete/:id", deleteFromFavourite);

module.exports = Router;
