export const DRAWER_WIDTH = 220;
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:4100/api/v1";
