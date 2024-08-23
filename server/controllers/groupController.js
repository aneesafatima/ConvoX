const catchAsync = require("../utils/catchAsync.js");
const Group = require("../models/groupModel.js");
const User = require("../models/userModel.js");

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create({
    name: req.body.name,
    description: req.body.description,
    admin: req.user._id,
  });
  const groupMembers = req.body.groupMembers;
  console.log(groupMembers);
  groupMembers.map(async (member) => {
    await User.findByIdAndUpdate(member, { $push: { groupIds: group._id } });
  });

  res.status(201).json({
    status: "success",
    group,
  });
});
exports.getGroupMessages = catchAsync(async (req, res, next) => {
  // const groupMessages = Message

  res.status(201).json({
    status: "success",
    group,
  });
});
