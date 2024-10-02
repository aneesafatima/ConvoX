const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const multer = require("multer");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
dotenv.config({ path: "./.env" });

//cloudinary config 

console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET)
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profiles', // Folder in Cloudinary where the images will be stored
    public_id : (req) => {
      const {type,id} = req.params
     return type === "user"
      ? `user-${id}-${Date.now()}`
          : `group-${id}-${Date.now()}`;
    },
    format: 'jpeg', 
    transformation: [{ width: 600, height: 600, crop: 'limit' }], // Optional image transformation
  },
});

// const multerStrorage = multer.memoryStorage();
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

const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadProfilePicture = upload.single("profile-picture");

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const { id, type } = req.params;
  if (type === "user") {
    doc = await User.findByIdAndUpdate(id, {
      photo: req.file.filename,
    });
  } else {
    doc = await Group.findByIdAndUpdate(id, {
      photo: req.file.filename,
    });
  }
  res.status(200).json({
    status: "success",
    imageUrl: req.file.filename,
  });
});
