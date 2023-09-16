var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//BLOGS COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find blogs by id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {blog: blog});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //look up blogs with id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
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
                    //connect new comment to the blog
                    blog.comments.push(comment);
                    blog.save();
                    //redirect it to show page
                    req.flash("success", "Comment successful!");
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        } else{
            res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

// END OF BLOG COMMENT

module.exports = router;