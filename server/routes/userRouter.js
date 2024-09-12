const express = require("express");
const {
  logIn,
  signUp,
  logOut,
  protect,
} = require("../controllers/authController");
const {
  getAllUsers,
  addUserContact,
  getUserContacts,
  removeContactFromChats,
} = require("../controllers/userController");
const { uploadProfilePicture, resizePhoto } = require("../utils/fileUpload");
const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);
userRouter.post(
  "/updateProfilePicture/:type/:id",
  uploadProfilePicture,
  resizePhoto
);
userRouter.use(protect);
userRouter.get("/", getAllUsers);
userRouter.route("/logout").get(logOut);

userRouter.patch("/:type/addUserContact/:selectedUserId", addUserContact);
userRouter.get("/userContacts", getUserContacts);
userRouter.delete(
  "/removeContact/:type/:selectedUserId",
  removeContactFromChats
);

module.exports = userRouter;
