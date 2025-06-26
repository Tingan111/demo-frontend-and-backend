const express = require("express");
const cors = require("cors")
const {Pool} =require("pg")
require('dotenv').config();
const app=express();
const port=4000;

const pool=new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(cors());
app.use(express.json());

app.post("/api/todos/create",async (req,res)=>{
  try{const { text } =req.body;
  if(!text) return res.status(400).json({error:"text 欄位是必要的"})
  const result = await pool.query("INSERT INTO todos (text) VALUES ($1) RETURNING *",[text]);
  res.json(result.rows[0])
}catch(err){
  console.error("新增失敗",err.message);
  res.status(500).json({ error:"新增失敗"});
  }
});

app.get("/api/todos/read",async(req,res)=>{
  const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(result.rows);
})


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

