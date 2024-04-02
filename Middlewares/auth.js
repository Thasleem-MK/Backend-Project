const authentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return res.status(500).send("Please login..");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("User authentication Error");
  }
};

module.exports = authentication;
