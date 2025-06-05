const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/list", async (req, res) => {
  const users = await User.find({});
  const simplifiedUsers = users.map((user) => ({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
  }));
  res.status(200).json(simplifiedUsers);
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const foundUsers = await User.find({ _id: userId });
    if (!foundUsers || foundUsers.length === 0) {
      res
        .status(404)
        .send(
          `User with ID: ${userId} was not found. Please check the ID and try again.`
        );
      return;
    }
    const userDetails = foundUsers.map((user) => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    }));
    res.json(userDetails);
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(400)
        .send("Invalid user ID format. Please provide a valid ID.");
    } else {
      res
        .status(500)
        .send("An unexpected error occurred. Please try again later.");
    }
  }
});

router.get("/comments/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const photosWithComments = await Photo.find({ "comments.user_id": userId });
    if (!photosWithComments || photosWithComments.length === 0) {
      res.status(404).send(`No comments found for user with ID: ${userId}.`);
      return;
    }
    const processedPhotos = photosWithComments.map(async (photo) => {
      const enrichedComments = await Promise.all(
        photo.comments.map(async (comment) => {
          const user = await User.find({ _id: comment.user_id });
          const commenter = {
            _id: user[0]._id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
          };
          return {
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: commenter,
          };
        })
      );
      return {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: enrichedComments,
      };
    });
    res.status(200).json(await Promise.all(processedPhotos));
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(400)
        .send("Invalid user ID format. Please provide a valid ID.");
    } else {
      res
        .status(500)
        .send("An unexpected error occurred. Please try again later.");
    }
  }
});

module.exports = router;
