const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

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
const upload = multer({ storage: multerStrorage, fileFilter: multerFilter });

exports.uploadProfilePicture = upload.single("profile-picture");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const userId = req.params.userId;
  req.file.filename = `user-${userId}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  const user = await User.findByIdAndUpdate(userId, {
    photo: req.file.filename,
  });
  const photo =  path.join(__dirname, `../public/img/users/${user.photo}`);  
  console.log(photo);
  if(fs.existsSync(photo) && user.photo !== "default.png")
    fs.unlinkSync(photo);
  res.status(200).json({
    status: "success",
    imageUrl: req.file.filename,
  });
});

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
  console.log(user)
  if (type === "personal") {
    if (user.contacts.includes(selectedUserId))
      return next(new ErrorHandler("User is already in your contacts", 400));

    await User.findByIdAndUpdate(req.user._id, {
      $push: { contacts: selectedUserId },
    });
   if(!selectedUser.contacts.includes(user._id))
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
  const { selectedUserId, type } = req.params;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { [type]: selectedUserId },
  });
  res.status(200).json({
    status: "success",
  });
});
