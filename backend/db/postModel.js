const mongoose = require("mongoose");

const postListSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  description: { type: String },
});

const PostList = mongoose.model("PostList", postListSchema);

module.exports = PostList;
