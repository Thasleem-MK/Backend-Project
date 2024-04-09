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
  const user = await cartSchema.findOne({ userId: decode.userId }).populate("cart.product");
  if (!user || !user.cart.length) {
    return res.status(200).json({ message: "No item in your cart" });
  }
  return res.status(200).json(user.cart);
};

//............. Add to wishList ....................
const addToWishList = async (req, res) => {
  const { productId } = req.body;
  const { token } = req.cookies;
  const { userId } = jwt.verify(token, process.env.SecretKey);

  const user = await wishlistSchema.findOne({ userId: userId });
  if (!user) {
    const newWishList = new wishlistSchema({
      userId: userId,
      wishList: [{ product: productId }]
    })
    await newWishList.save();
    return res.status(200).send("Product add to wishList successfully");
  }
  const productIndex = await user.wishList.findIndex(
    (item) => item.product.toString() === productId
  );
  if (productIndex !== -1) {
    throw new createError.BadRequest("Product is already exist in your wishList");
  } else {
    user.wishList.push({ product: productId });
    await user.save();
    return res.status(200).send("Product added to your wishlist");
  }
};

//.............. Get the wishlist of user ..................
const readWishList = async (req, res) => {
  const { token } = req.cookies;
  const { userId } = jwt.verify(token, process.env.SecretKey);
  const user = await wishlistSchema.findOne({ userId: userId }).populate("wishList.product");
  if (!user || !user.wishList.length) {
    return res.status(200).json({ message: "No item in your wish list" });
  }
  res.json(user.wishList);
};

//..........delete products from wishlist..............
const deleteWishItem = async (req, res) => {
  const { productId } = req.body;
  const { token } = req.cookies;
  const { userId } = jwt.verify(token, process.env.SecretKey);
  const user = await wishlistSchema.findOne({ userId: userId });
  if (!user) {
    throw new createError.NotFound("Item not found in your wishlist");
  }
  const productIndex = await user.wishList.findIndex((item) => {
    return item.product.toString() === productId;
  });
  if (productIndex !== -1) {
    user.wishList.splice(productIndex, 1);
    await user.save();
    res.status(200).send("The specific item removed from wishlist");
  } else {
    throw new createError.NotFound("Item not found in your wishlist");
  }

};

//export modules
module.exports = {
  userProducts,
  userProductById,
  userProductByCategory,
  addCartItems,
  readCart,
  addToWishList,
  readWishList,
  deleteWishItem,
};
