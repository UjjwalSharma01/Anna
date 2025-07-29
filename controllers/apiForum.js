const User = require("../models/user");
const Forum = require("../models/forum");

// GET /api/forum - Get all forum posts
module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Forum.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: posts,
            message: "Forum posts retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching forum posts:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching forum posts",
            error: err.message
        });
    }
};

// POST /api/forum - Create a new forum post
module.exports.createPost = async (req, res) => {
    try {
        const { Question, Description, Category } = req.body;
        
        // Validation
        if (!Question || !Description || !Category) {
            return res.status(400).json({
                success: false,
                message: "Question, Description, and Category are required"
            });
        }

        const newForum = new Forum({
            Question,
            Description,
            Category,
            author: req.user._id
        });

        await newForum.save();
        await newForum.populate('author', 'username');

        res.status(201).json({
            success: true,
            data: newForum,
            message: "Question posted successfully"
        });
    } catch (err) {
        console.error("Error creating forum post:", err);
        res.status(500).json({
            success: false,
            message: "Error creating forum post",
            error: err.message
        });
    }
};

// GET /api/forum/:id - Get a specific forum post
module.exports.getPost = async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id)
            .populate('author', 'username');
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }

        res.json({
            success: true,
            data: post,
            message: "Forum post retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching forum post:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching forum post",
            error: err.message
        });
    }
};

// PUT /api/forum/:id - Update a forum post (only by author)
module.exports.updatePost = async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this post"
            });
        }

        const { Question, Description, Category } = req.body;
        
        if (Question) post.Question = Question;
        if (Description) post.Description = Description;
        if (Category) post.Category = Category;

        await post.save();
        await post.populate('author', 'username');

        res.json({
            success: true,
            data: post,
            message: "Forum post updated successfully"
        });
    } catch (err) {
        console.error("Error updating forum post:", err);
        res.status(500).json({
            success: false,
            message: "Error updating forum post",
            error: err.message
        });
    }
};

// DELETE /api/forum/:id - Delete a forum post (only by author)
module.exports.deletePost = async (req, res) => {
    try {
        const post = await Forum.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Forum post not found"
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this post"
            });
        }

        await Forum.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Forum post deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting forum post:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting forum post",
            error: err.message
        });
    }
};

// GET /api/forum/categories - Get all available categories
module.exports.getCategories = async (req, res) => {
    try {
        const categories = [
            'Agricultural Comodity',
            'Agricultural Product', 
            'Crop Insurence',
            "Farmer's Issues",
            'Livestock and Animal Husbandery',
            'Organic Farming',
            'Schemes and Subsidies'
        ];

        res.json({
            success: true,
            data: categories,
            message: "Categories retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: err.message
        });
    }
};
