const express = require("express");
const PostList = require("../db/postModel"); // hoặc models/PostList nếu bạn lưu ở đó
const User = require("../db/userModel");
const router = express.Router();

router.get("/postsOfUser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const posts = await PostList.find({ user_id: userId });
    if (!posts || posts.length === 0) {
      res
        .status(400)
        .send(
          `No posts found for user with ID: ${userId}. Please check the user ID.`
        );
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send("User not found.");
      return;
    }

    const result = posts.map((post) => ({
      _id: post._id,
      user_id: post.user_id,
      title: post.title,
      description: post.description,
      date_time: post.date_time,
    }));

    res.status(200).json(result);
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(400)
        .send("Invalid user ID format. Please provide a valid user ID.");
    } else {
      res
        .status(500)
        .send("An unexpected error occurred. Please try again later.");
    }
  }
});

module.exports = router;
