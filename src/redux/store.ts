import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./features/user/userSlice";
import { apiSlice } from "./api/apiSlice";
import sidebarReducer from "./features/ui/sidebarSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: null,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selector with proper typing
export const selectUser = (state: RootState) => state.user;