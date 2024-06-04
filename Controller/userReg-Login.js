const userSchema = require("../Models/UserSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const createError = require('http-errors');
const { patch } = require("../Routes/User");

// ......................User Registeration............................

// => Joi validation

const joiSchema = joi.object({
  name: joi.string().required().messages({
    'string.empty': 'Name is required'
  }),
  email: joi.string().required().lowercase().email(),
  password: joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password should contain 8 characters of letters and numbers. No special characters allowed',
  }),
}).options({ abortEarly: false });

// =>User Registeration

const userRegister = async (req, res) => {
  console.log("userRegister");
  const data = JSON.parse(req.body.data);
  const validationResult = await joiSchema.validateAsync(data);

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new createError.Conflict("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = new User({
    ...data,
    password: hashedPassword,
    profileImg: req.cloudinaryImageUrl,
  });

  await newUser.save();

  res.status(201).json({ status: "Success", message: "You are registered" });
}

//................User Login................................

const userLogin = async (req, res) => {
  console.log("userLogin");
  const data = req.body;
  const user = await userSchema.findOne({ email: data.email }
  );
  if (!user) {
    throw new createError.NotFound("User not found. Please check your email.");
  }
  const isPasswordMatch = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatch) { throw new createError.BadRequest("Incorrect password. Please try again.") }
  const key = process.env.SecretKey;
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    key,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign({ userId: user._id, email: user.email },
    process.env.RefreshTokenSecret,
    {
      expiresIn: "7d",
    })
  res.cookie("token", accessToken, {
    expires: new Date(Date.now() + 10 * 60 * 1000),
    httpOnly: true,
    sameSite: "Strict",
    path: '/'
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
    path: '/',
  });
  res.status(200).send("Logged in successfully");
};

//............. Refresh Token ........................
const refresh = async (req, res) => {
  console.log("refresh");
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new createError.BadRequest("Login please!");
  }
  const decoded = jwt.verify(refreshToken, process.env.RefreshTokenSecret);
  const accessToken = jwt.sign(
    { userId: decoded.userId, email: decoded.email },
    process.env.SecretKey,
    {
      expiresIn: "10m",
    }
  );
  res.cookie("token", accessToken, {
    expires: new Date(Date.now() + 600 * 1000),
  }).send("New access token generated");
}

module.exports = { userRegister, userLogin, refresh };