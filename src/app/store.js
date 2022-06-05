import { configureStore } from "@reduxjs/toolkit";
// import globalReducer from "../features/global/globalSlice";
import authReducer from "../features/auth/authSlice";
import budgetsReducer from "../features/budgets/budgetsSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    // global: globalReducer,
    auth: authReducer,
    budgets: budgetsReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});
