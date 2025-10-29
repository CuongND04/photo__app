import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Dialog,
  Typography,
  Button,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./styles.css";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
function TopBar() {
  const {
    page,
    user,
    setUser,
    advancedFeaturesEnabled,
    setAdvancedFeaturesEnabled,
  } = useAuth();
  const [dialog, setDialog] = useState(false);
  const [uploadInput, setUploadInput] = useState(null);

  const handleLogOut = async () => {
    try {
      await fetch("http://localhost:8081/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      // Xóa user khỏi sessionStorage
      sessionStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append("file", uploadInput.files[0]);

      try {
        const response = await fetch("http://localhost:8081/api/photos/new", {
          method: "POST",
          body: domForm,
          credentials: "include",
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          toast.success("Photo uploaded successfully!");
          setDialog(false);
        } else {
          toast.error(result?.message || "Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("An error occurred during upload.");
      }
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="toolbar">
        {/* Left: Page name */}
        <Typography variant="h5" color="inherit">
          {page}
        </Typography>

        {/* Right: Button group */}
        {user ? (
          <>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={advancedFeaturesEnabled}
                  onChange={() => setAdvancedFeaturesEnabled((prev) => !prev)}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                />
                Enable Advanced Features
              </label>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setDialog(true)}
              >
                Add Photo
              </Button>
              <Button color="inherit" variant="outlined" onClick={handleLogOut}>
                Logout
              </Button>
            </div>
            <Dialog open={dialog} onClose={() => setDialog(false)}>
              <form onSubmit={handleUpload}>
                <DialogContent>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(domFileRef) => {
                      setUploadInput(domFileRef);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </form>
            </Dialog>

            {/* <Dialog open={dialog} onClose={() => setDialog(false)}>
              <form onSubmit={handleUpload}>
                <DialogContent>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(domFileRef) => {
                      setUploadInput(domFileRef);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button type="submit">Submit</Button>
                </DialogActions>
              </form>
            </Dialog> */}
          </>
        ) : (
          <Typography variant="h5" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
