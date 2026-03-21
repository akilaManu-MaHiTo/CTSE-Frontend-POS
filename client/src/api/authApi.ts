import axios from "axios";

export type LoginRequest = {
  email: string;
  password: string;
};
export type ValidateUserResponse = {
  authenticated: boolean;
  userId: string;
  email: string;
};

export const login = async (payload: LoginRequest) => {
  const BASE_URL = import.meta.env.VITE_AUTH_CLIENT_BASE_URL;
  const res = await axios.post(`${BASE_URL}/api/auth/login`, payload);
  return res.data;
};

export async function validateUser() {
  const res = await axios.get("/api/user");
  return res.data;
}
