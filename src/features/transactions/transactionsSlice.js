import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { endOfMonth, startOfMonth } from "date-fns";
import transactionService from "./transactionsService";

import processError from "../../utils/processError";
import { getTransactions } from "../../utils/transactionUtils";

const initialState = {
  txnBoardDate: new Date().toISOString(),
  transactions: [],
  recents: [],
  txnTotal: {
    income: 0,
    expense: 0,
    incomeCount: 0,
    expenseCount: 0,
  },
  latSixMonthDetails: [],
  categoryTotalDetail: [],
  txnFilters: {},
  txnSort: {},
  txnPagination: {
    page: 1,
    pageSize: 20,
  },
  totalCount: 0,
  txnEdit: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isDeleting: false,
  isUpdating: false,
  isDownloading: false,
  isRefetch: false,
  message: "",
};

const getTotalDetails = async (filters, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await transactionService.getTotalFromTransactions(token, filters);
  } catch (error) {
    const messages = processError(error);
    return thunkAPI.rejectWithValue(messages);
  }
};

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transaction, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await transactionService.createTransaction(token, transaction);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await transactionService.updateTransaction(token, transaction);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await transactionService.deleteTransaction( token,id);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const getRecentTransactions = createAsyncThunk(
  "transactions/getRecentTransactions",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await getTransactions(token, {
        limit: 5,
      });
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const getTransactionTotals = createAsyncThunk(
  "transactions/getTransactionTotals",
  getTotalDetails
);

export const getLastSixMonthDetail = createAsyncThunk(
  "transactions/getLastSixMonthDetail",
  getTotalDetails
);

export const getCategoryTotalDetail = createAsyncThunk(
  "transactions/getCategoryTotalDetail",
  getTotalDetails
);

export const getFilteredTxns = createAsyncThunk(
  "transactions/getFilteredTxns",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const { txnBoardDate, txnFilters, txnSort, txnPagination } =
        thunkAPI.getState().transactions;
        console.log(
          "filter data : ",
          {
            txnBoardDate,
            txnFilters,
            txnSort,
            txnPagination,
          },
          startOfMonth(new Date(txnBoardDate))
        );
      return await getTransactions(token, {
        limit: txnPagination.pageSize,
        page: txnPagination.page,
        start: startOfMonth(new Date(txnBoardDate)),
        end: endOfMonth(new Date(txnBoardDate)),
        ...txnFilters,
        ...txnSort,
      });
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const getUserTransactions = createAsyncThunk(
  "transactions/getUserTransactions",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await transactionService.getUserTransactions(token);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTxnBoardDate: (state, action) => {
      state.txnBoardDate = action.payload;
    },
    setFilters: (state, action) => {
      state.txnFilters = action.payload;
    },
    setTxnSort: (state, action) => {
      state.txnSort = action.payload;
    },
    setPagination: (state, action) => {
      state.txnPagination = { ...state.txnPagination, ...action.payload };
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setTxnEdit: (state, action) => {
      state.txnEdit = action.payload;
    },
    setRefetch: (state, action) => {
      state.isRefetch = action.payload;
    },
    reset: () => {
      return initialState;
    },
    resetMessage: (state) => {
      // state.isDeleting = false;
      // state.isUpdating = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isRefetch = true;
        state.transactions.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFilteredTxns.pending, (state) => {
        state.isLoading = true;
        console.log("Fetching filtered transactions...")
      })
      .addCase(getFilteredTxns.fulfilled, (state, action) => {
        const {transactions, totalResults} = action.payload.data
        state.isLoading = false;
        state.isSuccess = true;
        state.isRefetch = false;
        state.transactions = transactions;
        state.totalCount = totalResults;
        if (state.txnEdit) { state.txnEdit = transactions.filter((txn) => txn._id === state.txnEdit._id)[0];}
      })
      .addCase(getFilteredTxns.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isRefetch = false;
        state.message = action.payload;
      })
      .addCase(getRecentTransactions.pending, () => {
        console.log("Fetching recent transactions...");
      })
      .addCase(getRecentTransactions.fulfilled, (state, action) => {
        state.recents = action.payload.data.transactions;
      })
      .addCase(getRecentTransactions.rejected, (_, action) => {
        console.log("Unable to get recent transactions... : ", action.payload);
      })
      .addCase(getTransactionTotals.pending, (state) => {
        console.log("Fetching transactions total details...");
      })
      .addCase(getTransactionTotals.fulfilled, (state, action) => {
        const { transactions = [] } = action.payload.data;
        transactions.forEach((txnDetail) => {
          if (txnDetail._id === "income") {
            state.txnTotal.income = txnDetail.totalAmount;
            state.txnTotal.incomeCount = txnDetail.count;
          } else if (txnDetail._id === "expense") {
            state.txnTotal.expense = txnDetail.totalAmount;
            state.txnTotal.expenseCount = txnDetail.count;
          }
        });
      })
      .addCase(getTransactionTotals.rejected, (state, action) => {
        console.log(
          "Unable to get transactions total details... : ",
          action.payload
        );
      })
      .addCase(getLastSixMonthDetail.pending, (state) => {
        // state.isLoading = true;
        console.log("Fetching last 6 month transaction details...");
      })
      .addCase(getLastSixMonthDetail.fulfilled, (state, action) => {
        state.latSixMonthDetails = action.payload.data.transactions;
      })
      .addCase(getLastSixMonthDetail.rejected, (state, action) => {
        console.log(
          "Unable to fetch last 6 month transaction details... : ",
          action.payload
        );
      })
      .addCase(getCategoryTotalDetail.pending, (state) => {
        // state.isLoading = true;
        console.log("Fetching category total details...");
      })
      .addCase(getCategoryTotalDetail.fulfilled, (state, action) => {
        state.categoryTotalDetail = action.payload.data.transactions;
      })
      .addCase(getCategoryTotalDetail.rejected, (state, action) => {
        console.log(
          "Unable to fetch category total details... : ",
          action.payload
        );
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.isSuccess = true;
        state.isRefetch = true;
        state.message = action.payload.message;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isDeleting = false;
        state.isError = true;
        state.message = action.payload.message;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const transaction = action.payload.data;
        console.log(
          "updated txn from redux action : ",
          transaction,
          action.payload
        );
        // state.txnEdit = transaction;
        state.isRefetch = true;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  setTxnBoardDate,
  setFilters,
  setTxnSort,
  setPagination,
  setTotalCount,
  setRefetch,
  setTxnEdit,
  reset,
  resetMessage,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
