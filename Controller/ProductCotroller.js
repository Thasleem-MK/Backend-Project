const productSchema = require("../Models/ProductSchema");

const addProduct = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await productSchema.create({
      title: data.title,
      ...(data.description && { description: data.description }),
      gender: data.gender,
      category: data.category,
      price: data.price,
      image: data.image,
    });
    res.status(200).send("The product added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server side Error");
  }
};

module.exports = { addProduct };
