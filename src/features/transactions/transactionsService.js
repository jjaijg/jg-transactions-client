import axios from "axios";
import configHeader from "../../utils/configHeader";
import { API_URL } from "../../constants";

const TXN_URL = API_URL + "/transactions";

export const createTransaction = async (token, transaction) => {
  const response = await axios.post(
    `${TXN_URL}`,
    transaction,
    configHeader(token)
  );
  return response.data;
};
export const updateTransaction = async (token, transaction) => {
  const response = await axios.put(
    `${TXN_URL}/${transaction.prevTxn._id}`,
    transaction,
    configHeader(token)
  );
  return response.data;
};

export const getUserTransactions = async (token) => {
  const response = await axios.get(`${TXN_URL}`, configHeader(token));
  return response.data;
};

export const getfilteredTransactions = async (token, params = {}) => {
  const response = await axios.get(`${TXN_URL}/filter`, {
    params,
    ...configHeader(token),
  });
  return response.data;
};

export const getTotalFromTransactions = async (token, params = {}) => {
  // console.log("token : ", token);
  const response = await axios.get(`${TXN_URL}/total`, {
    params,
    ...configHeader(token),
  });
  return response.data;
};

export const deleteTransaction = async (token, id) => {
  const response = await axios.delete(`${TXN_URL}/${id}`, configHeader(token));
  return response.data;
};

const transactionService = {
  createTransaction,
  updateTransaction,
  getUserTransactions,
  getfilteredTransactions,
  getTotalFromTransactions,
  deleteTransaction,
};

export default transactionService;
