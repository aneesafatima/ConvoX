const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
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
  const user = await User.findById(req.user._id);
  const selectedUser = await User.findById(selectedUserId);
  if (type === "personal") {
    if (user.contacts.includes(selectedUserId))
      return next(new ErrorHandler("User is already in your contacts", 400));

    await User.findByIdAndUpdate(req.user._id, {
      $push: { contacts: selectedUserId },
    });
    if (!selectedUser.contacts.includes(user._id))
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
  const user = await User.findById(req.user._id)
    .populate([{ path: "contacts" }, { path: "groupIds" }])
    .select("-passwordConfirm");
  res.status(200).json({
    status: "success",
    contactUsers: user.contacts
      .concat(user.groupIds)
  });
});
exports.removeContactFromChats = catchAsync(async (req, res, next) => {
  const { selectedUserId, type } = req.params;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { [type]: selectedUserId },
  });
  res.status(200).json({
    status: "success",
  });
});
