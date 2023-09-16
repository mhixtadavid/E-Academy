var Blog = require("../models/blogs");
var Comment = require("../models/comment");
var Course = require("../models/courses");

//All the middleware being refactored goes here

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                req.flash("error", "Blog not found!");
                res.redirect("back")
            } else {
                //check if the current user owns th blog
                if(foundBlog.author.id.equals(req.user._id)){
                    next();                }
            }
        });
            } else {
                req.flash("error", "Permission denied!")
                res.redirect("back")
            }
        };

middlewareObj.checkCourseOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Course.findById(req.params.id, function(err, foundCourse){
            if(err){
                req.flash("error", "Course not found!");
                res.redirect("back")
            } else {
                //check if the current user owns the course
                if(foundCourse.author.id.equals(req.user._id)){
                    next();                }
            }
        });
            } else {
                req.flash("error", "Permission denied!")
                res.redirect("back")
            }
        };

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            } else {
                //check if the current user owns th blog
                if(foundComment.author.id.equals(req.user._id)){
                    next();  
                } else {
                    req.flash("error", "Permission denied!");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Permission denied!");
        res.redirect("back")
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login!");
    res.redirect("/login");
};

module.exports = middlewareObj