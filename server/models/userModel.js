const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must confirm their password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  photo: {
    type: String,
    default: "default-user.jpg",
  },
  active: Boolean,
  contacts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  unreadMessages: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
      count: Number,
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    //hashing the password to secure
    this.passwordConfirm = undefined;
  }
  next();
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  console.log(this.passwordChangedAt);
  next();
});

UserSchema.methods.comparePasswords = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

UserSchema.methods.passwordChangedAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordTime = this.passwordChangedAt.getTime();
    console.log(passwordTime / 1000);
    return passwordTime / 1000 > jwtTimeStamp;
  }
  return false;
};

const User = new mongoose.model("User", UserSchema);

module.exports = User;
