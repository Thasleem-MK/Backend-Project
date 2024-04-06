const adminSchema = require("../Models/AdminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");

// Joi validation for admin registeration
const joiSchema = joi
  .object({
    username: joi.string().required().alphanum(),
    email: joi.string().required().email(),
    password: joi
      .string()
      .required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  })
  .options({ abortEarly: false });

// Admin login
const getAdmin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const admin = await adminSchema.findOne({
      $or: [{ username: userId }, { email: userId }],
    });
    if (!admin) {
      return res.status(404).send("Admin not found!");
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (isPasswordMatch) {
      const token = jwt.sign(
        { username: admin.username, email: admin.email },
        process.env.AdminKey,
        {
          expiresIn: "1h",
        }
      );
      res
        .status(200)
        .cookie("token", token)
        .json({ status: "success", message: "Successfully logged in" });
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong");
  }
};

//Admin Signup

const postAdmin = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.AdminKey);
    const { username, email, password } = req.body;

    const newAdmin = { username: username, email: email, password: password };
    const validate = await joiSchema.validate(newAdmin);
    if (validate.error) {
      return res.status(401).json({});
    } else {
      return res
        .status(401)
        .send(
          "Password must contain 8 characters include a character and a number"
        );
    }
  } catch (error) {
    console.log(error);
    res.send("Either existing or incomplete input");
  }
};

//Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const data = req.body;
    const status = await adminSchema.find({
      id: data.id,
      email: data.email,
      password: data.password,
    });
    console.log(status);
    if (status.length != 0) {
      await adminSchema
        .deleteOne({
          id: data.id,
          email: data.email,
          password: data.password,
        })
        .then(() => res.send("Delete admin successfully"))
        .catch((error) => {
          console.log(error);
          res.send("No admin found !!");
        });
    } else {
      res.send("No admin found!!");
    }
  } catch (error) {
    console.log(error);
    res.send("No admin found!!");
  }
};

module.exports = { getAdmin, postAdmin, deleteAdmin };
