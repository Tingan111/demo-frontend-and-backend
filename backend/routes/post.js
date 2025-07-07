const express = require("express"); //
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

//新增文章
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever error");
  }
});

//取得所有文章
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT posts.*, posts.email FROM posts JOIN users ON posts.user_id= users.id ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Sever error");
  }
});
//取得單篇文章
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id=$1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).send("文章不存在");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Sever error");
  }
});

module.exports = router;
