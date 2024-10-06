const catchAsync = require("../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const multer = require("multer");
const uuid = require("uuid");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
dotenv.config({ path: "./.env" });

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer

//Profiles
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles", // Folder in Cloudinary where the images will be stored
    public_id: (req) => {
      const { type, id } = req.params;
      return type === "user"
        ? `user-${id}-${Date.now()}`
        : `group-${id}-${Date.now()}`;
    },
    format: "jpeg",
    transformation: [{ width: 600, height: 600, crop: "limit" }], // Optional image transformation
  },
});

// const multerStrorage = multer.memoryStorage();
const multerProfileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler("Not an image! Please upload only images.", 400),
      false
    );
  }
};

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: multerProfileFilter,
});

exports.uploadProfilePicture = uploadProfile.single("profile-picture");

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

//Chats Media

const multerChatsFilter = (req, file, cb) => {
  const { type } = req.params;
  const allowedTypes =
    type === "image"
      ? null
      : [
          "msword",
          "vnd.openxmlformats-officedocument.wordprocessingml.document",
          "mp4",
          "mp3",
          "pdf",
        ];
  if (
    (type === "image" && file.mimetype.startsWith("image")) ||
    allowedTypes.includes(file.mimetype.split("/")[1])
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        `Wrong Format. Allowed Formats are : ${
          type === "image" ? "image" : ".doc, .docx, .pdf,.mp4, .mp3"
        }`,
        400
      ),
      false
    );
  }
};

const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const { type } = req.params;
    const mimeType = file.mimetype.split("/")[0];
    req.ext =
      mimeType === "image" || mimeType === "video"
        ? ""
        : `.${file.mimetype.split("/")[1]}`;
    return {
      folder: "chats", // Folder in Cloudinary where the files will be stored
      public_id:
        type === "image"
          ? `chat-${req.user._id}-${Date.now()}`
          : `${file.originalname.split(".")[0]}-${uuid.v1().replace(/-/g, "")}`,
      resource_type:
        type === "image"
          ? "image"
          : file.mimetype.startsWith("video")
          ? "video"
          : "raw", // Auto will let Cloudinary determine the resource type (image, video, raw)
      format: type === "image" ? "jpeg" : null,
      transformation:
        type === "image" ? [{ width: 400, height: 400, crop: "limit" }] : null, // Optional image transformation
    };
  },
});

const uploadChat = multer({
  storage: chatStorage,
  fileFilter: multerChatsFilter,
});

exports.uploadChatMedia = (req, res, next) => {
  const upload = uploadChat.single(
    req.params.type === "image" ? "photo-upload" : "file-upload"
  );
  upload(req, res, next);
};
