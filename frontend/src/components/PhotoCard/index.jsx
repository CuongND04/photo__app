import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import fetchModel from "../../lib/fetchModelData";
import imageMap from "../../utils/imageMap";
import { Avatar } from "@mui/material";
import "./styles.css";
import CommentInput from "../CommentInput";

const PhotoCard = ({ photo, userId, toggle, setToggle }) => {
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    fetchModel(`/api/user/${userId}`)
      .then((res) => setUserDetail(res[0]))
      .catch(() => {});
  }, [userId]);
  // console.log("userDetail : ", userDetail);
  return (
    <div className="photo-card">
      <div className="photo-image-container">
        <img
          // src={imageMap[photo.file_name]}
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
                  <p
                    className="comment-text"
                    dangerouslySetInnerHTML={{ __html: comment.comment }}
                  />
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
