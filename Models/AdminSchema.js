const mongoose = require("mongoose");
const admingLoginSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    unique: true,
    required: true,
    maxLength: 8,
    minLength: 8,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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
});

module.exports = mongoose.model("AdminData", admingLoginSchema);
