const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(value);
      },
      message: "Invalid email adress",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(value);
      },
      message:
        "Password should have 8 characters and contain atleast a letter and a digit ",
    },
  },
  profileImg: String,
  accountCreatedDate: {
    type:Date,
    default: Date.now(),
    immutable: true,
  },
  wishList: [],
  cart: [],
  orders: [],
});
// userSchema.pre({})
module.exports = mongoose.model("UserDatas", userSchema);
