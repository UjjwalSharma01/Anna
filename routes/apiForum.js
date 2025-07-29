const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { authenticateToken } = require("../middleware/auth.js");
const apiForumController = require("../controllers/apiForum.js");

// GET /api/forum/categories - Get all categories (public)
router.get("/categories", wrapAsync(apiForumController.getCategories));

// GET /api/forum - Get all forum posts (public)
router.get("/", wrapAsync(apiForumController.getAllPosts));

// GET /api/forum/:id - Get specific forum post (public)
router.get("/:id", wrapAsync(apiForumController.getPost));

// POST /api/forum - Create new forum post (protected)
router.post("/", authenticateToken, wrapAsync(apiForumController.createPost));

// PUT /api/forum/:id - Update forum post (protected)
router.put("/:id", authenticateToken, wrapAsync(apiForumController.updatePost));

// DELETE /api/forum/:id - Delete forum post (protected)
router.delete("/:id", authenticateToken, wrapAsync(apiForumController.deletePost));

module.exports = router;
