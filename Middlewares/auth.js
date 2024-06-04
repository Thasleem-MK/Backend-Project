const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");
const adminSchema = require('../Models/AdminSchema');
const createError = require('http-errors');
const { trycatch } = require("../utils/tryCatch")

//.............. User Authentication ........................
const userAuthentication = trycatch(async (req, res, next) => {
  console.log("User Authentication");
  const { token } = req.cookies;
  if (!token) {
    return res.redirect(`/api/users/refresh-token?originalUrl=${req.originalUrl}`);
  }
  const decode = await jwt.verify(token, process.env.SecretKey);
  const user = await userSchema.find({ _id: decode.userId });
  if (!user) { throw new createError.Unauthorized("Invalid token") }
  console.log("Authenticated .")
  next();
})

//.............. Admin Authentication ......................
const adminAuthentication = trycatch(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.redirect(`/api/admins/refresh-token?originalUrl=${req.originalUrl}`);
  }
  const decode = await jwt.verify(token, process.env.AdminKey);
  const admin = await adminSchema.find({ username: decode.username });
  if (!admin) { throw new createError.Unauthorized("Invalid token") }
  console.log("Authenticated .")
  next();
})

module.exports = { userAuthentication, adminAuthentication }
