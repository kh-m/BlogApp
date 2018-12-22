var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// APP CONFIG:
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
// So we can serve our custom style sheets
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE/MODEL CONFIG:
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES: -

app.get("/", function(req, res){
    res.redirect("/blogs");
})

// INDEX route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
})

// NEW route
    app.get("/blogs/new", function(req, res){
        res.render("new");
    });

// CREATE route
app.post("/blogs", function(req, res){
    // creates blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
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
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("COULD NOT FIND BLOG!");
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})


app.listen(8000, function(){
    console.log("Server running.")
})
