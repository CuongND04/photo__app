import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import fetchModel from "../../lib/fetchModelData";
import imageMap from "../../utils/imageMap";
import { Avatar, Button, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import "./styles.css";
import CommentInput from "../CommentInput";
import { useAuth } from "../../contexts/AuthContext";

const PhotoCard = ({ photo, userId, toggle, setToggle }) => {
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes?.length || 0);

  useEffect(() => {
    fetchModel(`/api/user/${userId}`)
      .then((res) => setUserDetail(res[0]))
      .catch(() => {});
  }, [userId]);

  const handleEditComment = (commentId, originalText) => {
    setEditingCommentId(commentId);
    setEditText(originalText);
  };
  useEffect(() => {
    if (photo.likes) {
      setLiked(photo.likes.includes(user._id));
      setLikeCount(photo.likes.length);
    } else {
      setLiked(false);
      setLikeCount(0);
    }
  }, [photo, user._id]);

  const handleSaveComment = async (photoId, commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/comments/${photoId}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ comment: editText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setEditingCommentId(null);
      setToggle(!toggle);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/photos/${photo._id}/like`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id: user._id }),
        }
      );
      const result = await response.json();
      console.log("result: ", result);
      setLiked(result.liked);
      setLikeCount(result.totalLikes);
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  console.log("photo: ", photo);
  return (
    <div className="photo-card">
      <div className="photo-image-container">
        <img
          src={`http://localhost:8081/images/${photo.file_name}`}
          alt={photo.file_name}
          className="photo-image"
        />
      </div>

      <div className="photo-meta">
        <div className="meta-item">
          <p className="photo-meta-label">Upload Date</p>
          <p className="photo-meta-value">{formatDate(photo.date_time)}</p>
        </div>
        <div className="meta-item">
          <p className="photo-meta-label">Uploaded by</p>
          <Link to={`/users/${userId}`} className="photo-meta-value user-link">
            {userDetail.first_name && userDetail.last_name
              ? `${userDetail.first_name} ${userDetail.last_name}`
              : "Loading..."}
          </Link>
        </div>
        <div className="photo-like-container">
          <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
            {liked ? "Thích" : "Không thích"}
          </IconButton>
          <span>
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
      </div>

      <div className="photo-comments">
        <h3 className="comments-title">Comments</h3>
        {photo?.comments?.length ? (
          photo.comments.map((comment, index) => (
            <div key={comment?._id ?? index} className="photo-comment-card">
              <div className="comment-container">
                <div className="comment-avatar">
                  <Avatar
                    sx={{
                      fontSize: 10,
                      bgcolor: "primary.light",
                      width: 40,
                      height: 40,
                    }}
                  >
                    {comment.user.first_name.charAt(0)}
                  </Avatar>
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <Link
                      to={`/users/${comment.user._id}`}
                      className="comment-user-name"
                    >
                      {`${comment.user.first_name} ${comment.user.last_name}`}
                    </Link>
                    <span className="comment-date">
                      {formatDate(comment.date_time)}
                    </span>
                  </div>

                  {editingCommentId === comment._id ? (
                    <>
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <Button
                        onClick={() =>
                          handleSaveComment(photo._id, comment._id)
                        }
                        size="small"
                        variant="contained"
                        sx={{ mt: 1 }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <p
                        className="comment-text"
                        dangerouslySetInnerHTML={{ __html: comment.comment }}
                      />
                      {user._id === comment.user._id && (
                        <Button
                          onClick={() =>
                            handleEditComment(comment._id, comment.comment)
                          }
                          size="small"
                          variant="text"
                        >
                          Edit
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">No comment</div>
        )}
      </div>

      <CommentInput photoId={photo._id} toggle={toggle} setToggle={setToggle} />
    </div>
  );
};

export default PhotoCard;
