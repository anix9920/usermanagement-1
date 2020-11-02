const express = require('express')
const fs = require('fs')
const app = express()
var dateFormat = require("dateformat");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.json());
app.use(express.static("views"));
// app.set('view-engine','ejs')
app.get("/", (req, res) => {
    var time = dateFormat(new Date(), "ddd , mmm d yyyy h:MM TT");

  res.render("index.ejs", { time: time });
});

app.get("/createUser", (req, res) => {
   var time = dateFormat(new Date(), "ddd , mmm d yyyy h:MM TT");

  res.render("CreateUser.ejs", { time: time });
});

app.get("/editUser", (req, res) => {
    var time = dateFormat(new Date(), "ddd , mmm d yyyy h:MM TT");
    var user = req.query.usr.trim();
  res.render("EditUser.ejs", { user: user, time: time });
});
app.post("/addUser", (req, res) => {
//   console.log(req.body.firstName);
    const db = JSON.parse(fs.readFileSync("db.json"));
    user = req.body;
    var found = false;
    var users=[]
    if(db.users){
       users = db.users
      for(let i of users){
          if (user.userName === i.userName) {
            found = true
            break;
          }
        //   console.log("i is: ", i.userName);
      }
    }
    if (!found) {
        users.push(user);
        db.users = users;
        var data = JSON.stringify(db, null, 2);
        fs.writeFileSync("db.json", data, function done() {
          console.log("done");
          
        });
         res.jsonp(user.userName + " user Added");
    }else{
        // console.log('User alredy exist...');
         res.jsonp(user.userName +" user alredy exist...");
    }
   

});

app.post("/editUser", (req, res) => {
  //   console.log(req.body.firstName);
  const db = JSON.parse(fs.readFileSync("db.json"));
  user = req.body;
  var found = false;
  var users = [];
  if (db.users) {
    users = db.users;
     for (let i = 0; i < users.length; i++) {
       // console.log(users[i]);
       if (user.userName === users[i].userName) {
         found = true;
         users.splice(i, 1);
         found = true;
         break;
       }
       //   console.log("i is: ", i.userName);
     }
  }
  if (found) {
    users.push(user);
    db.users = users;
    var data = JSON.stringify(db, null, 2);
    fs.writeFileSync("db.json", data, function done() {
      console.log("done");
    });
    res.jsonp(user.userName + " user edited");
  } else {
    // console.log('User alredy exist...');
    res.jsonp(user.userName + " user alredy exist...");
  }
});

app.post("/removeUser", (req, res) => {
  const db = JSON.parse(fs.readFileSync("db.json"));
  userName = req.body.userName;
  var found = false;
  var m=0;
  var users = [];
  if (db.users) {
    users = db.users;
    for (let i = 0; i < users.length; i++) {
        // console.log(users[i]);
      if (userName === users[i].userName) {
        found = true;
        users.splice(i, 1);
        // console.log(m, "=>  is: ", i);
        //  delete users[i];
        break;
      }
      //   m++;
    }
  }
  if (found) {
    // users.push(user);
    db.users = users;
    var data = JSON.stringify(db, null, 2);
    //  console.log(data)
    fs.writeFileSync("db.json", data, function done() {
     
    });
      res.jsonp(userName + " user removed sussfully...");
  } else {
    console.log("User Not exist...");
  }
  
// res.redirect('localhost:3000');
});
app.get('/data',(req,res)=>{
    let db = JSON.parse(fs.readFileSync("db.json"));
    res.json(db)
})
// console.log(db.roles[3])
app.listen(3000,function(){
    console.log("Application is running on http://localhost:3000")
})