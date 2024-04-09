const userSchema = require("../Models/UserSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const createError = require('http-errors');

// ......................User Registeration............................

// => Joi validation

const joiSchema = joi.object({
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
  const data = req.body;

  const validationResult = await joiSchema.validate(data);
  if (validationResult.error) {
    const errorMessage = validationResult.error.details[0].message;
    throw new createError.Unauthorized(errorMessage);
  };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await userSchema.create({
    userName: data.userName,
    email: data.email,
    password: hashedPassword,
  });
  res.send("You are registered");
}

//................User Login................................

const userLogin = async (req, res) => {
  const data = req.body;
  const user = await userSchema.findOne({
    $or: [{ userName: data.userId }, { email: data.userId }],
  });
  if (!user) {
    throw new createError.NotFound("User not found!!");
  }
  const isPasswordMatch = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatch) { throw new createError.BadRequest("Password mismatch") }
  const key = process.env.SecretKey;
  const token = jwt.sign(
    { userId: user._id, userName: user.userName },
    key,
    {
      expiresIn: "1h",
    }
  );
  res.cookie("token", token);
  res.status(200).send("Loged in successfully");
};

module.exports = { userRegister, userLogin };