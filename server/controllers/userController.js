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
  const user = await User.findById(req.user._id);
  if(user.contacts.includes(req.body.userContacted)){
   return next(new ErrorHandler("User is already in your contacts", 400));}
  await User.findByIdAndUpdate(req.user._id, {
    $push: { contacts: req.body.userContacted },
  });
  await User.findByIdAndUpdate(req.body.userContacted, {
    $push: { contacts: req.user._id },
  });
  res.status(200).json({
    status: "success"
  })
});


exports.getUserContacts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate([{path: "contacts"}, {path: "groupIds"}]);
  res.status(200).json({
    status: "success",
    contactUsers : user.contacts,
    groups: user.groupIds
  });
});
