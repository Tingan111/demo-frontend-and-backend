const jwt = require("jsonwebtoken");
const auth =  (req, res, next)=> {
const token = req.header("Authorization")?.replace("Bearer ","");

if (!token)return res.status(401).json({message: "未授權"});

try{
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  req.user= decoded;
  next();
}catch(err){
  res.status(401).json({message: "無效的token"});
}
};

module.exports =auth;