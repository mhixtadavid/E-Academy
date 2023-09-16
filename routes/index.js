var express = require("express");
var router = express.Router();
var passport = require("passport");
var path = require("path")
var User = require("../models/user");
var Image = require("../models/image");
var nodemailer = require("nodemailer");
const flash = require("connect-flash");
const { getMaxListeners } = require("../models/user");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        const id  = Date.now();
        const filePath = `${id}${ext}`
        Image.create({ filePath })
        .then(function(){
            cb(null, filePath)
        });        
    }
});
var upload = multer({storage: storage});

router.get("/", function(req, res){
    res.render("home");
});

router.get("/courses", function(req, res){
    res.render("courses")
});

router.get("/dashboard", function(req, res){
    res.render("dashboard")
})

router.get("/terms", function(req, res){
    res.render("terms")
});

//contact routes
router.get("/contact", function(req, res){
    res.render("contact")
});

router.post("/contact", function(req, res){
 // create reusable transporter object using the default SMTP transport
 const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kingdavidoshin@gmail.com',
      pass: 'oluwakemi112' // naturally, replace both with your real credentials or an application-specific password
    }
  });
  
  const mailOptions = {
    from: req.body.Email,
    to: "kaydeeacademyonline@gmail.com",
    subject: req.body.Subject,
    text:  req.body.message + ". " + req.body.Name + ", " + req.body.Email
  };
  
  transporter.sendMail(mailOptions, function(error, info, next){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    
    }
  });
  res.render("contact");
});

router.get("/register", function(req, res){
    res.render("register");
});

//HANDLING SIGN UP (REGISTER)
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    var newUser2 = new User({email: req.body.email});
    User.register(newUser, newUser2, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Your Best Online Academy " + user.username);
            res.redirect("/home");
        });
    });
});

//HANDLING SIGN IN (LOGIN)
router.get("/login", function(req, res){
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res, next){
    req.logout();
    req.flash("success", "Logout Successful!");
    res.redirect("home");
});

module.exports = router;