import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";

import {TransactionProvider} from './context/transactionContext'

import CategoryDashboard from "./pages/CategoryDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./features/auth/authSlice";
import Spinner from "./components/Spinner";
import TransactionDashboard from "./pages/TransactionDashboard";
import SideNav from "./components/SideNav";
import { DRAWER_WIDTH } from "./constants";

function App() {
  // const [openSideNav, setOpenSideNav] = useState(false);
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // const handleSideNav = () => {
  //   setOpenSideNav(true);
  // };

  if (isLoading) return <Spinner />;

  return (
    <>
      <Router>
        <CssBaseline />
        <Header />
        <SideNav user={user} />
        <Box
          component={"main"}
          sx={{
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            ml: `${DRAWER_WIDTH}px`,
            mt: "70px",
          }}
        >
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/transactions" element={
              <TransactionProvider>

                <TransactionDashboard />
              </TransactionProvider>
            } />
            <Route path="/categories" element={<CategoryDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
