import axios from "axios";
import configHeader from "../../utils/configHeader";
import { API_URL } from "../../constants";

const CAT_URL = API_URL + "/categories";

export const createCategory = async (category, token) => {
  const response = await axios.post(
    `${CAT_URL}`,
    category,
    configHeader(token)
  );
  return response.data;
};
export const updateCategory = async (category, token) => {
  const response = await axios.put(
    `${CAT_URL}/${category.id}`,
    category,
    configHeader(token)
  );
  return response.data;
};

export const getUserCategories = async (token) => {
  const response = await axios.get(`${CAT_URL}`, configHeader(token));
  return response.data;
};

export const deleteCategory = async (id, token) => {
  const response = await axios.delete(`${CAT_URL}/${id}`, configHeader(token));
  return response.data;
};

const categoryService = {
  createCategory,
  updateCategory,
  getUserCategories,
  deleteCategory,
};

export default categoryService;
