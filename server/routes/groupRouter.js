const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createGroup,
  exitGroup,
  removeGroupMember,
  getGroupMembers,
  deleteGroup,
} = require("../controllers/groupController");
const groupRouter = express.Router();
groupRouter.use(protect);
groupRouter.post("/", createGroup);
groupRouter.patch("/:groupId", deleteGroup);
groupRouter.post("/exit-group", exitGroup);
groupRouter.get("/:groupId/members", getGroupMembers);
groupRouter.delete("/removeGroupMember/:groupId/:userId", removeGroupMember);

//http://localhost:5000/api/groups/removeGroupMember/66cb3c5180db5545aee911b4/66c5e9d9e00e710a48cd079c

module.exports = groupRouter;
