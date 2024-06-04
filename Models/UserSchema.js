const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  profileImg: String,
  accountCreatedDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("UserDatas", userSchema);
