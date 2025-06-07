import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import { useAuth } from "../../contexts/AuthContext";
import { Avatar } from "@mui/material";
function UserDetail() {
  const { setPage } = useAuth();
  const { userId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      const data = await fetchModel(`/api/user/${userId}`);
      setData(data[0]);
      setPage(data[0]?.first_name + "'s information");
    };
    getData();
  }, [setPage, userId]);

  return (
    <>
      <div className="user-detail-container">
        <div className="user-detail-header">
          <div className="user-detail-avatar">
            <Avatar sx={{ bgcolor: "primary.light", width: 80, height: 80 }}>
              {data.first_name}
            </Avatar>
          </div>
          <div className="user-detail-info">
            <h2 className="user-detail-title">{`${data.first_name} ${data.last_name}`}</h2>
            <p className="user-detail-occupation">{`${data.occupation}`}</p>
          </div>
        </div>

        <div className="user-detail-details">
          <div className="user-detail-item">
            <div className="user-detail-item-icon ">👤</div>
            <div>
              <p className="">User ID</p>
              <p className="">{userId}</p>
            </div>
          </div>

          <div className="user-detail-item">
            <div className="user-detail-item-icon ">📍</div>
            <div>
              <p className="">Location</p>
              <p className="">{data.location}</p>
            </div>
          </div>

          <div className="user-detail-item">
            <div className="user-detail-item-icon">💬</div>
            <div>
              <p className="">Description</p>
              <p
                className=""
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          </div>
        </div>

        <Link to={`/photos/${userId}`} className="user-detail-link">
          View all photos
        </Link>
        <Link to={`/viewpost/${userId}`} className="user-detail-link">
          View Posts
        </Link>
      </div>
    </>
  );
}

export default UserDetail;
