require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

mongoose.connect('mongodb://localhost:27017/user_DB', { useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true,
   useFindAndModify: false}).then(()=>{
    console.log(`connection to database established`)
}).catch(err=>{
    console.log(`db error ${err.message}`);
    process.exit(-1)
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const userSchema = new mongoose.Schema({
email: String,
password: String
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['password']});

const userModel = mongoose.model("User", userSchema);



app.get("/", function(req, res){

res.render("home");
});

app.get("/login", function(req, res){

res.render("login");
});

app.get("/register", function(req, res){

res.render("register");
});


app.post("/register", function(req, res){

const userDetail = new userModel({
email: req.body.username,
password: req.body.password
});



userDetail.save(function(err){
  if(err) console.log(err);
  else res.render("secrets");
});
});


app.post("/login", function(req, res){
const usernameu  = req.body.usernamee;
const passwordp  = req.body.passwordd;

userModel.findOne({email: usernameu},function(err, foundresult){

  if(err) console.log(err);
  else if(foundresult.password === passwordp){
    if(foundresult.password === passwordp){
      res.render("secrets");
    }

  }
});
});

app.listen(3000, function(req, res){
  console.log("server started on port no 3000");
});
