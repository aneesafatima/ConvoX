const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  name: {
    type: String,
    required: [true, "A group must have a name"],
  },
  description: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Group = new mongoose.model("Group", groupSchema);

module.exports = Group;