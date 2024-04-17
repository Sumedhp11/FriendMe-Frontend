/* eslint-disable react-refresh/only-export-components */
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor, orange } from "../constants/color";
import {
  ALERT,
  CHAT_EXITED,
  CHAT_JOINED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useInfiniteScrollTop } from "6pp";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { getSocket } from "../socket";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [FileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [iamTyping, setIamTyping] = useState(false);
  const [userTyping, setuserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery(chatId, page);
  const socket = getSocket();
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  const members = chatDetails?.data?.chat?.members;
  const submithandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  const { data: oldmessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      socket.emit(CHAT_EXITED, { userId: user._id, members });
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId, setOldMessages, dispatch, user._id, socket, members]);

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const startTypingListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setuserTyping(true);
    },
    [chatId]
  );
  const stopTypingListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setuserTyping(false);
    },
    [chatId]
  );
  const ALERTLISTENER = useCallback(
    (data) => {
      const messageForAlert = {
        content: data,

        sender: {
          _id: "AAAAAAAAA",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );
  const eventHandlers = {
    [ALERT]: ALERTLISTENER,
    [NEW_MESSAGE]: newMessageHandler,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner,
  };

  useSocketEvents(socket, eventHandlers);
  useErrors(errors);

  const handleFileopen = (e) => {
    setFileMenuAnchor(e.currentTarget);
    dispatch(setIsFileMenu(true));
  };
  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!iamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
    }, [3500]);
  };

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError, navigate]);

  const allMessages = [...oldmessages, ...messages];
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((msg, index) => (
          <MessageComponent message={msg} user={user} key={index} />
        ))}
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submithandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            onClick={handleFileopen}
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here"
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={FileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
