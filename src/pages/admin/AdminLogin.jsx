import { Button, Container, Paper, TextField, Typography } from "@mui/material";

import { useInputValidation } from "6pp";

import { bgGradient } from "../../constants/color";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import { useEffect } from "react";

const AdminLogin = () => {
  const secretKey = useInputValidation("");
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };
  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to={"/admin/dashboard"} />;
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
          <Typography variant="h5">Admin Login</Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="secretKey"
              type="password"
              margin="normal"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              variant="outlined"
            />
            <Button
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
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
