import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";

import { SideNavCtx } from "./context/sideNavContext";

import { getMe } from "./features/auth/authSlice";
import { getUserCategories } from "./features/categories/categoriesSlice";
import { DRAWER_WIDTH } from "./constants";

import Header from "./components/layouts/Header";
import SideNav from "./components/layouts/SideNav";
import Spinner from "./components/Spinner";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BudgetBoard from "./pages/BudgetBoard";
import TransactionDashboard from "./pages/TransactionDashboard";
import CategoryDashboard from "./pages/CategoryDashboard";

import "react-toastify/dist/ReactToastify.css";

function App() {
  // const [openSideNav, setOpenSideNav] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const { open } = useContext(SideNavCtx);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user && user?.token) {
      console.log("calling categories")
      dispatch(getUserCategories())}
  }, [user, dispatch])

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
            width: open
              ? `calc(100% - ${DRAWER_WIDTH}px)`
              : `calc(99%-${theme.spacing(7)})`,
            ml: open ? `${DRAWER_WIDTH}px` : `calc(${theme.spacing(8)} + 1px)`,
            mt: "70px",
          }}
        >
          <Routes>
            <Route path="/" element={<BudgetBoard />} />
            <Route
              path="/transactions"
              element={
                  <TransactionDashboard  />
              }
            />
            <Route path="/categories" element={<CategoryDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<BudgetBoard />} />
          </Routes>
        </Box>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
