const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role === "U" || decoded.role === "A") {
      console.log(decoded.role);
      console.log(decoded.id);
      req.userData = decoded;
      next();
    } else {
      return res.status(401).json({
        message: "UnAuthorize Access!!",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
