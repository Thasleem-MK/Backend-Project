const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("productData", productSchema);
