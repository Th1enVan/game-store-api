const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
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

    const correctedPassword = passwordHashed.toString(CryptoJS.enc.Utf8);

    if (correctedPassword !== req.body.password) {
      res.status(401).json("Wrong username or password!");
    } else {
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: "4d" }
      );

      // Take the user props excepting password
      const { password, ...others } = user._doc;
      res.status(201).json({...others, accessToken});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
