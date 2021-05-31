const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  const { email, username, phone, password } = req.fields;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      if (username && password && email) {
        const salt = uid2(64);
        const token = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        const newUser = new User({
          email: email,
          account: {
            username: username,
            phone: phone,
          },
          token: token,
          salt: salt,
          hash: hash,
        });
        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.status(400).json({ message: "Missing parameters" });
      }
    } else {
      res.status(409).json({ message: "This email already has an account" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    const user = await User.findOne({ email: email });
    if (user) {
      const newHash = SHA256(password + user.salt).toString(encBase64);
      if (newHash === user.hash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
