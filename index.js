const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();

const PORT = 8000;

//Middleware-Plugin

app.use(express.urlencoded({extended: false}));

app.use((req,res,next)=>{
  fs.appendFile("log.txt", `\n${Date.now()}: ${req.ip}: ${req.method}: ${req.path}`,(err,data)=>{
    next();

  });
});

// ROUTES

app.get("/api/users", (req,res)=>{
  return res.json(users);
});

app.get("/users",(req,res)=>{
  const HTML = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>`;
  res.send(HTML);
});

app.get("/api/users/:id",(req,res)=>{
  const id = Number(req.params.id);
  const user = users.find((user)=>user.id === id);
  return res.json(user);
});

app.post("/api/users",(req,res)=>{
  const body = req.body;
  users.push({...body, id : users.length+1});
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
    return res.json({status : "success" , id : users.length});
  });
});

app.listen(PORT,()=>{
  console.log(`Server started at Port ${PORT}`);
});