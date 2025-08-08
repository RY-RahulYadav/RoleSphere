const Post = require('../models/Post');
const Log = require('../models/Log');

// Create a new post (editor or admin)
exports.createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    const post = new Post({
      title,
      content,
      image,
      author: req.user._id
    });
    
    await post.save();
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Create Post',
      details: `User ${req.user.firstName} ${req.user.lastName} created post: ${title}`
    });
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'firstName middleName lastName email role');
    
    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get editor's own posts
exports.getEditorPosts = async (req, res) => {
  try {
    // Only fetch posts created by the logged-in editor
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'firstName middleName lastName email role');
    
    res.json(posts);
  } catch (error) {
    console.error('Get editor posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName middleName lastName email role');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get post by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post (editors can only edit their own posts)
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Find post
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Editors can only edit their own posts
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post. Editors can only edit their own posts.' });
    }
    
    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('author', 'firstName middleName lastName email role');
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Update Post',
      details: `User ${req.user.firstName} ${req.user.lastName} updated their post: ${title}`
    });
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post (editors can only delete their own posts)
exports.deletePost = async (req, res) => {
  try {
    // Find post
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Editors can only delete their own posts
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post. Editors can only delete their own posts.' });
    }
    
    // Delete post
    await Post.findByIdAndDelete(req.params.id);
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Delete Post',
      details: `User ${req.user.firstName} ${req.user.lastName} deleted their post: ${post.title}`
    });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the user has already liked the post
    if (post.likes.includes(req.user._id)) {
      // User already liked it, so unlike
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      await post.save();
      return res.json({ message: 'Post unliked', likes: post.likes.length });
    }
    
    // Add like
    post.likes.push(req.user._id);
    await post.save();
    
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Like Post',
      details: `User ${req.user.firstName} ${req.user.lastName} liked post: ${post.title}`
    });
    
    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Add comment
    const comment = {
      content,
      author: req.user._id,
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Populate author info for the newly added comment
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'firstName middleName lastName email role')
      .populate('comments.author', 'firstName middleName lastName email role');
      
    // Log this action
    await Log.create({
      user: req.user._id,
      action: 'Comment on Post',
      details: `User ${req.user.firstName} ${req.user.lastName} commented on post: ${post.title}`
    });
    
    res.status(201).json({
      message: 'Comment added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
