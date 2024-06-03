const mongoose = require("mongoose");
const connectToDb = async function () {
  try {
    mongoose
      .connect("mongodb+srv://Thasleem:XlVGj7YGmCifJlZ2@cluster0.pvkgqgd.mongodb.net/PlaShoe")
      .then(() => console.log("Connected to database"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDb;
