const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");
const multer = require("multer");
const User = require("../models/userModel");
const sharpResizing = require("../utils/sharpResizing");

const multerStrorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler("Not an image! Please upload only images.", 400),
      false
    );
  }
};



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
  const activeGroupIds = user.groupIds.filter((el) => el.active);
  res.status(200).json({
    status: "success",
    contactUsers: user.contacts
      .concat(activeGroupIds)
      .sort((a, b) => a.timestamp - b.timestamp),
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
