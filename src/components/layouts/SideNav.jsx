import { useContext } from "react";
import { NavLink as RouteLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { Toolbar, Link, useTheme, styled, IconButton } from "@mui/material";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout, reset } from "../../features/auth/authSlice";
import { reset as resetCategory } from "../../features/categories/categoriesSlice";
import { reset as resetBudget } from "../../features/budgets/budgetsSlice";
import { reset as resetTransaction } from "../../features/transactions/transactionsSlice";

import { DRAWER_WIDTH } from "../../constants";
import { SIDENAV_COMMON, SIDENAV_AUTH } from "../../constants/sideNavLink";
import { SideNavCtx, SideNavDispatchCtx } from "../../context/sideNavContext";

const renderSideNavFooter = (user, open, theme, onLogout, handleDrawerOpen) => (
  <List
    style={{
      position: `fixed`,
      bottom: 0,
      paddingBottom: 10,
      width: !open ? `calc(${theme.spacing(7)} + 1px)` : DRAWER_WIDTH,
      overflowX: "hidden",
    }}
  >
    {user && [{ name: "Logout", icon: <LogoutIcon />, onClick: onLogout }].map(
      ({ name, icon, onClick }, index) => (
        <ListItem button key={name} onClick={onClick}>
          <ListItemIcon>{icon} </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      )
    )}
    <ListItem
      button
      onClick={handleDrawerOpen}
      secondaryAction={
        <IconButton aria-label="delete">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      }
      sx={{ py: 3 }}
    />
  </List>
);

function SideNav({ user }) {
  const theme = useTheme();

  const navigate = useNavigate();
  const disptach = useDispatch();

  const { open } = useContext(SideNavCtx);
  const { handleDrawerOpen } = useContext(SideNavDispatchCtx);

  const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const onLogout = () => {
    console.log("SIDENAV :: Logging out....")
    disptach(logout());
    disptach(reset());
    disptach(resetCategory());
    disptach(resetBudget());
    disptach(resetTransaction());
    navigate("/");
  };

  const list = () => (
    // Box role="presentation"
    <Box role="presentation">
      <List>
        {SIDENAV_COMMON.map(({ name, icon, route }, index) => (
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
      {!user && (
        <>
          <List>
            {SIDENAV_AUTH.map(({ name, icon, route }, index) => (
              <ListItem button key={name} component={RouteLink} to={route}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      {renderSideNavFooter(user, open, theme, onLogout, handleDrawerOpen)}
    </Box>
  );
  return (
    <div>
      <Drawer
        variant="permanent"
        open={open}
        // anchor={"left"}
        // sx={{
        //   width: `${DRAWER_WIDTH}px`,
        //   flexShrink: 0,
        //   [`& .MuiDrawer-paper`]: {
        //     width: DRAWER_WIDTH,
        //     boxSizing: "border-box",
        //   },
        // }}
      >
        <Toolbar />
        {list()}
      </Drawer>
    </div>
  );
}

export default SideNav;
