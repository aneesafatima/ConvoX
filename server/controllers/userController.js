const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});
exports.addUserContact = catchAsync(async (req, res, next) => {
  const { selectedUserId, type } = req.params;
  console.log(req.body);
  const user = await User.findById(req.user._id);
  if (type === "personal") {
    if (user.contacts.includes(selectedUserId))
      return next(new ErrorHandler("User is already in your contacts", 400));

    await User.findByIdAndUpdate(req.user._id, {
      $push: { contacts: selectedUserId },
    });

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { contacts: req.user._id },
    });
  } else {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { groupIds: req.body.groupId },
    });
  }
  res.status(200).json({
    status: "success",
  });
});

exports.getUserContacts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate([
    { path: "contacts" },
    { path: "groupIds" },
  ]);
  res.status(200).json({
    status: "success",
    contactUsers: user.contacts,
    groups: user.groupIds,
  });
});
exports.removeContactFromChats = catchAsync(async (req, res, next) => {
  const { id, type } = req.params;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { [type]: id },
  });
  res.status(200).json({
    status: "success",
  });
});
