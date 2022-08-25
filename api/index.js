const express = require("express");
const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const app = express();
const firebase = require("./config/db");
require("dotenv").config();
const productSchema = require("./models/products");

const PORT = process.env.PORT | 4000;

app.use(bodyParser());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    method: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json("Success");
});
app.post("/product", async (req, res) => {
  const validate = productSchema.validate(req.body);
  console.log(req.body);

  if (validate.error) res.status(400).send(product.error);

  const product = validate.value;
  console.log(product)

  await firebase.firestore().collection("products").add({
    title: product.title,
    description: product.description,
    price: product.price,
    colors: product.colors,
    sizes: product.sizes,
    img: product.image,
  });

  res.status(201).json("New Product Added");
});
app.use("/products", productsRoutes);

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
