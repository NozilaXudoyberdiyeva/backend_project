const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send({ message: "User created successfully", user: user });
  } catch (err) {
    res.status(400).send({ message: "Failed to create user" });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send({ error: "Invalid username" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send({ error: "Invalid password" });

  const token = jwt.sign({ _id: user._id }, "Nozila");
  res.send({ message: "Login succesful!", token: token });
});

module.exports = router;
