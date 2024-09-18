const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/errorHandler");
const multer = require("multer");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const fs = require("fs");
const path = require("path");
const sharpResizing = require("./sharpResizing");

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

exports.resizePhoto = catchAsync(async (req, res, next) => {
  let doc;
  if (!req.file) return next();
  const { id, type } = req.params;
  console.log(id, type);
  req.file.filename =
    type === "user"
      ? `user-${id}-${Date.now()}.jpeg`
      : `group-${id}-${Date.now()}.jpeg`;
  sharpResizing(`profiles`, req);

  if (type === "user") {
    doc = await User.findByIdAndUpdate(id, {
      photo: req.file.filename,
    });
  } else {
    doc = await Group.findByIdAndUpdate(id, {
      photo: req.file.filename,
    });
  }

  const photo = path.join(__dirname, `../public/img/profiles/${doc.photo}`);
  if (
    fs.existsSync(photo) &&
    doc.photo !== "default-user.jpeg" &&
    doc.photo !== "default-group.png"
  ) {
    fs.unlinkSync(photo);
  }
  res.status(200).json({
    status: "success",
    imageUrl: req.file.filename,
  });
});
