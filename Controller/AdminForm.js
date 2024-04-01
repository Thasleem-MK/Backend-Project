const adminSchema = require("../Models/AdminSchema");

const getAdmin = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const users = await adminSchema.find({ email: data.email });
    if (users.length == 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    console.log(error);
  }
};

const postAdmin = async (req, res) => {
  try {
    const data = req.body;
    await adminSchema.create({
      name: data.name,
      id: data.id,
      email: data.email,
      password: data.password,
    });
    res.send("New admin details added successfully");
  } catch (error) {
    console.log(error);
    res.send("The given data either existed or incomplete");
  }
};

const deleteAdmin = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.send("No admin found!!");
  }
};

module.exports = { getAdmin, postAdmin, deleteAdmin };
