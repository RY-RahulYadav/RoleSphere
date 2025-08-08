const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, isEditor, isViewer } = require('../middleware/auth');

// Get all posts (viewable by all authenticated users)
router.get('/', auth, isViewer, postController.getAllPosts);

// Get editor's own posts (only for editors)
router.get('/editor/my-posts', auth, isEditor, postController.getEditorPosts);

// Get post by ID (viewable by all authenticated users)
router.get('/:id', auth, isViewer, postController.getPostById);

// Create post (editors only)
router.post('/', auth, isEditor, postController.createPost);

// Update post (editors only - and only their own posts)
router.put('/:id', auth, isEditor, postController.updatePost);

// Delete post (editors only - and only their own posts)
router.delete('/:id', auth, isEditor, postController.deletePost);

// Like/unlike a post (all authenticated users)
router.post('/:id/like', auth, isViewer, postController.likePost);

// Add comment to a post (all authenticated users)
router.post('/:id/comment', auth, isViewer, postController.addComment);

module.exports = router;
