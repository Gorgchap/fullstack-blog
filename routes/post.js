const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => res.status(200).json(await Post.find({})) );

router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        text: req.body.text
    });
    await post.save();
    res.status(201).json(post);
});

router.delete('/:id', async (req, res) => {
    await Post.remove({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted' });
});

module.exports = router;
