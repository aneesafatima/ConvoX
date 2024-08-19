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
