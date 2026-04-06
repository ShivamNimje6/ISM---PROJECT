const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");
const sanitizeHtml = require("sanitize-html");
const logger = require("../logger"); // Import the logger

// Function to sanitize comments and prevent harmful scripts and URLs
const sanitizeComment = (comment, username) => {
  const sanitized = sanitizeHtml(comment, {
    allowedTags: [], // Disallow all HTML tags
    allowedAttributes: {}, // Disallow all attributes
  });

  console.log("Sanitized Comment:", sanitized);

  // Check for harmful patterns, including XSS, JavaScript, and URLs
  const harmfulPatterns =
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|data:text\/html|data:text\/javascript/i;

  // Regex to match URLs (both HTTP and HTTPS)
  const urlPattern = /https?:\/\/[^\s]+/i;

  // Test for harmful content (original and sanitized)
  if (
    harmfulPatterns.test(comment) ||
    harmfulPatterns.test(sanitized) ||
    urlPattern.test(comment) // Block URLs in the original comment
  ) {
    // Log both the original and sanitized comments
    logger.error({
      message: `Harmful comment attempt detected by user "${username}"`,
      originalComment: comment,
      sanitizedComment: sanitized,
    });
    throw new Error("Harmful content detected");
  }

  return sanitized;
};

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    const username = req.username; // Get the username from the request

    // Sanitize the comment
    const sanitizedComment = sanitizeComment(req.body.comment, username);

    const newComment = new Comment({ ...req.body, comment: sanitizedComment });
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    // Handle specific error for harmful content
    if (err.message === "Harmful content detected") {
      return res.status(400).json({
        error: "Your comment contains harmful content and cannot be submitted.",
      });
    }
    res.status(500).json({ error: err.message }); // Return other errors
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const username = req.username; // Get the username from the request

    // Sanitize the updated comment
    const sanitizedComment = sanitizeComment(req.body.comment, username);

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: { comment: sanitizedComment } }, // Use sanitized comment
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Return error message
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment has been deleted!");
  } catch (err) {
    res.status(500).json({ error: err.message }); // Return error message
  }
});

// GET POST COMMENTS
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Return error message
  }
});

module.exports = router;
