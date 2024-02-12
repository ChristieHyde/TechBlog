const router = require('express').Router();
const { Account, BlogPost, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Default homepage, login dependent
router.get('/', async (req, res) => {
    try {
        // Get recent blog posts
        const recentBlogData = await BlogPost.findAll({
            include: [
                {
                model: Account,
                attributes: ['name'],
                },
            ],
            order: ['date_created'],
            limit: 5,
        });

        const recentBlogs = recentBlogData.map((blog) => blog.get({ plain: true }));

        // Render homepage with recent blogs
        res.render('homepage', { 
            recentBlogs, 
            logged_in: req.session.logged_in 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login page
router.get('/login', (req, res) => {
    // Attempting to log in while already logged in redirects to homepage
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
});

// Sign up page
router.get('/signup', (req, res) => {
    // Attempting to signup while already logged in redirects to homepage
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
});

// Dashboard, logged in
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Find the account from session ID
        const accountData = await Account.findByPk(req.session.account_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: BlogPost }],
        });
        const account = accountData.get({ plain: true });
  
        res.render('dashboard', {
            ...account,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// View blog post
router.get('/blog/:id', async (req, res) => {
    try {
        // Get blog post by its ID
        const blogData = await BlogPost.findByPk(req.params.id, {
            include: [
            {
                model: Account,
                attributes: ['name'],
            },
            {
                model: Comment,
            }
            ],
        });
        const blog = blogData.get({ plain: true });

        // Render blog with comments
        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create comment
// Create blog post
// Logout

module.exports = router;