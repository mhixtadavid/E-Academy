const { json } = require("body-parser");

var express     = require("express");
    router      = express.Router(),
    mongoose    = require("mongoose"),
    path        = require("path"),
    Course      = require("../models/courses"),
    //Tutorial    = require("../models/tutorial"),
    middleware  = require("../middleware"),
    multer      = require("multer"),
    storage     = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/course_uploads")
    },
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        const id  = Date.now();
        const filePath = `${id}${ext}`
            cb(null, filePath);        
    }
});
var upload      = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 200
}});

router.get("/", function(req, res){
    res.render("courses/index")
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("courses/new")
})

router.post("/", upload.single("tutorial"), function(req, res){
    //get data from the form and add it to the course array
    var name        = req.body.name;
    var course      = req.body.course;
    var tutorial    = req.file;
    var price       = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };
    var newCourse = {name: name, course: course, tutorial: tutorial, price:price, description: description, author: author}
    //Create a new course and save to the database
    Course.create(newCourse, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            //redirect it page back to the blogs page
            res.redirect("courses/" + req.body.course);
        }
    });    
});

router.get("/Artificial-Intelligence", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Artificial-Intelligence"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Artificial-Intelligence", {courses: allCourses});
        }
    });
});

router.get("/Arts", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Arts"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Arts", {courses: allCourses});
        }
    });
});

router.get("/Back-End-Courses", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Back-End-Courses"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Back-End-Courses", {courses: allCourses});
        }
    });
});

router.get("/CSS-Courses", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "CSS-Courses"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/CSS-Courses", {courses: allCourses});
        }
    });
});

router.get("/Enterpreneurship", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Enterpreneurship"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Enterpreneurship", {courses: allCourses});
        }
    });
});

router.get("/E-Books", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "E-Books"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/E-Books", {courses: allCourses});
        }
    });
});

router.get("/External-Libraries", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "External-Libraries"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/External-Libraries", {courses: allCourses});
        }
    });
});

router.get("/HTML-Courses", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "HTML-Courses"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/HTML-Courses", {courses: allCourses});
        }
    });
});

router.get("/JavaScript-Courses", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "JavaScript-Courses"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/JavaScript-Courses", {courses: allCourses});
        }
    });
});

router.get("/Science", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Science"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Science", {courses: allCourses});
        }
    });
});

router.get("/Social-Science", middleware.isLoggedIn, function(req, res){

    //Get all courses from database
    Course.find({ "course" : "Social-Science"}, function(err, allCourses) {
        if(err){
            console.log(err)
        } else {
            res.render("courses/Social-Science", {courses: allCourses});
        }
    });
});

router.get("/:id", function(req, res){
    //find the course with the provided id
    Course.findById(req.params.id).populate("comments").exec(function(err, foundCourse){
        if(err){
            console.log(err)
        } else{
            //render the show template from the database
            res.render("courses/show", {course: foundCourse})
        }
    });
});

//EDIT COURSE ROUTE
router.get("/:id/edit", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, foundCourse){
        res.render("courses/edit", {course: foundCourse});
    });
});

//UPDATE COURSE ROUTE
router.put("/:id", middleware.checkCourseOwnership, function(req, res){
    // find and update the correct course
    Course.findByIdAndUpdate(req.params.id, req.body.course, req.file, function(err, updatedCourse){
        if(err){
            res.redirect("/courses");
        } else{
        //redirect somewhere(show page)
            res.redirect("/courses/" + req.params.id)
        }
    });
});

//DESTROY COURSE ROUTE
router.delete("/:id", middleware.checkCourseOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/courses")
        } else 
        req.flash("Success", "Course deleted successfully!");
        res.redirect("/courses")
    });
});

module.exports = router;