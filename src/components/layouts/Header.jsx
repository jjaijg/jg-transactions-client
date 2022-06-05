import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import { reset as resetCategory } from "../../features/categories/categoriesSlice";
import { reset as resetBudget } from "../../features/budgets/budgetsSlice";
import { reset as resetTransaction } from "../../features/transactions/transactionsSlice";

function Header() {
  const navigate = useNavigate();
  const disptach = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    console.log("HEADER :: Logging out...")
    disptach(logout());
    disptach(reset());
    disptach(resetCategory());
    disptach(resetBudget());
    disptach(resetTransaction());
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          // width: `calc(100% - ${DRAWER_WIDTH}px)`,
          // ml: `${DRAWER_WIDTH}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              handleSideNav(true);
            }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyExpense
          </Typography>
          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
