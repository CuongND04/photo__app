import React, { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useNavigate } from "react-router-dom";
function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      const data = await fetchModel("/api/user/list");
      setUsers(data);
    };
    getData();
  }, []);
  const { pathname } = useLocation();
  const userId = pathname.split("/").pop();
  console.log("users: ");
  return (
    <>
      <aside>
        <div className="sidebar-title">User List</div>

        <div className="sidebar-list">
          {users.map((item) => (
            <Link
              to={`/users/${item._id}`}
              key={item._id}
              className={`sidebar-user ${userId === item._id ? "active" : ""}`}
            >
              <span>{`${item.first_name} ${item.last_name}`}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

export default UserList;
