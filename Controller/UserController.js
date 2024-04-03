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
    const data = await productSchema.find({},'-__v');
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(404).send("No products found");
  }
};

//show products by id

const userProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSchema.findById(id,'-__v');
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
    },'-__v');
    res.status(201).send(products);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//add to cart
const addCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;
    const { token } = req.cookies;
    const decode = jwt.verify(token, process.env.SecretKey);
    console.log(`${decode.userId}`);

    if (userId == decode.userId) {
      const user = await userSchema.findById(userId);
      const productIndex = await user.cart.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        user.cart[productIndex].quantity += 1;
      } else {
        user.cart.push({ product: productId });
      }
      await user.save();

      res.send("Product add to cart successfully");
    } else {
      res.send("User ID mismatch");
    }
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//Read the cart

const readCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { token } = req.cookies;
    console.log(userId);
    const decode = jwt.verify(token, process.env.SecretKey);
    if (userId === decode.userId) {
      const user = await userSchema.findById(userId).populate("cart.product");
      // console.log(user.cart);
      res.json(user.cart);
    } else {
      res.send("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    res.send("Server error");
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
  readCart,
};