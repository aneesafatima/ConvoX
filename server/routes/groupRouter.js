const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createGroup,
  removeGroupMember,
  getGroupMembers,
  deleteGroup,
  updateGroupName,
} = require("../controllers/groupController");
const { uploadProfilePicture, resizePhoto } = require("../utils/fileUpload");
const groupRouter = express.Router();
groupRouter.post(
  "/updateProfilePicture/:type/:id",
  uploadProfilePicture,
  resizePhoto
);
groupRouter.use(protect);
groupRouter.post("/", createGroup);
groupRouter.patch("/:groupId", deleteGroup);
groupRouter.get("/:groupId/members", getGroupMembers);
groupRouter.delete("/removeGroupMember/:groupId/:userId", removeGroupMember);
groupRouter.patch("/updateGroupName/:groupId", updateGroupName);

module.exports = groupRouter;
