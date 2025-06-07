import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function ViewPost() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchModel(`/api/post/postsOfUser/${userId}`);
      setPosts(data);
    };
    getPosts();
  }, [userId]);

  return (
    <div>
      <h2>User's Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewPost;
