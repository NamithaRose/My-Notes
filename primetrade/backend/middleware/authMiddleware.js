const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ msg: "No token provided" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId }
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
