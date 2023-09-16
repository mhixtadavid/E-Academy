var express = require("express");
var router = express.Router({mergeParams: true});
var Course = require("../models/courses");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// COURSE ROUTES

router.get("/course-new", function(req, res){
    //find courses by id
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
        } else {
            res.render("comments/course-new", {course: course});
        }
    })
});

router.post("/", function(req, res){
    //look up courses with id
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
            res.redirect("/courses");
        } else {
                //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to course
                    course.comments.push(comment);
                    course.save();
                    //redirect it to show page
                    req.flash("success", "Comment successful!");
                    res.redirect("/courses/" + course._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/course-edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        } else{
            res.render("comments/course-edit", {course_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/courses/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/courses/" + req.params.id)
        }
    });
});

// END OF COURSE

module.exports = router;