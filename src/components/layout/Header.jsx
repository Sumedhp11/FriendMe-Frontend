/* eslint-disable react/prop-types */
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import { Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orange } from "../../constants/color";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import { ResetNotificationCount } from "../../redux/reducers/chat";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";

const Search = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notification"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNewGroup, isNotification } = useSelector(
    (state) => state.misc
  );

  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobileMenu(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const logouthandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "SomeThing Went Wrong");
    }
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(ResetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");
  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              FriendMe{" "}
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onclick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onclick={openNewGroup}
              />
              <IconBtn
                title={"Manage Group"}
                icon={<GroupIcon />}
                onclick={navigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<Notifications />}
                onclick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onclick={logouthandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};
const IconBtn = ({ title, icon, onclick, value }) => (
  <Tooltip title={title}>
    <IconButton color="inherit" size="large" onClick={onclick}>
      {value ? (
        <Badge badgeContent={value} color="error">
          {icon}
        </Badge>
      ) : (
        icon
      )}
    </IconButton>
  </Tooltip>
);
export default Header;
