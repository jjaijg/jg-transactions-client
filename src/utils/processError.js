export const processError = (error) => {
  return (
    (error.response && error.response.data && error.response.data.messages) ||
    error.message ||
    error.toString()
  );
};

export default processError;
