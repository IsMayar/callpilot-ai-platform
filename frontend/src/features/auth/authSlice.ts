import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { tokenStorage } from "./tokenStorage";
import type { AuthSession, AuthenticatedUser } from "./types";

type AuthState = {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  status: "anonymous" | "authenticated";
};

const accessToken = tokenStorage.getAccessToken();

const initialState: AuthState = {
  accessToken,
  user: null,
  status: accessToken ? "authenticated" : "anonymous"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthSession>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      state.status = "anonymous";
    }
  }
});

export const { clearCredentials, setCredentials } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;

