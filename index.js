const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

//IMport routes
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Conencted to databvase")
);

//middleware

app.use(express.json());

//routes

app.use("/api/user", authRoute);
app.use("/api/post", postRoute);
app.listen(3000, () => console.log("Server up and running"));
