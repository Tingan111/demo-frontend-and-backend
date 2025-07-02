require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const port = 4000;
const pool = require("./db");
pool
  .connect()
  .then(() => console.log("✅ 資料庫連線成功"))
  .catch((err) => console.error("❌ 資料庫連線失敗", err));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", authRoutes);

app.post("/api/todos/create", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text 欄位是必要的" });
    const result = await pool.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("新增失敗", err.message);
    res.status(500).json({ error: "新增失敗" });
  }
});

app.get("/api/todos/read", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(result.rows);
});
app.delete("/api/todos/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE id= $1", [id]);
    res.json({ success: true, message: "刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

app.put("/api/todos/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todos SET text= $1 WHERE id =$2 RETURNING *",
      [text, id]
    );
    res.json({ success: true, todo: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
