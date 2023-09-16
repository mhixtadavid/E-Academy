var express         = require ("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    methodOverride  = require("method-override"),
    nodemailer      = require("nodemailer");
    multer          = require("multer");
    Course          = require("./models/courses");
    Blog            = require("./models/blogs"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    //Image           = require("./models/image");
    //Tutorial        = require("./models/tutorial");

    const AdminBro = require('admin-bro')
    const AdminBroExpress = require('@admin-bro/express')
    const AdminBroMongoose = require('@admin-bro/mongoose')
    
    AdminBro.registerAdapter(AdminBroMongoose)
    const adminBro = new AdminBro({
      databases: [mongoose],
      rootPath: '/admin',
    })
    
    var ADMIN = {
        email: process.env.ADMIN_EMAIL || "kingdavidoshin@gmail.com",
        password: process.env.ADMIN_PASSWORD || "oluwakemi112"
    }
    
    var router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
        cookiename: process.env.ADMIN_COOKIE_NAME || "admin-bro",
        cookiePassword: process.env.ADMIN_COOKIE_pass || "kingdavidoshin",
        authenticate: async (email, password) => {
            if (email === ADMIN.email && password === ADMIN.password) {
                return ADMIN
            }
                return null
        }
    });

app.use(adminBro.options.rootPath, router)

var homeRoutes      = require("./routes/home"),
    courseRoutes    = require("./routes/courses"),
    indexRoutes     = require("./routes/index");
    commentRoutes   = require("./routes/comments"),
    courseCommentRoutes = require("./routes/course-comments"),
    blogRoutes      = require("./routes/blogs"),
    


mongoose.connect("mongodb://127.0.0.1:27017/E-Learning", { 
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/blogs", express.static('blog_uploads'));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "kaidi",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/home", homeRoutes);
app.use("/courses", courseRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments/", commentRoutes);
app.use("/courses/:id/comments/", courseCommentRoutes);


app.listen (8080, function(){
    console.log ("Server Active");
});