const express = require("express");
const { protect } = require("../controllers/authController");
const { createGroup } = require("../controllers/groupController");
const groupRouter = express.Router();
groupRouter.use(protect)
groupRouter.post("/", createGroup);

//delete group functioanlity by admins


module.exports = groupRouter;
