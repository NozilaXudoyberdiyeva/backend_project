const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  color: String,
  description: String,
  //   category: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Category",
  //   },
});

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products;
