import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants/constants";
import Cookies from "js-cookie";

// User state interface
interface UserState {
  email: string;
  isSignedIn: boolean;
  user_id: string;
  token: string;
  status: "idle" | "loading" | "failed";
}

// Initial state
const initialState: UserState = {
  email: "",
  isSignedIn: false,
  user_id: "",
  token: "",
  status: "idle",
};

// Async thunk to fetch user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("authToken"); // Retrieve token from cookies
    if (!token) return rejectWithValue("No token found");

    try {
      const response = await fetch(`${BASE_URL}/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();
      return { ...userData, token };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn(
      state,
      action: PayloadAction<{ user_id: string; token: string; email: string }>
    ) {
      state.isSignedIn = true;
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.email = "";
      state.user_id = "";
      state.token = "";

      Cookies.remove("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.isSignedIn = true;
        state.user_id = action.payload.user_id;
        state.email = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
        state.isSignedIn = false;
        state.email = "";
        state.user_id = "";
        state.token = "";
      });
  },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
