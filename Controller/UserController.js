const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//user Login
const userLogin = async (req, res) => {
  try {
    const data = req.body;
    const user = await userSchema.findOne({
      $or: [{ userName: data.userId }, { email: data.userId }],
    });
    console.log(user);
    if (!user) {
      return res.status(404).send("User not exist!");
    }

    if (data.password === user.password) {
      // const key = crypto.randomBytes(32).toString("hex");
      const key = process.env.SecretKey;
      console.log(key);
      const token = jwt.sign(
        { userId: user._id, userName: user.userName },
        key,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token);
      res.status(200).send("Loged in successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

//user registeration
const userRegister = async (req, res) => {
  try {
    const data = req.body;
    await userSchema.create({
      userName: data.userName,
      email: data.email,
      password: data.password,
    });
    res.send("You are registered");
  } catch (error) {
    console.log(error);
    res.send("The given data is already exist !! ");
  }
};

//show products to users

const userProducts = async (req, res) => {
  try {
    const data = await productSchema.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(404).send("No products");
  }
};

//export modules
module.exports = { userRegister, userLogin, userProducts };
