const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");

router.get("/photosOfUser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const photos = await Photo.find({ user_id: userId });
    if (!photos) {
      res
        .status(400)
        .send(
          `No photos found for user with ID: ${userId}. Please check the user ID.`
        );
      return;
    }
    const result = photos.map(async (photo) => {
      const enrichedComments = await Promise.all(
        photo.comments.map(async (comment) => {
          const commenter = await User.find({ _id: comment.user_id });
          if (!commenter || commenter.length === 0) {
            return null;
          }
          const commenterInfo = {
            _id: commenter[0]._id,
            first_name: commenter[0].first_name,
            last_name: commenter[0].last_name,
          };
          return {
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: commenterInfo,
          };
        })
      );
      return {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: enrichedComments.filter((c) => c !== null),
        likes: photo.likes || [],
      };
    });
    res.status(200).json(await Promise.all(result));
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

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  const photoId = req.params.photo_id;
  const { user_id, comment } = req.body;
  try {
    const targetPhoto = await Photo.findOne({ _id: photoId });
    if (!targetPhoto) {
      res.status(404).send(`Photo with ID: ${photoId} not found.`);
      return;
    }

    const commentingUser = await User.findOne({ _id: user_id });
    if (!commentingUser) {
      res.status(404).send(`User with ID: ${user_id} not found.`);
      return;
    }

    const newComment = {
      user_id,
      comment,
      date_time: new Date(),
    };

    targetPhoto.comments.push(newComment);
    await targetPhoto.save();
    res.status(201).json(newComment);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send("Invalid ID format. Please provide valid IDs.");
    } else {
      res
        .status(500)
        .send("An unexpected error occurred. Please try again later.");
    }
  }
});

router.post("/photos/new", upload.single("file"), async (req, res) => {
  const currentUser = req.user;
  if (!currentUser) {
    res.status(401).send("Unauthorized: User authentication required.");
    return;
  }
  if (!req.file) {
    res.status(400).send("No file uploaded. Please upload an image file.");
    return;
  }

  const timestamp = Date.now();
  // format: userId + timestamp + origName
  const filename = `${currentUser._id}_${timestamp}_${req.file.originalname}`;

  try {
    fs.writeFile(`./public/images/${filename}`, req.file.buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res
          .status(500)
          .send("Failed to save the image file. Please try again.");
      }
    });

    const newPhoto = await Photo.create({
      file_name: filename,
      date_time: timestamp,
      user_id: currentUser._id,
      comments: [], // fixed typo: comment -> comments
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("An unexpected error occurred while uploading the photo.");
  }
});

// api sửa bình luận
router.put("/comments/:photo_id/:comment_id", async (req, res) => {
  const { photo_id, comment_id } = req.params;
  const { comment } = req.body;
  console.log("comment: ", comment);
  if (!comment || typeof comment !== "string") {
    return res.status(400).send("Invalid comment content.");
  }

  try {
    const photo = await Photo.findOne({ _id: photo_id });
    if (!photo) {
      return res.status(404).send(`Photo with ID ${photo_id} not found.`);
    }

    const targetComment = photo.comments.id(comment_id);
    if (!targetComment) {
      return res.status(404).send(`Comment with ID ${comment_id} not found.`);
    }

    targetComment.comment = comment;
    await photo.save();

    res.status(200).json({
      message: "Comment updated successfully.",
      updatedComment: targetComment,
    });
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send("Invalid ID format. Please provide valid IDs.");
    } else {
      console.error(err);
      res.status(500).send("An unexpected error occurred.");
    }
  }
});

// routes/photo.js
router.put("/photos/:id/like", async (req, res) => {
  try {
    const userId = req.body.user_id; // user gửi lên
    const photoId = req.params.id;

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).send("Photo not found");

    const alreadyLiked = photo.likes.includes(userId);
    if (alreadyLiked) {
      // Unlike
      photo.likes = photo.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      photo.likes.push(userId);
    }

    await photo.save();
    res
      .status(200)
      .json({ liked: !alreadyLiked, totalLikes: photo.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to like photo");
  }
});

module.exports = router;
