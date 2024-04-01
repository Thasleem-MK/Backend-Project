const express = require("express");
const mongoose = require("mongoose");
const route = require("./Routes/Admin");
const dbConnect = require("./config/dbConnection");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(route);
app.use(cors({origin:"http://localhost:3000"}));

dbConnect();

app.listen(7000, () =>
  console.log(`Server connected in the server Number : 7000`)
);
