const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const cartSchema = require('../Models/cartSchema');
const wishlistSchema = require('../Models/wishlistSchema');
const orderSchema = require('../Models/ordersSchema');
const jwt = require("jsonwebtoken");
const createError = require('http-errors');

//............ show products to users ...............
const userProducts = async (req, res) => {
  const data = await productSchema.find({}, "-__v");
  if (!data) throw new createError.NotFound("No product in store")
  res.status(200).send(data);
};

//............... show products by id ....................
const userProductById = async (req, res) => {
  const { id } = req.params;
  if (!await productSchema.findById(id)) {
    throw new createError.NotFound("No product in given id");
  }
  const product = await productSchema.findById(id, "-__v");
  res.status(200).send(product);
};

//............... show products by category ..................
const userProductByCategory = async (req, res) => {
  const { categoryname } = req.params;
  const products = await productSchema.find(
    {
      $or: [{ gender: categoryname }, { category: categoryname }],
    },
    "-__v"
  );
  if (products.length === 0) {
    throw new createError.NotFound("No item in the given category");
  }
  res.status(200).send(products);
};


//................ add to cart ........................
const addCartItems = async (req, res) => {
  const { productId } = req.body;
  const { token } = req.cookies;
  const decode = jwt.verify(token, process.env.SecretKey);

  const user = await cartSchema.findOne({ userId: decode.userId });

  if (!user) {
    const newCart = new cartSchema({
      userId: decode.userId,
      cart: [{ product: productId }]
    })
    await newCart.save();
    return res.status(200).send("Product add to cart successfully");
  }

  const productIndex = await user.cart.findIndex(
    (item) => item.product.toString() === productId
  );
  if (productIndex !== -1) {
    user.cart[productIndex].quantity += 1;
  } else {
    user.cart.push({ product: productId });
  }
  await user.save();
  res.status(200).send("Product add to cart successfully");
};

//................ Read the cart .............................
const readCart = async (req, res) => {
  const { token } = req.cookies;
  const decode = jwt.verify(token, process.env.SecretKey);
  const user = await cartSchema.findOne({ userId: decode.userId });
  if (!user) {
    console.log("dklsfj");
    return res.status(200).json({ message: "No item in your cart" });

  }
  res.status(200).json(user.cart);
};

//............. Add to wishList ....................
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
