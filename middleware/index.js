var Blog = require('../models/blogs');
var Comment = require('../models/comments');
var middlewareObj = {};

middlewareObj.checkBlogOwner = function (req, res, next) {
    //is user logged in
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function (err, foundBlog) {
            if (err) {
                req.flash('error', "Blog not found")
                res.redirect('back');
            } else {
                if (!foundBlog) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                //does user own blog?
                if (foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don´t have permission to do that")
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "You need to be Logged In to do that");
        res.redirect('back');
    }

};

middlewareObj.checkCommentOwner = function (req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect('back');
            } else {
                //does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You dont have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "You need to be logged in to do that");
        res.redirect('back');
    }
};


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be Logged In to do that");
    res.redirect('/login');
};

module.exports = middlewareObj;