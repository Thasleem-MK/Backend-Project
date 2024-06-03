const express = require("express");
const usersRoute = require("./Routes/User");
const adminRoute = require("./Routes/Admin");
const dbConnect = require("./config/dbConnection");
const cors = require("cors");
const dotenv = require("dotenv");
const cookie_Parser = require("cookie-parser");
const errorHandler = require("./Middlewares/errorHandler");

const app = express();

dotenv.config({ path: "./config/.env" });
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookie_Parser());

app.use("/api", adminRoute);
app.use("/api", usersRoute);



dbConnect();

app.use(errorHandler)

app.listen(7000, () =>
  console.log(`Server connected in the server Number : 7000`)
);
