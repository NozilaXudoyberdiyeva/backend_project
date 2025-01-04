const express = require("express");
const router = express.Router();
const Products = require("./../models/products");
const autenticate = require("./../middleware/auth");

router.get("/products", async (req, res) => {
  try {
    let { page = 1, limit = 100, price1, price2, color } = req.query;

    let query = {};
    if (price1 && price2) {
      query.price = { $gte: parseFloat(price1), $lte: parseFloat(price2) };
    }
    if (color) {
      query.color = color;
    }

    let skip = (page - 1) * limit;
    limit = parseInt(limit);

    let all = await Products.find(query).skip(skip).limit(limit);

    res.status(200).send(all);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    let product = await Products.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/products", autenticate, async (req, res) => {
  try {
    let product = new Products({
      name: req.body.name,
      price: req.body.price,
      color: req.body.color,
    });
    await product.save();
    res.status(200).send({
      message: "Product created successfully",
      product: product,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.put("/products/:id", autenticate, async (req, res) => {
  try {
    let product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      lean: true,
    });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({
      message: "Product updated successfully",
      product: product,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.delete("/products/:id", autenticate, async (req, res) => {
  try {
    let product = await Products.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Deleted product",
      product: product,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
