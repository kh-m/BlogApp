var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
    expressSanitizer = require("express-sanitizer");

// APP CONFIG:
var url = process.env.PUBLICBLOGDATABSEURL || "mongodb://localhost:27017/restful_blog_app";
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect("mongodb://khaled:gFofkMXjbV8@ds161804.mlab.com:61804/public-blog", { useNewUrlParser: true });
// To stop the depreciation Warning ...
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
// So we can serve our custom style sheets
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// Tells method-override to look for _method to override
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG:
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})
var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES: -

app.get("/", function (req, res) {
    res.redirect("/blogs");
})

// INDEX route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blog: blogs });
        }
    });
})

// NEW route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// CREATE route
app.post("/blogs", function (req, res) {
    // sanitizes the blog body from scripts etc
    req.body.blog.body = req.sanitize(req.body.blog.body);

    // creates blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log("ERROR! DID NOT POST!");
            console.log(err);
            res.render("new");
        } else {
            // redirects to index
            res.redirect("/blogs");
        }
    })
})

// SHOW route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log("COULD NOT FIND BLOG!");
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
})

// EDIT route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            console.log("COULD NOT EDIT!");
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })
})

// UPDATE route
app.put("/blogs/:id/", function (req, res) {
    // sanitizes the blog body from scripts etc
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // findByIdAndUpdate(idToFindBy, newData, callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            console.log("COULD NOT EDIT!");
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

// DELETE route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

// // For when running on external environment
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Server running.");
//     console.log("PORT:", process.env.PORT);
//     console.log("IP:", process.env.IP);
// });

// For when running on local environment
app.listen(8000, function () {
    console.log("Server running.")
})
