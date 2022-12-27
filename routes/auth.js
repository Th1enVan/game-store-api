const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

// REGISTER A USER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_ENCRYPT_KEY
    ),
  });

  try {
    const savedUser = await newUser.save();
    console.log(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Username is not valid!");

    const passwordHashed = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_ENCRYPT_KEY
    );

    const correctPassword = passwordHashed.toString(CryptoJS.enc.Utf8);

    if (correctPassword !== req.body.password) {
      res.status(401).json("Wrong username or password!");
    } else {
      res.status(201).json("Login Successfully");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
