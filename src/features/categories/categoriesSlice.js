import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import processError from "../../utils/processError";
import categoryService from "./categoriesService";

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
      const token = thunkAPI.getState().auth.user?.token;
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
      const token = thunkAPI.getState().auth.user?.token;
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
      const token = thunkAPI.getState().auth.user?.token;
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
      const token = thunkAPI.getState().auth.user?.token;
      return await categoryService.deleteCategory(id, token);
    } catch (error) {
      const messages = processError(error);
      return thunkAPI.rejectWithValue(messages);
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    reset: () => {
      console.log("resetting categories...")
      return initialState
    },
    resetMessage: (state) => {
      state.isError = false;
      state.isSuccess = false;
      // state.isDeleting = false;
      // state.isUpdating = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload.data);
        state.message = action.payload.message;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
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
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.isSuccess = true;
        const delId = action.payload.data.category;
        state.categories = state.categories.filter((cat) => cat._id !== delId);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isDeleting = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const category = action.payload.data;
        console.log(category, action.payload);
        state.categories = state.categories.map((cat) => {
          if (cat._id === category._id) {
            return category;
          }
          return cat;
        });
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetMessage } = categoriesSlice.actions;
export default categoriesSlice.reducer;
