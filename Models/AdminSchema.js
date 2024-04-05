const mongoose = require("mongoose");

const admingLoginSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
    // validate: {
    //   validator: function (value) {
    //     const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //     return emailRegex.test(value);
    //   },
    //   message: "Invalid email adress",
    // },
  },
  password: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("AdminDatas", admingLoginSchema);
