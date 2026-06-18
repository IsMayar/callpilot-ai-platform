export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  accessToken: string;
  user: AuthenticatedUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

