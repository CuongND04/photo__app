import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const CommentInput = ({ photoId, toggle, setToggle }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    await fetch(`http://localhost:8081/api/commentsOfPhoto/${photoId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user._id,
        comment,
      }),
    });
    setToggle(!toggle);
    setComment("");
  };

  return (
    <>
      <TextField
        label="Comment"
        variant="outlined"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ marginTop: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 1 }}>
        Submit
      </Button>
    </>
  );
};

export default CommentInput;
