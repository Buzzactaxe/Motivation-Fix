var mongoose = require("mongoose");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");

var data = [{
        title: "Best Dog Halloween Costume",
        image: "https://farm2.staticflickr.com/1845/43838624385_c6fe7e9fc7.jpg",
        body: "this is a test and it is amazing 1"
    },
    {
        title: "Eat your veg",
        image: "https://farm2.staticflickr.com/1724/27707429387_1764b60b17.jpg",
        body: "this is a test and it is amazing 2"
    },
    {
        title: "WARNING: Flamable Tec!",
        image: "https://farm3.staticflickr.com/2397/2076045109_3b9b0cb5fe.jpg",
        body: "this is a test and it is amazing 3"
    },
]

function seedDB() {
    //Remove all campgrounds
    Blog.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed blogs!");
        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach(function (seed) {
                Blog.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a blog");
                        //create a comment
                        Comment.create({
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            },
                            function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }

                            });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;