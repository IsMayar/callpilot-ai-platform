const ACCESS_TOKEN_KEY = "callpilot.accessToken";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export const tokenStorage = {
  getAccessToken() {
    try {
      return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  },
  setAccessToken(accessToken: string) {
    try {
      getStorage()?.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch {
      return;
    }
  },
  clear() {
    try {
      getStorage()?.removeItem(ACCESS_TOKEN_KEY);
    } catch {
      return;
    }
  }
};

