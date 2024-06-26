const productSchema = require('../Models/ProductSchema');
const userSchema = require('../Models/UserSchema');
const orderSchema = require('../Models/ordersSchema');
const cartSchema = require('../Models/cartSchema');
const createError = require('http-errors');
const joi = require('joi')
const cloudinary = require('cloudinary').v2;

//.......... Joi validation ...........
const joiSchema = joi.object({
  title: joi.string().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: joi.string().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty'
  }),
  gender: joi.string().messages({
    'string.base': 'Gender must be a string'
  }),
  category: joi.string().messages({
    'string.base': 'Category must be a string'
  }),
  price: joi.number().messages({
    'number.base': 'Price must be a number'
  }),
  image: joi.string().messages({
    'string.base': 'Image URL must be a string'
  })
});


//.......... Get Users ..............
const getUsers = async (req, res) => {
  const users = await userSchema.find({}, "-__v");
  if (users.length === 0) { throw new createError.NotFound("No users found") };
  return res.status(200).send(users);
};

//........... Get a user by Id .............
const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await userSchema.findById(id);
  if (!user) { throw new createError.NotFound("No user found please try again") };
  return res.status(200).send(user)
}

//............ Get user cart ..................
const readCart = async (req, res) => {
  const { id } = req.params;
  const userCart = await cartSchema.findOne({ userId: id }).populate("cart.product");
  if (!userCart || userCart.cart.length === 0) {
    return res.status(200).send("No items found in the cart!");
  }
  return res.status(200).json(userCart.cart);
};

//........ Get Orders .................
const orders = async (req, res) => {
  const { id } = req.params;
  const userOrders = await orderSchema.find({ userId: id }).populate({
    path: "products.productId",
    select: "title image price",
  });
  res.json(userOrders);
}


//............. Get all products .........................
const getProducts = async (req, res) => {
  const products = await productSchema.find({}, "-__v");
  if (products.length === 0) {
    return res.status(200).send("No Product are available");
  };
  return res.status(200).send(products);
};

//................ Get product by category ...................
const getProductCategory = async (req, res) => {
  const category = req.query.category;
  const products = await productSchema.find(
    {
      $or: [
        { gender: { $regex: new RegExp(category, "i") } }, //make case-insensitive
        { category: { $regex: new RegExp(category, "i") } }
      ]
    },
    "-__v"
  );

  if (products.length === 0) {
    throw new createError.NotFound("No item in the given category");
  }
  res.status(200).send(products);
}

//....... Get a product by id ................
const getproduct = async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findById(id);
  if (!product) { throw new createError.NotFound("No item found") };
  res.status(200).send(product);
}

//....... Add product ..................
const addProduct = async (req, res, next) => {

  try {
    const data = req.body;
    console.log("Add product", data);
    if (req.cloudinaryImageUrl) { data.image = req.cloudinaryImageUrl };
    // data.image = req.cloudinaryImageUrl;
    const validate = await joiSchema.validate(data);
    if (validate.error) {
      const errorMessage = validate.error.details[0].message;
      return next(new createError.BadRequest(errorMessage));
    }
    const newProduct = await new productSchema({
      title: data.title,
      ...(data.description && { description: data.description }),
      gender: data.gender,
      category: data.category,
      price: data.price,
      image: data.image,
    });
    await newProduct.save();
    next();
    res.status(201).send("New product added");
  } catch (error) {
    next(error);
  }
};

//.............. Update Products ...................
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { error } = joiSchema.validate(data, { allowUnknown: true });
  if (error) {
    throw new createError.BadRequest(error.details[0].message);
  }
  const product = await productSchema.findById(id);
  if (!product) {
    throw new createError.NotFound("No product found with the given ID");
  }
  if (req.file) {
    product.image = req.cloudinaryImageUrl;
  }

  // Update only the fields provided in the body
  Object.keys(data).forEach(key => {
    if (key !== 'image') {
      product[key] = data[key];
    }
  });

  await product.save();
  return res.status(200).send("Product updated successfully");
}

//............... Delete Product ...................
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await productSchema.findByIdAndDelete(id);
  if (!product) { throw new createError.NotFound("Product not found in the given Id") };
  return res.status(200).send("Product deleted successfully");
}

//............... Get Status ...................
const status = async (req, res) => {
  let orderDetails = [];
  const productDetails = await orderSchema.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalQuantity: { $sum: "$products.quantity" }
      }
    },
  ]);
  if (productDetails.length === 0) { return res.status(200).send("No ordered items") };

  await Promise.all(productDetails.map(async (items) => {
    const product = await productSchema.findById(items._id, "-__v");
    const { title, description, gender, category, price, image } = product;
    orderDetails.push({ title, description, gender, category, price, image, totalQuantity: items.totalQuantity, totalRevenue: price * items.totalQuantity });
  }));

  return res.status(200).json({
    status: 'success',
    message: 'Successfully fetched stats.',
    data: orderDetails,
  });
}

//................ Oreders ...................
const orderProducts = async (req, res) => {
  const orders = await orderSchema.find({}, "-__v");
  if (orders.length === 0) {
    return res.status(200).send("No orders");
  }
  res.json({
    status: 'success',
    message: 'Successfully fetched order detail.',
    data: orders
  })
}

//....... Complete Order .........................
const orderComplete = async (req, res) => {
  const { id } = req.params;
  const order = await orderSchema.findByIdAndDelete(id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.status(200).json({ message: "Order deleted successfully" });
}


module.exports = { getUsers, getUser, readCart, orders, orderComplete, getProducts, getProductCategory, getproduct, addProduct, updateProduct, deleteProduct, status, orderProducts };