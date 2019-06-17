var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var middleware = require('../middleware/index');
var Comment = require('../models/comments');

//Comments NEW
router.get('/blogs/:id/comments/new', middleware.isLoggedIn, function (req, res) {
    //find campground by ID
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                blog: blog
            });
        }
    });
});

//Comments CREATE
router.post('/blogs/:id/comments', middleware.isLoggedIn, function (req, res) {
    //lookup blog using ID
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            req.flash('error', "Something went wrong");
            console.log(err);
            res.redirect('/blogs');
        } else {
            console.log(req.body.comment);
            //creat new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment with blog
                    blog.comments.push(comment);
                    console.log(comment);
                    blog.save();
                    //redirect blog showpage
                    req.flash('success', "Successfully created comment");
                    res.redirect('/blogs/' + blog._id);
                }
            });
        }
    });
});

// Comments EDIT Route
router.get('/blogs/:id/comments/:comment_id/edit', middleware.checkCommentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                blog_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// COMMENT UPDATE ROUTE
router.put('/blogs/:id/comments/:comment_id', function (req, res) {
    req.body.comment.body = req.sanitize(req.body.comment.body);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

//Comments Destroy Route
router.delete('/blogs/:id/comments/:comment_id', middleware.checkCommentOwner, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment deleted");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;