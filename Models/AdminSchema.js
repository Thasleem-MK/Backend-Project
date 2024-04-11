const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model("AdminDatas", adminSchema);
