const express = require("express");
const port = 3001;
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.get("/api/posts", (req, res) => {
  const posts = [
    { id: 1, title: "第一篇文章", content: "這是內容1" },
    { id: 2, title: "第二篇文章", content: "這是內容1" },
  ];
  res.json(posts);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  