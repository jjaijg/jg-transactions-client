import { getfilteredTransactions } from "../features/transactions/transactionsService";

export const getTransactions = async (token, params = { page: 1, group: 0 }) => {
  const paramters = {
    ...params,
  };
  return await getfilteredTransactions(token, paramters);
};

