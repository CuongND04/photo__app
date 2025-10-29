const jwt = require("jsonwebtoken");
const User = require("../db/userModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  req.user = user;
  next();

  // const decoded = jwt.verify(token, process.env.SECRET_KEY);
  // const user = await User.findById(decoded.id);
  // if (!user) {
  //   return res.status(404).json({
  //     message: "User not found",
  //   });
  // }
  // req.user = user;
  // next();
};

module.exports = isAuthenticated;
