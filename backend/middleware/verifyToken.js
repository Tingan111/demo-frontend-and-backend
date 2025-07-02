const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.status(401).json({ error: "缺少授權" });
  const token = bearerHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ error: "Token無效" });
  }
};

const verifyToken = require("./middleware/verifyToken");

app.get("/api/todos/secure", verifyToken, (req, res) => {
  res.json({ message: "你已登入", userId: req.userId });
});
