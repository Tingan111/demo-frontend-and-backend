const express = require("express");
const router = express.Router();
const bcypt = require("bcypt");
const pool = ".../db";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash=await bcypt.hash(password,10);
    const result=await pool.query(
      "INSERT INTO user (email, password) VALUES ($1, $2) RETURNING id, email",
      [email,hash]
    );
    res.status(201).json({user:result.row[0]});
  }catch(err){
    res.status(500).json({error:"註冊失敗",detail:err.message});
  }
});

module.export=router;
