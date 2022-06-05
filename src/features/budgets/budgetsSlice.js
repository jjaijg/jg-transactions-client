import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import processError from "../../utils/processError";
import budgetService from "./budgetsService";

const initialState = {
  budgets: [],
  budgetIdSearch: "",
  selectedBudget: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isDeleting: false,
  isCreating: false,
  isUpdating: false,
  isRefetch: false,
  message: "",
};

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (budget, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.createBudget(token, budget);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async (budget, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.updateBudget(token, budget);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const getUserBudgets = createAsyncThunk(
  "budgets/getUserBudgets",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.getUserBudgets(token);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const  getFilteredBudgets = createAsyncThunk(
  "budgets/getFilteredBudgets",
  async ({  isClearCache, ...filters }, thunkAPI) => {
    try {
      console.log("budget filters : ", filters);
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.getfilteredBudgets(
        token,
        filters,
        isClearCache
      );
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.deleteBudget(token, id);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const createBudgetCat = createAsyncThunk(
  "budgets/createBudgetCategory",
  async (budgetCat, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.createBudgetCat(token, budgetCat);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const updateBudgetCatAmt = createAsyncThunk(
  "budgets/updateBudgetCategoryAmount",
  async (budgetCat, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.updateBudgetCatAmount(token, budgetCat);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const deleteBudgetCat = createAsyncThunk(
  "budgets/deleteBudgetCategory",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await budgetService.deleteBudgetCat(token, id);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudgetIdSearch: (state, action) => {
      state.budgetIdSearch = action.payload;
    },
    setSelectedBudget: (state, action) => {
      state.selectedBudget = action.payload;
    },
    refetchBudgets: (state, action) => {
      state.isRefetch = action.payload;
    },
    reset: () => {
      console.log("resetting budget details...")
      return  initialState;
    },
    resetMessage: (state) => {
      state.message = "";
      state.isSuccess = false;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBudget.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isCreating = false;
        state.isSuccess = true;
        state.isRefetch = true;
        // state.budgets.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isCreating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFilteredBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFilteredBudgets.fulfilled, (state, action) => {
        const { data } = action.payload;
        const { selectedBudget } = state;
        state.isLoading = false;
        state.isRefetch = false;
        state.budgets = data.budgets;
        if (state.selectedBudget) {
          state.selectedBudget = data.budgets.filter(
            (bud) => bud._id === selectedBudget._id
          )[0];
        }
      })
      .addCase(getFilteredBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBudget.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        const {
          // data,
          message,
        } = action.payload;
        state.isDeleting = false;
        state.isSuccess = true;
        state.isRefetch = true;
        // const delId = data;
        state.selectedBudget = null;
        state.message = message;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isDeleting = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBudget.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const { message, data } = action.payload;
        state.isUpdating = false;
        state.isSuccess = true;
        state.isRefetch = true;
        state.message = message;
        state.selectedBudget.name = data.name;
        state.selectedBudget.description = data.description;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBudgetCat.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createBudgetCat.fulfilled, (state, action) => {
        state.isCreating = false;
        state.isSuccess = true;
        state.isRefetch = true;
        // state.budgets.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createBudgetCat.rejected, (state, action) => {
        state.isCreating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBudgetCatAmt.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateBudgetCatAmt.fulfilled, (state, action) => {
        const { message, data } = action.payload;
        state.isUpdating = false;
        state.isSuccess = true;
        state.isRefetch = true;
        state.message = message;
        state.selectedBudget.budgetCategories =
          state.selectedBudget.budgetCategories.map((cat) =>
            cat._id !== data._id ? cat : { ...cat, planned: data.planned }
          );
      })
      .addCase(updateBudgetCatAmt.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBudgetCat.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteBudgetCat.fulfilled, (state, action) => {
        const { data, message } = action.payload;
        state.isDeleting = false;
        state.isSuccess = true;
        state.isRefetch = true;
        state.message = message;
        state.selectedBudget.budgetCategories =
          state.selectedBudget.budgetCategories.filter(
            (cat) => cat._id !== data
          );
      })
      .addCase(deleteBudgetCat.rejected, (state, action) => {
        state.isDeleting = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  setBudgetIdSearch,
  setSelectedBudget,
  refetchBudgets,
  reset,
  resetMessage,
} = budgetsSlice.actions;
export default budgetsSlice.reducer;
