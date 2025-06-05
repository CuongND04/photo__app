import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function UserComments() {
  const user = useParams();
  const { setPage } = useAuth();
  const [data, setData] = useState({});
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data1 = await fetchModel(`/api/user/${user.userId}`);
      setData(data1[0]);
      const data2 = await fetchModel(`/api/user/comments/${user.userId}`);
      setPhotos(data2);
    };
    getData();
    if (data.first_name) {
      setPage("Comments of " + data.first_name);
    }
  }, [data.first_name, setPage, user.userId]);
  return (
    <div>
      <Grid
        container
        justifyContent="space-evenly"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={12}>
          <h1>{data.first_name}'s comments</h1>
        </Grid>
        {photos.map((photo) => (
          <Grid item xs={12} key={photo._id}>
            <Card variant="outlined">
              <Typography gutterBottom>{photo.date_time}</Typography>
              <CardContent>
                <CardMedia
                  component="img"
                  src={`http://localhost:8081/images/${photo.file_name}`}
                />
                <List>
                  {photo.comments
                    ? photo.comments.map((comment) => (
                        <ListItem key="comment._id">
                          <Typography>
                            <Link
                              to={`/users/${comment.user._id}`}
                              style={{ marginRight: "10px" }}
                            >
                              <Typography variant="body1">
                                {comment.user.first_name +
                                  " " +
                                  comment.user.last_name}
                              </Typography>
                            </Link>
                            <Typography variant="caption">
                              {comment.date_time}
                            </Typography>
                            <Typography variant="body2">
                              {comment.comment}
                            </Typography>
                          </Typography>
                          <Divider />
                        </ListItem>
                      ))
                    : null}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserComments;
