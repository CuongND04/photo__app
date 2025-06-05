require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

const sendToken = (user, statusCode, res) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret);
  res.cookie("token", token, { httpOnly: true });
  res.status(statusCode).json({
    token,
    user,
  });
};

module.exports = sendToken;
