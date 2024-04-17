import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";

const store = configureStore({
  reducer: {
    [AuthSlice.name]: AuthSlice.reducer,
    [api.reducerPath]: api.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
  },
  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
