import { NavLink as RouteLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Toolbar, Link, useTheme } from "@mui/material";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout, reset } from "../features/auth/authSlice";
import { DRAWER_WIDTH } from "../constants";

function SideNav({ user }) {
  const theme = useTheme();

  const navigate = useNavigate();
  const disptach = useDispatch();

  const onLogout = () => {
    disptach(logout());
    disptach(reset());
    navigate("/");
  };

  const list = () => (
    <Box role="presentation" sx={{ overflow: "auto" }}>
      <List>
        {[
          { name: "Categories", icon: <CategoryIcon />, route: "/categories" },
          {
            name: "Transactions",
            icon: <ReceiptIcon />,
            route: "/transactions",
          },
        ].map(({ name, icon, route }, index) => (
          <Link
            component={RouteLink}
            to={route}
            underline="none"
            color="inherit"
            key={name}
            style={({ isActive }) => ({
              color: isActive ? "inherit" : theme.palette.text.secondary,
            })}
          >
            <ListItem button key={name}>
              <ListItemIcon>{icon} </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      {!user ? (
        <>
          <List>
            {[
              {
                name: "Register",
                icon: <AssignmentIndIcon />,
                route: "/register",
              },
              { name: "Login", icon: <LoginIcon />, route: "/login" },
            ].map(({ name, icon, route }, index) => (
              <ListItem button key={name} component={RouteLink} to={route}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <List>
          {[{ name: "Logout", icon: <LogoutIcon />, onClick: onLogout }].map(
            ({ name, icon, onClick }, index) => (
              <ListItem button key={name} onClick={onClick}>
                <ListItemIcon>{icon} </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            )
          )}
        </List>
      )}
    </Box>
  );
  return (
    <div>
      <Drawer
        variant="permanent"
        anchor={"left"}
        sx={{
          width: `${DRAWER_WIDTH}px`,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        {list()}
      </Drawer>
    </div>
  );
}

export default SideNav;
