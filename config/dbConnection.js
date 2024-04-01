const mongoose = require("mongoose");
const connectToDb = async function () {
  try {
    mongoose
      .connect("mongodb://localhost:27017/PLASHOE")
      .then(() => console.log("Connected to database"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDb;
