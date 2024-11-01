import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/user/userSlice";
import userFormsReducer from "@/store/forms/formSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userForms: userFormsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
