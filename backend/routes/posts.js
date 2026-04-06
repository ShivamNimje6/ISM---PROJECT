const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    // Validate title length
    if (req.body.title.length > 40) {
      return res
        .status(400)
        .json({ error: "Title exceeds 40 characters limit" });
    }
    // Validate description length
    if (req.body.desc.length > 500) {
      return res
        .status(400)
        .json({ error: "Description exceeds 500 characters limit" });
    }
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create post", details: err.message });
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    // Validate title length

    if (req.body.title && req.body.title.length > 40) {
      return res
        .status(400)
        .json({ error: "Title exceeds 40 characters limit" });
    }
    // Validate description length
    if (req.body.desc && req.body.desc.length > 500) {
      return res
        .status(400)
        .json({ error: "Description exceeds 500 characters limit" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update post", details: err.message });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete post", details: err.message });
  }
});

// GET POST DETAILS
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: "Post not found", details: err.message });
  }
});

// GET POSTS
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    const searchFilter = {
      title: { $regex: query.search, $options: "i" },
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: err.message });
  }
});

// GET USER POSTS
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch user posts", details: err.message });
  }
});

module.exports = router;
