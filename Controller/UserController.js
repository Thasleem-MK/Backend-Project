const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
// const userSchema = require("../Models/UserSchema");

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
    res.status(404).send("No products found");
  }
};

//show products by id

const userProductById = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await productSchema.find({ title: name });
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(404).send("No item found");
  }
};

//show products by category

const userProductByCategory = async (req, res) => {
  try {
    const { categoryname } = req.params;
    const products = await productSchema.find({
      $or: [{ gender: categoryname }, { category: categoryname }],
    });
    res.status(201).send(products);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//add to cart
const addCartItems = async (req, res) => {
  try {
    const { userName } = req.params;
    const { itemName } = req.body;
    // await userSchema.updateOne()
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//export modules
module.exports = {
  userRegister,
  userLogin,
  userProducts,
  userProductById,
  userProductByCategory,
  addCartItems,
};
