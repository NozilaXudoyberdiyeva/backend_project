const express = require("express");
const mongoose = require("mongoose");
const ProductsRoute = require("./routes/products");
const CategoriesRoute = require("./routes/categories");
const UsersRouter = require("./routes/users");
const RegisterRouter = require("./routes/auth");
const app = express();
app.use(express.json());

const url =
  "mongodb+srv://nozilaxudoyberdiyeva:BHxlJ5mVJgUetRDp@cluster0.e46r8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log("Error", e);
  });

app.use(ProductsRoute);
app.use(UsersRouter);
app.use(RegisterRouter);
app.use(CategoriesRoute);
app.listen(3000, () => {
  console.log("Server started!");
});
