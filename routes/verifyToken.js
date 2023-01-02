const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    // Remove the Bearer from the authHeader
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        res.status(403).json("token is not valid! Please login again.");
      }
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("Not authenticated yet! Please login.");
  }
};

// Verify if user have the same id or user is an Admin
const verifyTokenWithAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(401).json("Cannot edit user.");
    }
  });
};

const verifyTokenWithAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not an admin to delete a user.");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenWithAuthorization,
  verifyTokenWithAdmin,
};
