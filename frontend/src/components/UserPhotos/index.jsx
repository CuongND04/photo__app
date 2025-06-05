import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Stack,
  Pagination,
} from "@mui/material";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { useAuth } from "../../contexts/AuthContext";
import PhotoCard from "../PhotoCard";

function UserPhotos() {
  const { setPage, advancedFeaturesEnabled } = useAuth();
  const { userId } = useParams();
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState({});
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data1 = await fetchModel(`/api/user/${userId}`);
      setData(data1[0]);
      const data2 = await fetchModel(`/api/photosOfUser/${userId}`);
      setPhotos(data2);
    };
    getData();
  }, [userId, toggle]);

  useEffect(() => {
    if (data.first_name) {
      setPage("Photos of " + data.first_name);
    }
  }, [data.first_name, setPage]);

  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="flex-start"
      spacing={2}
    >
      <Grid item xs={12}>
        <h1>{data.first_name}'s photos</h1>
      </Grid>
      {photos.length > 0 ? (
        !advancedFeaturesEnabled ? (
          photos.map((photo) => (
            <Grid item xs={12} key={photo._id}>
              <PhotoCard
                photo={photo}
                userId={userId}
                toggle={toggle}
                setToggle={setToggle}
              />
            </Grid>
          ))
        ) : (
          <AdvancedMode
            photos={photos}
            toggle={toggle}
            setToggle={setToggle}
            userId={userId}
          />
        )
      ) : (
        <Grid item xs={12}>
          <p>This user has not uploaded any photos yet.</p>
        </Grid>
      )}
    </Grid>
  );
}

function AdvancedMode({ photos, toggle, setToggle, userId }) {
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState(photos[0]);

  useEffect(() => {
    setPhoto(photos[page - 1]);
  }, [page, photos]);

  return (
    <Stack spacing={2}>
      <Pagination
        count={photos.length}
        page={page}
        onChange={(event, value) => setPage(value)}
      />
      <PhotoCard
        photo={photo}
        userId={userId}
        toggle={toggle}
        setToggle={setToggle}
      />
    </Stack>
  );
}

export default UserPhotos;
