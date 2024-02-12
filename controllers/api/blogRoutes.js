const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

// Create new blog post
router.post('/', withAuth, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            account_id: req.session.account_id,
        });

        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete blog post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                account_id: req.session.account_id,
            },
        });

        if (!blogData) {
            res.status(404).json({ message: 'Post with this ID does not exist' });
            return;
        }

        const commentData = await Comment.destroy({
            where: {
                blog_id: req.params.id,
            },
        })

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
  }
});

module.exports = router;
