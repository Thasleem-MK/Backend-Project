const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

//show products to users

const userProducts = async (req, res) => {
  try {
    const data = await productSchema.find({}, "-__v");
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
    const product = await productSchema.findById(id, "-__v");
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
    const products = await productSchema.find(
      {
        $or: [{ gender: categoryname }, { category: categoryname }],
      },
      "-__v"
    );
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
      res.json(user.cart);
    } else {
      res.send("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    res.send("Server error");
  }
};

//Add to wishList

const addToWishList = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const { token } = req.cookies;
    const { userId } = jwt.verify(token, process.env.SecretKey);
    if (id === userId) {
      const user = await userSchema.findById(userId);
      const productIndex = await user.wishList.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex !== -1) {
        res.send("Product is already exist in your wishList");
      } else {
        user.wishList.push({ product: productId });
        await user.save();
        res.send("Product added to your wishlist");
      }
    } else {
      res.send("The given userId is wrong");
    }
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//Get the wishlist of user

const readWishList = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const { userId } = jwt.verify(token, process.env.SecretKey);
    if (id === userId) {
      const user = await userSchema.findById(id).populate("wishList.product");
      res.json(user.wishList);
    } else {
      res.send("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//delete products from wishlist

const deleteWishItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const { token } = req.cookies;
    const { userId } = jwt.verify(token, process.env.SecretKey);
    console.log(userId);
    if (id === userId) {
      const user = await userSchema.findById(id);
      const productIndex = await user.wishList.findIndex((item) => {
        return item.product.toString() === productId;
      });
      if (productIndex !== -1) {
        user.wishList.splice(productIndex, 1);
        user.save();
        res.send("The specific item removed from wishlist");
      } else {
        res.send("Item not found in your wishlist");
      }
    } else {
      res.send("Somthing went wrong");
    }
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
};

//export modules
module.exports = {
  // userRegister,
  // userLogin,
  userProducts,
  userProductById,
  userProductByCategory,
  addCartItems,
  readCart,
  addToWishList,
  readWishList,
  deleteWishItem,
};
