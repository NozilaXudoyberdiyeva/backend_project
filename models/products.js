const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: { type: String },
});

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products;
