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
    const decode = jwt.verify(token, process.env.AdminKey);
    if (decode.username !== process.env.AdminUserName || decode.email !== process.env.AdminEmail) {
        throw new createError.Unauthorized("Can't add new admin")
    }
    const { userName, email, password } = req.body;
    const newAdmin = { username: userName, email: email, password: password };
    const validate = await joiSchema.validate(newAdmin);
    if (validate.error) {
        const errorMessage = validate.error.details[0].message;
        throw new createError.BadRequest(errorMessage);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminSchema.create({
        username: userName,
        email: email,
        password: hashedPassword,
    });
    res.status(201).send("New admin added");
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
        process.env.AdminKey,
        {
            expiresIn: "1h",
        }
    );
    res
        .status(200)
        .cookie("token", token)
        .json({ status: "success", message: "Logged in" });
};

//............... Delete Admin .................//
const deleteAdmin = async (req, res) => {
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
};

module.exports = { getAdmin, postAdmin, deleteAdmin };
