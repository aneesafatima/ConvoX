const express = require("express");
const { protect } = require("../controllers/authController");
const homeRouter = express.Router();
homeRouter.get("/", protect, (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

module.exports = homeRouter;
