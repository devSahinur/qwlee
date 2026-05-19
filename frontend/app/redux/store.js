import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import userSlice from "./slices/userSlice";
import featureSlice from "./slices/featureSlice";
import userToChatSlice from "./features/inbox/userToChatSlice";
import chatSlice from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    feature: featureSlice,
    userToChat: userToChatSlice,
    chat: chatSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
