import axios from "axios";
import configHeader from "./configHeader";

const resources = {};

const makeRequestCreator = () => {
  let cancel;

  return async (token, queryUrl, params = {}, isClearCache = false) => {
    console.log("Search params : ", queryUrl, params);
    const cacheKey = `${queryUrl}_${JSON.stringify(params)}_${token}`;
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (!isClearCache && resources[cacheKey]) {
        // Return result if it exists
        return resources[cacheKey];
      }
      const res = await axios({
        method: "GET",
        url: queryUrl,
        params,
        cancelToken: cancel.token,

        ...configHeader(token),
      });
      //     await axios.get(queryUrl, {
      //   params,
      //   ...configHeader(token),
      // });

      const result = res;
      // Store response
      resources[cacheKey] = res;

      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log("Request canceled", error.message);
      } else {
        // Handle usual errors
        console.log("Something went wrong: ", error.message);
        throw error;
      }
    }
  };
};

export const search = makeRequestCreator();
