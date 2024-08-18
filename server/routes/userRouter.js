const express = require("express");
const {
  logIn,
  signUp,
  logOut,
  protect,
  updateMyPassword,
  updateMe,
  deleteMe,
} = require("../controllers/authController");
const {
  getAllUsers,
  addUserContact,
  getUserContacts
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);
userRouter.use(protect);
userRouter.get("/", getAllUsers)
userRouter.route("/logout").get(logOut);
userRouter.route("/updateMyPassword").patch(updateMyPassword);
userRouter.route("/updateMe").patch(updateMe);
userRouter.route("/deleteMe/:userId").delete(deleteMe);
userRouter.post("/addUserContact", addUserContact)
userRouter.get("/userContacts", getUserContacts)

module.exports = userRouter;