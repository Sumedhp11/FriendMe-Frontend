import { CameraAlt } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "../utils/validators";
import { bgGradient } from "../constants/color";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setisLogin] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword("");
  const avatar = useFileHandler("single");

  const handleSignup = async (e) => {
    setisLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "SomeThing Went Wrong");
    }
    setisLoading(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setisLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "SomeThing Went Wrong");
    }
    setisLoading(false);
  };
  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        component={"main"}
        maxWidth="xs"
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password.value}
                  onChange={password.changeHandler}
                  variant="outlined"
                />
                <Button
                  disabled={isLoading}
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>
                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={() => setisLogin(false)}
                >
                  Sign up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignup}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography color="error" variant="caption">
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                />
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  value={bio.value}
                  onChange={bio.changeHandler}
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  value={password.value}
                  onChange={password.changeHandler}
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  disabled={isLoading}
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Register
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>
                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={() => setisLogin(true)}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
