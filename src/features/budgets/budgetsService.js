import axios from "axios";
import configHeader from "../../utils/configHeader";
import { API_URL } from "../../constants";
import { search } from "../../utils/requestCreator";

const BUDGET_URL = API_URL + "/budgets";
const BUDGETCAT_URL = API_URL + "/budget-categories";

export const createBudget = async (token, budget) => {
  const response = await axios.post(
    `${BUDGET_URL}`,
    budget,
    configHeader(token)
  );
  return response.data;
};
export const updateBudget = async (token, budget) => {
  const response = await axios.put(
    `${BUDGET_URL}/${budget.id}`,
    budget,
    configHeader(token)
  );
  return response.data;
};

export const getUserBudgets = async (token) => {
  const response = await axios.get(`${BUDGET_URL}`, configHeader(token));
  return response.data;
};

export const getfilteredBudgets = async (token, params = {}, isClearCache) => {
  const response = await search(
    token,
    `${BUDGET_URL}/filter`,
    params,
    isClearCache
  );
  // await axios.get(`${BUDGET_URL}/filter`, {
  //   params,
  //   ...configHeader(token),
  // });
  return response.data;
};

export const deleteBudget = async (token, id) => {
  const response = await axios.delete(
    `${BUDGET_URL}/${id}`,
    configHeader(token)
  );
  return response.data;
};

export const createBudgetCat = async (token, budgetCat) => {
  const response = await axios.post(
    `${BUDGETCAT_URL}`,
    budgetCat,
    configHeader(token)
  );
  return response.data;
};
export const updateBudgetCatAmount = async (token, budgetCat) => {
  const response = await axios.put(
    `${BUDGETCAT_URL}/update/${budgetCat.id}/planned`,
    budgetCat,
    configHeader(token)
  );
  return response.data;
};

export const deleteBudgetCat = async (token, id) => {
  const response = await axios.delete(
    `${BUDGETCAT_URL}/${id}`,
    configHeader(token)
  );
  return response.data;
};

const budgetService = {
  createBudget,
  getUserBudgets,
  getfilteredBudgets,
  updateBudget,
  deleteBudget,
  createBudgetCat,
  updateBudgetCatAmount,
  deleteBudgetCat,
};

export default budgetService;
