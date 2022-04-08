import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import processError from "../../utils/processError";
import transactionService from "./transactionsService";

const initialState = {
  transactions: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isDeleting: false,
  isUpdating: false,
  message: "",
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
      return await transactionService.updateTransaction(transaction, token);
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
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await transactionService.deleteTransaction(id, token);
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
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isDeleting = false;
      state.isUpdating = false;
      state.message = "";
    },
    resetMessage: (state) => {
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
        state.transactions.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transactions = action.payload.data;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.isSuccess = true;
        const delId = action.payload.data.transaction;
        state.transactions = state.transactions.filter(
          (txn) => txn._id !== delId
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isDeleting = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const transaction = action.payload.data;
        console.log(transaction, action.payload);
        state.transactions = state.transactions.map((txn) => {
          if (txn._id === transaction._id) {
            return transaction;
          }
          return txn;
        });
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = transactionsSlice.actions;
export default transactionsSlice.reducer;
