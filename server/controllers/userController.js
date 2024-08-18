const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});
exports.addUserContact = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.contacts.push(req.body.userContacted);
  await user.save();
  res.status(200).json({
    status: "success"
  })
});


exports.getUserContacts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("contacts");
  res.status(200).json({
    status: "success",
    contactUsers : user.contacts
  });
});
