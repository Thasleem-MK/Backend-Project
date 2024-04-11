//make in india 
const adminSchema = require("../Models/AdminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const createError = require('http-errors');

// Joi validation for admin registeration
const joiSchema = joi.object({
    username: joi.string().required().lowercase().messages({
        'string.empty': 'Username is required',
        'string.pattern.base': 'Username must contain only letters and numbers',
    }),
    email: joi.string().required().lowercase().email(),
    password: joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).messages({
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password should contain 8 characters of letters and numbers.No special characters allowed',
    }),
}).options({ abortEarly: false });


//............Add new Admin...................
const postAdmin = async (req, res) => {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SecretKey);
    if (decode.username !== process.env.AdminUserName || decode.email !== process.env.AdminEmail) {
        throw new createError.Unauthorized("Can't add new admin")
    }
    const { userName, email, password } = req.body;
    const adminDetails = { username: userName, email: email, password: password };
    const validate = await joiSchema.validate(adminDetails);
    if (validate.error) {
        const errorMessage = validate.error.details[0].message;
        throw new createError.BadRequest(errorMessage);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await adminSchema.create({
        username: userName,
        email: email,
        password: hashedPassword,
    });
    if (result) {
        res.status(201).send("New admin added");

    } else {
        res.status(400).json({ message: "error" })
    }
};

//............... Admin login .........................
const getAdmin = async (req, res) => {
    const { userId, password } = req.body;
    const admin = await adminSchema.findOne({
        $or: [{ username: userId }, { email: userId }],
    });
    if (!admin) {
        throw new createError.Unauthorized("User not found. Please check your userId ");
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) { throw new createError.Unauthorized("Incorrect password. Please try again.") }
    const token = jwt.sign(
        { username: admin.username, email: admin.email },
        process.env.SecretKey,
        {
            expiresIn: "1h",
        }
    );
    res
        .status(200)
        .cookie("token", token)
        .json({ status: "success", message: "Logged in" });
};

//............... Delete Admin .................
const deleteAdmin = async (req, res) => {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SecretKey);
    if (decode.username !== process.env.AdminUserName || decode.email !== process.env.AdminEmail) {
        throw new createError.Unauthorized("Can't add new admin")
    }
    const { userName, email } = req.body;
    const admin = await adminSchema.findOneAndDelete({
        username: userName,
        email: email,
    });
    if (admin === null) {
        throw new createError.NotFound("Admin not found");
    }
    return res.status(200).send("Admin deleted successfully");
};


module.exports = { getAdmin, postAdmin, deleteAdmin };
