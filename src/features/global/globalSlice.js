import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import processError from "../../utils/processError";
import categoryService from "../categories/categoriesService";

const initialState = {
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isDeleting: false,
  isUpdating: false,
  message: "",
};

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await categoryService.createCategory(category, token);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (category, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await categoryService.updateCategory(category, token);
    } catch (error) {
      const messages = processError(error);

      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const getUserCategories = createAsyncThunk(
  "categories/getUserCategories",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await categoryService.getUserCategories(token);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await categoryService.deleteCategory(id, token);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCategories: (state, action) => (state.categories = action.payload),
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
      .addCase(getUserCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data;
      })
      .addCase(getUserCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = globalSlice.actions;
export default globalSlice.reducer;
