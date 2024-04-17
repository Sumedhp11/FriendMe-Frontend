import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/Features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};
const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    IncrementNotificationCount: (state) => {
      state.notificationCount = state.notificationCount + 1;
    },
    ResetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload?.chatId;
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === action.payload.chatId
      );
      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },
    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;
export const {
  IncrementNotificationCount,
  ResetNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;
