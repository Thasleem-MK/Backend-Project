const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");
const createError = require('http-errors');
const { trycatch } = require("../utils/tryCatch")

const authentication = trycatch(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new createError.Unauthorized("You have no token, Login please..")
  }
  const decode = await jwt.verify(token, process.env.SecretKey);
  const user = await userSchema.find({ _id: decode.userId });
  if (!user) { throw new createError.Unauthorized("Invalid token") }
  console.log("Authenticated .")
  next();


})

module.exports = authentication;
