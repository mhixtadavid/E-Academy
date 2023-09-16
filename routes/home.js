var express = require("express");
var router = express.Router();
var middleware = ("../middleware");

router.get("/", function(req, res){
    res.render("home")
});

router.post("/", function(req, res){
    res.render("home");
});

module.exports = router;