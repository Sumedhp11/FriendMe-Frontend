/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { Drawer, Grid, Skeleton } from "@mui/material";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  setIsDeleteMenu,
  setIsMobileMenu,
  setSelectedDeletedChat,
} from "../../redux/reducers/misc";
import Profile from "../specific/Profile";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IncrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/Features";
import DeleteChatMEnu from "../dialogs/DeleteChatMEnu";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { isMobileMenu } = useSelector((state) => state.misc);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [chatId]
    );

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);
    const newRequestListener = useCallback(() => {
      dispatch(IncrementNotificationCount());
    }, [dispatch]);
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);
    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeletedChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => {
      dispatch(setIsMobileMenu(false));
    };
    null;

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMEnu
          dispatch={dispatch}
          deleteOptionAnchor={deleteMenuAnchor}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chat}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chat}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
