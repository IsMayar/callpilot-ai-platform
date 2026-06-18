import type { Middleware } from "@reduxjs/toolkit";
import { clearCredentials, setCredentials } from "./authSlice";
import { tokenStorage } from "./tokenStorage";

export const authPersistenceMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (setCredentials.match(action)) {
    tokenStorage.setAccessToken(action.payload.accessToken);
  }

  if (clearCredentials.match(action)) {
    tokenStorage.clear();
  }

  return result;
};

