const express = require("express");
const Category = require("./../models/categories");
const router = express.Router();
const autenticate = require("./../middleware/auth");

router.get("/categories", async (req, res) => {
  try {
    let allCategories = await Category.find();
    res.status(200).send(allCategories);
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
});

router.post("/categories", autenticate, async (req, res) => {
  try {
    let category = new Category(req.body);
    await category.save();
    res.status(201).send({ message: "Create category", category });
  } catch {
    res.status(400).send({ error: "Invalid request" });
  }
});

router.put("/categories/:id", autenticate, async (req, res) => {
  try {
    let category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      lean: true,
    });
    if (!category)
      return res.status(404).send({ message: "Category not found!" });
    res.status(201).send({ message: "Category updated!", category });
  } catch (err) {
    res.status(401).send({ error: err.message });
    console.log(err);
  }
});

router.delete("/categories/:id", autenticate, async (req, res) => {
  try {
    let category = await Category.findByIdAndDelete(req.params.id);
    res.status(201).send({ message: "Category deleted", category });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
});

module.exports = router;
