const express = require("express");
const router = express.Router();
const Products = require("./../models/products");
const autenticate = require("./../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/products",
  autenticate,
  upload.single("image"),
  async (req, res) => {
    const { name, price, color, category } = req.body;
    let product = new Products({
      name,
      price,
      color,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    try {
      await product.save();
      res.status(200).send({
        message: "Product created successfully",
        product: product,
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

router.get("/products", async (req, res) => {
  try {
    let { page = 1, limit = 100, price1, price2, color, category } = req.query;

    let query = {};
    if (price1 && price2) {
      query.price = { $gte: parseFloat(price1), $lte: parseFloat(price2) };
    }
    if (color) {
      query.color = color;
    }
    if (category) {
      query.category = category;
    }

    let skip = (page - 1) * limit;
    limit = parseInt(limit);

    let all = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .populate("category");

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

router.put(
  "/products/:id",
  autenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      // Yangilanish uchun ma'lumotlarni yig'ish
      const updatedData = { ...req.body };

      // Fayl mavjud bo'lsa, image fieldni yangilash
      if (req.file) {
        updatedData.image = `/uploads/${req.file.filename}`;
      }

      let product = await Products.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          lean: true,
        }
      );

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
  }
);

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
