import axios from "axios";
import { API_URL } from "../../constants";

const AUTH_URL = API_URL + "/users";

export const register = async (user) => {
  const response = await axios.post(`${AUTH_URL}`, user);

  if (response.data) {
    const { data } = response.data;
    localStorage.setItem("user", JSON.stringify(data));
  }

  return response.data;
};
export const login = async (credentials) => {
  const response = await axios.post(`${AUTH_URL}/login`, credentials);

  if (response.data) {
    const { data } = response.data;
    localStorage.setItem("user", JSON.stringify(data));
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
