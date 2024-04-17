/* eslint-disable no-unused-vars */
import { Menu, Stack, Typography } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutations } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const DeleteChatMEnu = ({ dispatch, deleteOptionAnchor }) => {
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  const navigate = useNavigate();
  const [deleteChat, _, deleteChatData] = useAsyncMutations(
    useDeleteChatMutation
  );
  const [deleteGroup, __, deleteGroupData] = useAsyncMutations(
    useLeaveGroupMutation
  );
  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteOptionAnchor.current = null;
  };
  const deleteChathandler = () => {
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
    closeHandler();
  };
  const LeaveGroupHandler = () => {
    deleteGroup("Leaving Group...", selectedDeleteChat.chatId);
    closeHandler();
  };
  useEffect(() => {
    if (deleteChatData || deleteGroupData) navigate("/");
  }, [deleteChatData, navigate, deleteGroupData]);
  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteOptionAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        onClick={
          selectedDeleteChat.groupChat ? LeaveGroupHandler : deleteChathandler
        }
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
      >
        {selectedDeleteChat.groupChat ? (
          <Fragment>
            <ExitToAppIcon /> <Typography>Leave Group</Typography>
          </Fragment>
        ) : (
          <Fragment>
            <DeleteIcon /> <Typography>Delete Chat</Typography>
          </Fragment>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMEnu;
