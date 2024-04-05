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
  },
  profileImg: String,
  accountCreatedDate: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  wishList: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductData",
      },
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductData",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  orders: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductData",
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
        immutable: true,
      },
    },
  ],
});

module.exports = mongoose.model("UserDatas", userSchema);
