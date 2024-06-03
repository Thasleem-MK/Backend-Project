const userSchema = require("../Models/UserSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const createError = require('http-errors');

// ......................User Registeration............................

// => Joi validation

const joiSchema = joi.object({
  name: joi.string().required().messages({
    'string.empty': 'Name is required'
  }),
  userName: joi.string().required().lowercase().messages({
    'string.empty': 'Username is required',
    'string.pattern.base': 'Username must contain only letters and numbers',
  }),
  email: joi.string().required().lowercase().email(),
  password: joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password should contain 8 characters of letters and numbers.No special characters allowed',
  }),
}).options({ abortEarly: false });

// =>User Registeration

const userRegister = async (req, res) => {
  const data = JSON.parse(req.body.data)
  console.log(data);
  const validationResult = await joiSchema.validate(data);
  if (validationResult.error) {
    const errorMessage = validationResult.error.details[0].message;
    throw new createError.BadRequest(errorMessage);
  };
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await userSchema.create({
    ...data,
    password: hashedPassword,
    profileImg: req.cloudinaryImageUrl,
  });
  res.status(201).json({ status: "Success", message: "You are registered" });
}

//................User Login................................

const userLogin = async (req, res) => {
  const data = req.body;
  const user = await userSchema.findOne({
    $or: [{ userName: data.userId }, { email: data.userId }],
  });
  if (!user) {
    throw new createError.NotFound("User not found. Please check your username or email.");
  }
  const isPasswordMatch = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatch) { throw new createError.BadRequest("Incorrect password. Please try again.") }
  const key = process.env.SecretKey;
  const accessToken = jwt.sign(
    { userId: user._id, userName: user.userName },
    key,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign({ userId: user._id, userName: user.userName },
    process.env.RefreshTokenSecret,
    {
      expiresIn: "7d",
    })
  res.cookie("token", accessToken, {
    expires: new Date(Date.now() + 60 * 10 * 1000)
  });
  
  res.cookie("refreshToken", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(200).send("Logged in successfully");
};

//............. Refresh Token ........................
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new createError.BadRequest("Login please!");
  }
  const decoded = jwt.verify(refreshToken, process.env.RefreshTokenSecret);
  const accessToken = jwt.sign(
    { userId: decoded.userId, userName: decoded.userName },
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