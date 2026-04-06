const mongoose = require("mongoose");
const DOMPurify = require("isomorphic-dompurify");
const sanitizeHtml = require("sanitize-html");

const MAX_TITLE_LENGTH = 40;
const MAX_DESC_LENGTH = 500;

const sanitizeInput = (value) => {
  return sanitizeHtml(DOMPurify.sanitize(value), {
    allowedTags: [], // Disallow all tags
    allowedAttributes: {}, // Disallow all attributes
  });
};

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      maxlength: MAX_TITLE_LENGTH,
      set: sanitizeInput, // Sanitizes title input
    },
    desc: {
      type: String,
      required: true,
      unique: true,
      maxlength: MAX_DESC_LENGTH,
      set: sanitizeInput, // Sanitizes description input
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      set: (values) => values.map(sanitizeInput), // Sanitizes each category input
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
