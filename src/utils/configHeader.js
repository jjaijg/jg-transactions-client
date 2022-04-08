export const configHeader = (token) => {
  const config = {
    headers: {},
  };
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

export default configHeader;
