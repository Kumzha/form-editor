import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isSignedIn: boolean;
  user_id: string;
  token: string;
}

const initialState: UserState = {
  isSignedIn: false,
  user_id: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<{ user_id: string; token: string }>) {
      state.isSignedIn = true;
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.user_id = "";
      state.token = "";
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
