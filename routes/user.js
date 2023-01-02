const User = require("../models/User");
const { verifyTokenWithAuthorization, verifyToken } = require("./verifyToken");
const CryptoJS = require("crypto-js")

const router = require("express").Router();

// UPDATE A USER
router.put("/:id", verifyTokenWithAuthorization, async (req, res) => {
  console.log("true");
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_ENCRYPT_KEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE A USER (Admin Only)
router.delete("/:id", verifyTokenWithAuthorization, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(`Deleted User: ${deletedUser.username}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// FIND A USER (Admin Only)
router.get(":/id", verifyToken, async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
