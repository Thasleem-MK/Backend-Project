const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const cartSchema = require('../Models/cartSchema');
const wishlistSchema = require('../Models/wishlistSchema');
const orderSchema = require('../Models/ordersSchema');
const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const stripeID = require('stripe')("sk_test_51P5UXZSBDzdy1QTWpNIKtArSEQbiMZjfYDYU9jovotYhHLQ3psaq6zDz5aM9IEGcA2LNgHSqOk8M6E5i9sa2OjuI002nxX88bZ");

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
      $or: [
        { gender: { $regex: new RegExp(category, "i") } },
        { category: { $regex: new RegExp(category, "i") } }
      ]
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
  if (!user || user.cart.length === 0) {
    return res.status(200).json({ message: "No item in your cart" });
  }
  return res.status(200).json(user.cart);
};

//............ Delete Cart ........................
const deleteCart = async (req, res) => {
  const { productId } = req.body;
  const { token } = req.cookies;
  const { userId } = jwt.verify(token, process.env.SecretKey);
  const user = await cartSchema.findOne({ userId: userId });
  if (!user) {
    throw new createError.NotFound("Item not found in your cart");
  }
  const productIndex = await user.cart.findIndex((item) => {
    return item.product.toString() === productId;
  });
  if (productIndex === -1) { throw new createError.NotFound("Item not found in your cart") }
  user.cart.splice(productIndex, 1);
  await user.save();
  return res.status(200).send("The specific item removed from cart");
}

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

//............ Order Cart item ................

const orderCart = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { userId } = jwt.verify(token, process.env.SecretKey);
    const cartData = await cartSchema.findOne({ userId: userId }, "-__v -_id -userId");
    if (!cartData || cartData.cart.length === 0) {
      return res.status(200).json({ message: "No items in your cart" });
    }

    const line_items = [];
    for (const cartItem of cartData.cart) {
      const product = await productSchema.findById(cartItem.product);
      if (!product) {
        throw new Error(`Product with ID ${cartItem.product} not found`);
      }
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }
    console.log(line_items);
    // Create Stripe session
    const session = await stripeID.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      line_items: line_items,
      success_url: 'http://localhost:7000/api/users/success',
      cancel_url: 'http://localhost:7000/api/users/cancel',
    });
    console.log(session.url);
    const sessionId = session.id;
    const sessionUrl = session.url;
    res.cookie("session", sessionId);
    res.send(`Click to pay: ${sessionUrl}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred while processing your request" });
  }
}

//......... Success message ................
const success = async (req, res) => {
  const { token, session } = req.cookies;
  const { userId } = jwt.verify(token, process.env.SecretKey);

  const cartData = await cartSchema.findOne({ userId: userId }, "-__v -_id -userId");
  const newOrder = new orderSchema({ userId: userId });
  // Populate order products
  for (const element of cartData.cart) {
    newOrder.products.push({ productId: element.product, quantity: element.quantity });
  }
  await newOrder.save();
  newOrder.orderId = session
  await newOrder.save();
  const newCart = await cartSchema.findOneAndUpdate({ userId: userId }, { $set: { cart: [] } });
  await newCart.save();
  return res.status(200).json({
    message: "Payment successful",
    orderId: newOrder._id,
    sessionId: session.id,
  });
}

const cancel = (req, res) => {
  return res.status(200).json({
    status: "Success",
    message: "Payment cancelled"
  })
}

//export modules
module.exports = {
  userProducts,
  userProductById,
  userProductByCategory,
  addCartItems,
  readCart,
  deleteCart,
  addToWishList,
  readWishList,
  deleteWishItem,
  orderCart,
  success,
  cancel,
};