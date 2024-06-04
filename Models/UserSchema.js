const { string } = require("joi");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profileImg: String,
  accountCreatedDate: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
}
);

module.exports = mongoose.model("UserDatas", userSchema);
