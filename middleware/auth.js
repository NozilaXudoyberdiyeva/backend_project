const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, "Nozila");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid token." });
  }
};

module.exports = auth;
