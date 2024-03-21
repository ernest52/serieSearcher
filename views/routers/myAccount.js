const express = require("express");
const Router = express.Router();
const { searcherValidator } = require("../../public/scripts/ErrorApp");
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

Router.route("/")
  .get(myAccountRenderGet)
  .post(searcherValidator, serialSearcherPanel);
Router.route("/update").get(updateAccountForm).patch(updateAccount);
Router.route("/comments/:id/update")
  .get(commnetsUpdateForm)
  .post(commentsUpdate);

// Router.get("/", myAccountRenderGet);
// Router.post("/", searcherValidator, serialSearcherPanel);
Router.get("/settings", myAccountSettings);

Router.get("/favourites/:id", addToFavourite);
Router.get("/favourites/delete/:id", deleteFromFavourite);
Router.get("/comments", commentsShower);
// Router.get("/update", updateAccountForm);
// Router.patch("/update", updateAccount);

// Router.get("/comments/:id/update", commnetsUpdateForm);
// Router.post("/comments/:id/update", commentsUpdate);
Router.post("/logout", logOut);
Router.delete("/comments/:id/delete", commentsDelete);
Router.delete("/remove", removeAccount);

module.exports = Router;
