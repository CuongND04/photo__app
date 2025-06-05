import { Grid, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

function LoginRegister() {
  const navigate = useNavigate();
  const { setPage, user, setUser } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerLocation, setRegisterLocation] = useState("");
  const [registerOccupation, setRegisterOccupation] = useState("");
  const [registerDescription, setRegisterDescription] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/");
    setPage("Login/Register");
  }, []);

  const handleToggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  // Thay showMessage bằng toast
  const showMessage = (msg, type = "error") => {
    if (type == "success") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  const handleLogin = () => {
    const data = { login_name: loginUsername, password: loginPassword };
    fetch("http://localhost:8081/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          sessionStorage.setItem("user", JSON.stringify(result.user));
          setUser(result.user);
          setTimeout(() => {
            navigate("/");
          }, 50);
          showMessage("Login successful!", "success");
        } else if (res.status === 401) {
          showMessage("Invalid login information, please try again.");
        } else if (res.status === 400) {
          showMessage("Please fill in both login name and password.");
        }
      })
      .catch((err) => showMessage(err.message));

    setLoginUsername("");
    setLoginPassword("");
  };

  const handleRegister = () => {
    if (registerPassword !== registerConfirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    const data = {
      login_name: registerUsername,
      first_name: registerFirstName,
      last_name: registerLastName,
      location: registerLocation,
      occupation: registerOccupation,
      description: registerDescription,
      password: registerPassword,
    };

    fetch("http://localhost:8081/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          showMessage("User created successfully!", "success");

          setRegisterUsername("");
          setRegisterFirstName("");
          setRegisterLastName("");
          setRegisterLocation("");
          setRegisterOccupation("");
          setRegisterDescription("");
          setRegisterPassword("");
          setRegisterConfirmPassword("");
        } else if (res.status === 409) {
          showMessage("User already exists.");
        } else if (res.status === 400) {
          showMessage("Please fill in all required registration fields.");
        }
      })
      .catch((err) => showMessage(err.message));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="80vh"
      p={4}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          {isRegisterMode ? "Register" : "Login"}
        </Typography>

        {!isRegisterMode ? (
          <>
            <TextField
              fullWidth
              label="Login Name"
              variant="outlined"
              margin="normal"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" onClick={handleLogin}>
              Login
            </Button>
            <Button fullWidth sx={{ mt: 2 }} onClick={handleToggleMode}>
              Switch to Register
            </Button>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Login Name"
              variant="outlined"
              margin="normal"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              margin="normal"
              value={registerLocation}
              onChange={(e) => setRegisterLocation(e.target.value)}
            />
            <TextField
              fullWidth
              label="Occupation"
              variant="outlined"
              margin="normal"
              value={registerOccupation}
              onChange={(e) => setRegisterOccupation(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              value={registerDescription}
              onChange={(e) => setRegisterDescription(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" onClick={handleRegister}>
              Register Me
            </Button>
            <Button fullWidth sx={{ mt: 2 }} onClick={handleToggleMode}>
              Switch to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
