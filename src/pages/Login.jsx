import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Spinner from "../components/Spinner";

import { login, resetMessage } from "../features/auth/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password } = formData;
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!email || !password) {
      toast.error("Please fill all the fileds");
    } else {
      const credentials = { email, password };
      dispatch(login(credentials));
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(resetMessage());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) return <Spinner />;

  return (
    <Card sx={{ minWidth: 275, mb: 2, mt: "75px", mx: 2 }} raised>
      <CardContent>
        <Typography
          sx={{ fontSize: 20, textAlign: "center" }}
          color="text.secondary"
          gutterBottom
        >
          Login
        </Typography>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 2, width: "100ch" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            type={"email"}
            name="email"
            id="email"
            label="Email"
            value={email}
            onChange={handleChange}
          />
          <TextField
            required
            type={"password"}
            name="password"
            id="password"
            label="Password"
            value={password}
            onChange={handleChange}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button color="success" variant="contained" onClick={handleSubmit}>
          Login
        </Button>
      </CardActions>
    </Card>
  );
}

export default Login;
