const jwt = require("jsonwebtoken");
require("dotenv").config();
const authVerify = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log({ err });
    res.status(401).json({ success: false, message: "Uauthorized User!" });
  }
};

module.exports = { authVerify };
