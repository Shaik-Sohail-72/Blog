require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const homeStartingContent = "Welcome to Daily Journal!!!  To Compose ?   1. Click on COMPOSE.   2. Enter the title in the title field.   3. Enter the text which you want to publish in the post field.    4. Click on publish button.";
const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactContent = "Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Facilisis mauris sit amet massa vitae. Ac tincidunt vitae semper quis lectus nulla at. Nec dui nunc mattis enim. Euismod lacinia at quis risus sed. Suscipit adipiscing bibendum est ultricies integer. Nunc pulvinar sapien et ligula ullamcorper malesuada. Gravida neque convallis a cras semper auctor. Ultricies integer quis auctor elit sed vulputate mi. Id aliquet lectus proin nibh. Sed viverra ipsum nunc aliquet bibendum. Eget nullam non nisi est.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


let port = process.env.PORT;
	if (port == null || port == "") {
  	port = 3000;
	}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
