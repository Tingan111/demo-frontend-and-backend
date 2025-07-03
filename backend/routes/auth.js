const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "註冊失敗", detail: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("接收到登入請求：", email, password); // 🔍 檢查輸入

    const result = await pool.query("SELECT * FROM users WHERE email =$1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(400).json({ error: "帳號不存在" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "密碼錯誤" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    console.error("登入錯誤：", err); // 🔥 錯誤訊息打印出來

    res.status(500).json({ error: "登入失敗", detail: err.message });
  }
});
module.exports = router;
