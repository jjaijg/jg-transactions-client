export const DRAWER_WIDTH = 220;
export const FILE_NAME = "transactions";
export const EXPORT_TYPE = "csv";
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:4100/api/v1";
