const mongoose = require("mongoose");

const userCart = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDatas",
    required: true,
    unique:true,
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductData",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],

});

module.exports = mongoose.model("CartItems", userCart);
