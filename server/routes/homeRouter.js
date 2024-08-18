const express = require("express");
const { protect } = require("../controllers/authController");
const User = require( "../models/userModel" );
const homeRouter = express.Router();
homeRouter.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id)
  res.status(200).json({
    status: "success",
    user
  });
});

module.exports = homeRouter;
