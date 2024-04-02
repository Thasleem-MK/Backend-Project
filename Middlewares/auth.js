const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");

const authentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(500).send("Please login..");
    }
    const decode = await jwt.verify(token, process.env.SecretKey);
    const user = await userSchema.find({ _id: decode.userId });
    if (user) {
      console.log("Authenticated .")
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("User authentication Error");
  }
};

module.exports = authentication;
