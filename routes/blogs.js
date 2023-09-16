const { json } = require("body-parser");

var express     = require("express"),
    router      = express.Router(),
    mongoose    = require("mongoose"),
    path        = require("path"),
    Blog        = require("../models/blogs"),
    Image       = require("../models/image"),
    middleware  = require("../middleware"),
    multer      = require("multer"),
    storage     = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/blog_uploads")
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
})
    upload      = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
}});

    

//in my hichat put a middleware here (...middleware.isLoggedIn...)
router.get("/", async function(req, res){
    var blogs = await Blog.find().sort({
      createdAt: "desc"
    })
    res.render("blogs/index", { blogs: blogs })
});

router.post("/", upload.single("image"), async function (req, res){
   var blog = new Blog ({
       name: req.body.name,
       description: req.body.description,
       markdown: req.body.markdown,
       author: {
           id: req.user._id,
           username: req.user.username
       }
   })
    try {
        blog = await blog.save()
        req.flash("success", "Blog posted successfully " + currentUser.username);
        res.redirect(`/blogs`)
    } catch (e) {
        console.log(e)
        req.flash("error", e);
        res.render("blogs/new", { blog: blog })
    }
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
});

router.get("/:slug", function(req, res){
    //find the blog with the provided id
    Blog.findOne({slug: req.params.slug}).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err)
        } else{
            //render the show template from the database
            res.render("blogs/show", {blog: foundBlog})
        }
    });
});

//EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog});
    });
});

//UPDATE BLOG ROUTE
// router.put("/:slug", middleware.checkBlogOwnership, function(req, res){
//     // find and update the correct blog
//     Blog.findOneAndUpdate({slug: req.params.slug}, req.body.blog, function(err, updatedBlog){
//         if(err){
//             res.redirect("/blogs");
//         } else{
//         //redirect somewhere(show page)
//             res.redirect(`/blogs/show`)
//         }
//     });
// });

router.put("/:id", middleware.checkBlogOwnership, async function(req, res, next) {
    req.blog = await Blog.findById(req.params.id)
    next()
 }, saveBlogAndRedirect("edit"))

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        } else 
        req.flash("Success", "Blog deleted successfully!");
        res.redirect("/blogs")
    });
});

function saveBlogAndRedirect(path){
    return async function(req, res){
        var blog = req.blog
            blog.title = req.body.title
            blog.description = req.body.description
            blog.markdown = req.body.markdown
        try {
            blog = await blog.save()
            res.flash("success", "Blog posted successfully " + currentUser.username)
            res.redirect(`/blogs/${blog.slug}`)
        } catch (e){
            res.flash("error", e)
            res.render(`blogs/${path}`, {blog: blog})
        }    
    }
}

module.exports = router;