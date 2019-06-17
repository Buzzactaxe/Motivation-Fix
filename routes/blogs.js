var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var middleware = require('../middleware/index');


//------------------------
// INDEX ROUTE: show all blogs
router.get('/', function (req, res) {
	Blog.find({}, function (err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render('blogs/index', {
				blogs,
				blogs,
				currentUser: req.user
			});
		}
	});
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function (req, res) {
	res.render('blogs/new');
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function (req, res) {
	//create blog
	var auth = {
		id: req.user._id,
		username: req.user.username
	}

	req.body.blog.body.author = req.sanitize(req.body.blog.body);
	console.log(req.user);
	Blog.create(req.body.blog, function (err, newBlog) {
		if (err) {
			res.render('new');
		} else {
			//then redirect to index
			newBlog.author = auth;
			newBlog.save();
			console.log(newBlog)
			res.redirect('/blogs');
		}
	});
});

// SHOW ROUTE(added comments)
router.get('/:id', function (req, res) {
	Blog.findById(req.params.id).populate('comments').exec(function (err, foundBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('blogs/show', {
				blog: foundBlog
			});
		}
	});
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkBlogOwner, function (req, res) {
	Blog.findById(req.params.id, function (err, foundBlog) {
		if (err) {
			req.flash('error', err);
		} else {
			res.render('blogs/edit', {
				blog: foundBlog
			});
		}
	});
});


// UPDATE ROUTE
router.put('/:id', middleware.checkBlogOwner, function (req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			req.flash('success', "Blog Updated");
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkBlogOwner, function (req, res) {
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect('/blogs');
		} else {
			// redirect
			req.flash('success', "Blog deleted");
			res.redirect('/blogs');
		}
	});
});

module.exports = router;